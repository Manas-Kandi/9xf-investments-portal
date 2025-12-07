'use client';

import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { 
  companyAddressSchema, 
  CompanyAddressData, 
  US_STATES 
} from '@/lib/validations/company';

interface AddressStepProps {
  data: Partial<CompanyAddressData>;
  onNext: (data: CompanyAddressData) => void;
  onBack: () => void;
}

const containerVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      staggerChildren: 0.08,
    },
  },
  exit: { opacity: 0, x: -50 },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function AddressStep({ data, onNext, onBack }: AddressStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyAddressData>({
    resolver: zodResolver(companyAddressSchema),
    defaultValues: data,
  });

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
            <h2 className="text-2xl font-bold text-white">Business Address</h2>
            <p className="text-sm text-white/50">Where is your company located?</p>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onNext)} className="space-y-6">
        {/* Street Address */}
        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="streetAddress">Street Address *</Label>
          <Input
            id="streetAddress"
            {...register('streetAddress')}
            placeholder="123 Main Street, Suite 100"
          />
          {errors.streetAddress && (
            <motion.p 
              className="text-xs text-red-400"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errors.streetAddress.message}
            </motion.p>
          )}
        </motion.div>

        {/* City and State */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              {...register('city')}
              placeholder="San Francisco"
            />
            {errors.city && (
              <motion.p 
                className="text-xs text-red-400"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.city.message}
              </motion.p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State *</Label>
            <Select {...register('state')}>
              <option value="">Select...</option>
              {US_STATES.map((state) => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </Select>
            {errors.state && (
              <motion.p 
                className="text-xs text-red-400"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.state.message}
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* ZIP Code */}
        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="zipCode">ZIP Code *</Label>
          <Input
            id="zipCode"
            {...register('zipCode')}
            placeholder="94102"
            className="w-32"
            maxLength={10}
          />
          {errors.zipCode && (
            <motion.p 
              className="text-xs text-red-400"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errors.zipCode.message}
            </motion.p>
          )}
        </motion.div>

        {/* Map placeholder */}
        <motion.div 
          variants={itemVariants}
          className="h-32 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"
        >
          <div className="text-center">
            <MapPin className="w-6 h-6 text-white/20 mx-auto mb-2" />
            <p className="text-xs text-white/30">Map preview coming soon</p>
          </div>
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
