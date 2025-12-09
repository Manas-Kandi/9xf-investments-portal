import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';

export async function getCompanyForUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return null;
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
  });

  if (!dbUser) {
    return null;
  }

  const member = await prisma.companyMember.findFirst({
    where: { userId: dbUser.id },
    include: { company: true },
  });

  return member?.company || null;
}

export async function requireCompany() {
  const company = await getCompanyForUser();
  if (!company) {
    redirect('/company/setup');
  }
  return company;
}
