'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { form1ABusinessSchema, Form1ABusinessData } from '@/lib/validations/form-1a';
import { updateForm1A } from '@/app/actions/form-1a';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AutoSaveStatus } from '@/components/form-c/auto-save-status';

export default function BusinessForm({ filingId, initialData }: { filingId: string, initialData: any }) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const { register, watch, formState: { errors } } = useForm<Form1ABusinessData>({
    resolver: zodResolver(form1ABusinessSchema),
    defaultValues: {
      narrative: initialData?.narrative || '',
      employees: initialData?.employees || 0,
    }
  });

  useEffect(() => {
    const subscription = watch((value) => {
      setSaveStatus('saving');
      const timer = setTimeout(async () => {
         const result = await updateForm1A(filingId, 'business', value);
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
           <CardTitle>Business Description</CardTitle>
           <CardDescription>Describe your business operations, products, and market.</CardDescription>
        </div>
        <AutoSaveStatus status={saveStatus} />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Narrative Description</Label>
          <Textarea 
            {...register('narrative')} 
            className="min-h-[300px]" 
            placeholder="Our company was founded to..." 
          />
          {errors.narrative && <p className="text-xs text-red-500">{errors.narrative.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label>Number of Employees</Label>
          <Input type="number" {...register('employees', { valueAsNumber: true })} />
        </div>
      </CardContent>
    </Card>
  );
}
