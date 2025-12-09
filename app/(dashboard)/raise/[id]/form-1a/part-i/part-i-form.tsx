'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { form1APart1Schema, Form1APart1Data } from '@/lib/validations/form-1a';
import { updateForm1A } from '@/app/actions/form-1a';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AutoSaveStatus } from '@/components/form-c/auto-save-status';

export default function Part1Form({ filingId, initialData, company }: { filingId: string, initialData: any, company: any }) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const { register, watch, formState: { errors } } = useForm<Form1APart1Data>({
    resolver: zodResolver(form1APart1Schema),
    defaultValues: {
      legalName: initialData?.legalName || company.legalName,
      jurisdiction: initialData?.jurisdiction || company.stateOfIncorporation,
      entityType: initialData?.entityType || company.entityType,
      streetAddress: initialData?.streetAddress || company.streetAddress || '',
      city: initialData?.city || company.city || '',
      state: initialData?.state || company.state || '',
      zipCode: initialData?.zipCode || company.zipCode || '',
      phone: initialData?.phone || '',
      website: initialData?.website || company.website || '',
    }
  });

  useEffect(() => {
    const subscription = watch((value) => {
      setSaveStatus('saving');
      const timer = setTimeout(async () => {
         const result = await updateForm1A(filingId, 'part1', value);
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
           <CardTitle>Part I: Notification</CardTitle>
           <CardDescription>Basic issuer information for Form 1-A.</CardDescription>
        </div>
        <AutoSaveStatus status={saveStatus} />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Legal Name</Label>
            <Input {...register('legalName')} />
            {errors.legalName && <p className="text-xs text-red-500">{errors.legalName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Entity Type</Label>
            <Input {...register('entityType')} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Jurisdiction</Label>
            <Input {...register('jurisdiction')} />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input {...register('phone')} placeholder="(555) 555-5555" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Website</Label>
          <Input {...register('website')} />
        </div>

        <div className="space-y-4">
          <Label>Principal Place of Business</Label>
          <Input {...register('streetAddress')} placeholder="Street Address" />
          <div className="grid grid-cols-3 gap-4">
             <Input {...register('city')} placeholder="City" />
             <Input {...register('state')} placeholder="State" />
             <Input {...register('zipCode')} placeholder="Zip Code" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
