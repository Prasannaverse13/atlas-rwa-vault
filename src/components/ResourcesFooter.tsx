import { ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const ResourcesFooter = () => {
  const resources = [
    { name: 'Phantom', url: 'https://phantom.app', description: 'Leading Solana Wallet' },
    { name: 'Raydium', url: 'https://raydium.io', description: 'Solana\'s First AMM' },
    { name: 'Triton', url: 'https://triton.one', description: 'High-Performance RPC' },
    { name: 'Forward', url: 'https://sol.forwardindustries.com', description: 'Treasury Strategy' },
    { name: 'Solana', url: 'https://solana.com', description: 'High-Speed Blockchain' },
  ];

  return (
    <Card className="gradient-card shadow-card p-6 mt-8">
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-center">Powered By Industry Leaders</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {resources.map((resource) => (
            <a
              key={resource.name}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3 rounded-lg bg-muted/50 hover:bg-primary/10 transition-all hover:scale-105"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm group-hover:text-primary transition-colors">
                  {resource.name}
                </span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-muted-foreground">{resource.description}</p>
            </a>
          ))}
        </div>
      </div>
    </Card>
  );
};
