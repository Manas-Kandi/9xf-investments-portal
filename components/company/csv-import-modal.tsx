'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileSpreadsheet, Check, AlertCircle, ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { parseCSV } from '@/lib/validations/cap-table';

interface ShareClass {
  id: string;
  name: string;
}

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: ImportedShareholder[]) => void;
  shareClasses: ShareClass[];
}

interface ImportedShareholder {
  name: string;
  email?: string;
  type: string;
  shareClassId: string;
  shares: number;
}

const REQUIRED_FIELDS = ['name', 'shares'];
const OPTIONAL_FIELDS = ['email', 'type', 'shareClassId'];
const ALL_FIELDS = [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS];

export function CSVImportModal({ isOpen, onClose, onImport, shareClasses }: CSVImportModalProps) {
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview'>('upload');
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [defaultShareClass, setDefaultShareClass] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseCSV(text);
        
        if (parsed.length < 2) {
          setError('CSV must have at least a header row and one data row');
          return;
        }

        setHeaders(parsed[0]);
        setCsvData(parsed.slice(1));
        setError(null);
        
        // Auto-map columns if headers match
        const autoMapping: Record<string, string> = {};
        parsed[0].forEach((header, index) => {
          const normalized = header.toLowerCase().replace(/[^a-z]/g, '');
          if (normalized.includes('name')) autoMapping['name'] = index.toString();
          if (normalized.includes('email')) autoMapping['email'] = index.toString();
          if (normalized.includes('share') && !normalized.includes('class')) autoMapping['shares'] = index.toString();
          if (normalized.includes('type')) autoMapping['type'] = index.toString();
        });
        setColumnMapping(autoMapping);
        
        setStep('mapping');
      } catch (err) {
        setError('Failed to parse CSV file');
      }
    };
    reader.readAsText(file);
  }, []);

  const handleMappingChange = (field: string, columnIndex: string) => {
    setColumnMapping(prev => ({ ...prev, [field]: columnIndex }));
  };

  const getMappedData = useCallback((): ImportedShareholder[] => {
    return csvData.map(row => ({
      name: columnMapping.name ? row[parseInt(columnMapping.name)] || '' : '',
      email: columnMapping.email ? row[parseInt(columnMapping.email)] : undefined,
      type: columnMapping.type ? row[parseInt(columnMapping.type)] || 'OTHER' : 'OTHER',
      shareClassId: defaultShareClass,
      shares: columnMapping.shares ? parseInt(row[parseInt(columnMapping.shares)].replace(/,/g, '')) || 0 : 0,
    })).filter(item => item.name && item.shares > 0);
  }, [csvData, columnMapping, defaultShareClass]);

  const handleImport = () => {
    const data = getMappedData();
    onImport(data);
    handleClose();
  };

  const handleClose = () => {
    setStep('upload');
    setCsvData([]);
    setHeaders([]);
    setColumnMapping({});
    setDefaultShareClass('');
    setError(null);
    onClose();
  };

  const canProceedToPreview = columnMapping.name && columnMapping.shares && defaultShareClass;
  const previewData = step === 'preview' ? getMappedData() : [];

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
            className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold text-white">Import Shareholders</h2>
                <p className="text-sm text-white/50 mt-1">
                  {step === 'upload' && 'Upload a CSV file with shareholder data'}
                  {step === 'mapping' && 'Map CSV columns to shareholder fields'}
                  {step === 'preview' && 'Review and confirm import'}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/50" />
              </button>
            </div>

            {/* Step indicator */}
            <div className="px-6 py-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                {['Upload', 'Map Columns', 'Preview'].map((label, index) => {
                  const stepNames = ['upload', 'mapping', 'preview'];
                  const currentIndex = stepNames.indexOf(step);
                  const isActive = index === currentIndex;
                  const isComplete = index < currentIndex;

                  return (
                    <div key={label} className="flex items-center">
                      <div className={`flex items-center gap-2 ${
                        isActive ? 'text-white' : isComplete ? 'text-white/70' : 'text-white/30'
                      }`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          isComplete ? 'bg-green-500/20 text-green-400' :
                          isActive ? 'bg-white/20' : 'bg-white/5'
                        }`}>
                          {isComplete ? <Check className="w-3 h-3" /> : index + 1}
                        </div>
                        <span className="text-sm font-medium">{label}</span>
                      </div>
                      {index < 2 && (
                        <ArrowRight className="w-4 h-4 mx-4 text-white/20" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Upload Step */}
              {step === 'upload' && (
                <div className="space-y-6">
                  <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-white/30 hover:bg-white/5 transition-all">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="sr-only"
                    />
                    <Upload className="w-10 h-10 text-white/30 mb-3" />
                    <p className="text-sm text-white/70 font-medium">Click to upload CSV</p>
                    <p className="text-xs text-white/40 mt-1">or drag and drop</p>
                  </label>

                  {error && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <p className="text-sm text-red-400">{error}</p>
                    </div>
                  )}

                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <h4 className="text-sm font-medium text-white mb-2">Expected CSV format</h4>
                    <div className="font-mono text-xs text-white/50 bg-neutral-950 rounded p-3 overflow-x-auto">
                      <p>Name,Email,Shares,Type</p>
                      <p>John Doe,john@example.com,100000,Founder</p>
                      <p>Jane Smith,jane@example.com,50000,Employee</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Mapping Step */}
              {step === 'mapping' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <p className="text-sm text-blue-400">
                      Found {csvData.length} rows with {headers.length} columns
                    </p>
                  </div>

                  {/* Default share class */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Default Share Class *</label>
                    <Select
                      value={defaultShareClass}
                      onChange={(e) => setDefaultShareClass(e.target.value)}
                    >
                      <option value="">Select share class...</option>
                      {shareClasses.map((sc) => (
                        <option key={sc.id} value={sc.id}>{sc.name}</option>
                      ))}
                    </Select>
                  </div>

                  {/* Column mapping */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-white">Column Mapping</h4>
                    
                    {ALL_FIELDS.map((field) => (
                      <div key={field} className="flex items-center gap-4">
                        <div className="w-32">
                          <span className={`text-sm ${
                            REQUIRED_FIELDS.includes(field) ? 'text-white' : 'text-white/50'
                          }`}>
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                            {REQUIRED_FIELDS.includes(field) && ' *'}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-white/20" />
                        <Select
                          value={columnMapping[field] || ''}
                          onChange={(e) => handleMappingChange(field, e.target.value)}
                          className="flex-1"
                        >
                          <option value="">-- Skip --</option>
                          {headers.map((header, index) => (
                            <option key={index} value={index.toString()}>
                              {header} (Column {index + 1})
                            </option>
                          ))}
                        </Select>
                      </div>
                    ))}
                  </div>

                  {/* Sample data preview */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-white">Sample Data</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-white/10">
                            {headers.map((header, i) => (
                              <th key={i} className="text-left p-2 text-white/50 font-medium">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {csvData.slice(0, 3).map((row, i) => (
                            <tr key={i} className="border-b border-white/5">
                              {row.map((cell, j) => (
                                <td key={j} className="p-2 text-white/70">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Preview Step */}
              {step === 'preview' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <p className="text-sm text-green-400">
                      Ready to import {previewData.length} shareholders
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left p-3 text-white/50 font-medium">Name</th>
                          <th className="text-left p-3 text-white/50 font-medium">Email</th>
                          <th className="text-left p-3 text-white/50 font-medium">Type</th>
                          <th className="text-right p-3 text-white/50 font-medium">Shares</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.map((row, i) => (
                          <tr key={i} className="border-b border-white/5">
                            <td className="p-3 text-white">{row.name}</td>
                            <td className="p-3 text-white/60">{row.email || '-'}</td>
                            <td className="p-3 text-white/60">{row.type}</td>
                            <td className="p-3 text-white font-mono text-right">
                              {row.shares.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-white/10">
              {step === 'upload' && (
                <Button variant="secondary" onClick={handleClose} className="flex-1">
                  Cancel
                </Button>
              )}
              
              {step === 'mapping' && (
                <>
                  <Button variant="secondary" onClick={() => setStep('upload')} className="flex-1">
                    Back
                  </Button>
                  <Button 
                    onClick={() => setStep('preview')} 
                    className="flex-1"
                    disabled={!canProceedToPreview}
                  >
                    Preview Import
                  </Button>
                </>
              )}
              
              {step === 'preview' && (
                <>
                  <Button variant="secondary" onClick={() => setStep('mapping')} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={handleImport} className="flex-1">
                    Import {previewData.length} Shareholders
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
