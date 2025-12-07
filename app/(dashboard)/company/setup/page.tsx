'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { StepIndicator } from '@/components/company/step-indicator';
import { CompanyPreview } from '@/components/company/company-preview';
import { BasicInfoStep } from '@/components/company/steps/basic-info-step';
import { IncorporationStep } from '@/components/company/steps/incorporation-step';
import { AddressStep } from '@/components/company/steps/address-step';
import { AdditionalInfoStep } from '@/components/company/steps/additional-info-step';
import { 
  CompanyData,
  CompanyBasicData,
  CompanyIncorporationData,
  CompanyAddressData,
  CompanyAdditionalData,
} from '@/lib/validations/company';
import { Sparkles, Check } from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Basics', description: 'Company name and type' },
  { id: 2, title: 'Incorporation', description: 'State and formation' },
  { id: 3, title: 'Address', description: 'Business location' },
  { id: 4, title: 'Details', description: 'Final touches' },
];

export default function CompanySetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const [formData, setFormData] = useState<Partial<CompanyData>>({});

  const handleBasicInfo = useCallback((data: CompanyBasicData) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCompletedSteps(prev => [...new Set([...prev, 1])]);
    setCurrentStep(2);
  }, []);

  const handleIncorporation = useCallback((data: CompanyIncorporationData) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCompletedSteps(prev => [...new Set([...prev, 2])]);
    setCurrentStep(3);
  }, []);

  const handleAddress = useCallback((data: CompanyAddressData) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCompletedSteps(prev => [...new Set([...prev, 3])]);
    setCurrentStep(4);
  }, []);

  const handleAdditional = useCallback(async (data: CompanyAdditionalData) => {
    setIsSubmitting(true);
    const finalData = { ...formData, ...data };
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Company data:', finalData);
    
    setCompletedSteps(prev => [...new Set([...prev, 4])]);
    setIsSubmitting(false);
    setIsComplete(true);
    
    // Redirect after celebration
    setTimeout(() => {
      router.push('/company');
    }, 3000);
  }, [formData, router]);

  const handleBack = useCallback(() => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  }, []);

  // Success celebration screen
  if (isComplete) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Success animation */}
          <motion.div
            className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.4 }}
            >
              <Check className="w-12 h-12 text-green-400" />
            </motion.div>
          </motion.div>

          {/* Confetti particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'][i % 4],
                left: '50%',
                top: '40%',
              }}
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{
                x: (Math.random() - 0.5) * 400,
                y: (Math.random() - 0.5) * 400,
                opacity: 0,
                scale: Math.random() * 2,
              }}
              transition={{ duration: 1.5, delay: 0.3 + i * 0.02 }}
            />
          ))}

          <motion.h2
            className="text-3xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Company Created!
          </motion.h2>
          
          <motion.p
            className="text-white/60 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {formData.legalName} is ready to go
          </motion.p>

          <motion.p
            className="text-sm text-white/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Redirecting to your company dashboard...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white/70" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create Your Company</h1>
        </div>
        <p className="text-white/50 ml-11">
          Set up your company profile to start your fundraising journey
        </p>
      </motion.div>

      {/* Step Indicator */}
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <StepIndicator 
          steps={STEPS} 
          currentStep={currentStep} 
          completedSteps={completedSteps} 
        />
      </motion.div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-5 gap-8">
        {/* Form */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <BasicInfoStep
                key="step1"
                data={formData}
                onNext={handleBasicInfo}
              />
            )}
            {currentStep === 2 && (
              <IncorporationStep
                key="step2"
                data={formData}
                onNext={handleIncorporation}
                onBack={handleBack}
              />
            )}
            {currentStep === 3 && (
              <AddressStep
                key="step3"
                data={formData}
                onNext={handleAddress}
                onBack={handleBack}
              />
            )}
            {currentStep === 4 && (
              <AdditionalInfoStep
                key="step4"
                data={formData}
                onNext={handleAdditional}
                onBack={handleBack}
                isSubmitting={isSubmitting}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2 hidden lg:block">
          <CompanyPreview data={formData} />
        </div>
      </div>
    </div>
  );
}
