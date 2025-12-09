'use client';

import { useState } from 'react';
import { captureTtwLead } from '@/app/actions/ttw';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function LeadCaptureForm({ shareToken }: { shareToken: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get('email') as string,
      name: formData.get('name') as string,
      interestAmount: Number(formData.get('amount')),
      message: formData.get('message') as string,
    };
    
    await captureTtwLead(shareToken, data);
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Card className="bg-green-500/10 border-green-500/20">
        <CardContent className="pt-6 text-center">
          <h3 className="text-xl font-bold text-green-400 mb-2">Interest Recorded</h3>
          <p className="text-green-200/70">Thank you for your interest. We will contact you when the offering goes live.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-neutral-900 border-white/10">
      <CardHeader>
        <CardTitle>Indicate Interest</CardTitle>
        <CardDescription>No obligation. Just let us know you're interested.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required placeholder="Your Name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
             <Label htmlFor="amount">Potential Investment ($)</Label>
             <Input id="amount" name="amount" type="number" min="100" placeholder="1000" />
          </div>
          <div className="space-y-2">
             <Label htmlFor="message">Message (Optional)</Label>
             <Textarea id="message" name="message" placeholder="Questions or comments..." />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Submitting...' : 'I\'m Interested'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
