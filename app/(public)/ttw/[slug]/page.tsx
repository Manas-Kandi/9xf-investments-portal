import { notFound } from 'next/navigation';
import { getPublicCampaign } from '@/app/actions/ttw';
import LeadCaptureForm from '@/components/ttw/lead-capture-form';
import { SecDisclaimer } from '@/components/ttw/sec-disclaimer';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const campaign = await getPublicCampaign(slug);
  return {
    title: campaign ? campaign.title : 'Campaign Not Found',
  };
}

export default async function PublicTtwPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const campaign = await getPublicCampaign(slug);

  if (!campaign || campaign.status !== 'ACTIVE') {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-white/20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-12 text-center">
           <h1 className="text-4xl md:text-5xl font-bold mb-4">{campaign.title}</h1>
           <p className="text-xl text-white/60 max-w-2xl mx-auto">
             Testing the Waters for {campaign.raise.company.legalName}
           </p>
        </header>

        <div className="grid md:grid-cols-3 gap-12">
           {/* Content */}
           <div className="md:col-span-2 space-y-8">
             <div className="prose prose-invert prose-lg max-w-none">
               <p className="whitespace-pre-wrap leading-relaxed text-white/80">{campaign.description}</p>
             </div>
           </div>

           {/* Sidebar */}
           <div className="md:col-span-1">
             <div className="sticky top-6">
               <LeadCaptureForm shareToken={slug} />
             </div>
           </div>
        </div>
      </div>
      
      <SecDisclaimer />
    </div>
  );
}
