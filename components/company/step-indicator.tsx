'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
}

export function StepIndicator({ steps, currentStep, completedSteps }: StepIndicatorProps) {
  return (
    <div className="relative">
      {/* Progress line */}
      <div className="absolute top-5 left-5 right-5 h-px bg-white/10" />
      <motion.div 
        className="absolute top-5 left-5 h-px bg-white/30"
        initial={{ width: 0 }}
        animate={{ 
          width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` 
        }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />

      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const isPast = currentStep > step.id;

          return (
            <div key={step.id} className="flex flex-col items-center">
              {/* Circle */}
              <motion.div
                className={`relative w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  isCompleted
                    ? 'bg-white border-white'
                    : isCurrent
                    ? 'bg-white/10 border-white/50'
                    : 'bg-transparent border-white/20'
                }`}
                initial={false}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  >
                    <Check className="w-5 h-5 text-neutral-900" />
                  </motion.div>
                ) : (
                  <span className={`text-sm font-semibold ${
                    isCurrent ? 'text-white' : 'text-white/40'
                  }`}>
                    {step.id}
                  </span>
                )}

                {/* Pulse animation for current step */}
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-white/30"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </motion.div>

              {/* Label */}
              <motion.div 
                className="mt-3 text-center"
                initial={false}
                animate={{ opacity: isCurrent || isCompleted ? 1 : 0.4 }}
              >
                <p className={`text-xs font-medium ${
                  isCurrent ? 'text-white' : isCompleted ? 'text-white/70' : 'text-white/40'
                }`}>
                  {step.title}
                </p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
