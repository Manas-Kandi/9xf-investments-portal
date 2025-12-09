'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';

export default function AuditTable({ logs }: { logs: any[] }) {
  const handleExport = () => {
    const csv = [
      ['Timestamp', 'User', 'Action', 'Entity', 'Details', 'IP Address'],
      ...logs.map(log => [
        new Date(log.createdAt).toISOString(),
        log.user?.email || 'System',
        log.action,
        log.entity,
        JSON.stringify(log.metadata || {}).replace(/,/g, ';'), // Simple escape
        log.ipAddress
      ])
    ].map(e => e.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString()}.csv`;
    a.click();
  };

  return (
    <Card className="bg-neutral-900 border-white/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>System Audit Logs</CardTitle>
        <Button variant="secondary" size="sm" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-white/50 border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">IP</th>
              </tr>
            </thead>
            <tbody className="text-white/80">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-white/40">No audit logs found.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="py-3 px-4">{log.user?.name || log.user?.email || 'System'}</td>
                    <td className="py-3 px-4 font-mono text-xs">{log.action}</td>
                    <td className="py-3 px-4">{log.entity}</td>
                    <td className="py-3 px-4 font-mono text-xs">{log.ipAddress}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
