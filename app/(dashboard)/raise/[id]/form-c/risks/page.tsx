import { redirect } from 'next/navigation';
import { getOrCreateFormC } from '@/app/actions/form-c';
import RisksForm from './risks-form';

export default async function RisksPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const result = await getOrCreateFormC(id);
  if (result.error || !result.filing) {
    redirect('/dashboard');
  }

  const content = (result.filing.contentJson as any)?.risks || {};

  return <RisksForm filingId={result.filing.id} initialData={content} />;
}
