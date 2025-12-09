'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formCOfferingSchema, FormCOfferingData } from '@/lib/validations/form-c';
import { updateFormC } from '@/app/actions/form-c';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AutoSaveStatus } from '@/components/form-c/auto-save-status';

export default function OfferingForm({ filingId, initialData, raise }: { filingId: string, initialData: any, raise: any }) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const { register, watch, formState: { errors } } = useForm<FormCOfferingData>({
    resolver: zodResolver(formCOfferingSchema),
    defaultValues: {
      securityType: initialData?.securityType || 'Common Stock',
      targetAmount: initialData?.targetAmount || Number(raise.targetAmount) || 10000,
      maximumAmount: initialData?.maximumAmount || 100000,
      pricePerSecurity: initialData?.pricePerSecurity || 0,
      minimumInvestment: initialData?.minimumInvestment || 100,
      votingRights: initialData?.votingRights ?? true,
      useOfProceedsDescription: initialData?.useOfProceedsDescription || '',
    }
  });

  useEffect(() => {
    const subscription = watch((value) => {
      setSaveStatus('saving');
      const timer = setTimeout(async () => {
         const result = await updateFormC(filingId, 'offering', value);
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
           <CardTitle>Offering Information</CardTitle>
           <CardDescription>Details about the securities you are selling.</CardDescription>
        </div>
        <AutoSaveStatus status={saveStatus} />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Security Type</Label>
          <select 
            {...register('securityType')}
            className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="Common Stock">Common Stock</option>
            <option value="Preferred Stock">Preferred Stock</option>
            <option value="SAFE">SAFE</option>
            <option value="Convertible Note">Convertible Note</option>
            <option value="Debt">Debt</option>
          </select>
          {errors.securityType && <p className="text-xs text-red-500">{errors.securityType.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Target Amount ($)</Label>
            <Input type="number" {...register('targetAmount', { valueAsNumber: true })} />
            {errors.targetAmount && <p className="text-xs text-red-500">{errors.targetAmount.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Maximum Amount ($)</Label>
            <Input type="number" {...register('maximumAmount', { valueAsNumber: true })} />
             {errors.maximumAmount && <p className="text-xs text-red-500">{errors.maximumAmount.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Price per Security ($)</Label>
            <Input type="number" step="0.01" {...register('pricePerSecurity', { valueAsNumber: true })} />
             {errors.pricePerSecurity && <p className="text-xs text-red-500">{errors.pricePerSecurity.message}</p>}
          </div>
          <div className="space-y-2">
             <Label>Minimum Investment ($)</Label>
             <Input type="number" {...register('minimumInvestment', { valueAsNumber: true })} />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <input type="checkbox" {...register('votingRights')} className="rounded border-white/10 bg-white/5" />
            Securities have voting rights
          </Label>
        </div>

        <div className="space-y-2">
          <Label>Use of Proceeds</Label>
          <Textarea 
            {...register('useOfProceedsDescription')} 
            placeholder="Describe how the funds will be used..." 
            className="min-h-[150px]"
          />
           {errors.useOfProceedsDescription && <p className="text-xs text-red-500">{errors.useOfProceedsDescription.message}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
