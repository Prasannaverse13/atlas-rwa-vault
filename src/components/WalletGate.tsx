import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Shield, Wallet, TrendingUp, Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const WalletGate = () => {
  const { connected } = useWallet();

  if (connected) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <div className="w-full max-w-4xl space-y-8 animate-slide-up">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-primary shadow-elevated mb-4">
            <Shield className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Atlas Treasury
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            AI-Powered Real-World Asset Management on Solana
          </p>
        </div>

        <Card className="gradient-card shadow-elevated p-8 md:p-12 backdrop-blur-sm border-2">
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <Wallet className="w-12 h-12 mx-auto text-primary" />
              <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
              <p className="text-muted-foreground">
                Connect your Solana wallet to access the treasury dashboard
              </p>
            </div>

            <div className="flex justify-center">
              <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !text-primary-foreground !rounded-xl !px-8 !py-6 !text-lg !font-semibold transition-smooth shadow-elevated">
                Wallet
              </WalletMultiButton>
            </div>

            <div className="grid md:grid-cols-3 gap-6 pt-6 border-t">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="font-semibold">Secure</h3>
                <p className="text-sm text-muted-foreground">
                  Your keys, your assets
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 text-accent">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="font-semibold">Optimized Yield</h3>
                <p className="text-sm text-muted-foreground">
                  AI-driven strategies
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-success/10 text-success">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="font-semibold">Transparent</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time monitoring
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>Powered by Solana • Forward Industries • Raydium</p>
        </div>
      </div>
    </div>
  );
};
