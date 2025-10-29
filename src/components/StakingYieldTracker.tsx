import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, TrendingUp, DollarSign, RefreshCw } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useToast } from '@/hooks/use-toast';

interface StakingData {
  stakingAPY: number;
  defiYield: number;
  blendedYield: number;
  projectedAnnualReturn: number;
  dailyRewards: number;
  strategy: 'Conservative' | 'Balanced' | 'Aggressive';
}

export const StakingYieldTracker = () => {
  const { publicKey } = useWallet();
  const { toast } = useToast();
  const [stakingData, setStakingData] = useState<StakingData>({
    stakingAPY: 7.2,
    defiYield: 8.5,
    blendedYield: 7.72,
    projectedAnnualReturn: 15680,
    dailyRewards: 42.95,
    strategy: 'Balanced',
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshYields = async () => {
    if (!publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    setIsRefreshing(true);
    try {
      // Simulate fetching real-time staking yields from validators and DeFi protocols
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // In production, this would fetch from:
      // - Solana validators for staking APY
      // - Raydium pools for DeFi yield
      // - Forward Industries' validator for institutional rates
      
      const newStakingAPY = 7.2 + (Math.random() - 0.5) * 0.4;
      const newDefiYield = 8.5 + (Math.random() - 0.5) * 0.6;
      const blended = (newStakingAPY * 0.6) + (newDefiYield * 0.4);
      
      setStakingData({
        ...stakingData,
        stakingAPY: newStakingAPY,
        defiYield: newDefiYield,
        blendedYield: blended,
      });

      toast({
        title: "Yields Updated",
        description: "Real-time staking and DeFi yields refreshed",
      });
    } catch (error) {
      console.error('Error refreshing yields:', error);
      toast({
        title: "Refresh Failed",
        description: "Unable to fetch latest yields",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Card className="gradient-card shadow-card animate-slide-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <Coins className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle>Staking & DeFi Yield Tracker</CardTitle>
              <CardDescription>Forward's dual-revenue strategy: Staking + DeFi</CardDescription>
            </div>
          </div>
          <Button
            onClick={refreshYields}
            disabled={isRefreshing}
            size="sm"
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Yield Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Staking APY</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{stakingData.stakingAPY.toFixed(2)}%</span>
              <Badge variant="default" className="bg-success">
                Validator
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From Forward Industries validator delegation
            </p>
          </div>

          <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">DeFi Yield</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{stakingData.defiYield.toFixed(2)}%</span>
              <Badge variant="default" className="bg-primary">
                Raydium
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From RWA liquidity pools on Raydium
            </p>
          </div>

          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Blended Yield</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">{stakingData.blendedYield.toFixed(2)}%</span>
              <Badge variant="default" className="gradient-primary">
                Combined
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              60% staking / 40% DeFi allocation
            </p>
          </div>
        </div>

        {/* Strategy Allocation */}
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">Forward's Institutional Strategy</h4>
            <Badge variant="outline">{stakingData.strategy}</Badge>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Staking (Capital Preservation)</span>
                <span className="font-semibold">60%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-success" style={{ width: '60%' }} />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">DeFi (Yield Enhancement)</span>
                <span className="font-semibold">40%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '40%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Projected Returns */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Daily Rewards</p>
            <p className="text-2xl font-bold">${stakingData.dailyRewards.toFixed(2)}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Annual Projection</p>
            <p className="text-2xl font-bold">${stakingData.projectedAnnualReturn.toLocaleString()}</p>
          </div>
        </div>

        {/* Info Box */}
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-sm">
            <span className="font-semibold">Forward Industries Strategy:</span> By delegating to their 
            own validator and participating in select DeFi protocols (like Raydium RWA pools), Forward 
            generates dual revenue streams that compound SOL holdings while maintaining institutional-grade 
            risk controls.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
