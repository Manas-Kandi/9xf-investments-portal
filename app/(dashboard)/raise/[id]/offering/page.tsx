import { redirect } from 'next/navigation';
import { getOfferingConfig } from '@/app/actions/offering';
import { prisma } from '@/lib/db';
import OfferingBuilder from './offering-builder';

export default async function OfferingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const config = await getOfferingConfig(id);
  
  if (!config) redirect('/dashboard');

  const raise = await prisma.raise.findUnique({ where: { id } });

  return <OfferingBuilder initialConfig={config} raiseId={id} slug={raise?.slug} />;
}
