'use client';

import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, Calendar, ArrowLeft } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { 
  companyIncorporationSchema, 
  CompanyIncorporationData, 
  US_STATES,
  FISCAL_YEAR_ENDS 
} from '@/lib/validations/company';

interface IncorporationStepProps {
  data: Partial<CompanyIncorporationData>;
  onNext: (data: CompanyIncorporationData) => void;
  onBack: () => void;
}

const containerVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      staggerChildren: 0.1,
    },
  },
  exit: { opacity: 0, x: -50 },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function IncorporationStep({ data, onNext, onBack }: IncorporationStepProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CompanyIncorporationData>({
    resolver: zodResolver(companyIncorporationSchema),
    defaultValues: data,
  });

  const selectedState = watch('stateOfIncorporation');

  // Popular states for quick selection
  const popularStates = ['DE', 'CA', 'NY', 'TX', 'FL', 'WY', 'NV'];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white/70" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Incorporation Details</h2>
            <p className="text-sm text-white/50">Where and when was your company formed?</p>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onNext)} className="space-y-6">
        {/* State of Incorporation */}
        <motion.div variants={itemVariants} className="space-y-3">
          <Label>State of Incorporation *</Label>
          
          {/* Popular states quick select */}
          <div className="flex flex-wrap gap-2 mb-3">
            {popularStates.map((stateCode) => {
              const state = US_STATES.find(s => s.value === stateCode);
              if (!state) return null;
              
              return (
                <motion.button
                  key={stateCode}
                  type="button"
                  onClick={() => {
                    const event = { target: { value: stateCode } } as React.ChangeEvent<HTMLSelectElement>;
                    register('stateOfIncorporation').onChange(event);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedState === stateCode
                      ? 'bg-white text-neutral-900'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {state.label}
                </motion.button>
              );
            })}
          </div>

          <Select {...register('stateOfIncorporation')}>
            <option value="">Select a state...</option>
            {US_STATES.map((state) => (
              <option key={state.value} value={state.value}>
                {state.label}
              </option>
            ))}
          </Select>
          
          {errors.stateOfIncorporation && (
            <motion.p 
              className="text-xs text-red-400"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errors.stateOfIncorporation.message}
            </motion.p>
          )}

          {/* Delaware tip */}
          {selectedState === 'DE' && (
            <motion.div
              className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <p className="text-xs text-blue-400">
                Delaware is the most popular state for incorporation due to its business-friendly laws and Court of Chancery.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Formation Date */}
        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="formationDate">
            Formation Date
            <span className="text-white/30 ml-2 text-xs">Optional</span>
          </Label>
          <div className="relative">
            <input
              type="date"
              id="formationDate"
              {...register('formationDate')}
              className="flex h-11 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all [color-scheme:dark]"
            />
          </div>
        </motion.div>

        {/* Fiscal Year End */}
        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="fiscalYearEnd">
            Fiscal Year End
            <span className="text-white/30 ml-2 text-xs">Optional</span>
          </Label>
          <Select {...register('fiscalYearEnd')}>
            <option value="">Select fiscal year end...</option>
            {FISCAL_YEAR_ENDS.map((fy) => (
              <option key={fy.value} value={fy.value}>
                {fy.label}
              </option>
            ))}
          </Select>
          <p className="text-xs text-white/30">
            Most companies use December 31. This affects your annual reporting deadlines.
          </p>
        </motion.div>

        {/* Navigation */}
        <motion.div variants={itemVariants} className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onBack} className="flex-1">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button type="submit" className="flex-1">
            Continue
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}
