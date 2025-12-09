'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formCIssuerSchema, FormCIssuerData } from '@/lib/validations/form-c';
import { updateFormC } from '@/app/actions/form-c';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AutoSaveStatus } from '@/components/form-c/auto-save-status';

export default function IssuerForm({ filingId, initialData, company }: { filingId: string, initialData: any, company: any }) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const { register, watch, formState: { errors } } = useForm<FormCIssuerData>({
    resolver: zodResolver(formCIssuerSchema),
    defaultValues: {
      legalName: initialData?.legalName || company.legalName,
      jurisdiction: initialData?.jurisdiction || company.stateOfIncorporation,
      entityType: initialData?.entityType || company.entityType,
      formationDate: initialData?.formationDate || (company.formationDate ? new Date(company.formationDate).toISOString().split('T')[0] : ''),
      streetAddress: initialData?.streetAddress || company.streetAddress || '',
      city: initialData?.city || company.city || '',
      state: initialData?.state || company.state || '',
      zipCode: initialData?.zipCode || company.zipCode || '',
      website: initialData?.website || company.website || '',
      employees: initialData?.employees || 0,
    }
  });

  useEffect(() => {
    const subscription = watch((value) => {
      setSaveStatus('saving');
      const timer = setTimeout(async () => {
         const result = await updateFormC(filingId, 'issuer', value);
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
           <CardTitle>Issuer Information</CardTitle>
           <CardDescription>Basic information about the company.</CardDescription>
        </div>
        <AutoSaveStatus status={saveStatus} />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Legal Name</Label>
            <Input {...register('legalName')} placeholder="Company Name" />
            {errors.legalName && <p className="text-xs text-red-500">{errors.legalName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Entity Type</Label>
            <Input {...register('entityType')} />
             {errors.entityType && <p className="text-xs text-red-500">{errors.entityType.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Jurisdiction of Incorporation</Label>
            <Input {...register('jurisdiction')} placeholder="Delaware" />
             {errors.jurisdiction && <p className="text-xs text-red-500">{errors.jurisdiction.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Formation Date</Label>
            <Input type="date" {...register('formationDate')} />
             {errors.formationDate && <p className="text-xs text-red-500">{errors.formationDate.message}</p>}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Website</Label>
          <Input {...register('website')} placeholder="https://..." />
           {errors.website && <p className="text-xs text-red-500">{errors.website.message}</p>}
        </div>

        <div className="space-y-4">
          <Label>Physical Address</Label>
          <Input {...register('streetAddress')} placeholder="Street Address" />
          <div className="grid grid-cols-3 gap-4">
             <Input {...register('city')} placeholder="City" />
             <Input {...register('state')} placeholder="State" />
             <Input {...register('zipCode')} placeholder="Zip Code" />
          </div>
        </div>

         <div className="space-y-2">
          <Label>Number of Employees</Label>
          <Input type="number" {...register('employees', { valueAsNumber: true })} />
        </div>
      </CardContent>
    </Card>
  );
}
