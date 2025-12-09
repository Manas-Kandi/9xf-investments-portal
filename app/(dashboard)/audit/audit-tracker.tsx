'use client';

import { useState } from 'react';
import { initializeFinancialAudit } from '@/app/actions/financial-audit';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Upload, FileText, Play } from 'lucide-react';

export default function AuditTracker({ audit, raiseId }: { audit: any, raiseId: string }) {
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    await initializeFinancialAudit(raiseId);
    setLoading(false);
  };

  if (!audit) {
    return (
      <div className="p-12 text-center bg-neutral-900 border border-white/10 rounded-xl">
        <h1 className="text-2xl font-bold text-white mb-2">Audit Tracker</h1>
        <p className="text-white/50 mb-6">Track your financial audit progress for Reg A+ / Reg CF.</p>
        <Button onClick={handleStart} disabled={loading}>
          <Play className="w-4 h-4 mr-2" /> Start Audit Prep
        </Button>
      </div>
    );
  }

  const completedTasks = audit.tasks.filter((t: any) => t.status === 'UPLOADED' || t.status === 'VERIFIED').length;
  const progress = (completedTasks / audit.tasks.length) * 100;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Audit Preparation</h1>
          <p className="text-white/50">Fiscal Year {audit.fiscalYear}</p>
        </div>
        <Badge variant="default" className="border-white/20">{audit.status.replace('_', ' ')}</Badge>
      </div>

      <Card className="bg-neutral-900 border-white/10">
        <CardHeader>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/70">Checklist Progress</span>
            <span className="text-white font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {audit.tasks.map((task: any) => (
              <div key={task.id} className="flex items-center justify-between p-3 hover:bg-white/5 rounded transition-colors">
                <div className="flex items-center gap-3">
                  {task.status === 'UPLOADED' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-white/20" />
                  )}
                  <span className={`text-sm ${task.status === 'UPLOADED' ? 'text-white line-through opacity-50' : 'text-white'}`}>
                    {task.title}
                  </span>
                </div>
                {task.status !== 'UPLOADED' ? (
                  <Button variant="ghost" size="sm" onClick={() => alert('This would open the document selector to link a file.')}>
                    <Upload className="w-4 h-4 mr-2" /> Upload
                  </Button>
                ) : (
                  <div className="flex items-center text-xs text-white/40">
                    <FileText className="w-3 h-3 mr-1" />
                    Document Linked
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
