import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getCompanyForUser } from '@/lib/company';
import FinancialsWizard from './financials-wizard';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FinancialsPage({ params }: PageProps) {
  const { id } = await params;
  const company = await getCompanyForUser();
  
  if (!company) redirect('/company/setup');

  const raise = await prisma.raise.findUnique({
    where: { id },
  });

  if (!raise || raise.companyId !== company.id) {
    redirect('/dashboard');
  }

  const serializedRaise = {
    id: raise.id,
    financialTier: raise.financialTier,
    isFirstTimeIssuer: raise.isFirstTimeIssuer,
    targetAmount: Number(raise.targetAmount),
    priorRaisesAmount: raise.priorRaisesAmount ? Number(raise.priorRaisesAmount) : 0,
  };

  return <FinancialsWizard raise={serializedRaise} targetAmount={serializedRaise.targetAmount} />;
}
