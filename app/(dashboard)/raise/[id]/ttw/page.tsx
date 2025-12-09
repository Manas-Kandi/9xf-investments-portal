import { redirect } from 'next/navigation';
import { getOrCreateTtwCampaign } from '@/app/actions/ttw';
import { prisma } from '@/lib/db';
import TtwBuilder from './ttw-builder';

export default async function TtwPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getOrCreateTtwCampaign(id);
  if (result.error || !result.campaign) redirect('/dashboard');
  
  const leads = await prisma.ttwLead.findMany({ 
    where: { campaignId: result.campaign.id },
    orderBy: { createdAt: 'desc' }
  });

  return <TtwBuilder campaign={result.campaign} raiseId={id} leads={leads} />;
}
