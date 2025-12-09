import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getCompanyForUser } from '@/lib/company';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, Edit, CheckCircle2 } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  title: string | null;
  ownershipPercentage: any;
}

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = await getCompanyForUser();
  if (!company) redirect('/company/setup');

  const teamMembers = (await prisma.teamMember.findMany({
    where: { companyId: company.id },
  })) as TeamMember[];

  const officers = teamMembers.filter(m => 
    m.role === 'OFFICER' || m.role === 'OFFICER_DIRECTOR' || m.role === 'ALL'
  );
  
  const directors = teamMembers.filter(m => 
    m.role === 'DIRECTOR' || m.role === 'OFFICER_DIRECTOR' || m.role === 'ALL'
  );

  const owners = teamMembers.filter(m => Number(m.ownershipPercentage || 0) >= 20);

  return (
    <div className="space-y-6">
       <Card className="bg-neutral-900 border-white/10">
         <CardHeader>
           <div className="flex justify-between items-start">
             <div>
               <CardTitle>Officers & Directors</CardTitle>
               <CardDescription>
                 The following individuals will be listed in your Form C.
               </CardDescription>
             </div>
             <Link href="/company/team">
               <Button variant="secondary" size="sm">
                 <Edit className="w-4 h-4 mr-2" />
                 Edit Roster
               </Button>
             </Link>
           </div>
         </CardHeader>
         <CardContent className="space-y-6">
           <div>
             <h3 className="text-sm font-medium text-white mb-3">Officers</h3>
             <div className="grid gap-3">
               {officers.length > 0 ? officers.map(m => (
                 <div key={m.id} className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/10">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                       <Users className="w-4 h-4 text-white/50" />
                     </div>
                     <div>
                       <p className="text-sm font-medium text-white">{m.name}</p>
                       <p className="text-xs text-white/50">{m.title}</p>
                     </div>
                   </div>
                   <CheckCircle2 className="w-4 h-4 text-green-500" />
                 </div>
               )) : (
                 <p className="text-sm text-white/40 italic">No officers found.</p>
               )}
             </div>
           </div>

           <div>
             <h3 className="text-sm font-medium text-white mb-3">Directors</h3>
             <div className="grid gap-3">
               {directors.length > 0 ? directors.map(m => (
                 <div key={m.id} className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/10">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                       <Users className="w-4 h-4 text-white/50" />
                     </div>
                     <div>
                       <p className="text-sm font-medium text-white">{m.name}</p>
                       <p className="text-xs text-white/50">{m.title}</p>
                     </div>
                   </div>
                   <CheckCircle2 className="w-4 h-4 text-green-500" />
                 </div>
               )) : (
                 <p className="text-sm text-white/40 italic">No directors found.</p>
               )}
             </div>
           </div>

            <div>
             <h3 className="text-sm font-medium text-white mb-3">20%+ Shareholders</h3>
             <div className="grid gap-3">
               {owners.length > 0 ? owners.map(m => (
                 <div key={m.id} className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/10">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                       <Users className="w-4 h-4 text-white/50" />
                     </div>
                     <div>
                       <p className="text-sm font-medium text-white">{m.name}</p>
                       <p className="text-xs text-white/50">{Number(m.ownershipPercentage)}% Ownership</p>
                     </div>
                   </div>
                   <CheckCircle2 className="w-4 h-4 text-green-500" />
                 </div>
               )) : (
                 <p className="text-sm text-white/40 italic">No 20%+ shareholders found.</p>
               )}
             </div>
           </div>
         </CardContent>
       </Card>
    </div>
  );
}
