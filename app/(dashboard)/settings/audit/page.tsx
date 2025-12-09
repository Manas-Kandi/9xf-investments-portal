import { getAuditLogs } from '@/app/actions/audit';
import { requireCompany } from '@/lib/company';
import AuditTable from './audit-table';
import { redirect } from 'next/navigation';

export default async function AuditPage() {
  const company = await requireCompany();
  if (!company) redirect('/company/setup');

  const logs = await getAuditLogs();

  return <AuditTable logs={logs} />;
}
