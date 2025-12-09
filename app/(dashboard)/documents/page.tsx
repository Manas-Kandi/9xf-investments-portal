import { redirect } from 'next/navigation';
import { getDocuments } from '@/app/actions/documents';
import { requireCompany } from '@/lib/company';
import DocumentManager from './document-manager';

export default async function DocumentsPage() {
  const company = await requireCompany();
  if (!company) redirect('/company/setup');

  const documents = await getDocuments();

  return <DocumentManager initialDocuments={documents} />;
}
