import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getCompanyForUser } from '@/lib/company';
import TeamView from './team-view';

export default async function TeamPage() {
  const company = await getCompanyForUser();
  
  if (!company) {
    redirect('/company/setup');
  }

  const members = await prisma.teamMember.findMany({
    where: { companyId: company.id },
    orderBy: { createdAt: 'desc' },
  });

  const serializedMembers = members.map(m => ({
    id: m.id,
    name: m.name,
    title: m.title,
    email: m.email,
    role: m.role,
    ownershipPercentage: m.ownershipPercentage ? Number(m.ownershipPercentage) : undefined,
    badActorStatus: m.badActorStatus,
  }));

  return <TeamView members={serializedMembers} />;
}
