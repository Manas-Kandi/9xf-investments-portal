import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getCompanyForUser } from '@/lib/company';
import { getOrCreateFormC } from '@/app/actions/form-c';
import PreviewView from './preview-view';

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = await getCompanyForUser();
  if (!company) redirect('/company/setup');

  const result = await getOrCreateFormC(id);
  if (result.error || !result.filing) {
    redirect('/dashboard');
  }

  const raise = await prisma.raise.findUnique({ where: { id } });

  return <PreviewView filing={result.filing} company={company} raise={raise} />;
}
