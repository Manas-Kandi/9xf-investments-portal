'use client';

import { createMockInvestment } from '@/app/actions/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DollarSign, Users, Calendar, TrendingUp, PlusCircle } from 'lucide-react';
import { useState } from 'react';

export default function DashboardClient({ stats, raiseId }: { stats: any, raiseId: string }) {
  const [loading, setLoading] = useState(false);

  const handleSimulate = async () => {
    setLoading(true);
    await createMockInvestment(raiseId);
    setLoading(false);
  };

  const statusColors = {
    DRAFT: 'default',
    FILED: 'info',
    LIVE: 'success',
    CLOSED: 'secondary',
    CANCELLED: 'error',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Campaign Dashboard</h1>
          <p className="text-white/50">Real-time overview of your fundraising progress.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={statusColors[stats.status as keyof typeof statusColors] as any || 'default'} className="text-sm px-3 py-1">
            {stats.status}
          </Badge>
          <Button variant="secondary" size="sm" onClick={handleSimulate} disabled={loading}>
            <PlusCircle className="w-4 h-4 mr-2" />
            {loading ? 'Simulating...' : 'Simulate Investment'}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-neutral-900 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/50">Amount Raised</CardTitle>
            <DollarSign className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${stats.amountRaised.toLocaleString()}</div>
            <p className="text-xs text-white/50">{stats.progress.toFixed(1)}% of Target</p>
          </CardContent>
        </Card>
        
        <Card className="bg-neutral-900 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/50">Investors</CardTitle>
            <Users className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.investorCount}</div>
            <p className="text-xs text-white/50">Total Commitments</p>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/50">Avg. Investment</CardTitle>
            <TrendingUp className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${Math.round(stats.averageInvestment).toLocaleString()}</div>
            <p className="text-xs text-white/50">Per Investor</p>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/50">Time Remaining</CardTitle>
            <Calendar className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.daysLeft} Days</div>
            <p className="text-xs text-white/50">Until Closing</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Section */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="bg-neutral-900 border-white/10">
          <CardHeader>
            <CardTitle>Funding Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Progress to Minimum (${stats.minimumAmount.toLocaleString()})</span>
                <span className="text-white font-medium">{stats.minProgress.toFixed(1)}%</span>
              </div>
              <Progress value={Math.min(stats.minProgress, 100)} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Progress to Target (${stats.targetAmount.toLocaleString()})</span>
                <span className="text-white font-medium">{stats.progress.toFixed(1)}%</span>
              </div>
              <Progress value={Math.min(stats.progress, 100)} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-neutral-900 border-white/10">
          <CardHeader>
            <CardTitle>Recent Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.investments.length === 0 ? (
                <p className="text-sm text-white/40 text-center py-4">No investments yet.</p>
              ) : (
                stats.investments.map((inv: any) => (
                  <div key={inv.id} className="flex items-center justify-between text-sm p-2 rounded hover:bg-white/5">
                    <div className="flex flex-col">
                      <span className="font-medium text-white">{inv.investorName}</span>
                      <span className="text-xs text-white/40">{new Date(inv.investedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="font-mono text-green-400">
                      +${Number(inv.amount).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
