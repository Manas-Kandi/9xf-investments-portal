'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Layers, DollarSign, Vote } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { shareClassSchema, ShareClassData, SHARE_CLASS_TYPES, SHARE_CLASS_COLORS } from '@/lib/validations/cap-table';

interface AddShareClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ShareClassData) => void;
  editData?: ShareClassData | null;
}

export function AddShareClassModal({ isOpen, onClose, onSubmit, editData }: AddShareClassModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ShareClassData>({
    resolver: zodResolver(shareClassSchema),
    defaultValues: editData || {
      type: 'COMMON',
      authorizedShares: 10000000,
      parValue: 0.0001,
      votingRights: true,
    },
  });

  const selectedType = watch('type');
  const showLiquidationPref = ['PREFERRED', 'CONVERTIBLE', 'SAFE'].includes(selectedType);

  const handleFormSubmit = (data: ShareClassData) => {
    onSubmit(data);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {editData ? 'Edit Share Class' : 'Add Share Class'}
                </h2>
                <p className="text-sm text-white/50 mt-1">
                  Define a class of shares for your cap table
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/50" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
              {/* Share Class Type */}
              <div className="space-y-3">
                <Label>Share Class Type *</Label>
                <div className="grid grid-cols-3 gap-2">
                  {SHARE_CLASS_TYPES.map((type) => (
                    <motion.label
                      key={type.value}
                      className={`relative flex flex-col items-center p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedType === type.value
                          ? 'border-white/30 bg-white/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <input
                        type="radio"
                        {...register('type')}
                        value={type.value}
                        className="sr-only"
                      />
                      <div 
                        className="w-3 h-3 rounded-full mb-2"
                        style={{ backgroundColor: SHARE_CLASS_COLORS[type.value] }}
                      />
                      <span className={`text-xs font-medium text-center ${
                        selectedType === type.value ? 'text-white' : 'text-white/70'
                      }`}>
                        {type.label}
                      </span>
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Class Name *</Label>
                <div className="relative">
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="e.g., Common Stock, Series A Preferred"
                    className="pl-10"
                  />
                  <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-400">{errors.name.message}</p>
                )}
              </div>

              {/* Authorized Shares */}
              <div className="space-y-2">
                <Label htmlFor="authorizedShares">Authorized Shares *</Label>
                <Input
                  id="authorizedShares"
                  type="number"
                  {...register('authorizedShares', { valueAsNumber: true })}
                  placeholder="10,000,000"
                />
                {errors.authorizedShares && (
                  <p className="text-xs text-red-400">{errors.authorizedShares.message}</p>
                )}
                <p className="text-xs text-white/30">
                  Maximum number of shares that can be issued
                </p>
              </div>

              {/* Par Value */}
              <div className="space-y-2">
                <Label htmlFor="parValue">
                  Par Value
                  <span className="text-white/30 ml-2 text-xs">Optional</span>
                </Label>
                <div className="relative w-40">
                  <Input
                    id="parValue"
                    type="number"
                    step="0.0001"
                    {...register('parValue', { valueAsNumber: true })}
                    placeholder="0.0001"
                    className="pl-8"
                  />
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                </div>
              </div>

              {/* Voting Rights */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <Vote className="w-5 h-5 text-white/50" />
                  <div>
                    <p className="text-sm font-medium text-white">Voting Rights</p>
                    <p className="text-xs text-white/40">Shareholders can vote on company matters</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('votingRights')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white/30"></div>
                </label>
              </div>

              {/* Liquidation Preference (for preferred shares) */}
              <AnimatePresence>
                {showLiquidationPref && (
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Label htmlFor="liquidationPreference">
                      Liquidation Preference
                      <span className="text-white/30 ml-2 text-xs">Multiple (e.g., 1x, 2x)</span>
                    </Label>
                    <div className="relative w-32">
                      <Input
                        id="liquidationPreference"
                        type="number"
                        step="0.1"
                        {...register('liquidationPreference', { valueAsNumber: true })}
                        placeholder="1.0"
                        className="pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">x</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={handleClose} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editData ? 'Save Changes' : 'Add Share Class'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
