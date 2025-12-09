import { redirect } from 'next/navigation';
import { getClosingStatus } from '@/app/actions/close';
import CloseManager from './close-manager';

export default async function ClosePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const status = await getClosingStatus(id);

  if (!status) {
    redirect('/dashboard');
  }

  return <CloseManager status={status} raiseId={id} />;
}
