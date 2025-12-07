'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Search, Filter, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TeamMemberCard } from '@/components/company/team-member-card';
import { AddTeamMemberModal } from '@/components/company/add-team-member-modal';
import { TeamMemberData } from '@/lib/validations/team';

interface TeamMember {
  id: string;
  name: string;
  title?: string;
  email?: string;
  role: string;
  ownershipPercentage?: number;
  badActorStatus: 'pending' | 'cleared' | 'flagged';
}

// Mock data
const initialMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Doe',
    title: 'Chief Executive Officer (CEO)',
    email: 'john@acme.com',
    role: 'OFFICER_DIRECTOR',
    ownershipPercentage: 35,
    badActorStatus: 'cleared',
  },
  {
    id: '2',
    name: 'Jane Smith',
    title: 'Chief Financial Officer (CFO)',
    email: 'jane@acme.com',
    role: 'OFFICER',
    ownershipPercentage: 15,
    badActorStatus: 'cleared',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    title: undefined,
    email: 'bob@investor.com',
    role: 'DIRECTOR',
    ownershipPercentage: 0,
    badActorStatus: 'pending',
  },
];

export default function TeamRosterPage() {
  const [members, setMembers] = useState(initialMembers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<typeof members[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddMember = (data: TeamMemberData) => {
    const newMember = {
      id: Date.now().toString(),
      ...data,
      badActorStatus: 'pending' as const,
    };
    setMembers(prev => [...prev, newMember]);
  };

  const handleEditMember = (member: typeof members[0]) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleDeleteMember = (member: typeof members[0]) => {
    setMembers(prev => prev.filter(m => m.id !== member.id));
  };

  const handleBadActorCheck = (member: typeof members[0]) => {
    // Navigate to bad actor questionnaire
    console.log('Bad actor check for:', member.name);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  // Stats
  const totalMembers = members.length;
  const clearedMembers = members.filter(m => m.badActorStatus === 'cleared').length;
  const pendingMembers = members.filter(m => m.badActorStatus === 'pending').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-white/70" />
            </div>
            <h1 className="text-2xl font-bold text-white">Team Roster</h1>
          </div>
          <p className="text-white/50 ml-13">
            Manage officers, directors, and 20%+ shareholders
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4"
      >
        <div className="p-4 rounded-xl border border-white/10 bg-white/5">
          <p className="text-2xl font-bold text-white">{totalMembers}</p>
          <p className="text-xs text-white/40">Total Members</p>
        </div>
        <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/5">
          <p className="text-2xl font-bold text-green-400">{clearedMembers}</p>
          <p className="text-xs text-green-400/60">Bad Actor Cleared</p>
        </div>
        <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
          <p className="text-2xl font-bold text-yellow-400">{pendingMembers}</p>
          <p className="text-xs text-yellow-400/60">Checks Pending</p>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <Input
          placeholder="Search team members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-11"
        />
      </motion.div>

      {/* Team Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {filteredMembers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredMembers.map((member, index) => (
                <TeamMemberCard
                  key={member.id}
                  member={member}
                  index={index}
                  onEdit={handleEditMember}
                  onDelete={handleDeleteMember}
                  onBadActorCheck={handleBadActorCheck}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <EmptyState onAdd={() => setIsModalOpen(true)} />
        )}
      </motion.div>

      {/* Modal */}
      <AddTeamMemberModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddMember}
        editData={editingMember}
      />
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4 rounded-2xl border border-dashed border-white/20"
    >
      <motion.div
        className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
      >
        <UserPlus className="w-8 h-8 text-white/50" />
      </motion.div>
      <h3 className="text-lg font-semibold text-white mb-2">No team members yet</h3>
      <p className="text-sm text-white/50 text-center max-w-sm mb-6">
        Add your officers, directors, and shareholders to complete your company profile.
      </p>
      <Button onClick={onAdd}>
        <Plus className="w-4 h-4 mr-2" />
        Add First Member
      </Button>
    </motion.div>
  );
}
