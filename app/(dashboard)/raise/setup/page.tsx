import { redirect } from 'next/navigation';
import { getCompanyForUser } from '@/lib/company';
import PathwayWizard from './pathway-wizard';

export default async function RaiseSetupPage() {
  const company = await getCompanyForUser();
  
  if (!company) {
    redirect('/company/setup');
  }

  return <PathwayWizard />;
}
