import { redirect } from 'next/navigation';
import { getOrCreateForm1A } from '@/app/actions/form-1a';
import { getCompanyForUser } from '@/lib/company';
import PreviewView1A from './preview-view-1a';

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = await getCompanyForUser();
  if (!company) redirect('/company/setup');

  const result = await getOrCreateForm1A(id);
  if (result.error || !result.filing) redirect('/dashboard');

  return <PreviewView1A filing={result.filing} company={company} />;
}
