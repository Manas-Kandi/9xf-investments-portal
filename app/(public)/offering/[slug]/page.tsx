import { notFound } from 'next/navigation';
import { getPublicOffering } from '@/app/actions/offering';
import { Button } from '@/components/ui/button';

export default async function PublicOfferingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const raise = await getPublicOffering(slug);

  if (!raise) return notFound();

  const config = raise.offeringConfig as any || {};

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-white/20">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center bg-black overflow-hidden">
        {config.coverImageUrl && (
          <div 
            className="absolute inset-0 opacity-40 bg-cover bg-center transition-transform duration-1000 hover:scale-105" 
            style={{ backgroundImage: `url(${config.coverImageUrl})` }} 
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent" />
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">{config.heroTitle || raise.company.legalName}</h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">{config.heroSubtitle}</p>
          <Button size="lg" className="text-lg px-8 py-6 rounded-full bg-white text-black hover:bg-white/90 transition-all transform hover:scale-105">
            Invest Now
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2">
          {config.videoUrl && (
            <div className="aspect-video mb-12 rounded-xl overflow-hidden bg-neutral-900 border border-white/10">
              <iframe 
                src={config.videoUrl.replace('watch?v=', 'embed/')} 
                className="w-full h-full" 
                allowFullScreen 
              />
            </div>
          )}
          
          <div className="prose prose-invert prose-lg max-w-none">
            <h2 className="text-3xl font-bold mb-6">The Story</h2>
            <div className="whitespace-pre-wrap text-white/80 leading-relaxed">{config.story}</div>
          </div>
        </div>

        <div>
          <div className="sticky top-8 p-8 bg-neutral-900 border border-white/10 rounded-2xl shadow-xl">
            <div className="mb-2">
              <span className="text-4xl font-bold text-white">${Number(raise.amountRaised).toLocaleString()}</span>
              <span className="text-white/50 ml-2 text-lg">raised</span>
            </div>
            
            <div className="mb-8 relative pt-4">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full" 
                  style={{ width: `${Math.min((Number(raise.amountRaised) / Number(raise.targetAmount)) * 100, 100)}%` }} 
                />
              </div>
              <div className="flex justify-between text-sm text-white/40 mt-2 font-mono">
                <span>0%</span>
                <span>Target: ${Number(raise.targetAmount).toLocaleString()}</span>
              </div>
            </div>

            <Button className="w-full mb-6 py-6 text-lg font-bold bg-green-600 hover:bg-green-700">Invest Now</Button>
            
            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-white/50">Minimum Investment</span>
                <span className="font-mono text-white">${Number(raise.minimumInvestment || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/50">Security Type</span>
                <span className="text-white">{(raise.filings[0]?.contentJson as any)?.offering?.securityType || 'Equity'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/50">Valuation Cap</span>
                <span className="font-mono text-white">$10M</span> 
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
