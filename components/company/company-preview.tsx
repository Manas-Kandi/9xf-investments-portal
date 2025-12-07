'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Building2, MapPin, Globe, Calendar } from 'lucide-react';
import { CompanyData, ENTITY_TYPES, US_STATES } from '@/lib/validations/company';

interface CompanyPreviewProps {
  data: Partial<CompanyData>;
}

export function CompanyPreview({ data }: CompanyPreviewProps) {
  const entityLabel = ENTITY_TYPES.find(e => e.value === data.entityType)?.label;
  const stateLabel = US_STATES.find(s => s.value === data.stateOfIncorporation)?.label;
  const addressStateLabel = US_STATES.find(s => s.value === data.state)?.label;

  const hasBasicInfo = data.legalName;
  const hasAddress = data.streetAddress && data.city;

  return (
    <div className="sticky top-8">
      <motion.div
        className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header with gradient */}
        <div className="h-24 bg-gradient-to-br from-white/10 via-white/5 to-transparent relative overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-30">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" opacity="0.2" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
          
          {/* Company icon */}
          <motion.div 
            className="absolute -bottom-6 left-6 w-16 h-16 rounded-xl bg-neutral-900 border border-white/20 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
          >
            <Building2 className="w-8 h-8 text-white/70" />
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-6 pt-10">
          {/* Company Name */}
          <AnimatePresence mode="wait">
            {data.legalName ? (
              <motion.h3
                key="name"
                className="text-xl font-bold text-white mb-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                {data.legalName}
              </motion.h3>
            ) : (
              <motion.div
                key="placeholder"
                className="h-7 w-48 bg-white/10 rounded animate-pulse mb-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            )}
          </AnimatePresence>

          {/* DBA */}
          <AnimatePresence>
            {data.dba && (
              <motion.p
                className="text-sm text-white/50 mb-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                DBA: {data.dba}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Entity Type Badge */}
          <AnimatePresence>
            {entityLabel && (
              <motion.div
                className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-xs text-white/70 mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                {entityLabel}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Details */}
          <div className="space-y-3 mt-4 pt-4 border-t border-white/10">
            {/* State of Incorporation */}
            <AnimatePresence>
              {stateLabel && (
                <motion.div
                  className="flex items-center gap-3 text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <Calendar className="w-4 h-4 text-white/40" />
                  <span className="text-white/60">Incorporated in {stateLabel}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Address */}
            <AnimatePresence>
              {hasAddress && (
                <motion.div
                  className="flex items-start gap-3 text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <MapPin className="w-4 h-4 text-white/40 mt-0.5" />
                  <span className="text-white/60">
                    {data.streetAddress}
                    {data.city && `, ${data.city}`}
                    {addressStateLabel && `, ${addressStateLabel}`}
                    {data.zipCode && ` ${data.zipCode}`}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Website */}
            <AnimatePresence>
              {data.website && (
                <motion.div
                  className="flex items-center gap-3 text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <Globe className="w-4 h-4 text-white/40" />
                  <span className="text-white/60">{data.website}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* EIN */}
            <AnimatePresence>
              {data.ein && (
                <motion.div
                  className="flex items-center gap-3 text-sm font-mono"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <span className="text-white/40 text-xs">EIN</span>
                  <span className="text-white/60">{data.ein}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Description */}
          <AnimatePresence>
            {data.description && (
              <motion.p
                className="mt-4 pt-4 border-t border-white/10 text-sm text-white/50 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {data.description}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Progress indicator */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between text-xs text-white/40 mb-2">
            <span>Profile completion</span>
            <span>{calculateCompletion(data)}%</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white/50 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${calculateCompletion(data)}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function calculateCompletion(data: Partial<CompanyData>): number {
  const fields = [
    data.legalName,
    data.entityType,
    data.stateOfIncorporation,
    data.streetAddress,
    data.city,
    data.state,
    data.zipCode,
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}
