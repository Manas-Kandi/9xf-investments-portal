'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formCUseOfProceedsSchema, FormCUseOfProceedsData } from '@/lib/validations/form-c';
import { updateFormC } from '@/app/actions/form-c';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AutoSaveStatus } from '@/components/form-c/auto-save-status';
import { Plus, Trash2 } from 'lucide-react';

export default function UseOfProceedsForm({ filingId, initialData, targetAmount }: { filingId: string, initialData: any, targetAmount: number }) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const { register, control, watch } = useForm<FormCUseOfProceedsData>({
    resolver: zodResolver(formCUseOfProceedsSchema),
    defaultValues: {
      items: initialData?.items || [
        { category: 'Intermediary Fees', amount: Math.round(targetAmount * 0.075), description: '7.5% Platform Fee' },
        { category: 'Marketing', amount: 0, description: '' },
        { category: 'Research & Development', amount: 0, description: '' },
        { category: 'Working Capital', amount: 0, description: '' },
      ],
      totalTarget: targetAmount,
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  
  const items = watch('items');
  const total = items?.reduce((sum, item) => sum + (Number(item.amount) || 0), 0) || 0;
  const percent = (total / targetAmount) * 100;

  useEffect(() => {
    const subscription = watch((value) => {
      setSaveStatus('saving');
      const timer = setTimeout(async () => {
         const result = await updateFormC(filingId, 'useOfProceeds', value);
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
           <CardTitle>Use of Proceeds</CardTitle>
           <CardDescription>How will you use the funds from the Target Amount (${targetAmount.toLocaleString()})?</CardDescription>
         </div>
         <AutoSaveStatus status={saveStatus} />
       </CardHeader>
       <CardContent>
         <div className="grid grid-cols-12 gap-4 mb-2 px-2 text-xs font-semibold text-white/50 uppercase">
           <div className="col-span-4">Category</div>
           <div className="col-span-3">Amount ($)</div>
           <div className="col-span-1">%</div>
           <div className="col-span-3">Description</div>
           <div className="col-span-1"></div>
         </div>
         
         <div className="space-y-2">
           {fields.map((field, index) => {
             const amount = Number(items[index]?.amount) || 0;
             const itemPercent = (amount / targetAmount) * 100;
             return (
              <div key={field.id} className="grid grid-cols-12 gap-4 items-center p-2 rounded bg-white/5 border border-white/10">
                <div className="col-span-4">
                  <Input {...register(`items.${index}.category` as const)} placeholder="Category" className="h-8" />
                </div>
                <div className="col-span-3">
                  <Input 
                    type="number" 
                    {...register(`items.${index}.amount` as const, { valueAsNumber: true })} 
                    className="h-8 font-mono" 
                  />
                </div>
                <div className="col-span-1 text-xs text-white/70 font-mono flex items-center">
                  {itemPercent.toFixed(1)}%
                </div>
                <div className="col-span-3">
                  <Input {...register(`items.${index}.description` as const)} placeholder="Details..." className="h-8" />
                </div>
                <div className="col-span-1 flex justify-end">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-400" onClick={() => remove(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
             );
           })}
         </div>

         <div className="mt-4">
           <Button variant="secondary" size="sm" onClick={() => append({ category: '', amount: 0, description: '' })}>
             <Plus className="w-4 h-4 mr-2" /> Add Item
           </Button>
         </div>

         <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
            <span className="font-bold text-white">Total Allocation</span>
            <div className="text-right">
              <span className={`block text-lg font-mono font-bold ${Math.abs(total - targetAmount) < 1 ? 'text-green-500' : 'text-yellow-500'}`}>
                ${total.toLocaleString()}
              </span>
              <span className="text-xs text-white/50">{percent.toFixed(1)}% of Target</span>
            </div>
         </div>
         {Math.abs(total - targetAmount) >= 1 && (
           <p className="text-xs text-yellow-500 mt-2 text-right">Total allocation must equal the target raise amount exactly.</p>
         )}
       </CardContent>
    </Card>
  );
}
