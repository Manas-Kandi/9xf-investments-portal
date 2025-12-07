'use client';

import { motion } from 'framer-motion';
import { Layers, MoreVertical, Pencil, Trash2, Vote, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SHARE_CLASS_TYPES, SHARE_CLASS_COLORS, formatNumber } from '@/lib/validations/cap-table';

interface ShareClass {
  id: string;
  name: string;
  type: string;
  authorizedShares: number;
  issuedShares: number;
  parValue?: number;
  votingRights: boolean;
  liquidationPreference?: number;
}

interface ShareClassCardProps {
  shareClass: ShareClass;
  index: number;
  onEdit: (shareClass: ShareClass) => void;
  onDelete: (shareClass: ShareClass) => void;
}

export function ShareClassCard({ shareClass, index, onEdit, onDelete }: ShareClassCardProps) {
  const typeLabel = SHARE_CLASS_TYPES.find(t => t.value === shareClass.type)?.label || shareClass.type;
  const color = SHARE_CLASS_COLORS[shareClass.type] || '#6b7280';
  const utilizationPercent = shareClass.authorizedShares > 0 
    ? (shareClass.issuedShares / shareClass.authorizedShares) * 100 
    : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className="group"
    >
      <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden hover:border-white/20 transition-all">
        {/* Color bar */}
        <div className="h-1" style={{ backgroundColor: color }} />
        
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${color}20` }}
              >
                <Layers className="w-5 h-5" style={{ color }} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">{shareClass.name}</h3>
                <p className="text-xs text-white/50">{typeLabel}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => onEdit(shareClass)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-red-400 hover:text-red-300"
                onClick={() => onDelete(shareClass)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-white/40 mb-1">Authorized</p>
              <p className="text-lg font-semibold text-white">{formatNumber(shareClass.authorizedShares)}</p>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-1">Issued</p>
              <p className="text-lg font-semibold text-white">{formatNumber(shareClass.issuedShares)}</p>
            </div>
          </div>

          {/* Utilization bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-white/40">Utilization</span>
              <span className="text-white/60">{utilizationPercent.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
                initial={{ width: 0 }}
                animate={{ width: `${utilizationPercent}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>
          </div>

          {/* Footer badges */}
          <div className="flex items-center gap-2 pt-3 border-t border-white/10">
            {shareClass.votingRights && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 text-xs text-white/50">
                <Vote className="w-3 h-3" />
                <span>Voting</span>
              </div>
            )}
            {shareClass.parValue !== undefined && shareClass.parValue > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 text-xs text-white/50">
                <DollarSign className="w-3 h-3" />
                <span>${shareClass.parValue.toFixed(4)}</span>
              </div>
            )}
            {shareClass.liquidationPreference !== undefined && shareClass.liquidationPreference > 0 && (
              <div className="px-2 py-1 rounded-full bg-purple-500/10 text-xs text-purple-400">
                {shareClass.liquidationPreference}x Pref
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
