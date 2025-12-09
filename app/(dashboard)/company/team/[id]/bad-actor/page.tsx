import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getCompanyForUser } from '@/lib/company';
import BadActorForm from './bad-actor-form';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BadActorPage({ params }: PageProps) {
  const { id } = await params;
  const company = await getCompanyForUser();
  
  if (!company) {
    redirect('/company/setup');
  }

  const teamMember = await prisma.teamMember.findUnique({
    where: { id },
  });

  if (!teamMember || teamMember.companyId !== company.id) {
    redirect('/company/team');
  }

  const serializedMember = {
    id: teamMember.id,
    name: teamMember.name,
    badActorStatus: teamMember.badActorStatus,
  };

  return <BadActorForm teamMember={serializedMember} />;
}
