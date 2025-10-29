import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, Activity, Loader2, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useWallet } from '@solana/wallet-adapter-react';

interface RegimeData {
  regime: string;
  riskLevel: string;
  action: string;
  recommendedAllocation: number;
  impermanentLossRisk: number;
  confidence: number;
  reasoning: string;
  alertLevel: 'red' | 'yellow' | 'green';
  timestamp: string;
  volatilityMetrics: {
    historical: number;
    current: number;
    spike: string;
  };
}

export const RiskRegimeMonitor = () => {
  const { publicKey } = useWallet();
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [regimeData, setRegimeData] = useState<RegimeData | null>(null);
  const { toast } = useToast();

  const checkRegime = async () => {
    if (!publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    setIsMonitoring(true);
    try {
      // Simulate real-time volatility data
      const historicalVol = 12.5;
      const currentVol = 15.8;

      const { data, error } = await supabase.functions.invoke('risk-regime-detector', {
        body: {
          poolData: {
            tvl: 2500000,
            volume24h: 450000,
          },
          historicalVolatility: historicalVol,
          currentVolatility: currentVol,
          marketMetrics: {
            solPrice: 180.5,
            solChange24h: -3.2,
          },
        },
      });

      if (error) throw error;

      setRegimeData(data);
      
      if (data.riskLevel === 'CRITICAL' || data.riskLevel === 'HIGH') {
        toast({
          title: "⚠️ Risk Alert",
          description: `${data.regime} regime detected. ${data.action}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Regime Analysis Complete",
          description: `Market regime: ${data.regime}`,
        });
      }
    } catch (error) {
      console.error('Regime detection error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Unable to detect market regime",
        variant: "destructive",
      });
    } finally {
      setIsMonitoring(false);
    }
  };

  // Auto-refresh every 30 seconds if wallet is connected
  useEffect(() => {
    if (publicKey && regimeData) {
      const interval = setInterval(checkRegime, 30000);
      return () => clearInterval(interval);
    }
  }, [publicKey, regimeData]);

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'red': return 'bg-destructive';
      case 'yellow': return 'bg-warning';
      case 'green': return 'bg-success';
      default: return 'bg-muted';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'CRITICAL':
      case 'HIGH':
        return <AlertTriangle className="w-5 h-5" />;
      case 'MEDIUM':
        return <Activity className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  return (
    <Card className="gradient-card shadow-card animate-slide-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${regimeData ? getAlertColor(regimeData.alertLevel) : 'gradient-primary'} flex items-center justify-center ${regimeData?.alertLevel === 'red' ? 'animate-pulse-glow' : ''}`}>
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle>AI Risk Regime Monitor</CardTitle>
              <CardDescription>Real-time volatility & risk detection</CardDescription>
            </div>
          </div>
          <Button
            onClick={checkRegime}
            disabled={isMonitoring}
            size="sm"
            className="gap-2"
          >
            {isMonitoring ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <Activity className="w-4 h-4" />
                Check
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      {regimeData && (
        <CardContent className="space-y-4">
          {/* Regime Status */}
          <div className={`p-4 rounded-lg border-2 ${regimeData.alertLevel === 'red' ? 'border-destructive bg-destructive/10 animate-pulse-glow' : regimeData.alertLevel === 'yellow' ? 'border-warning bg-warning/10' : 'border-success bg-success/10'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${getAlertColor(regimeData.alertLevel)} flex items-center justify-center text-white`}>
                  {getRiskIcon(regimeData.riskLevel)}
                </div>
                <div>
                  <p className="font-bold text-lg">{regimeData.regime}</p>
                  <p className="text-sm text-muted-foreground">Market Regime</p>
                </div>
              </div>
              <Badge variant={regimeData.riskLevel === 'LOW' ? 'default' : 'destructive'} className="text-sm">
                {regimeData.riskLevel}
              </Badge>
            </div>
          </div>

          {/* Volatility Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Historical</p>
              <p className="text-lg font-bold">{regimeData.volatilityMetrics.historical}%</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Current</p>
              <p className="text-lg font-bold text-primary">{regimeData.volatilityMetrics.current}%</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Spike</p>
              <p className="text-lg font-bold text-destructive">{regimeData.volatilityMetrics.spike}%</p>
            </div>
          </div>

          {/* AI Recommendation */}
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="font-semibold mb-2">🤖 AI Recommendation:</p>
            <p className="text-sm mb-2">
              <strong>Action:</strong> {regimeData.action}
            </p>
            <p className="text-sm mb-2">
              <strong>Recommended Allocation:</strong> {regimeData.recommendedAllocation}%
            </p>
            <p className="text-sm">
              <strong>IL Risk:</strong> {regimeData.impermanentLossRisk.toFixed(2)}%
            </p>
          </div>

          {/* Reasoning */}
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm font-semibold mb-2">Analysis:</p>
            <p className="text-sm text-muted-foreground">{regimeData.reasoning}</p>
          </div>

          {/* Auto-refresh indicator */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <p>🔄 Auto-refresh: every 30s</p>
            <p>🕐 Updated: {new Date(regimeData.timestamp).toLocaleTimeString()}</p>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
