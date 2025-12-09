import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getOrCreateFormC } from '@/app/actions/form-c';
import UseOfProceedsForm from './use-of-proceeds-form';

export default async function UseOfProceedsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const result = await getOrCreateFormC(id);
  if (result.error || !result.filing) {
    redirect('/dashboard');
  }

  const raise = await prisma.raise.findUnique({ where: { id } });
  const content = (result.filing.contentJson as any)?.useOfProceeds || {};

  return <UseOfProceedsForm filingId={result.filing.id} initialData={content} targetAmount={Number(raise?.targetAmount || 0)} />;
}
