import { Card } from '@/components/ui/card';
import { TrendingUp, DollarSign, PieChart, Percent } from 'lucide-react';

export const TreasuryOverview = () => {
  const metrics = [
    {
      label: 'Total Value',
      value: '$1,850,000',
      change: '+5.2%',
      positive: true,
      icon: DollarSign,
      gradient: 'gradient-primary'
    },
    {
      label: 'Current Yield',
      value: '8.5%',
      change: '+1.2%',
      positive: true,
      icon: Percent,
      gradient: 'gradient-success'
    },
    {
      label: 'RWA Holdings',
      value: '500 t-BILL',
      change: '$850k',
      positive: true,
      icon: PieChart,
      gradient: 'from-accent to-secondary'
    },
    {
      label: 'Active Positions',
      value: '3',
      change: '2 Raydium',
      positive: true,
      icon: TrendingUp,
      gradient: 'from-warning to-accent'
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
      {metrics.map((metric, idx) => {
        const Icon = metric.icon;
        return (
          <Card 
            key={idx}
            className="gradient-card shadow-card p-6 hover:shadow-elevated transition-smooth"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </span>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${metric.gradient}`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className={`text-sm ${metric.positive ? 'text-success' : 'text-destructive'}`}>
                  {metric.change}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
