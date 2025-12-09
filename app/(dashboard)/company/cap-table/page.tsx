import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getCompanyForUser } from '@/lib/company';
import CapTableView from './cap-table-view';

export default async function CapTablePage() {
  const company = await getCompanyForUser();
  
  if (!company) {
    redirect('/company/setup');
  }

  const shareClasses = await prisma.shareClass.findMany({
    where: { companyId: company.id },
    include: { capTableEntries: true },
  });

  const serializedShareClasses = shareClasses.map(sc => {
    const issued = sc.capTableEntries.reduce((sum, entry) => sum + Number(entry.shares), 0);
    
    return {
      id: sc.id,
      name: sc.name,
      type: (sc as any).type || 'COMMON',
      authorizedShares: Number(sc.authorizedShares),
      issuedShares: issued,
      parValue: sc.parValue ? Number(sc.parValue) : undefined,
      votingRights: (sc as any).votingRights ?? true,
      liquidationPreference: (sc as any).liquidationPreference ? Number((sc as any).liquidationPreference) : undefined,
    };
  });

  const entries = await prisma.capTableEntry.findMany({
    where: { companyId: company.id },
  });

  const serializedShareholders = entries.map(entry => ({
    id: entry.id,
    name: entry.shareholderName,
    email: entry.email,
    type: (entry as any).shareholderType || 'OTHER',
    shareClassId: entry.shareClassId,
    shares: Number(entry.shares),
    purchasePrice: Number(entry.pricePerShare),
    purchaseDate: entry.issueDate ? entry.issueDate.toISOString() : undefined,
    vestingSchedule: entry.vestingSchedule,
  }));

  return (
    <CapTableView 
      shareClasses={serializedShareClasses} 
      shareholders={serializedShareholders} 
    />
  );
}
