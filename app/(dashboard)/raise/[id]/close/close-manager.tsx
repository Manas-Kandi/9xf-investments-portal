'use client';

import { useState } from 'react';
import { generateProgressUpdate } from '@/app/actions/close';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, FileText, Lock } from 'lucide-react';

export default function CloseManager({ status, raiseId }: { status: any, raiseId: string }) {
  const [loading, setLoading] = useState(false);

  const handleMilestone = async (milestone: '50%' | '100%') => {
    if (confirm(`Generate Form C-U for ${milestone} milestone?`)) {
      setLoading(true);
      await generateProgressUpdate(raiseId, milestone);
      setLoading(false);
    }
  };

  const handleRollingClose = async () => {
    if (confirm('Initiate rolling close? This will create a Form C-U.')) {
      setLoading(true);
      await generateProgressUpdate(raiseId, 'Other');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Closing & Milestones</h1>
        <p className="text-white/50">Manage your progress updates and rolling closes.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Progress & Milestones */}
        <Card className="bg-neutral-900 border-white/10">
          <CardHeader>
            <CardTitle>Milestone Tracker</CardTitle>
            <CardDescription>Reg CF requires Form C-U filings at 50% and 100%.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Current Progress</span>
                <span className="text-white font-medium">${status.amountRaised.toLocaleString()} ({status.progress.toFixed(1)}%)</span>
              </div>
              <Progress value={Math.min(status.progress, 100)} />
            </div>

            <div className="space-y-4">
              {/* 50% Milestone */}
              <div className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${status.milestones.fifty ? 'bg-green-500/20 text-green-500' : 'bg-white/10 text-white/50'}`}>
                    {status.milestones.fifty ? <CheckCircle className="w-4 h-4" /> : <span className="text-xs font-bold">50%</span>}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">50% Milestone</p>
                    <p className="text-xs text-white/50">{status.milestones.fifty ? 'Filed' : 'Pending'}</p>
                  </div>
                </div>
                {!status.milestones.fifty && (
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    disabled={status.progress < 50 || loading}
                    onClick={() => handleMilestone('50%')}
                  >
                    File Update
                  </Button>
                )}
              </div>

              {/* 100% Milestone */}
              <div className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${status.milestones.hundred ? 'bg-green-500/20 text-green-500' : 'bg-white/10 text-white/50'}`}>
                    {status.milestones.hundred ? <CheckCircle className="w-4 h-4" /> : <span className="text-xs font-bold">100%</span>}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">100% Milestone</p>
                    <p className="text-xs text-white/50">{status.milestones.hundred ? 'Filed' : 'Pending'}</p>
                  </div>
                </div>
                {!status.milestones.hundred && (
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    disabled={status.progress < 100 || loading}
                    onClick={() => handleMilestone('100%')}
                  >
                    File Update
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rolling Close Actions */}
        <Card className="bg-neutral-900 border-white/10">
          <CardHeader>
            <CardTitle>Rolling Close</CardTitle>
            <CardDescription>Close on funds raised to date (must be &gt; min threshold).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm text-yellow-200">
              <div className="flex gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>Initiating a rolling close requires giving investors at least 5 business days notice. This action generates the Form C-U filing.</p>
              </div>
            </div>

            <div className="space-y-2">
               <div className="flex justify-between text-sm">
                 <span className="text-white/70">Minimum Threshold</span>
                 <span className="text-white">${status.minAmount.toLocaleString()}</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-white/70">Eligible to Close</span>
                 <span className={status.canClose ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>
                   {status.canClose ? 'YES' : 'NO'}
                 </span>
               </div>
            </div>

            <Button 
              className="w-full" 
              disabled={!status.canClose || loading}
              onClick={handleRollingClose}
            >
              <Lock className="w-4 h-4 mr-2" />
              Initiate Rolling Close
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Filing History */}
      <Card className="bg-neutral-900 border-white/10">
        <CardHeader>
          <CardTitle>Progress Filings (Form C-U)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {status.progressUpdates.length === 0 ? (
              <p className="text-sm text-white/40 text-center py-4">No progress updates filed yet.</p>
            ) : (
              status.progressUpdates.map((filing: any) => (
                <div key={filing.id} className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-sm font-medium text-white">Form C-U ({filing.status})</p>
                      <p className="text-xs text-white/50">{new Date(filing.createdAt).toLocaleDateString()} • {(filing.contentJson as any)?.description}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">View PDF</Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
