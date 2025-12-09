'use client';

import { useState } from 'react';
import { createInvestor, createInvestment, signAgreement } from '@/app/actions/invest';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CheckCircle, Banknote } from 'lucide-react';

export default function InvestmentWizard({ raise, slug }: { raise: any, slug: string }) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(Number(raise.minimumInvestment || 100));
  const [investorData, setInvestorData] = useState({ name: '', email: '', phone: '' });
  const [investmentId, setInvestmentId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateInvestor = async () => {
    setLoading(true);
    const investor = await createInvestor(investorData);
    if (investor) {
      const inv = await createInvestment({ 
        raiseId: raise.id, 
        investorId: investor.id, 
        amount: Number(amount) 
      });
      if (inv.success) {
        setInvestmentId(inv.investmentId!);
        setStep(3);
      }
    }
    setLoading(false);
  };

  const handleSign = async () => {
    setLoading(true);
    await signAgreement(investmentId);
    setLoading(false);
    setStep(5);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      {step === 1 && (
        <Card className="bg-neutral-900 border-white/10">
          <CardHeader><CardTitle>Investment Amount</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold text-center text-white">${amount}</div>
            <Input 
              type="range" 
              min={Number(raise.minimumInvestment || 100)} 
              max={Number(raise.maximumAmount || 100000)} 
              step={100}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
            <div className="flex justify-between text-xs text-white/40">
              <span>Min: ${Number(raise.minimumInvestment || 100)}</span>
              <span>Max: ${Number(raise.maximumAmount || 100000)}</span>
            </div>
            <Button className="w-full" onClick={() => setStep(2)}>Continue</Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="bg-neutral-900 border-white/10">
          <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={investorData.name} onChange={(e) => setInvestorData({...investorData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={investorData.email} onChange={(e) => setInvestorData({...investorData, email: e.target.value})} />
            </div>
            <Button className="w-full" onClick={handleCreateInvestor} disabled={loading}>
              {loading ? 'Creating Account...' : 'Continue'}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card className="bg-neutral-900 border-white/10">
          <CardHeader><CardTitle>Payment Method</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Button variant="secondary" className="w-full h-16" onClick={() => setStep(4)}>
              <Banknote className="w-6 h-6 mr-3" /> Connect Bank Account (Plaid)
            </Button>
            <p className="text-center text-xs text-white/40">Mock: Click to simulate connection.</p>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card className="bg-neutral-900 border-white/10">
          <CardHeader><CardTitle>Review & Sign</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white/5 p-4 rounded text-sm space-y-2">
              <div className="flex justify-between text-white"><span>Investment:</span><span>${amount}</span></div>
              <div className="flex justify-between text-white"><span>Investor:</span><span>{investorData.name}</span></div>
            </div>
            <div className="h-40 bg-white p-4 text-black text-xs overflow-y-auto font-mono rounded">
              SUBSCRIPTION AGREEMENT
              <br/><br/>
              This Subscription Agreement (the "Agreement") is entered into...
              <br/><br/>
              (Mock legal text for demonstration purposes)
            </div>
            <Button className="w-full" onClick={handleSign} disabled={loading}>
              {loading ? 'Signing...' : 'Sign Agreement'}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 5 && (
        <Card className="bg-green-500/10 border-green-500/20 text-center py-12">
          <CardContent>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">Investment Confirmed!</h2>
            <p className="text-white/60">Thank you for investing in {raise.company.legalName}. You will receive a confirmation email shortly.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
