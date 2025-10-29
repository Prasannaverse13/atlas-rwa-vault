import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, DollarSign, Target, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useWallet } from '@solana/wallet-adapter-react';

interface FairValueData {
  fairValue: number;
  onChainPrice: number;
  dislocation: number;
  arbitrageOpportunity: boolean;
  recommendation: 'BUY' | 'SELL' | 'HOLD';
  expectedReturn: number;
  confidence: number;
  reasoning: string;
  riskLevel: string;
  realWorldData: any;
  timestamp: string;
}

export const FairValueOracle = () => {
  const { publicKey } = useWallet();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fairValueData, setFairValueData] = useState<FairValueData | null>(null);
  const { toast } = useToast();

  const analyzeFairValue = async () => {
    if (!publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // Fetch real on-chain data (simulated pool data for demo)
      const poolData = {
        tvl: 2500000,
        volume24h: 450000,
        feeRate: 0.003,
      };

      const { data, error } = await supabase.functions.invoke('fair-value-oracle', {
        body: {
          tokenSymbol: 't-BILL',
          onChainPrice: 0.995,
          poolData,
        },
      });

      if (error) throw error;

      setFairValueData(data);
      
      toast({
        title: "Fair Value Analysis Complete",
        description: `${data.recommendation}: ${data.reasoning.slice(0, 80)}...`,
      });
    } catch (error) {
      console.error('Fair value analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Unable to analyze fair value",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRecommendationIcon = (rec: string) => {
    switch (rec) {
      case 'BUY': return <TrendingUp className="w-5 h-5" />;
      case 'SELL': return <TrendingDown className="w-5 h-5" />;
      default: return <Minus className="w-5 h-5" />;
    }
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'BUY': return 'bg-success';
      case 'SELL': return 'bg-destructive';
      default: return 'bg-warning';
    }
  };

  return (
    <Card className="gradient-card shadow-card animate-slide-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <Target className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle>AI Fair Value Oracle</CardTitle>
              <CardDescription>Real-time RWA valuation & arbitrage detection</CardDescription>
            </div>
          </div>
          <Button
            onClick={analyzeFairValue}
            disabled={isAnalyzing}
            size="sm"
            className="gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <DollarSign className="w-4 h-4" />
                Analyze
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      {fairValueData && (
        <CardContent className="space-y-4">
          {/* Price Comparison */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-1">On-Chain Price</p>
              <p className="text-2xl font-bold">${fairValueData.onChainPrice.toFixed(4)}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-1">AI Fair Value</p>
              <p className="text-2xl font-bold text-primary">${fairValueData.fairValue.toFixed(4)}</p>
            </div>
          </div>

          {/* Dislocation Alert */}
          {fairValueData.arbitrageOpportunity && (
            <div className="p-4 rounded-lg bg-success/10 border border-success/20 animate-pulse-glow">
              <div className="flex items-center gap-2 text-success font-semibold mb-2">
                <TrendingUp className="w-5 h-5" />
                Arbitrage Opportunity Detected!
              </div>
              <p className="text-sm">
                Price dislocation: {Math.abs(fairValueData.dislocation).toFixed(2)}%
              </p>
              <p className="text-sm">
                Expected return: {fairValueData.expectedReturn.toFixed(2)}%
              </p>
            </div>
          )}

          {/* Recommendation */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${getRecommendationColor(fairValueData.recommendation)} flex items-center justify-center text-white`}>
                {getRecommendationIcon(fairValueData.recommendation)}
              </div>
              <div>
                <p className="font-semibold text-lg">{fairValueData.recommendation}</p>
                <p className="text-sm text-muted-foreground">
                  Confidence: {fairValueData.confidence}%
                </p>
              </div>
            </div>
            <Badge variant={fairValueData.riskLevel === 'low' ? 'default' : 'destructive'}>
              {fairValueData.riskLevel.toUpperCase()} RISK
            </Badge>
          </div>

          {/* AI Reasoning */}
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm font-semibold mb-2">AI Analysis:</p>
            <p className="text-sm text-muted-foreground">{fairValueData.reasoning}</p>
          </div>

          {/* Real-World Data Source */}
          <div className="text-xs text-muted-foreground">
            <p>📊 Data source: US Treasury Fiscal Data API</p>
            <p>🕐 Updated: {new Date(fairValueData.timestamp).toLocaleString()}</p>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
