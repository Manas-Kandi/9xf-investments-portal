'use client';

import { useState, useEffect } from 'react';
import { DollarSign, FileText, Upload, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { updateFinancialInfo } from '@/app/actions/financials';
import { calculateFinancialRequirement } from '@/lib/financials';

interface FinancialsWizardProps {
  raise: any;
  targetAmount: number;
}

export default function FinancialsWizard({ raise, targetAmount }: FinancialsWizardProps) {
  const [step, setStep] = useState(raise.financialTier ? 2 : 1);
  const [priorAmount, setPriorAmount] = useState(raise.priorRaisesAmount?.toString() || '0');
  const [isFirstTime, setIsFirstTime] = useState<boolean>(raise.isFirstTimeIssuer ?? true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Calculate locally for display preview
  const calculation = calculateFinancialRequirement(
    targetAmount, 
    parseFloat(priorAmount || '0'), 
    isFirstTime
  );

  const handleCalculate = async () => {
    setIsLoading(true);
    const result = await updateFinancialInfo(raise.id, {
      priorRaisesAmount: parseFloat(priorAmount || '0'),
      isFirstTimeIssuer: isFirstTime,
    });
    setIsLoading(false);
    
    if (result.success) {
      setStep(2);
    } else {
      alert(result.error);
    }
  };

  const requiredDocs = {
    CEO_CERTIFIED: ['Balance Sheet', 'Income Statement', 'Cash Flow Statement', 'Statement of Equity', 'Notes to Financials', 'Tax Returns (Redacted)'],
    REVIEWED: ['Review Report from CPA', 'Balance Sheet', 'Income Statement', 'Cash Flow Statement', 'Statement of Equity', 'Notes to Financials'],
    AUDITED: ['Audit Report from CPA', 'Balance Sheet', 'Income Statement', 'Cash Flow Statement', 'Statement of Equity', 'Notes to Financials']
  };

  const currentDocs = requiredDocs[calculation.requirement] || [];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Financial Statements</h1>
        <p className="text-white/50">Determine your reporting requirements and upload documents.</p>
      </div>

      {/* Step 1: Calculator */}
      <Card className={`border-white/10 ${step === 1 ? 'bg-neutral-900' : 'bg-neutral-900/50 opacity-50'}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Requirement Calculator</CardTitle>
            {step > 1 && <Badge variant="success">Calculated</Badge>}
          </div>
          <CardDescription>We need to know about your prior fundraising history.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Prior Reg CF Raises (Last 12 Months)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <Input 
                type="number"
                value={priorAmount}
                onChange={(e) => setPriorAmount(e.target.value)}
                className="pl-9"
                disabled={step > 1}
              />
            </div>
            <p className="text-xs text-white/40">Enter 0 if this is your first time using Regulation CF.</p>
          </div>

          <div className="space-y-3">
            <Label>Is this your first Reg CF raise?</Label>
            <div className="flex gap-4">
              <button
                onClick={() => setIsFirstTime(true)}
                disabled={step > 1}
                className={`flex-1 p-3 rounded-lg border text-sm font-medium transition-all ${
                  isFirstTime 
                    ? 'bg-white text-neutral-900 border-white' 
                    : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'
                }`}
              >
                Yes, First Time
              </button>
              <button
                onClick={() => setIsFirstTime(false)}
                disabled={step > 1}
                className={`flex-1 p-3 rounded-lg border text-sm font-medium transition-all ${
                  !isFirstTime 
                    ? 'bg-white text-neutral-900 border-white' 
                    : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'
                }`}
              >
                No, Returning Issuer
              </button>
            </div>
          </div>

          {step === 1 && (
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-200 font-medium">Projected Requirement: {calculation.requirement.replace('_', ' ')}</p>
                  <p className="text-xs text-blue-300/70 mt-1">
                    Based on your target of ${targetAmount.toLocaleString()} + ${parseFloat(priorAmount || '0').toLocaleString()} prior raises.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        {step === 1 && (
          <CardFooter>
            <Button onClick={handleCalculate} disabled={isLoading} className="w-full">
              {isLoading ? 'Calculating...' : 'Confirm & Continue'}
            </Button>
          </CardFooter>
        )}
        {step > 1 && (
          <CardFooter>
            <Button variant="ghost" onClick={() => setStep(1)} size="sm">Edit Inputs</Button>
          </CardFooter>
        )}
      </Card>

      {/* Step 2: Uploads */}
      {step === 2 && (
        <Card className="bg-neutral-900 border-white/10">
          <CardHeader>
            <CardTitle>Required Documents</CardTitle>
            <CardDescription>
              Based on your tier ({calculation.threshold}), please upload the following.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentDocs.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-white/10">
                    <FileText className="w-5 h-5 text-white/70" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{doc}</p>
                    <p className="text-xs text-white/40">Required</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex justify-end gap-4 border-t border-white/10 pt-6">
             <Button variant="ghost" size="sm">Save as Draft</Button>
             <Button>
               Submit for Review
               <ArrowRight className="w-4 h-4 ml-2" />
             </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
