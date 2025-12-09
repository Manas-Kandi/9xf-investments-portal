'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Building2, 
  Users, 
  PieChart, 
  FileText, 
  Plus,
  ChevronRight,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DashboardViewProps {
  company: any; // Type strictly later
  stats?: {
    teamCount: number;
    shareholderCount: number;
    documentCount: number;
  };
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

export default function DashboardView({ company, stats }: DashboardViewProps) {
  // If no company exists, show setup prompt
  if (!company) {
    return <CompanyEmptyState />;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Company Header */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-white/70" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white">{company.legalName}</h1>
                <p className="text-white/50 text-sm">
                  {company.stateOfIncorporation} {company.entityType.replace('_', ' ')}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <Badge variant="success">Profile Complete</Badge>
                  {company.ein && (
                    <span className="text-xs text-white/40">EIN: {company.ein}</span>
                  )}
                </div>
              </div>
              <Button variant="secondary" size="sm">
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-white/40" />
              <div>
                <p className="text-2xl font-bold text-white">{stats?.teamCount || 0}</p>
                <p className="text-xs text-white/40">Team Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <PieChart className="w-5 h-5 text-white/40" />
              <div>
                <p className="text-2xl font-bold text-white">{stats?.shareholderCount || 0}</p>
                <p className="text-xs text-white/40">Shareholders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-white/40" />
              <div>
                <p className="text-2xl font-bold text-white">{stats?.documentCount || 0}</p>
                <p className="text-xs text-white/40">Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sections */}
      <motion.div variants={itemVariants} className="grid lg:grid-cols-2 gap-6">
        {/* Team Roster */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Team Roster</CardTitle>
                <CardDescription>Officers, directors, and key shareholders</CardDescription>
              </div>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* TODO: Real team data */}
            <div className="space-y-3">
              <div className="p-4 text-center text-white/40 text-sm bg-white/5 rounded-lg">
                No team members added yet
              </div>
            </div>
            <Link href="/company/team" className="flex items-center justify-center gap-2 mt-4 text-sm text-white/50 hover:text-white transition-colors">
              View all team members
              <ChevronRight className="w-4 h-4" />
            </Link>
          </CardContent>
        </Card>

        {/* Cap Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Cap Table</CardTitle>
                <CardDescription>Ownership structure and share classes</CardDescription>
              </div>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* TODO: Real cap table data */}
            <div className="space-y-3">
               <div className="p-4 text-center text-white/40 text-sm bg-white/5 rounded-lg">
                No share classes defined
              </div>
            </div>
            <Link href="/company/cap-table" className="flex items-center justify-center gap-2 mt-4 text-sm text-white/50 hover:text-white transition-colors">
              View full cap table
              <ChevronRight className="w-4 h-4" />
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function CompanyEmptyState() {
  const steps = [
    { title: 'Create Company Profile', description: 'Legal name, entity type, EIN', status: 'current' },
    { title: 'Add Team Members', description: 'Officers, directors, shareholders', status: 'locked' },
    { title: 'Build Cap Table', description: 'Share classes and ownership', status: 'locked' },
    { title: 'Complete EDGAR Access', description: 'SEC filing credentials', status: 'locked' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto"
    >
      {/* Hero */}
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        >
          <Building2 className="w-10 h-10 text-white/70" />
        </motion.div>
        <h1 className="text-3xl font-bold text-white mb-3">
          Set Up Your Company
        </h1>
        <p className="text-white/60 max-w-md mx-auto">
          Before you can start raising capital, we need some basic information about your company.
        </p>
      </motion.div>

      {/* Steps */}
      <motion.div
        className="space-y-3 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
              step.status === 'current'
                ? 'border-white/20 bg-white/5'
                : 'border-white/10 opacity-50'
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: step.status === 'locked' ? 0.5 : 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step.status === 'current' ? 'bg-white/20' : 'bg-white/5'
            }`}>
              {step.status === 'complete' ? (
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              ) : step.status === 'current' ? (
                <Circle className="w-5 h-5 text-white" />
              ) : (
                <span className="text-sm text-white/30">{index + 1}</span>
              )}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                step.status === 'current' ? 'text-white' : 'text-white/50'
              }`}>
                {step.title}
              </p>
              <p className="text-xs text-white/40">{step.description}</p>
            </div>
            {step.status === 'current' && (
              <ChevronRight className="w-5 h-5 text-white/30" />
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Button asChild size="lg" className="px-8">
          <Link href="/company/setup">
            Get Started
            <ChevronRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
        <p className="text-xs text-white/30 mt-4">
          Takes about 5 minutes to complete
        </p>
      </motion.div>
    </motion.div>
  );
}
