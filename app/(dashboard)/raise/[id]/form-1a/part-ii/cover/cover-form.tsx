'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { form1ACoverSchema, Form1ACoverData } from '@/lib/validations/form-1a';
import { updateForm1A } from '@/app/actions/form-1a';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AutoSaveStatus } from '@/components/form-c/auto-save-status';

export default function CoverForm({ filingId, initialData }: { filingId: string, initialData: any }) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const { register, watch, formState: { errors } } = useForm<Form1ACoverData>({
    resolver: zodResolver(form1ACoverSchema),
    defaultValues: {
      offeringType: initialData?.offeringType || 'Tier 2',
      securitiesOffered: initialData?.securitiesOffered || '',
      pricePerSecurity: initialData?.pricePerSecurity || 0,
      totalMaxOffering: initialData?.totalMaxOffering || 0,
      commissions: initialData?.commissions || 0,
      netProceeds: initialData?.netProceeds || 0,
    }
  });

  useEffect(() => {
    const subscription = watch((value) => {
      setSaveStatus('saving');
      const timer = setTimeout(async () => {
         const result = await updateForm1A(filingId, 'cover', value);
         setSaveStatus(result.success ? 'saved' : 'error');
      }, 2000); 
      return () => clearTimeout(timer);
    });
    return () => subscription.unsubscribe();
  }, [watch, filingId]);

  return (
    <Card className="bg-neutral-900 border-white/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
           <CardTitle>Part II: Offering Circular Cover Page</CardTitle>
           <CardDescription>Key terms of the offering.</CardDescription>
        </div>
        <AutoSaveStatus status={saveStatus} />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Offering Type</Label>
          <select {...register('offeringType')} className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white">
            <option value="Tier 1">Tier 1 (Up to $20M)</option>
            <option value="Tier 2">Tier 2 (Up to $75M)</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>Securities Offered</Label>
          <Input {...register('securitiesOffered')} placeholder="e.g. 1,000,000 Shares of Common Stock" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Price per Security ($)</Label>
            <Input type="number" {...register('pricePerSecurity', { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label>Total Max Offering ($)</Label>
            <Input type="number" {...register('totalMaxOffering', { valueAsNumber: true })} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Underwriting Commissions ($)</Label>
            <Input type="number" {...register('commissions', { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label>Net Proceeds to Issuer ($)</Label>
            <Input type="number" {...register('netProceeds', { valueAsNumber: true })} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
