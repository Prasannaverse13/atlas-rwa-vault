import { useWallet } from '@solana/wallet-adapter-react';
import { lazy, Suspense } from 'react';

const WalletGate = lazy(() => import('@/components/WalletGate').then(m => ({ default: m.WalletGate })));
const Dashboard = lazy(() => import('@/components/Dashboard').then(m => ({ default: m.Dashboard })));

const Fallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-accent/5">
    <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" aria-label="Loading" />
  </div>
);

const Index = () => {
  const { connected } = useWallet();

  return (
    <Suspense fallback={<Fallback />}>
      {!connected && <WalletGate />}
      {connected && <Dashboard />}
    </Suspense>
  );
};

export default Index;

