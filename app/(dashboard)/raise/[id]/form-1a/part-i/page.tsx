import { redirect } from 'next/navigation';
import { getCompanyForUser } from '@/lib/company';
import { getOrCreateForm1A } from '@/app/actions/form-1a';
import Part1Form from './part-i-form';

export default async function Part1Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = await getCompanyForUser();
  if (!company) redirect('/company/setup');

  const result = await getOrCreateForm1A(id);
  if (result.error || !result.filing) {
    redirect('/dashboard');
  }

  const content = (result.filing.contentJson as any)?.part1 || {};

  return <Part1Form filingId={result.filing.id} initialData={content} company={company} />;
}
