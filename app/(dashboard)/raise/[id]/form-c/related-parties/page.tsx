import { redirect } from 'next/navigation';
import { getOrCreateFormC } from '@/app/actions/form-c';
import RelatedPartiesForm from './related-parties-form';

export default async function RelatedPartiesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const result = await getOrCreateFormC(id);
  if (result.error || !result.filing) {
    redirect('/dashboard');
  }

  const content = (result.filing.contentJson as any)?.relatedParties || {};

  return <RelatedPartiesForm filingId={result.filing.id} initialData={content} />;
}
