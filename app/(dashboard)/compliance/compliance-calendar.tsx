'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, AlertCircle, FileText, XCircle } from 'lucide-react';
import { createAnnualReport, terminateReporting } from '@/app/actions/compliance';
import { getDaysUntil } from '@/lib/compliance';

export default function ComplianceCalendar({ status }: { status: any }) {
  const [loading, setLoading] = useState(false);

  const daysUntil = getDaysUntil(new Date(status.nextDue));
  const isOverdue = daysUntil < 0;

  const handleFileAr = async () => {
    setLoading(true);
    await createAnnualReport(status.raiseId);
    setLoading(false);
  };

  const handleTerminate = async () => {
    if (confirm('Are you sure you want to terminate reporting obligations? Ensure you meet the criteria (e.g. <300 shareholders).')) {
      setLoading(true);
      await terminateReporting(status.raiseId, 'Met termination criteria');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Compliance Calendar</h1>
        <p className="text-white/50">Manage your ongoing Reg CF reporting obligations.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className={`border-white/10 ${isOverdue ? 'bg-red-900/10 border-red-500/50' : 'bg-neutral-900'}`}>
          <CardHeader>
            <CardTitle>Next Annual Report</CardTitle>
            <CardDescription>Form C-AR Due Date</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center py-6">
              <div className="text-4xl font-bold text-white mb-2">{Math.abs(daysUntil)} Days</div>
              <p className={`text-sm ${isOverdue ? 'text-red-400' : 'text-white/50'}`}>
                {isOverdue ? 'OVERDUE' : 'Remaining'} until {new Date(status.nextDue).toLocaleDateString()}
              </p>
            </div>
            
            <Button className="w-full" onClick={handleFileAr} disabled={loading}>
              <FileText className="w-4 h-4 mr-2" />
              File Form C-AR
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-white/10">
          <CardHeader>
            <CardTitle>Obligation Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center p-3 rounded bg-white/5">
              <span className="text-white/70">Reporting Status</span>
              <Badge variant="success">Active</Badge>
            </div>
            
            <div className="space-y-2">
              <p className="text-xs text-white/40">
                You must file an annual report within 120 days of the end of your fiscal year. 
                You may terminate reporting if you have filed at least one annual report and meet other criteria.
              </p>
            </div>

            <Button variant="secondary" className="w-full text-red-400 hover:text-red-300 hover:bg-red-900/20" onClick={handleTerminate} disabled={loading}>
              <XCircle className="w-4 h-4 mr-2" />
              Terminate Reporting
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
