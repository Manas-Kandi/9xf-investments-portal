import { redirect } from 'next/navigation';
import { getComplianceStatus } from '@/app/actions/compliance';
import ComplianceCalendar from './compliance-calendar';

export default async function CompliancePage() {
  const status = await getComplianceStatus();

  if (!status) {
    redirect('/dashboard');
  }

  if (status.terminated) {
    return (
      <div className="p-8 text-center text-white/50">
        <h1 className="text-2xl font-bold text-white mb-2">Reporting Terminated</h1>
        <p>You have successfully terminated your reporting obligations.</p>
      </div>
    );
  }

  if (!status.hasObligation) {
    return (
      <div className="p-8 text-center text-white/50">
        <h1 className="text-2xl font-bold text-white mb-2">No Reporting Obligations</h1>
        <p>Complete a Regulation CF raise to activate compliance tracking.</p>
      </div>
    );
  }

  return <ComplianceCalendar status={status} />;
}
