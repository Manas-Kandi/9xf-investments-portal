'use client';

import { motion } from 'framer-motion';
import { User, Mail, Percent, Shield, ShieldCheck, ShieldAlert, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TEAM_ROLES } from '@/lib/validations/team';

interface TeamMember {
  id: string;
  name: string;
  title?: string;
  email?: string;
  role: string;
  ownershipPercentage?: number;
  badActorStatus: 'pending' | 'cleared' | 'flagged';
}

interface TeamMemberCardProps {
  member: TeamMember;
  index: number;
  onEdit: (member: TeamMember) => void;
  onDelete: (member: TeamMember) => void;
  onBadActorCheck: (member: TeamMember) => void;
}

export function TeamMemberCard({ member, index, onEdit, onDelete, onBadActorCheck }: TeamMemberCardProps) {
  const roleLabel = TEAM_ROLES.find(r => r.value === member.role)?.label || member.role;
  
  const initials = member.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const badActorConfig = {
    pending: { icon: Shield, color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Check Pending' },
    cleared: { icon: ShieldCheck, color: 'text-green-400', bg: 'bg-green-500/10', label: 'Cleared' },
    flagged: { icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Flagged' },
  };

  const badActor = badActorConfig[member.badActorStatus];
  const BadActorIcon = badActor.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.05,
        layout: { duration: 0.3 }
      }}
      whileHover={{ y: -2 }}
      className="group relative"
    >
      <div className="rounded-xl border border-white/10 bg-white/5 p-5 hover:border-white/20 hover:bg-white/[0.07] transition-all">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <motion.div 
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-lg font-semibold text-white/80">{initials}</span>
            </motion.div>
            
            {/* Name & Title */}
            <div>
              <h3 className="text-base font-semibold text-white">{member.name}</h3>
              {member.title && (
                <p className="text-sm text-white/50">{member.title}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => onEdit(member)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-red-400 hover:text-red-300"
              onClick={() => onDelete(member)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          {member.email && (
            <div className="flex items-center gap-2 text-sm text-white/50">
              <Mail className="w-4 h-4" />
              <span>{member.email}</span>
            </div>
          )}
          {member.ownershipPercentage !== undefined && member.ownershipPercentage > 0 && (
            <div className="flex items-center gap-2 text-sm text-white/50">
              <Percent className="w-4 h-4" />
              <span>{member.ownershipPercentage}% ownership</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          {/* Role Badge */}
          <Badge variant="default">{roleLabel}</Badge>

          {/* Bad Actor Status */}
          <motion.button
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${badActor.bg} transition-colors hover:opacity-80`}
            onClick={() => onBadActorCheck(member)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <BadActorIcon className={`w-4 h-4 ${badActor.color}`} />
            <span className={`text-xs font-medium ${badActor.color}`}>
              {badActor.label}
            </span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
