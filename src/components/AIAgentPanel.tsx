import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Brain, TrendingUp, Activity, Zap, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIAgentPanelProps {
  onAction: (action: any) => void;
}

export const AIAgentPanel = ({ onAction }: AIAgentPanelProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [targetYield, setTargetYield] = useState('5');
  const { toast } = useToast();

  const analyzeMarket = async () => {
    setIsAnalyzing(true);
    
    try {
      // Simulate AI analysis with Gemini API
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const analysis = {
        type: 'Market Analysis',
        timestamp: new Date().toISOString(),
        result: {
          recommendation: 'Deploy 15% to t-BILL/USDC pool',
          expectedYield: '8.7%',
          risk: 'Low',
          confidence: '94%',
        },
      };

      onAction(analysis);
      
      toast({
        title: "Analysis Complete",
        description: "AI recommends deploying to t-BILL/USDC pool for 8.7% yield",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to complete market analysis",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const deployToRaydium = async () => {
    setIsDeploying(true);
    
    try {
      // Simulate Raydium deployment
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const deployment = {
        type: 'Raydium Deployment',
        timestamp: new Date().toISOString(),
        result: {
          pool: 't-BILL/USDC',
          amount: '100,000 USDC + 100 t-BILL',
          expectedAPY: '8.5%',
          status: 'Active',
          txHash: '0x' + Math.random().toString(16).slice(2, 18),
        },
      };

      onAction(deployment);
      
      toast({
        title: "Deployment Successful",
        description: "Liquidity deployed to Raydium t-BILL/USDC pool",
      });
    } catch (error) {
      toast({
        title: "Deployment Failed",
        description: "Unable to deploy to Raydium pool",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const optimizePortfolio = async () => {
    setIsAnalyzing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const optimization = {
        type: 'Portfolio Optimization',
        timestamp: new Date().toISOString(),
        result: {
          action: 'Rebalance allocation',
          changes: [
            { asset: 't-BILL', from: '45%', to: '50%' },
            { asset: 'USDC', from: '40%', to: '35%' },
            { asset: 'LP Positions', from: '15%', to: '15%' },
          ],
          projectedYield: `${parseFloat(targetYield) + 1.5}%`,
        },
      };

      onAction(optimization);
      
      toast({
        title: "Optimization Complete",
        description: "Portfolio rebalanced for optimal yield",
      });
    } catch (error) {
      toast({
        title: "Optimization Failed",
        description: "Unable to optimize portfolio",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="gradient-card shadow-card p-6 animate-slide-in">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center animate-pulse-glow">
            <Brain className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">AI Agent Control</h2>
            <p className="text-sm text-muted-foreground">Autonomous treasury management</p>
          </div>
        </div>

        {/* Status */}
        <div className="p-4 rounded-lg bg-success/10 border border-success/20">
          <div className="flex items-center gap-2 text-success">
            <Activity className="w-4 h-4 animate-pulse" />
            <span className="font-semibold">Agent Status: Active</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Monitoring markets and optimizing positions
          </p>
        </div>

        {/* Target Yield */}
        <div className="space-y-2">
          <Label htmlFor="target-yield">Target Yield (%)</Label>
          <Input
            id="target-yield"
            type="number"
            value={targetYield}
            onChange={(e) => setTargetYield(e.target.value)}
            min="0"
            max="100"
            step="0.1"
            className="text-lg font-semibold"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid sm:grid-cols-3 gap-3">
          <Button
            onClick={analyzeMarket}
            disabled={isAnalyzing || isDeploying}
            className="w-full gap-2 gradient-primary"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4" />
                Analyze
              </>
            )}
          </Button>

          <Button
            onClick={deployToRaydium}
            disabled={isAnalyzing || isDeploying}
            className="w-full gap-2 bg-accent hover:bg-accent/90"
          >
            {isDeploying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deploying...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Deploy
              </>
            )}
          </Button>

          <Button
            onClick={optimizePortfolio}
            disabled={isAnalyzing || isDeploying}
            className="w-full gap-2 bg-success hover:bg-success/90"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4" />
                Optimize
              </>
            )}
          </Button>
        </div>

        {/* Info */}
        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <p className="font-semibold mb-1">How it works:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Analyze: AI evaluates market conditions using Gemini</li>
            <li>Deploy: Creates liquidity positions on Raydium</li>
            <li>Optimize: Rebalances portfolio for target yield</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};
