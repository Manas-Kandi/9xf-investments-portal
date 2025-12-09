'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formCRelatedPartySchema, FormCRelatedPartyData } from '@/lib/validations/form-c';
import { updateFormC } from '@/app/actions/form-c';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AutoSaveStatus } from '@/components/form-c/auto-save-status';
import { Plus, Trash2 } from 'lucide-react';

export default function RelatedPartiesForm({ filingId, initialData }: { filingId: string, initialData: any }) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const { register, control, watch, setValue, formState: { errors } } = useForm<FormCRelatedPartyData>({
    resolver: zodResolver(formCRelatedPartySchema),
    defaultValues: {
      hasTransactions: initialData?.hasTransactions ?? false,
      transactions: initialData?.transactions || [],
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "transactions" });
  const hasTransactions = watch('hasTransactions');

  useEffect(() => {
    const subscription = watch((value) => {
      setSaveStatus('saving');
      const timer = setTimeout(async () => {
         const result = await updateFormC(filingId, 'relatedParties', value);
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
           <CardTitle>Related Party Transactions</CardTitle>
           <CardDescription>Disclose transactions with officers, directors, or 20%+ owners {'>'} 5% of raise.</CardDescription>
        </div>
        <AutoSaveStatus status={saveStatus} />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-2 p-4 rounded bg-white/5 border border-white/10">
          <input 
            type="checkbox" 
            className="rounded border-white/10 bg-white/5"
            checked={!hasTransactions}
            onChange={(e) => {
              setValue('hasTransactions', !e.target.checked);
              if (e.target.checked) setValue('transactions', []);
            }}
          />
          <span className="text-sm text-white">We do not have any reportable related party transactions.</span>
        </div>

        {hasTransactions && (
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Transaction {index + 1}</Label>
                  <Button variant="ghost" size="sm" onClick={() => remove(index)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Specified Person</Label>
                    <Input {...register(`transactions.${index}.specifiedPerson` as const)} placeholder="Name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Relationship</Label>
                    <Input {...register(`transactions.${index}.relationship` as const)} placeholder="e.g. Director" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Amount of Interest ($)</Label>
                  <Input type="number" {...register(`transactions.${index}.amount` as const, { valueAsNumber: true })} />
                </div>

                <div className="space-y-2">
                  <Label>Description of Transaction</Label>
                  <Textarea {...register(`transactions.${index}.description` as const)} placeholder="Details..." />
                </div>
              </div>
            ))}

            <Button 
              variant="secondary" 
              onClick={() => append({ specifiedPerson: '', relationship: '', amount: 0, description: '' })}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
