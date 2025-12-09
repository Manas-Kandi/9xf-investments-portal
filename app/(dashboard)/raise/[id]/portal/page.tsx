import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getCompanyForUser } from '@/lib/company';
import PortalMarketplace from './portal-marketplace';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PortalPage({ params }: PageProps) {
  const { id } = await params;
  const company = await getCompanyForUser();
  
  if (!company) redirect('/company/setup');

  const raise = await prisma.raise.findUnique({
    where: { id },
  });

  if (!raise || raise.companyId !== company.id) {
    redirect('/dashboard');
  }

  return <PortalMarketplace raiseId={id} currentPortalId={raise.portalId} />;
}
