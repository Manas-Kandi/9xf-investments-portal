'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PieChart, 
  Plus, 
  Upload, 
  Search, 
  Layers, 
  Users,
  Download,
  MoreVertical,
  Pencil,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { OwnershipChart } from '@/components/company/ownership-chart';
import { ShareClassCard } from '@/components/company/share-class-card';
import { AddShareClassModal } from '@/components/company/add-share-class-modal';
import { AddShareholderModal } from '@/components/company/add-shareholder-modal';
import { CSVImportModal } from '@/components/company/csv-import-modal';
import { 
  ShareClassData, 
  ShareholderData, 
  SHARE_CLASS_COLORS,
  SHAREHOLDER_TYPES,
  formatNumber,
  calculateOwnership 
} from '@/lib/validations/cap-table';

// Mock data
const initialShareClasses = [
  {
    id: '1',
    name: 'Common Stock',
    type: 'COMMON',
    authorizedShares: 10000000,
    issuedShares: 8000000,
    parValue: 0.0001,
    votingRights: true,
  },
  {
    id: '2',
    name: 'Series A Preferred',
    type: 'PREFERRED',
    authorizedShares: 2000000,
    issuedShares: 1500000,
    parValue: 0.0001,
    votingRights: true,
    liquidationPreference: 1,
  },
  {
    id: '3',
    name: 'Option Pool',
    type: 'OPTION_POOL',
    authorizedShares: 1000000,
    issuedShares: 500000,
    parValue: 0,
    votingRights: false,
  },
];

const initialShareholders = [
  { id: '1', name: 'John Doe', email: 'john@acme.com', type: 'FOUNDER', shareClassId: '1', shares: 4000000 },
  { id: '2', name: 'Jane Smith', email: 'jane@acme.com', type: 'FOUNDER', shareClassId: '1', shares: 2000000 },
  { id: '3', name: 'Acme Ventures', email: 'invest@acme.vc', type: 'INVESTOR', shareClassId: '2', shares: 1500000 },
  { id: '4', name: 'Bob Johnson', email: 'bob@acme.com', type: 'EMPLOYEE', shareClassId: '1', shares: 500000 },
  { id: '5', name: 'Option Pool Reserve', email: '', type: 'OTHER', shareClassId: '3', shares: 500000 },
];

type TabType = 'overview' | 'share-classes' | 'shareholders';

