import { getCampaignStats } from '@/app/actions/dashboard';
import { redirect } from 'next/navigation';
import DashboardClient from './dashboard-client';

export default async function RaiseDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const stats = await getCampaignStats(id);

  if (!stats) {
    redirect('/dashboard');
  }

  return <DashboardClient stats={stats} raiseId={id} />;
}
