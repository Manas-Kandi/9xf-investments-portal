'use client';

import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Globe, FileText, ArrowLeft, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  companyAdditionalSchema, 
  CompanyAdditionalData 
} from '@/lib/validations/company';

interface AdditionalInfoStepProps {
  data: Partial<CompanyAdditionalData>;
  onNext: (data: CompanyAdditionalData) => void;
  onBack: () => void;
  isSubmitting?: boolean;
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

export function AdditionalInfoStep({ data, onNext, onBack, isSubmitting }: AdditionalInfoStepProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CompanyAdditionalData>({
    resolver: zodResolver(companyAdditionalSchema),
    defaultValues: data,
  });

  const description = watch('description') || '';
  const charCount = description.length;
  const maxChars = 500;

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
            <Sparkles className="w-5 h-5 text-white/70" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Final Details</h2>
            <p className="text-sm text-white/50">Almost there! Add some finishing touches.</p>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onNext)} className="space-y-6">
        {/* Website */}
        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="website">
            Website
            <span className="text-white/30 ml-2 text-xs">Optional</span>
          </Label>
          <div className="relative">
            <Input
              id="website"
              {...register('website')}
              placeholder="https://yourcompany.com"
              className="pl-10"
            />
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          </div>
          {errors.website && (
            <motion.p 
              className="text-xs text-red-400"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errors.website.message}
            </motion.p>
          )}
        </motion.div>

        {/* Description */}
        <motion.div variants={itemVariants} className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="description">
              Company Description
              <span className="text-white/30 ml-2 text-xs">Optional</span>
            </Label>
            <span className={`text-xs ${
              charCount > maxChars ? 'text-red-400' : 'text-white/30'
            }`}>
              {charCount}/{maxChars}
            </span>
          </div>
          <div className="relative">
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Briefly describe what your company does..."
              className="min-h-[120px] pl-10 pt-3"
            />
            <FileText className="absolute left-3 top-3 w-4 h-4 text-white/30" />
          </div>
          {errors.description && (
            <motion.p 
              className="text-xs text-red-400"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errors.description.message}
            </motion.p>
          )}
          <p className="text-xs text-white/30">
            This will be used in your SEC filings and investor materials.
          </p>
        </motion.div>

        {/* Completion message */}
        <motion.div 
          variants={itemVariants}
          className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-400">You&apos;re almost done!</p>
              <p className="text-xs text-green-400/70 mt-1">
                After this step, your company profile will be created and you can start adding team members.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div variants={itemVariants} className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onBack} className="flex-1" disabled={isSubmitting}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? (
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="w-4 h-4 border-2 border-neutral-900/30 border-t-neutral-900 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                Creating...
              </motion.div>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Create Company
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}
