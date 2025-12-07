'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, User, Mail, Calendar, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { shareholderSchema, ShareholderData, SHAREHOLDER_TYPES } from '@/lib/validations/cap-table';

interface ShareClass {
  id: string;
  name: string;
  type: string;
}

interface AddShareholderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ShareholderData) => void;
  shareClasses: ShareClass[];
  editData?: ShareholderData | null;
}

export function AddShareholderModal({ isOpen, onClose, onSubmit, shareClasses, editData }: AddShareholderModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ShareholderData>({
    resolver: zodResolver(shareholderSchema),
    defaultValues: editData || {
      type: 'FOUNDER',
      shares: 0,
    },
  });

  const selectedType = watch('type');

  const handleFormSubmit = (data: ShareholderData) => {
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
            className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-white/10 bg-neutral-900">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {editData ? 'Edit Shareholder' : 'Add Shareholder'}
                </h2>
                <p className="text-sm text-white/50 mt-1">
                  Add an individual or entity to the cap table
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
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <div className="relative">
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="John Doe or Acme Ventures LLC"
                    className="pl-10"
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-400">{errors.name.message}</p>
                )}
              </div>

              {/* Shareholder Type */}
              <div className="space-y-3">
                <Label>Shareholder Type *</Label>
                <div className="grid grid-cols-3 gap-2">
                  {SHAREHOLDER_TYPES.map((type) => (
                    <motion.label
                      key={type.value}
                      className={`relative flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${
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
                      <span className={`text-sm font-medium ${
                        selectedType === type.value ? 'text-white' : 'text-white/70'
                      }`}>
                        {type.label}
                      </span>
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email
                  <span className="text-white/30 ml-2 text-xs">Optional</span>
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="john@example.com"
                    className="pl-10"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-400">{errors.email.message}</p>
                )}
              </div>

              {/* Share Class */}
              <div className="space-y-2">
                <Label htmlFor="shareClassId">Share Class *</Label>
                <Select {...register('shareClassId')}>
                  <option value="">Select a share class...</option>
                  {shareClasses.map((sc) => (
                    <option key={sc.id} value={sc.id}>{sc.name}</option>
                  ))}
                </Select>
                {errors.shareClassId && (
                  <p className="text-xs text-red-400">{errors.shareClassId.message}</p>
                )}
              </div>

              {/* Number of Shares */}
              <div className="space-y-2">
                <Label htmlFor="shares">Number of Shares *</Label>
                <Input
                  id="shares"
                  type="number"
                  {...register('shares', { valueAsNumber: true })}
                  placeholder="100,000"
                />
                {errors.shares && (
                  <p className="text-xs text-red-400">{errors.shares.message}</p>
                )}
              </div>

              {/* Purchase Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">
                    Purchase Date
                    <span className="text-white/30 ml-1 text-xs">Optional</span>
                  </Label>
                  <input
                    type="date"
                    id="purchaseDate"
                    {...register('purchaseDate')}
                    className="flex h-11 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all [color-scheme:dark]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchasePrice">
                    Price/Share
                    <span className="text-white/30 ml-1 text-xs">Optional</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="purchasePrice"
                      type="number"
                      step="0.01"
                      {...register('purchasePrice', { valueAsNumber: true })}
                      placeholder="0.10"
                      className="pl-8"
                    />
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  </div>
                </div>
              </div>

              {/* Vesting Schedule */}
              <div className="space-y-2">
                <Label htmlFor="vestingSchedule">
                  Vesting Schedule
                  <span className="text-white/30 ml-2 text-xs">Optional</span>
                </Label>
                <Select {...register('vestingSchedule')}>
                  <option value="">No vesting</option>
                  <option value="4y-1y-cliff">4 years, 1 year cliff</option>
                  <option value="4y-no-cliff">4 years, no cliff</option>
                  <option value="3y-1y-cliff">3 years, 1 year cliff</option>
                  <option value="immediate">Immediately vested</option>
                  <option value="custom">Custom schedule</option>
                </Select>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={handleClose} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editData ? 'Save Changes' : 'Add Shareholder'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