export default function CapTablePage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [shareClasses, setShareClasses] = useState(initialShareClasses);
  const [shareholders, setShareholders] = useState(initialShareholders);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isShareClassModalOpen, setIsShareClassModalOpen] = useState(false);
  const [isShareholderModalOpen, setIsShareholderModalOpen] = useState(false);
  const [isCSVImportOpen, setIsCSVImportOpen] = useState(false);
  const [editingShareClass, setEditingShareClass] = useState<typeof shareClasses[0] | null>(null);
  const [editingShareholder, setEditingShareholder] = useState<typeof shareholders[0] | null>(null);

  // Calculations
  const totalShares = useMemo(() => 
    shareClasses.reduce((sum, sc) => sum + sc.issuedShares, 0),
    [shareClasses]
  );

  const chartSegments = useMemo(() => 
    shareClasses.map(sc => ({
      id: sc.id,
      name: sc.name,
      type: sc.type,
      shares: sc.issuedShares,
      percentage: calculateOwnership(sc.issuedShares, totalShares),
    })),
    [shareClasses, totalShares]
  );

  const filteredShareholders = useMemo(() => 
    shareholders.filter(sh =>
      sh.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sh.email?.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [shareholders, searchQuery]
  );

  // Handlers
  const handleAddShareClass = (data: ShareClassData) => {
    const newClass = {
      id: Date.now().toString(),
      ...data,
      issuedShares: 0,
    };
    setShareClasses(prev => [...prev, newClass]);
  };

  const handleEditShareClass = (shareClass: typeof shareClasses[0]) => {
    setEditingShareClass(shareClass);
    setIsShareClassModalOpen(true);
  };

  const handleDeleteShareClass = (shareClass: typeof shareClasses[0]) => {
    setShareClasses(prev => prev.filter(sc => sc.id !== shareClass.id));
  };

  const handleAddShareholder = (data: ShareholderData) => {
    const newShareholder = {
      id: Date.now().toString(),
      ...data,
    };
    setShareholders(prev => [...prev, newShareholder]);
    
    // Update issued shares count
    setShareClasses(prev => prev.map(sc => 
      sc.id === data.shareClassId 
        ? { ...sc, issuedShares: sc.issuedShares + data.shares }
        : sc
    ));
  };

  const handleDeleteShareholder = (shareholder: typeof shareholders[0]) => {
    setShareholders(prev => prev.filter(sh => sh.id !== shareholder.id));
    
    // Update issued shares count
    setShareClasses(prev => prev.map(sc => 
      sc.id === shareholder.shareClassId 
        ? { ...sc, issuedShares: sc.issuedShares - shareholder.shares }
        : sc
    ));
  };

  const handleCSVImport = (data: { name: string; email?: string; type: string; shareClassId: string; shares: number }[]) => {
    const newShareholders = data.map(item => ({
      id: Date.now().toString() + Math.random(),
      ...item,
    }));
    setShareholders(prev => [...prev, ...newShareholders]);
    
    // Update issued shares counts
    const sharesByClass: Record<string, number> = {};
    data.forEach(item => {
      sharesByClass[item.shareClassId] = (sharesByClass[item.shareClassId] || 0) + item.shares;
    });
    
    setShareClasses(prev => prev.map(sc => ({
      ...sc,
      issuedShares: sc.issuedShares + (sharesByClass[sc.id] || 0),
    })));
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <PieChart className="w-4 h-4" /> },
    { id: 'share-classes', label: 'Share Classes', icon: <Layers className="w-4 h-4" /> },
    { id: 'shareholders', label: 'Shareholders', icon: <Users className="w-4 h-4" /> },
  ];

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
              <PieChart className="w-5 h-5 text-white/70" />
            </div>
            <h1 className="text-2xl font-bold text-white">Cap Table</h1>
          </div>
          <p className="text-white/50 ml-13">
            Manage share classes and ownership structure
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setIsCSVImportOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </Button>
          <Button onClick={() => {
            if (activeTab === 'share-classes') {
              setIsShareClassModalOpen(true);
            } else {
              setIsShareholderModalOpen(true);
            }
          }}>
            <Plus className="w-4 h-4 mr-2" />
            {activeTab === 'share-classes' ? 'Add Class' : 'Add Shareholder'}
          </Button>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-1 p-1 bg-white/5 rounded-xl w-fit"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white/10 text-white'
                : 'text-white/50 hover:text-white/70'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <OverviewTab
            key="overview"
            shareClasses={shareClasses}
            shareholders={shareholders}
            totalShares={totalShares}
            chartSegments={chartSegments}
          />
        )}
        
        {activeTab === 'share-classes' && (
          <ShareClassesTab
            key="share-classes"
            shareClasses={shareClasses}
            onEdit={handleEditShareClass}
            onDelete={handleDeleteShareClass}
          />
        )}
        
        {activeTab === 'shareholders' && (
          <ShareholdersTab
            key="shareholders"
            shareholders={filteredShareholders}
            shareClasses={shareClasses}
            totalShares={totalShares}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onDelete={handleDeleteShareholder}
          />
        )}
      </AnimatePresence>

      {/* Modals */}
      <AddShareClassModal
        isOpen={isShareClassModalOpen}
        onClose={() => {
          setIsShareClassModalOpen(false);
          setEditingShareClass(null);
        }}
        onSubmit={handleAddShareClass}
        editData={editingShareClass}
      />

      <AddShareholderModal
        isOpen={isShareholderModalOpen}
        onClose={() => {
          setIsShareholderModalOpen(false);
          setEditingShareholder(null);
        }}
        onSubmit={handleAddShareholder}
        shareClasses={shareClasses}
        editData={editingShareholder}
      />

      <CSVImportModal
        isOpen={isCSVImportOpen}
        onClose={() => setIsCSVImportOpen(false)}
        onImport={handleCSVImport}
        shareClasses={shareClasses}
      />
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ 
  shareClasses, 
  shareholders, 
  totalShares, 
  chartSegments 
}: { 
  shareClasses: typeof initialShareClasses;
  shareholders: typeof initialShareholders;
  totalShares: number;
  chartSegments: { id: string; name: string; type: string; shares: number; percentage: number }[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Chart - Full width */}
      <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
        <h3 className="text-lg font-semibold text-white mb-6">Ownership Distribution</h3>
        <OwnershipChart segments={chartSegments} totalShares={totalShares} />
      </div>

      {/* Bottom section - Top Shareholders */}
      <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
        <h4 className="text-sm font-medium text-white mb-4">Top Shareholders</h4>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {shareholders
            .sort((a, b) => b.shares - a.shares)
            .slice(0, 5)
            .map((sh, index) => (
              <motion.div 
                key={sh.id} 
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/70">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate">{sh.name}</p>
                  <p className="text-xs text-white/40 font-mono">
                    {calculateOwnership(sh.shares, totalShares).toFixed(1)}%
                  </p>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </motion.div>
  );
}

// Share Classes Tab Component
function ShareClassesTab({ 
  shareClasses, 
  onEdit, 
  onDelete 
}: { 
  shareClasses: typeof initialShareClasses;
  onEdit: (sc: typeof initialShareClasses[0]) => void;
  onDelete: (sc: typeof initialShareClasses[0]) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {shareClasses.map((sc, index) => (
            <ShareClassCard
              key={sc.id}
              shareClass={sc}
              index={index}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Shareholders Tab Component
function ShareholdersTab({ 
  shareholders, 
  shareClasses,
  totalShares,
  searchQuery,
  onSearchChange,
  onDelete 
}: { 
  shareholders: typeof initialShareholders;
  shareClasses: typeof initialShareClasses;
  totalShares: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onDelete: (sh: typeof initialShareholders[0]) => void;
}) {
  const getShareClassName = (id: string) => 
    shareClasses.find(sc => sc.id === id)?.name || 'Unknown';
  
  const getShareClassColor = (id: string) => {
    const sc = shareClasses.find(s => s.id === id);
    return sc ? SHARE_CLASS_COLORS[sc.type] || '#6b7280' : '#6b7280';
  };

  const getTypeLabel = (type: string) =>
    SHAREHOLDER_TYPES.find(t => t.value === type)?.label || type;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <Input
          placeholder="Search shareholders..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-11"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="text-left p-4 text-xs font-medium text-white/50">Shareholder</th>
              <th className="text-left p-4 text-xs font-medium text-white/50">Type</th>
              <th className="text-left p-4 text-xs font-medium text-white/50">Share Class</th>
              <th className="text-right p-4 text-xs font-medium text-white/50">Shares</th>
              <th className="text-right p-4 text-xs font-medium text-white/50">Ownership</th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {shareholders.map((sh, index) => (
                <motion.tr
                  key={sh.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                >
                  <td className="p-4">
                    <div>
                      <p className="text-sm font-medium text-white">{sh.name}</p>
                      {sh.email && (
                        <p className="text-xs text-white/40">{sh.email}</p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="default">{getTypeLabel(sh.type)}</Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getShareClassColor(sh.shareClassId) }}
                      />
                      <span className="text-sm text-white/70">{getShareClassName(sh.shareClassId)}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-sm font-mono text-white">
                      {sh.shares.toLocaleString()}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-sm font-mono text-white/70">
                      {calculateOwnership(sh.shares, totalShares).toFixed(2)}%
                    </span>
                  </td>
                  <td className="p-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                      onClick={() => onDelete(sh)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
