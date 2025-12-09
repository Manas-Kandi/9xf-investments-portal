import { getFinancialAudit } from '@/app/actions/financial-audit';
import { requireCompany } from '@/lib/company';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import AuditTracker from './audit-tracker';

export default async function AuditPage() {
  const company = await requireCompany();
  if (!company) redirect('/company/setup');

  const raise = await prisma.raise.findFirst({
    where: { companyId: company.id },
    orderBy: { createdAt: 'desc' }
  });

  if (!raise) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">No Active Raise</h1>
        <p className="text-white/50">Please start a raise to access audit tools.</p>
      </div>
    );
  }

  const audit = await getFinancialAudit(raise.id);

  return <AuditTracker audit={audit} raiseId={raise.id} />;
}
