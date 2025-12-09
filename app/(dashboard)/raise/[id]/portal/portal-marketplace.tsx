'use client';

import { useState } from 'react';
import { Check, ExternalLink, Percent, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SEED_PORTALS } from '@/lib/portals';
import { selectPortal } from '@/app/actions/portal';

export default function PortalMarketplace({ raiseId, currentPortalId }: { raiseId: string, currentPortalId?: string | null }) {
  const [selectedId, setSelectedId] = useState<string | null>(currentPortalId || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelect = async (portalId: string) => {
    if (confirm('Are you sure you want to select this portal? This will initiate your application.')) {
      setIsSubmitting(true);
      const result = await selectPortal(raiseId, portalId);
      setIsSubmitting(false);
      if (result.success) {
        setSelectedId(portalId);
      } else {
        alert(result.error);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Select a Funding Portal</h1>
        <p className="text-white/50">
          Choose the platform where your campaign will live. We've partnered with the top portals to streamline your application.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {SEED_PORTALS.map((portal) => {
          const isSelected = selectedId === portal.id;
          
          return (
            <Card 
              key={portal.id}
              className={`relative flex flex-col transition-all duration-300 ${
                isSelected 
                  ? 'bg-neutral-900 border-green-500 ring-1 ring-green-500/50 shadow-lg shadow-green-500/10' 
                  : 'bg-neutral-900/50 hover:bg-neutral-900 hover:border-white/20'
              }`}
            >
              {isSelected && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-neutral-950 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  SELECTED
                </div>
              )}

              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="default" className="bg-white/5 border-white/10 text-white/70">
                    {portal.name}
                  </Badge>
                  <a 
                    href={portal.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white/30 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <CardTitle className="text-xl">{portal.name}</CardTitle>
                <CardDescription className="line-clamp-2 h-10">
                  {portal.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 space-y-6">
                {/* Fees */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-white/5">
                  <div>
                    <p className="text-xs text-white/40 mb-1">Cash Fee</p>
                    <p className="text-lg font-mono font-medium text-white">{portal.cashFeePercent}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-1">Equity Fee</p>
                    <p className="text-lg font-mono font-medium text-white">{portal.equityFeePercent}%</p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Key Features</p>
                  <ul className="space-y-2">
                    {portal.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-white/70">
                        <Trophy className="w-4 h-4 text-yellow-500/70 mt-0.5 shrink-0" />
                        <span className="leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>

              <CardFooter className="pt-2">
                <Button 
                  className="w-full" 
                  variant={isSelected ? 'secondary' : 'default'}
                  onClick={() => handleSelect(portal.id)}
                  disabled={isSubmitting || isSelected}
                >
                  {isSelected ? 'Application Started' : 'Select Portal'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
