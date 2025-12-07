import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, FileText, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'there';

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {userName}
        </h1>
        <p className="text-white/60">
          Here&apos;s an overview of your fundraising journey.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-white/5">
                <Building2 className="h-5 w-5 text-white/70" />
              </div>
              <Badge variant="draft">Not Started</Badge>
            </div>
            <CardTitle className="mt-4">Company Profile</CardTitle>
            <CardDescription>
              Set up your company details, team roster, and cap table.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/company/setup">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-white/5">
                <FileText className="h-5 w-5 text-white/70" />
              </div>
              <Badge variant="draft">Locked</Badge>
            </div>
            <CardTitle className="mt-4">EDGAR Access</CardTitle>
            <CardDescription>
              Get your SEC filing credentials to submit forms.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" disabled className="w-full">
              Complete Company First
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-white/5">
                <Users className="h-5 w-5 text-white/70" />
              </div>
              <Badge variant="draft">Locked</Badge>
            </div>
            <CardTitle className="mt-4">Start a Raise</CardTitle>
            <CardDescription>
              Choose Reg CF or Reg A+ and begin your fundraise.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" disabled className="w-full">
              Complete Prerequisites
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Progress Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Your Journey</CardTitle>
          <CardDescription>
            Complete each step to unlock the next phase of your fundraise.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 overflow-x-auto pb-4">
            {[
              { label: 'Company Setup', status: 'current' },
              { label: 'Team & Cap Table', status: 'locked' },
              { label: 'EDGAR Access', status: 'locked' },
              { label: 'Pathway Selection', status: 'locked' },
              { label: 'Filing', status: 'locked' },
              { label: 'Campaign', status: 'locked' },
            ].map((step, index) => (
              <div key={step.label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.status === 'current'
                        ? 'bg-white text-neutral-900'
                        : step.status === 'completed'
                        ? 'bg-green-500 text-white'
                        : 'bg-white/10 text-white/40'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className={`mt-2 text-xs whitespace-nowrap ${
                    step.status === 'current' ? 'text-white' : 'text-white/40'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < 5 && (
                  <div className="w-12 h-px bg-white/10 mx-2" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-white/70">
              <div className="w-5 h-5 rounded border border-white/20 flex items-center justify-center">
                <span className="text-xs">1</span>
              </div>
              <span>Create your company profile with legal details</span>
            </li>
            <li className="flex items-center gap-3 text-white/40">
              <div className="w-5 h-5 rounded border border-white/10 flex items-center justify-center">
                <span className="text-xs">2</span>
              </div>
              <span>Add team members and complete bad actor checks</span>
            </li>
            <li className="flex items-center gap-3 text-white/40">
              <div className="w-5 h-5 rounded border border-white/10 flex items-center justify-center">
                <span className="text-xs">3</span>
              </div>
              <span>Upload or create your cap table</span>
            </li>
            <li className="flex items-center gap-3 text-white/40">
              <div className="w-5 h-5 rounded border border-white/10 flex items-center justify-center">
                <span className="text-xs">4</span>
              </div>
              <span>Complete EDGAR access setup</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
