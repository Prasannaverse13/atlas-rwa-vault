import { useState, lazy, Suspense } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Shield, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TreasuryOverview = lazy(() => import('./TreasuryOverview').then(m => ({ default: m.TreasuryOverview })));
const AIAgentPanel = lazy(() => import('./AIAgentPanel').then(m => ({ default: m.AIAgentPanel })));
const ActivityFeed = lazy(() => import('./ActivityFeed').then(m => ({ default: m.ActivityFeed })));
const PortfolioAllocation = lazy(() => import('./PortfolioAllocation').then(m => ({ default: m.PortfolioAllocation })));
const ResourcesFooter = lazy(() => import('./ResourcesFooter').then(m => ({ default: m.ResourcesFooter })));
const FairValueOracle = lazy(() => import('./FairValueOracle').then(m => ({ default: m.FairValueOracle })));
const RiskRegimeMonitor = lazy(() => import('./RiskRegimeMonitor').then(m => ({ default: m.RiskRegimeMonitor })));
const PortfolioDiversifier = lazy(() => import('./PortfolioDiversifier').then(m => ({ default: m.PortfolioDiversifier })));
const ForwardMetrics = lazy(() => import('./ForwardMetrics').then(m => ({ default: m.ForwardMetrics })));
const StakingYieldTracker = lazy(() => import('./StakingYieldTracker').then(m => ({ default: m.StakingYieldTracker })));
const RWATracking = lazy(() => import('./RWATracking').then(m => ({ default: m.RWATracking })));

export const Dashboard = () => {
  const { disconnect } = useWallet();
  const [aiActions, setAiActions] = useState<any[]>([]);

  const handleAIAction = (action: any) => {
    setAiActions(prev => [action, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50 shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Atlas Treasury</h1>
                <p className="text-sm text-muted-foreground">AI-Powered RWA Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <WalletMultiButton className="!bg-muted hover:!bg-muted/80 !text-foreground !rounded-lg !px-4 !py-2 !text-sm">
                Wallet
              </WalletMultiButton>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => disconnect()}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Disconnect
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Treasury Overview */}
        <Suspense fallback={<div className="h-28 rounded-lg border bg-card animate-pulse" />}> 
          <TreasuryOverview />
        </Suspense>

        {/* Forward Industries Strategy Metrics */}
        <Suspense fallback={<div className="h-40 rounded-lg border bg-card animate-pulse" />}> 
          <ForwardMetrics />
        </Suspense>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - AI Features */}
          <div className="lg:col-span-2 space-y-8">
            <Suspense fallback={<div className="h-64 rounded-lg border bg-card animate-pulse" />}> 
              <AIAgentPanel onAction={handleAIAction} />
            </Suspense>
            
            {/* Staking & Yield Tracking */}
            <Suspense fallback={<div className="h-40 rounded-lg border bg-card animate-pulse" />}> 
              <StakingYieldTracker />
            </Suspense>
            
            {/* New AI Intelligence Features */}
            <div className="grid md:grid-cols-2 gap-6">
              <Suspense fallback={<div className="h-56 rounded-lg border bg-card animate-pulse" />}> 
                <FairValueOracle />
              </Suspense>
              <Suspense fallback={<div className="h-56 rounded-lg border bg-card animate-pulse" />}> 
                <RiskRegimeMonitor />
              </Suspense>
            </div>
            
            <Suspense fallback={<div className="h-48 rounded-lg border bg-card animate-pulse" />}> 
              <PortfolioDiversifier />
            </Suspense>
            <Suspense fallback={<div className="h-48 rounded-lg border bg-card animate-pulse" />}> 
              <RWATracking />
            </Suspense>
            <Suspense fallback={<div className="h-48 rounded-lg border bg-card animate-pulse" />}> 
              <PortfolioAllocation />
            </Suspense>
          </div>

          {/* Right Column - Activity Feed */}
          <div className="lg:col-span-1">
            <Suspense fallback={<div className="h-64 rounded-lg border bg-card animate-pulse" />}> 
              <ActivityFeed actions={aiActions} />
            </Suspense>
          </div>
        </div>

        {/* Resources Footer */}
        <Suspense fallback={<div className="h-24 rounded-lg border bg-card animate-pulse" />}> 
          <ResourcesFooter />
        </Suspense>
      </main>
    </div>
  );
};
