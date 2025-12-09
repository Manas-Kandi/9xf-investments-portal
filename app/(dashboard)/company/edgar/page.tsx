import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getCompanyForUser } from '@/lib/company';
import EdgarWizard from './edgar-wizard';

export default async function EdgarPage() {
  const company = await getCompanyForUser();
  
  if (!company) {
    redirect('/company/setup');
  }

  const serializedCompany = {
    id: company.id,
    edgarCik: company.edgarCik,
    edgarStatus: company.edgarStatus,
  };

  return (
    <div className="space-y-8">
       <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">EDGAR Access</h1>
        <p className="text-white/50">
          Set up your SEC filing credentials to enable Regulation CF and A+ offerings.
        </p>
      </div>
      <EdgarWizard company={serializedCompany} />
    </div>
  );
}
