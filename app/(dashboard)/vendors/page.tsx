import { getVendors } from '@/app/actions/vendors';
import { requireCompany } from '@/lib/company';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import VendorDirectory from './vendor-directory';

export default async function VendorsPage() {
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
        <p className="text-white/50">Please start a raise before engaging vendors.</p>
      </div>
    );
  }

  const vendors = await getVendors();

  return <VendorDirectory initialVendors={vendors} raiseId={raise.id} />;
}
