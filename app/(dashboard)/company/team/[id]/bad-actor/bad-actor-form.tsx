'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertTriangle, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BAD_ACTOR_QUESTIONS } from '@/lib/validations/team';
import { submitBadActorResponses } from '@/app/actions/bad-actor';

interface BadActorFormProps {
  teamMember: {
    id: string;
    name: string;
    badActorStatus: string;
  };
}

export default function BadActorForm({ teamMember }: BadActorFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [explanations, setExplanations] = useState<Record<string, string>>({});
  const [attested, setAttested] = useState(false);
  
  const allAnswered = BAD_ACTOR_QUESTIONS.every(q => answers[q.id] !== undefined);
  const anyYes = Object.values(answers).some(val => val === true);
  const allExplanationsProvided = BAD_ACTOR_QUESTIONS.every(q => 
    answers[q.id] === true ? !!explanations[q.id] : true
  );

  const handleSubmit = async () => {
    if (!allAnswered || !attested || (anyYes && !allExplanationsProvided)) return;

    setIsSubmitting(true);
    
    const responses = Object.entries(answers).map(([qid, val]) => ({
      questionId: qid,
      response: val,
      explanation: explanations[qid],
    }));

    const result = await submitBadActorResponses({
      teamMemberId: teamMember.id,
      responses,
      attested,
    });

    if (result.error) {
      alert(result.error);
      setIsSubmitting(false);
      return;
    }

    router.push('/company/team');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-white">Bad Actor Questionnaire</h1>
          <p className="text-white/50">For {teamMember.name}</p>
        </div>
      </div>

      <Card className="bg-neutral-900 border-white/10">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-yellow-500/10">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <CardTitle>SEC Rule 506(d) Compliance</CardTitle>
              <CardDescription>
                We are required to determine if any "bad actor" events apply to your officers, directors, and 20%+ shareholders.
                Answering "Yes" does not automatically disqualify the company, but may require disclosure.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {BAD_ACTOR_QUESTIONS.map((q, index) => (
            <div key={q.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex gap-4">
                <span className="text-white/30 font-mono pt-1">0{index + 1}</span>
                <div className="flex-1 space-y-4">
                  <p className="text-white font-medium">{q.question}</p>
                  
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name={q.id}
                        className="w-4 h-4 accent-green-500"
                        checked={answers[q.id] === false}
                        onChange={() => setAnswers(prev => ({ ...prev, [q.id]: false }))}
                      />
                      <span className={answers[q.id] === false ? "text-white" : "text-white/50"}>No</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name={q.id}
                        className="w-4 h-4 accent-red-500"
                        checked={answers[q.id] === true}
                        onChange={() => setAnswers(prev => ({ ...prev, [q.id]: true }))}
                      />
                      <span className={answers[q.id] === true ? "text-white" : "text-white/50"}>Yes</span>
                    </label>
                  </div>

                  {answers[q.id] === true && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="overflow-hidden"
                    >
                      <Label className="mb-2 block">Please explain the circumstances:</Label>
                      <Textarea 
                        value={explanations[q.id] || ''}
                        onChange={(e) => setExplanations(prev => ({ ...prev, [q.id]: e.target.value }))}
                        placeholder="Provide details about the event, date, and outcome..."
                        className="bg-white/5 border-white/10 min-h-[100px]"
                      />
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Attestation */}
          <div className="pt-6 border-t border-white/10">
            <label className="flex items-start gap-3 cursor-pointer">
              <input 
                type="checkbox"
                checked={attested} 
                onChange={(e) => setAttested(e.target.checked)}
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500 mt-1"
              />
              <div className="space-y-1">
                <span className="text-white font-medium">I attest that the information provided is true and complete.</span>
                <p className="text-sm text-white/50">
                  I understand that false statements may result in a violation of federal securities laws.
                </p>
              </div>
            </label>
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleSubmit} 
              disabled={!allAnswered || !attested || (anyYes && !allExplanationsProvided) || isSubmitting}
              size="lg"
            >
              {isSubmitting ? 'Saving...' : 'Submit Questionnaire'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
