'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, ExternalLink, FileText, Key, Shield, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { saveEdgarCredentials } from '@/app/actions/edgar';

export default function EdgarWizard({ company }: { company: any }) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    cik: company.edgarCik || '',
    ccc: '',
  });

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setIsLoading(true);
    const result = await saveEdgarCredentials(formData);
    setIsLoading(false);
    
    if (result.error) {
      alert(result.error);
    } else {
      alert('Credentials saved successfully!');
    }
  };

  const steps = [
    {
      id: 1,
      title: 'What is EDGAR?',
      icon: <Shield className="w-6 h-6 text-blue-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-white/70">
            EDGAR (Electronic Data Gathering, Analysis, and Retrieval) is the SEC's system for automated collection of corporate filings.
          </p>
          <p className="text-white/70">
            To raise capital under Regulation CF or Regulation A+, your company must have its own EDGAR account (CIK number) to file required forms (Form C, Form 1-A).
          </p>
          <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-400 mb-1">Why this matters</h4>
            <p className="text-sm text-blue-300/80">
              Without EDGAR access, you cannot legally file your offering documents with the SEC.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: 'Apply for Access',
      icon: <ExternalLink className="w-6 h-6 text-purple-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-white/70">
            You need to apply for a Form ID on the SEC website. This process creates your CIK (Central Index Key).
          </p>
          <ol className="list-decimal list-inside space-y-2 text-white/70 ml-2">
            <li>Go to the SEC EDGAR Filer Management website.</li>
            <li>Select "Apply for EDGAR Access (New)".</li>
            <li>Fill out the Form ID application as a "Filer".</li>
          </ol>
          <Button 
            className="w-full mt-4" 
            variant="secondary"
            onClick={() => window.open('https://www.filermanagement.edgarfiling.sec.gov/', '_blank')}
          >
            Open SEC Website <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )
    },
    {
      id: 3,
      title: 'Notarization',
      icon: <FileText className="w-6 h-6 text-yellow-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-white/70">
            The SEC requires a notarized authentication document to approve your Form ID application.
          </p>
          <div className="space-y-2">
            <h4 className="text-white font-medium">Instructions:</h4>
            <ul className="list-disc list-inside space-y-1 text-white/70 text-sm">
              <li>Print the Form ID application after submitting online.</li>
              <li>Sign it in the presence of a Notary Public.</li>
              <li>Scan the notarized document.</li>
              <li>Upload it to the SEC website (link in email from SEC).</li>
            </ul>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
             <p className="text-sm text-yellow-300/80">
               <strong>Tip:</strong> You can use online notary services like Notarize.com or OneNotary if you cannot find a local notary.
             </p>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: 'Enter Credentials',
      icon: <Key className="w-6 h-6 text-green-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-white/70">
            Once approved (usually within 48 hours), you will receive your CIK via email. You must then generate your CCC (CIK Confirmation Code) on the SEC website.
          </p>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>CIK (Central Index Key)</Label>
              <Input 
                placeholder="0001234567" 
                maxLength={10}
                value={formData.cik}
                onChange={(e) => setFormData(prev => ({ ...prev, cik: e.target.value }))}
              />
              <p className="text-xs text-white/40">10-digit number from SEC</p>
            </div>
            <div className="space-y-2">
              <Label>CCC (CIK Confirmation Code)</Label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                maxLength={8}
                value={formData.ccc}
                onChange={(e) => setFormData(prev => ({ ...prev, ccc: e.target.value }))}
              />
              <p className="text-xs text-white/40">8-character case-sensitive code</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentStep = steps[step - 1];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((s) => (
          <div key={s.id} className="flex items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border
              ${step === s.id 
                ? 'bg-white text-neutral-900 border-white' 
                : step > s.id 
                  ? 'bg-green-500 text-white border-green-500' 
                  : 'bg-transparent text-white/30 border-white/10'}
            `}>
              {step > s.id ? <Check className="w-4 h-4" /> : s.id}
            </div>
            {s.id !== steps.length && (
              <div className={`w-12 h-px mx-2 ${step > s.id ? 'bg-green-500' : 'bg-white/10'}`} />
            )}
          </div>
        ))}
      </div>

      <Card className="bg-neutral-900 border-white/10 min-h-[400px] flex flex-col">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-white/5">
              {currentStep.icon}
            </div>
            <CardTitle>{currentStep.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {currentStep.content}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between mt-8 pt-4 border-t border-white/10">
            <Button 
              variant="ghost" 
              onClick={handleBack} 
              disabled={step === 1}
              className={step === 1 ? 'invisible' : ''}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            {step < steps.length ? (
              <Button onClick={handleNext}>
                Next Step
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={isLoading || formData.cik.length !== 10 || formData.ccc.length < 8}
              >
                {isLoading ? 'Saving...' : 'Save Credentials'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
