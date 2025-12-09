'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, DollarSign, Scale, Zap, FileText, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RAISE_PATHWAYS } from '@/lib/validations/raise';
import { createRaise } from '@/app/actions/raise';

export default function PathwayWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [targetAmount, setTargetAmount] = useState<string>(''); // Input handling
  const [hasAudit, setHasAudit] = useState<boolean | null>(null);
  const [timeline, setTimeline] = useState<'ASAP' | 'FLEXIBLE' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const amount = parseInt(targetAmount.replace(/,/g, '') || '0');

  const getRecommendation = () => {
    if (amount > 5000000) return 'REG_A_TIER_2';
    if (timeline === 'ASAP' && amount <= 5000000) return 'REG_CF';
    if (!hasAudit && amount <= 1235000) return 'REG_CF';
    return 'REG_CF';
  };

  const recommendedId = getRecommendation();

  const handleCreate = async (regulation: 'REG_CF' | 'REG_A_TIER_2') => {
    setIsSubmitting(true);
    const result = await createRaise({
      regulation: regulation as any,
      targetAmount: amount,
    });
    
    if (result.error) {
      alert(result.error);
      setIsSubmitting(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Fundraising Goal</h1>
            <p className="text-white/50">Let's find the right regulatory pathway for you.</p>
          </div>

          <Card className="bg-neutral-900 border-white/10 max-w-lg mx-auto">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label>Target Raise Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <Input 
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    className="pl-9 text-lg"
                    placeholder="1,000,000"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Do you have 2 years of audited financials?</Label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setHasAudit(true)}
                    className={`p-4 rounded-lg border text-sm font-medium transition-all ${
                      hasAudit === true 
                        ? 'bg-white text-neutral-900 border-white' 
                        : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setHasAudit(false)}
                    className={`p-4 rounded-lg border text-sm font-medium transition-all ${
                      hasAudit === false 
                        ? 'bg-white text-neutral-900 border-white' 
                        : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <Label>What is your launch timeline?</Label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setTimeline('ASAP')}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      timeline === 'ASAP' 
                        ? 'bg-white text-neutral-900 border-white' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-semibold mb-1">ASAP</div>
                    <div className={`text-xs ${timeline === 'ASAP' ? 'text-neutral-600' : 'text-white/40'}`}>
                      I want to launch in 4-6 weeks
                    </div>
                  </button>
                  <button
                    onClick={() => setTimeline('FLEXIBLE')}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      timeline === 'FLEXIBLE' 
                        ? 'bg-white text-neutral-900 border-white' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-semibold mb-1">Flexible</div>
                    <div className={`text-xs ${timeline === 'FLEXIBLE' ? 'text-neutral-600' : 'text-white/40'}`}>
                      I can wait 4-6 months
                    </div>
                  </button>
                </div>
              </div>

              <Button 
                onClick={() => setStep(2)} 
                disabled={!amount || hasAudit === null || !timeline}
                className="w-full mt-4"
                size="lg"
              >
                Get Recommendation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Recommended Pathway</h1>
            <p className="text-white/50">Based on your goals and readiness</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {RAISE_PATHWAYS.map((path) => {
              const isRecommended = path.id === recommendedId;
              return (
                <Card 
                  key={path.id}
                  className={`relative border transition-all ${
                    isRecommended 
                      ? 'bg-neutral-900 border-green-500 shadow-[0_0_30px_-10px_rgba(34,197,94,0.3)]' 
                      : 'bg-neutral-900/50 border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  {isRecommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-neutral-950 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      RECOMMENDED
                    </div>
                  )}
                  
                  <CardHeader>
                    <CardTitle className="text-xl text-white">{path.name}</CardTitle>
                    <CardDescription>{path.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-white/40 mb-1">Raise Limit</p>
                        <p className="text-white font-medium">{path.limit}</p>
                      </div>
                      <div>
                        <p className="text-white/40 mb-1">Time to Launch</p>
                        <p className="text-white font-medium">{path.time}</p>
                      </div>
                      <div>
                        <p className="text-white/40 mb-1">Est. Cost</p>
                        <p className="text-white font-medium">{path.cost}</p>
                      </div>
                      <div>
                        <p className="text-white/40 mb-1">Audit</p>
                        <p className="text-white font-medium">{path.audit}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Key Benefits</p>
                      <ul className="space-y-2">
                        {path.pros.map(pro => (
                          <li key={pro} className="flex items-center gap-2 text-sm text-white/70">
                            <Check className="w-4 h-4 text-green-500" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button 
                      onClick={() => handleCreate(path.id as any)}
                      disabled={isSubmitting}
                      className="w-full"
                      variant={isRecommended ? 'default' : 'secondary'}
                    >
                      {isSubmitting ? 'Initializing...' : `Select ${path.name}`}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="text-center">
            <Button variant="link" onClick={() => setStep(1)} className="text-white/40">
              Back to Questionnaire
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
