import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export const PortfolioAllocation = () => {
  const data = [
    { name: 't-BILL Tokens', value: 850000, color: 'hsl(var(--primary))' },
    { name: 'USDC', value: 700000, color: 'hsl(var(--accent))' },
    { name: 'Raydium LP', value: 250000, color: 'hsl(var(--success))' },
    { name: 'Reserve', value: 50000, color: 'hsl(var(--muted))' },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="gradient-card shadow-card p-6 animate-slide-in">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Portfolio Allocation</h2>
          <p className="text-sm text-muted-foreground">Current asset distribution</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Breakdown */}
          <div className="space-y-4">
            {data.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-semibold text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold">
                    {((item.value / total) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>${item.value.toLocaleString()}</span>
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ 
                        width: `${(item.value / total) * 100}%`,
                        backgroundColor: item.color 
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="font-bold">Total Value</span>
                <span className="text-2xl font-bold">
                  ${total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
