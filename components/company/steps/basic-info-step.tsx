'use client';

import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Hash, Briefcase } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  companyBasicSchema, 
  CompanyBasicData, 
  ENTITY_TYPES,
  formatEIN 
} from '@/lib/validations/company';

interface BasicInfoStepProps {
  data: Partial<CompanyBasicData>;
  onNext: (data: CompanyBasicData) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function BasicInfoStep({ data, onNext }: BasicInfoStepProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CompanyBasicData>({
    resolver: zodResolver(companyBasicSchema),
    defaultValues: data,
  });

  const selectedEntityType = watch('entityType');

  const handleEINChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatEIN(e.target.value);
    setValue('ein', formatted);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white/70" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Company Basics</h2>
            <p className="text-sm text-white/50">Let&apos;s start with the fundamentals</p>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onNext)} className="space-y-6">
        {/* Legal Name */}
        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="legalName">Legal Company Name *</Label>
          <div className="relative">
            <Input
              id="legalName"
              {...register('legalName')}
              placeholder="Acme Corporation"
              className="pl-10"
            />
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          </div>
          {errors.legalName && (
            <motion.p 
              className="text-xs text-red-400"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errors.legalName.message}
            </motion.p>
          )}
        </motion.div>

        {/* DBA */}
        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="dba">
            DBA (Doing Business As)
            <span className="text-white/30 ml-2 text-xs">Optional</span>
          </Label>
          <Input
            id="dba"
            {...register('dba')}
            placeholder="Trade name, if different"
          />
        </motion.div>

        {/* EIN */}
        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="ein">
            EIN (Employer Identification Number)
            <span className="text-white/30 ml-2 text-xs">Optional</span>
          </Label>
          <div className="relative">
            <Input
              id="ein"
              {...register('ein')}
              onChange={handleEINChange}
              placeholder="XX-XXXXXXX"
              className="pl-10 font-mono"
              maxLength={10}
            />
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          </div>
          {errors.ein && (
            <motion.p 
              className="text-xs text-red-400"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errors.ein.message}
            </motion.p>
          )}
          <p className="text-xs text-white/30">
            You can add this later if you don&apos;t have it yet
          </p>
        </motion.div>

        {/* Entity Type */}
        <motion.div variants={itemVariants} className="space-y-3">
          <Label>Entity Type *</Label>
          <div className="grid grid-cols-2 gap-3">
            {ENTITY_TYPES.map((type) => (
              <motion.label
                key={type.value}
                className={`relative flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedEntityType === type.value
                    ? 'border-white/30 bg-white/10'
                    : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <input
                  type="radio"
                  {...register('entityType')}
                  value={type.value}
                  className="sr-only"
                />
                <div className="flex items-center gap-2 mb-1">
                  <Briefcase className={`w-4 h-4 ${
                    selectedEntityType === type.value ? 'text-white' : 'text-white/40'
                  }`} />
                  <span className={`text-sm font-medium ${
                    selectedEntityType === type.value ? 'text-white' : 'text-white/70'
                  }`}>
                    {type.label}
                  </span>
                </div>
                <span className="text-xs text-white/40 leading-relaxed">
                  {type.description}
                </span>
                
                {/* Selection indicator */}
                {selectedEntityType === type.value && (
                  <motion.div
                    className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white"
                    layoutId="entityIndicator"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.label>
            ))}
          </div>
          {errors.entityType && (
            <motion.p 
              className="text-xs text-red-400"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Please select an entity type
            </motion.p>
          )}
        </motion.div>

        {/* Submit */}
        <motion.div variants={itemVariants} className="pt-4">
          <Button type="submit" className="w-full">
            Continue
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}
