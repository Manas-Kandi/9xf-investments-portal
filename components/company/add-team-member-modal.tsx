'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, User, Mail, Briefcase, Percent } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { teamMemberSchema, TeamMemberData, TEAM_ROLES, OFFICER_TITLES } from '@/lib/validations/team';

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TeamMemberData) => void;
  editData?: TeamMemberData | null;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 25 }
  },
  exit: { opacity: 0, scale: 0.95, y: 20 },
};

export function AddTeamMemberModal({ isOpen, onClose, onSubmit, editData }: AddTeamMemberModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<TeamMemberData>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: editData || {
      role: 'OFFICER',
    },
  });

  const selectedRole = watch('role');
  const showOwnership = ['SHAREHOLDER', 'OFFICER_DIRECTOR', 'ALL'].includes(selectedRole);

  const handleFormSubmit = (data: TeamMemberData) => {
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
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {editData ? 'Edit Team Member' : 'Add Team Member'}
                </h2>
                <p className="text-sm text-white/50 mt-1">
                  Officers, directors, and 20%+ shareholders
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
                <Label htmlFor="name">Full Name *</Label>
                <div className="relative">
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="John Doe"
                    className="pl-10"
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-400">{errors.name.message}</p>
                )}
              </div>

              {/* Role */}
              <div className="space-y-3">
                <Label>Role *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {TEAM_ROLES.map((role) => (
                    <motion.label
                      key={role.value}
                      className={`relative flex flex-col p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedRole === role.value
                          ? 'border-white/30 bg-white/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <input
                        type="radio"
                        {...register('role')}
                        value={role.value}
                        className="sr-only"
                      />
                      <span className={`text-sm font-medium ${
                        selectedRole === role.value ? 'text-white' : 'text-white/70'
                      }`}>
                        {role.label}
                      </span>
                      <span className="text-xs text-white/40">{role.description}</span>
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title
                  <span className="text-white/30 ml-2 text-xs">Optional</span>
                </Label>
                <div className="relative">
                  <Select {...register('title')}>
                    <option value="">Select a title...</option>
                    {OFFICER_TITLES.map((title) => (
                      <option key={title} value={title}>{title}</option>
                    ))}
                  </Select>
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
                    placeholder="john@company.com"
                    className="pl-10"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-400">{errors.email.message}</p>
                )}
              </div>

              {/* Ownership Percentage */}
              <AnimatePresence>
                {showOwnership && (
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Label htmlFor="ownershipPercentage">
                      Ownership Percentage
                      <span className="text-white/30 ml-2 text-xs">For 20%+ shareholders</span>
                    </Label>
                    <div className="relative w-32">
                      <Input
                        id="ownershipPercentage"
                        type="number"
                        {...register('ownershipPercentage', { valueAsNumber: true })}
                        placeholder="25"
                        min={0}
                        max={100}
                        className="pr-8"
                      />
                      <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Info box */}
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-xs text-blue-400">
                  After adding this team member, you&apos;ll need to complete a bad actor questionnaire for SEC compliance.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={handleClose} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editData ? 'Save Changes' : 'Add Member'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
