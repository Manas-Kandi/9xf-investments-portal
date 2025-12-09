'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formCFinancialConditionSchema, FormCFinancialConditionData } from '@/lib/validations/form-c';
import { updateFormC } from '@/app/actions/form-c';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AutoSaveStatus } from '@/components/form-c/auto-save-status';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileText, ExternalLink } from 'lucide-react';

export default function FinancialConditionForm({ filingId, initialData, raiseId }: { filingId: string, initialData: any, raiseId: string }) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const { register, watch, formState: { errors } } = useForm<FormCFinancialConditionData>({
    resolver: zodResolver(formCFinancialConditionSchema),
    defaultValues: {
      history: initialData?.history || '',
      liquidity: initialData?.liquidity || '',
      capitalResources: initialData?.capitalResources || '',
    }
  });

  useEffect(() => {
    const subscription = watch((value) => {
      setSaveStatus('saving');
      const timer = setTimeout(async () => {
         const result = await updateFormC(filingId, 'financialCondition', value);
         setSaveStatus(result.success ? 'saved' : 'error');
      }, 2000); 
      return () => clearTimeout(timer);
    });
    return () => subscription.unsubscribe();
  }, [watch, filingId]);

  return (
    <div className="space-y-6">
      <Card className="bg-neutral-900 border-white/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
             <CardTitle>Financial Condition</CardTitle>
             <CardDescription>Discuss your company's financial health.</CardDescription>
          </div>
          <AutoSaveStatus status={saveStatus} />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Operating History</Label>
            <p className="text-xs text-white/50">Describe your history from inception to present.</p>
            <Textarea 
              {...register('history')} 
              className="min-h-[150px]"
              placeholder="We were incorporated on..."
            />
            {errors.history && <p className="text-xs text-red-500">{errors.history.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Liquidity & Capital Resources</Label>
            <p className="text-xs text-white/50">Do you have enough cash? What are your other sources of capital?</p>
            <Textarea 
              {...register('liquidity')} 
              className="min-h-[150px]"
              placeholder="As of [Date], we have $X in cash..."
            />
            {errors.liquidity && <p className="text-xs text-red-500">{errors.liquidity.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Historical Capital Resources</Label>
            <p className="text-xs text-white/50">Describe past raises, loans, or capital infusions.</p>
            <Textarea 
              {...register('capitalResources')} 
              className="min-h-[150px]"
              placeholder="In 2023, we issued a convertible note..."
            />
            {errors.capitalResources && <p className="text-xs text-red-500">{errors.capitalResources.message}</p>}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-white/10">
        <CardHeader>
          <CardTitle>Financial Statements</CardTitle>
          <CardDescription>Attached financial documents.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-white/50" />
              <div>
                <p className="text-sm font-medium text-white">Manage Financial Documents</p>
                <p className="text-xs text-white/40">Upload Balance Sheet, Income Statement, etc.</p>
              </div>
            </div>
            <Link href={`/raise/${raiseId}/financials`}>
              <Button variant="secondary" size="sm">
                Go to Financials
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
