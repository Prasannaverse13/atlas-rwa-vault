import { Card } from '@/components/ui/card';
import { Brain, TrendingUp, Zap, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ActivityFeedProps {
  actions: any[];
}

export const ActivityFeed = ({ actions }: ActivityFeedProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'Market Analysis':
        return <TrendingUp className="w-5 h-5" />;
      case 'Raydium Deployment':
        return <Zap className="w-5 h-5" />;
      case 'Portfolio Optimization':
        return <Brain className="w-5 h-5" />;
      default:
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getGradient = (type: string) => {
    switch (type) {
      case 'Market Analysis':
        return 'from-primary to-primary-glow';
      case 'Raydium Deployment':
        return 'from-accent to-secondary';
      case 'Portfolio Optimization':
        return 'from-success to-accent';
      default:
        return 'from-muted to-muted';
    }
  };

  return (
    <Card className="gradient-card shadow-card p-6 animate-slide-in h-fit sticky top-24">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Activity Feed</h2>
          <Badge variant="secondary" className="gap-1">
            <Clock className="w-3 h-3" />
            Live
          </Badge>
        </div>

        {actions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No activity yet</p>
            <p className="text-xs mt-1">Start using AI agent controls</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {actions.map((action, idx) => (
              <Card 
                key={idx}
                className="p-4 border-l-4 border-l-primary shadow-sm animate-slide-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${getGradient(action.type)} flex-shrink-0`}>
                      {getIcon(action.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm">{action.type}</h3>
                      <p className="text-xs text-muted-foreground">
                        {new Date(action.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Result Details */}
                  <div className="pl-11 space-y-2">
                    {action.result && (
                      <div className="bg-muted/50 rounded-lg p-3 space-y-2 text-xs">
                        {Object.entries(action.result).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center">
                            <span className="text-muted-foreground capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </span>
                            <span className="font-semibold text-right">
                              {Array.isArray(value) 
                                ? value.map((v: any, i: number) => (
                                    <div key={i} className="text-xs">
                                      {v.asset}: {v.from} → {v.to}
                                    </div>
                                  ))
                                : typeof value === 'string' 
                                  ? value 
                                  : JSON.stringify(value)
                              }
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <Badge variant="outline" className="text-xs">
                      <CheckCircle className="w-3 h-3 mr-1 text-success" />
                      Completed
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
