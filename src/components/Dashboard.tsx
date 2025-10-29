import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { TreasuryOverview } from './TreasuryOverview';
import { AIAgentPanel } from './AIAgentPanel';
import { ActivityFeed } from './ActivityFeed';
import { PortfolioAllocation } from './PortfolioAllocation';
import { Shield, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
              <WalletMultiButton className="!bg-muted hover:!bg-muted/80 !text-foreground !rounded-lg !px-4 !py-2 !text-sm" />
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
        <TreasuryOverview />

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - AI Agent & Portfolio */}
          <div className="lg:col-span-2 space-y-8">
            <AIAgentPanel onAction={handleAIAction} />
            <PortfolioAllocation />
          </div>

          {/* Right Column - Activity Feed */}
          <div className="lg:col-span-1">
            <ActivityFeed actions={aiActions} />
          </div>
        </div>
      </main>
    </div>
  );
};
