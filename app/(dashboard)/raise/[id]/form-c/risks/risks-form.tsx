'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formCRisksSchema, FormCRiskData } from '@/lib/validations/form-c';
import { updateFormC } from '@/app/actions/form-c';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AutoSaveStatus } from '@/components/form-c/auto-save-status';
import { Plus, Trash2 } from 'lucide-react';

export default function RisksForm({ filingId, initialData }: { filingId: string, initialData: any }) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const { register, control, watch, formState: { errors } } = useForm<FormCRiskData>({
    resolver: zodResolver(formCRisksSchema),
    defaultValues: {
      riskFactors: initialData?.riskFactors || [
        { title: 'Market Risk', description: '' },
        { title: 'Competition', description: '' },
        { title: 'Limited Operating History', description: '' }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "riskFactors"
  });

  useEffect(() => {
    const subscription = watch((value) => {
      setSaveStatus('saving');
      const timer = setTimeout(async () => {
         const result = await updateFormC(filingId, 'risks', value);
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
           <CardTitle>Risk Factors</CardTitle>
           <CardDescription>Material risks investors should be aware of.</CardDescription>
        </div>
        <AutoSaveStatus status={saveStatus} />
      </CardHeader>
      <CardContent className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <Label>Risk Factor {index + 1}</Label>
              <Button variant="ghost" size="sm" onClick={() => remove(index)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <Input {...register(`riskFactors.${index}.title` as const)} placeholder="Risk Title" />
              {errors.riskFactors?.[index]?.title && <p className="text-xs text-red-500">{errors.riskFactors[index]?.title?.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Textarea 
                {...register(`riskFactors.${index}.description` as const)} 
                placeholder="Description of risk..." 
                className="min-h-[100px]"
              />
               {errors.riskFactors?.[index]?.description && <p className="text-xs text-red-500">{errors.riskFactors[index]?.description?.message}</p>}
            </div>
          </div>
        ))}

        <Button 
          variant="secondary" 
          onClick={() => append({ title: '', description: '' })}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Risk Factor
        </Button>
      </CardContent>
    </Card>
  );
}
