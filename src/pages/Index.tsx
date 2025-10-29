import { useWallet } from '@solana/wallet-adapter-react';
import { WalletGate } from '@/components/WalletGate';
import { Dashboard } from '@/components/Dashboard';

const Index = () => {
  const { connected } = useWallet();

  return (
    <>
      {!connected && <WalletGate />}
      {connected && <Dashboard />}
    </>
  );
};

export default Index;
