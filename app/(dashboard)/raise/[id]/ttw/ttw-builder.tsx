'use client';

import { useState } from 'react';
import { updateTtwCampaign, toggleTtwStatus, convertLeadsToInvestors } from '@/app/actions/ttw';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, Users, Save, Globe, ArrowRightLeft } from 'lucide-react';
import Link from 'next/link';

export default function TtwBuilder({ campaign, raiseId, leads }: { campaign: any, raiseId: string, leads: any[] }) {
  const [formData, setFormData] = useState({
    title: campaign.title,
    description: campaign.description || '',
    minInterest: campaign.minInterest || 100,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await updateTtwCampaign(raiseId, formData);
    setIsSaving(false);
  };

  const handleStatusChange = async (status: 'DRAFT' | 'ACTIVE') => {
    if (confirm(`Change status to ${status}?`)) {
       await toggleTtwStatus(raiseId, status);
    }
  };

  const handleConvert = async () => {
    if (confirm('Convert leads to pending investments? This allows you to track them in the main dashboard.')) {
      const res = await convertLeadsToInvestors(raiseId);
      if (res.success) alert(`Converted ${res.count} leads.`);
      else alert('Failed to convert leads.');
    }
  };

  // Safe window usage
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/ttw/${campaign.shareToken}` : '';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white">Testing the Waters</h1>
          <p className="text-white/50">Gauge investor interest before filing Form C.</p>
        </div>
        <div className="flex gap-3">
          {campaign.status === 'DRAFT' ? (
             <Button onClick={() => handleStatusChange('ACTIVE')} className="bg-green-600 hover:bg-green-700">
               <Globe className="w-4 h-4 mr-2" /> Publish Campaign
             </Button>
          ) : (
             <Button variant="secondary" onClick={() => handleStatusChange('DRAFT')}>
               Unpublish
             </Button>
          )}
          <Link href={`/ttw/${campaign.shareToken}`} target="_blank">
            <Button variant="secondary" className="border border-white/10">
              <ExternalLink className="w-4 h-4 mr-2" /> View Live
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Editor */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-neutral-900 border-white/10">
            <CardHeader>
              <CardTitle>Campaign Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Campaign Headline</Label>
                <Input 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label>Pitch Description</Label>
                <Textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="min-h-[200px]"
                />
                <p className="text-xs text-white/40">Markdown is supported.</p>
              </div>
              <div className="space-y-2">
                <Label>Minimum Interest Indication ($)</Label>
                <Input 
                  type="number"
                  value={formData.minInterest} 
                  onChange={(e) => setFormData({...formData, minInterest: Number(e.target.value)})} 
                />
              </div>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
           <Card className="bg-neutral-900 border-white/10">
             <CardHeader>
               <CardTitle>Campaign Status</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="flex items-center justify-between">
                 <span className="text-sm text-white/70">Status</span>
                 <Badge variant={campaign.status === 'ACTIVE' ? 'success' : 'default'}>
                   {campaign.status}
                 </Badge>
               </div>
               
               {campaign.status === 'ACTIVE' && (
                 <div className="p-3 bg-white/5 rounded border border-white/10 space-y-2">
                   <Label className="text-xs">Share Link</Label>
                   <div className="flex gap-2">
                     <Input readOnly value={shareUrl} className="h-8 text-xs font-mono" />
                     <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => navigator.clipboard.writeText(shareUrl)}>
                       <Copy className="w-3 h-3" />
                     </Button>
                   </div>
                 </div>
               )}
             </CardContent>
           </Card>

           <Card className="bg-neutral-900 border-white/10">
             <CardHeader>
               <div className="flex items-center justify-between">
                 <CardTitle>Leads Collected</CardTitle>
                 <Badge variant="default">{leads.length}</Badge>
               </div>
             </CardHeader>
             <CardContent>
               {leads.length === 0 ? (
                 <p className="text-sm text-white/40 text-center py-4">No leads yet.</p>
               ) : (
                 <div className="space-y-3">
                   {leads.map((lead: any) => (
                     <div key={lead.id} className="p-2 bg-white/5 rounded text-sm">
                       <div className="font-medium text-white">{lead.email}</div>
                       <div className="text-white/50">${Number(lead.interestAmount).toLocaleString()} interest</div>
                     </div>
                   ))}
                   <Button variant="secondary" className="border border-white/10 w-full mt-2" size="sm">Export CSV</Button>
                   <Button variant="secondary" className="border border-white/10 w-full mt-2" size="sm" onClick={handleConvert}>
                     <ArrowRightLeft className="w-4 h-4 mr-2" /> Convert to Investors
                   </Button>
                 </div>
               )}
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
