import { redirect } from 'next/navigation';
import { getOrCreateForm1A } from '@/app/actions/form-1a';
import CoverForm from './cover-form';

export default async function CoverPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const result = await getOrCreateForm1A(id);
  if (result.error || !result.filing) {
    redirect('/dashboard');
  }

  const content = (result.filing.contentJson as any)?.cover || {};

  return <CoverForm filingId={result.filing.id} initialData={content} />;
}
