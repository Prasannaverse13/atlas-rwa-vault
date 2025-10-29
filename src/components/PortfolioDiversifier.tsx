import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TrendingUp, Loader2, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useWallet } from '@solana/wallet-adapter-react';

interface PoolAllocation {
  pool: string;
  percentage: number;
  amount: number;
  expectedYield: number;
  assetClass: string;
  reasoning: string;
}

interface DiversifierData {
  optimizedAllocation: PoolAllocation[];
  portfolioMetrics: {
    expectedReturn: number;
    expectedVolatility: number;
    sharpeRatio: number;
    diversificationScore: number;
  };
  reasoning: string;
  executionPlan: string[];
  timestamp: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const PortfolioDiversifier = () => {
  const { publicKey } = useWallet();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [diversifierData, setDiversifierData] = useState<DiversifierData | null>(null);
  const { toast } = useToast();

  const optimizePortfolio = async () => {
    if (!publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    setIsOptimizing(true);
    try {
      // Simulate available RWA pools on Raydium
      const availablePools = [
        { name: 't-BILL/USDC', apy: 8.5, tvl: 2500000, assetClass: 'Treasury Bills' },
        { name: 't-BOND/USDC', apy: 10.2, tvl: 1800000, assetClass: 'Treasury Bonds' },
        { name: 't-GOLD/USDC', apy: 4.5, tvl: 3200000, assetClass: 'Precious Metals' },
        { name: 'RWA-RE/USDC', apy: 12.5, tvl: 950000, assetClass: 'Real Estate' },
        { name: 'CORP-BOND/USDC', apy: 9.8, tvl: 1400000, assetClass: 'Corporate Bonds' },
      ];

      const { data, error } = await supabase.functions.invoke('portfolio-diversifier', {
        body: {
          availablePools,
          currentAllocation: {
            't-BILL/USDC': 100,
          },
          targetYield: 8.0,
          riskTolerance: 'medium',
          totalValue: 1850000,
        },
      });

      if (error) throw error;

      setDiversifierData(data);
      
      toast({
        title: "Portfolio Optimization Complete",
        description: `Diversified across ${data.optimizedAllocation.length} asset classes`,
      });
    } catch (error) {
      console.error('Portfolio optimization error:', error);
      toast({
        title: "Optimization Failed",
        description: error instanceof Error ? error.message : "Unable to optimize portfolio",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const chartData = diversifierData?.optimizedAllocation.map(item => ({
    name: item.pool,
    value: item.percentage,
  })) || [];

  return (
    <Card className="gradient-card shadow-card animate-slide-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle>AI Portfolio Diversifier</CardTitle>
              <CardDescription>Multi-asset optimization & allocation</CardDescription>
            </div>
          </div>
          <Button
            onClick={optimizePortfolio}
            disabled={isOptimizing}
            size="sm"
            className="gap-2"
          >
            {isOptimizing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4" />
                Optimize
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      {diversifierData && (
        <CardContent className="space-y-4">
          {/* Portfolio Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Expected Return</p>
              <p className="text-lg font-bold text-success">{diversifierData.portfolioMetrics.expectedReturn.toFixed(2)}%</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Volatility</p>
              <p className="text-lg font-bold">{diversifierData.portfolioMetrics.expectedVolatility.toFixed(2)}%</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Sharpe Ratio</p>
              <p className="text-lg font-bold text-primary">{diversifierData.portfolioMetrics.sharpeRatio.toFixed(2)}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Diversification</p>
              <p className="text-lg font-bold text-accent">{diversifierData.portfolioMetrics.diversificationScore}%</p>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Allocation Details */}
          <div className="space-y-2">
            <p className="font-semibold text-sm">Optimized Allocation:</p>
            {diversifierData.optimizedAllocation.map((item, index) => (
              <div key={index} className="p-3 rounded-lg bg-muted/50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{item.pool}</span>
                  <Badge>{item.percentage}%</Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{item.assetClass}</span>
                  <span className="text-success">{item.expectedYield.toFixed(2)}% APY</span>
                </div>
                <p className="text-xs text-muted-foreground">${item.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>

          {/* AI Reasoning */}
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm font-semibold mb-2">🤖 AI Strategy:</p>
            <p className="text-sm text-muted-foreground">{diversifierData.reasoning}</p>
          </div>

          {/* Execution Plan */}
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm font-semibold mb-2">📋 Execution Plan:</p>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              {diversifierData.executionPlan.map((step, index) => (
                <li key={index} className="text-muted-foreground">{step}</li>
              ))}
            </ol>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
