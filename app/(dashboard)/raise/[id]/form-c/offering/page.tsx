import { redirect } from 'next/navigation';
import { getOrCreateFormC } from '@/app/actions/form-c';
import OfferingForm from './offering-form';
import { prisma } from '@/lib/db';

export default async function OfferingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const result = await getOrCreateFormC(id);
  if (result.error || !result.filing) {
    redirect('/dashboard');
  }

  const raise = await prisma.raise.findUnique({ where: { id } });
  const content = (result.filing.contentJson as any)?.offering || {};

  return <OfferingForm filingId={result.filing.id} initialData={content} raise={raise} />;
}
