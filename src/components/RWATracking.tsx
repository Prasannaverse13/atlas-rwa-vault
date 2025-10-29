import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, MapPin, Thermometer, Shield, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';

interface RWAAsset {
  id: string;
  type: 'T-BILL' | 'T-BOND' | 'COMMODITY' | 'REAL_ESTATE';
  tokenAddress: string;
  status: 'Active' | 'In Transit' | 'Verified' | 'Alert';
  location: string;
  value: number;
  custody: string;
  lastVerified: Date;
  iotDeviceId?: string;
  temperature?: number;
  humidity?: number;
}

export const RWATracking = () => {
  const { publicKey } = useWallet();
  const [assets, setAssets] = useState<RWAAsset[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!publicKey) return;

    // Simulated RWA assets with IoT tracking
    // In production, this would integrate with:
    // - Forward Industries' IoT device platform
    // - Intelligent Product Solutions' embedded systems
    // - Kablooe Design's connected device architecture
    const mockAssets: RWAAsset[] = [
      {
        id: 'RWA-001',
        type: 'T-BILL',
        tokenAddress: 'So11111111111111111111111111111111111111112',
        status: 'Verified',
        location: 'Federal Reserve - New York',
        value: 1000000,
        custody: 'State Street Bank',
        lastVerified: new Date(Date.now() - 3600000),
        iotDeviceId: 'IPS-HC1-2024-001',
        temperature: 21.5,
        humidity: 45,
      },
      {
        id: 'RWA-002',
        type: 'T-BOND',
        tokenAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        status: 'Active',
        location: 'Treasury Direct Vault',
        value: 2500000,
        custody: 'BNY Mellon',
        lastVerified: new Date(Date.now() - 7200000),
        iotDeviceId: 'KABLOOE-MED-2024-042',
      },
      {
        id: 'RWA-003',
        type: 'COMMODITY',
        tokenAddress: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
        status: 'In Transit',
        location: 'Forward APAC - Hong Kong Warehouse',
        value: 750000,
        custody: 'Brinks Global Services',
        lastVerified: new Date(Date.now() - 1800000),
        iotDeviceId: 'FWD-SUPPLY-2024-128',
        temperature: 18.2,
        humidity: 52,
      },
    ];

    setAssets(mockAssets);
  }, [publicKey]);

  const refreshTracking = async () => {
    setIsRefreshing(true);
    // Simulate IoT device polling
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Verified':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'Active':
        return <Shield className="w-5 h-5 text-primary" />;
      case 'In Transit':
        return <Package className="w-5 h-5 text-warning" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-destructive" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified':
        return 'bg-success';
      case 'Active':
        return 'bg-primary';
      case 'In Transit':
        return 'bg-warning';
      default:
        return 'bg-destructive';
    }
  };

  if (!publicKey) {
    return (
      <Card className="gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Real-World Asset Tracking
          </CardTitle>
          <CardDescription>Connect wallet to monitor RWA custody and IoT sensors</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="gradient-card shadow-card animate-slide-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Real-World Asset Tracking
            </CardTitle>
            <CardDescription>
              IoT-enabled custody monitoring powered by Forward Industries' connected device platform
            </CardDescription>
          </div>
          <Button
            onClick={refreshTracking}
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

      <CardContent className="space-y-4">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="p-4 rounded-lg bg-muted/50 border border-border/50 hover:bg-muted/70 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{asset.id}</span>
                    <Badge variant="outline">{asset.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Custody: {asset.custody}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(asset.status)}
                <Badge className={getStatusColor(asset.status)}>
                  {asset.status}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="p-3 rounded-lg bg-background/50">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Location</span>
                </div>
                <p className="text-sm font-medium">{asset.location}</p>
              </div>
              <div className="p-3 rounded-lg bg-background/50">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Token Value</span>
                </div>
                <p className="text-sm font-medium">
                  ${asset.value.toLocaleString()}
                </p>
              </div>
            </div>

            {asset.iotDeviceId && (
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-primary">
                    IoT Device: {asset.iotDeviceId}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Last verified: {Math.floor((Date.now() - asset.lastVerified.getTime()) / 60000)}m ago
                  </span>
                </div>
                {(asset.temperature || asset.humidity) && (
                  <div className="flex gap-4">
                    {asset.temperature && (
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-4 h-4 text-primary" />
                        <span className="text-sm">{asset.temperature}°C</span>
                      </div>
                    )}
                    {asset.humidity && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          Humidity: {asset.humidity}%
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                Token: {asset.tokenAddress.slice(0, 8)}...{asset.tokenAddress.slice(-6)}
              </p>
            </div>
          </div>
        ))}

        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-1">Forward Industries Integration</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Atlas leverages Forward's expertise across three divisions to enable secure RWA tracking:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>
                  <strong>Intelligent Product Solutions (IPS)</strong>: Embedded systems and IoT device integration
                  for real-time asset monitoring
                </li>
                <li>
                  <strong>Kablooe Design</strong>: Connected device architecture for secure device-cloud-application
                  communication (used in HC-1 Headset, AdhereTech Connected Pill Bottle)
                </li>
                <li>
                  <strong>Forward APAC</strong>: Global supply chain logistics for physical asset custody verification
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
