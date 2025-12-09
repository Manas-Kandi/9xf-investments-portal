import { redirect } from 'next/navigation';
import { getCompanyForUser } from '@/lib/company';
import { getOrCreateFormC } from '@/app/actions/form-c';
import IssuerForm from './issuer-form';

export default async function IssuerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = await getCompanyForUser();
  if (!company) redirect('/company/setup');

  const result = await getOrCreateFormC(id);
  if (result.error || !result.filing) {
    redirect('/dashboard');
  }

  const content = (result.filing.contentJson as any)?.issuer || {};

  return <IssuerForm filingId={result.filing.id} initialData={content} company={company} />;
}
