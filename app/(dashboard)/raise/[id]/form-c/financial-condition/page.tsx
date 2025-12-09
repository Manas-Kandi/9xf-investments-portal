import { redirect } from 'next/navigation';
import { getOrCreateFormC } from '@/app/actions/form-c';
import FinancialConditionForm from './financial-condition-form';

export default async function FinancialConditionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const result = await getOrCreateFormC(id);
  if (result.error || !result.filing) {
    redirect('/dashboard');
  }

  const content = (result.filing.contentJson as any)?.financialCondition || {};

  return <FinancialConditionForm filingId={result.filing.id} initialData={content} raiseId={id} />;
}
