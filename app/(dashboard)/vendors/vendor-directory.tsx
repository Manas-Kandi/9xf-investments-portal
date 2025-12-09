'use client';

import { useState } from 'react';
import { getVendors, engageVendor } from '@/app/actions/vendors';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, DollarSign, Briefcase } from 'lucide-react';

export default function VendorDirectory({ initialVendors, raiseId }: { initialVendors: any[], raiseId: string }) {
  const [vendors, setVendors] = useState(initialVendors);
  const [filter, setFilter] = useState('ALL');
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFilter = async (type: string) => {
    setFilter(type);
    const data = await getVendors(type);
    setVendors(data);
  };

  const handleEngage = async () => {
    if (!selectedVendor) return;
    setLoading(true);
    await engageVendor(raiseId, selectedVendor.id, message);
    setLoading(false);
    setSelectedVendor(null);
    setMessage('');
    alert('Request sent successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Vendor Marketplace</h1>
          <p className="text-white/50">Find verified attorneys, auditors, and broker-dealers.</p>
        </div>
        <select 
          value={filter} 
          onChange={(e) => handleFilter(e.target.value)}
          className="h-10 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <option value="ALL">All Types</option>
          <option value="ATTORNEY">Attorneys</option>
          <option value="AUDITOR">Auditors</option>
          <option value="BROKER_DEALER">Broker-Dealers</option>
          <option value="MARKETING_AGENCY">Marketing</option>
          <option value="TRANSFER_AGENT">Transfer Agents</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor: any) => (
          <Card key={vendor.id} className="bg-neutral-900 border-white/10 flex flex-col hover:border-white/20 transition-colors">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="default" className="border-white/20">{vendor.type.replace('_', ' ')}</Badge>
              </div>
              <CardTitle>{vendor.name}</CardTitle>
              <CardDescription className="line-clamp-2 min-h-[40px]">{vendor.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 flex-1">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <MapPin className="w-4 h-4 shrink-0" /> {vendor.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <DollarSign className="w-4 h-4 shrink-0" /> {vendor.fees}
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Briefcase className="w-4 h-4 shrink-0" /> {vendor.specialty}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="secondary" onClick={() => setSelectedVendor(vendor)}>Request Quote</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-xl p-6 w-full max-w-md relative animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-white mb-2">Contact {selectedVendor.name}</h2>
            <p className="text-sm text-white/50 mb-4">Send a request for a quote or initial consultation.</p>
            <div className="space-y-4">
              <Textarea 
                placeholder="Describe your raise details (Amount, Regulation, Timeline)..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[120px]"
              />
              <div className="flex gap-3 justify-end">
                <Button variant="ghost" onClick={() => setSelectedVendor(null)}>Cancel</Button>
                <Button onClick={handleEngage} disabled={loading}>
                  {loading ? 'Sending...' : 'Send Request'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
