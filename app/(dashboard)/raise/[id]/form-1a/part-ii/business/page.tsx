import { redirect } from 'next/navigation';
import { getOrCreateForm1A } from '@/app/actions/form-1a';
import BusinessForm from './business-form';

export default async function BusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getOrCreateForm1A(id);
  if (result.error || !result.filing) redirect('/dashboard');
  const content = (result.filing.contentJson as any)?.business || {};
  return <BusinessForm filingId={result.filing.id} initialData={content} />;
}
