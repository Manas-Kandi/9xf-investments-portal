import { notFound } from 'next/navigation';
import { getPublicOffering } from '@/app/actions/offering';
import InvestmentWizard from './investment-wizard';

export default async function InvestPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const raise = await getPublicOffering(slug);

  if (!raise) return notFound();

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-white/20">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <header className="mb-8 text-center">
           <h1 className="text-2xl font-bold mb-2">Invest in {raise.company.legalName}</h1>
           <p className="text-white/50">Complete the steps below to finalize your investment.</p>
        </header>
        <InvestmentWizard raise={raise} slug={slug} />
      </div>
    </div>
  );
}
