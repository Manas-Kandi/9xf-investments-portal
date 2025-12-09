'use client';
import { Loader2, Check } from 'lucide-react';

export function AutoSaveStatus({ status }: { status: 'saving' | 'saved' | 'error' | 'idle' }) {
  if (status === 'saving') return <div className="flex items-center text-xs text-white/50"><Loader2 className="w-3 h-3 animate-spin mr-1" /> Saving...</div>;
  if (status === 'saved') return <div className="flex items-center text-xs text-green-500"><Check className="w-3 h-3 mr-1" /> Saved</div>;
  if (status === 'error') return <div className="text-xs text-red-500">Error saving</div>;
  return null;
}
