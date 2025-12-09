import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getCompanyForUser } from '@/lib/company';
import { Building2, Users, DollarSign, AlertTriangle } from 'lucide-react';

export default async function FormCLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const company = await getCompanyForUser();
  if (!company) redirect('/company/setup');

  const raise = await prisma.raise.findUnique({ where: { id } });
  if (!raise || raise.companyId !== company.id) redirect('/dashboard');

  const sections = [
    { name: 'Issuer Information', href: `/raise/${id}/form-c/issuer`, icon: Building2 },
    { name: 'Officers & Directors', href: `/raise/${id}/form-c/team`, icon: Users },
    { name: 'Offering Terms', href: `/raise/${id}/form-c/offering`, icon: DollarSign },
    { name: 'Risk Factors', href: `/raise/${id}/form-c/risks`, icon: AlertTriangle },
  ];

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-3">
        <div className="sticky top-6 space-y-2">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white">Form C Builder</h2>
            <p className="text-xs text-white/50">SEC Regulation CF</p>
          </div>
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <section.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{section.name}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="col-span-9">
        {children}
      </div>
    </div>
  );
}
