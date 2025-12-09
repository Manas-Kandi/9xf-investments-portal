import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db';
import DashboardView from './dashboard-view';

export default async function CompanyPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user || !user.email) {
    redirect('/login');
  }

  // 1. Find the Prisma user by email
  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
  });

  if (!dbUser) {
    // If user is not in Prisma yet, they definitely don't have a company
    return <DashboardView company={null} />;
  }

  // 2. Find the company linked to this user
  const member = await prisma.companyMember.findFirst({
    where: { userId: dbUser.id },
    include: { company: true },
  });

  if (!member || !member.company) {
    return <DashboardView company={null} />;
  }

  const company = member.company;

  // 3. Fetch stats
  const [teamCount, shareholderCount, documentCount] = await Promise.all([
    prisma.teamMember.count({ where: { companyId: company.id } }),
    prisma.capTableEntry.count({ where: { companyId: company.id } }),
    prisma.document.count({ where: { companyId: company.id } }),
  ]);

  return (
    <DashboardView 
      company={company} 
      stats={{ teamCount, shareholderCount, documentCount }} 
    />
  );
}
