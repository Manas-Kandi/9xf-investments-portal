'use client';

import { useState } from 'react';
import { addSecComment, updateSecResponse, createAmendment, markQualified, resolveComment } from '@/app/actions/sec-review';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, FileText } from 'lucide-react';

export default function CommentTracker({ status, raiseId }: { status: any, raiseId: string }) {
  const [newComment, setNewComment] = useState('');
  const [letterDate, setLetterDate] = useState('');
  const [responseDrafts, setResponseDrafts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleAddComment = async () => {
    if (!newComment) return;
    setLoading(true);
    await addSecComment(status.mainFiling.id, newComment, letterDate || new Date().toISOString());
    setNewComment('');
    setLoading(false);
  };

  const handleSaveResponse = async (id: string) => {
    setLoading(true);
    await updateSecResponse(id, responseDrafts[id]);
    setLoading(false);
  };

  const handleResolve = async (id: string) => {
    if (confirm('Mark this comment as resolved?')) {
      await resolveComment(id);
    }
  };

  const handleFileAmendment = async () => {
    if (confirm('File Amendment (Form 1-A/A)? This indicates you have addressed comments.')) {
      setLoading(true);
      await createAmendment(raiseId);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">SEC Review Tracker</h1>
          <p className="text-white/50">Manage comments and responses for your Form 1-A.</p>
        </div>
        <div className="flex gap-3">
          <Badge variant="default" className="text-lg px-4 py-1">{status.status.replace('_', ' ')}</Badge>
          {status.status !== 'QUALIFIED' && (
             <Button variant="secondary" onClick={() => markQualified(status.mainFiling.id, new Date().toISOString())}>
               Mark Qualified
             </Button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-neutral-900 border-white/10">
            <CardHeader>
              <CardTitle>Add Comment Item</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea 
                  placeholder="Paste comment text from SEC letter..." 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="flex gap-4">
                  <Input 
                    type="date" 
                    value={letterDate} 
                    onChange={(e) => setLetterDate(e.target.value)}
                    className="w-40"
                  />
                  <Button onClick={handleAddComment} disabled={loading || !newComment}>Add Item</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {status.comments.map((comment: any) => (
              <Card key={comment.id} className="bg-neutral-900 border-white/10">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <Badge variant={comment.status === 'RESOLVED' ? 'success' : 'default'}>{comment.status}</Badge>
                    <span className="text-xs text-white/40">{new Date(comment.letterDate).toLocaleDateString()}</span>
                  </div>
                  <div className="p-4 bg-white/5 rounded border border-white/10">
                    <p className="text-sm text-white/80 whitespace-pre-wrap">{comment.commentText}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs text-white/50">Draft Response</label>
                    <Textarea 
                      value={responseDrafts[comment.id] ?? comment.responseDraft ?? ''}
                      onChange={(e) => setResponseDrafts({...responseDrafts, [comment.id]: e.target.value})}
                      placeholder="Draft your response here..."
                      className="min-h-[100px]"
                    />
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleSaveResponse(comment.id)} disabled={loading}>
                        Save Draft
                      </Button>
                      {comment.status !== 'RESOLVED' && (
                        <Button size="sm" variant="secondary" onClick={() => handleResolve(comment.id)}>
                          <CheckCircle className="w-4 h-4 mr-2" /> Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-neutral-900 border-white/10">
            <CardHeader>
              <CardTitle>Review Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative border-l border-white/10 ml-2 space-y-6 pl-6">
                <div className="relative">
                  <div className="absolute -left-[29px] w-4 h-4 rounded-full bg-blue-500" />
                  <p className="text-sm font-medium text-white">Filed Form 1-A</p>
                  <p className="text-xs text-white/40">{new Date(status.mainFiling.createdAt).toLocaleDateString()}</p>
                </div>
                {status.comments.length > 0 && (
                  <div className="relative">
                    <div className="absolute -left-[29px] w-4 h-4 rounded-full bg-yellow-500" />
                    <p className="text-sm font-medium text-white">Comments Received</p>
                    <p className="text-xs text-white/40">{status.comments.length} Items</p>
                  </div>
                )}
                {status.amendments.map((a: any) => (
                  <div key={a.id} className="relative">
                    <div className="absolute -left-[29px] w-4 h-4 rounded-full bg-purple-500" />
                    <p className="text-sm font-medium text-white">Filed Amendment</p>
                    <p className="text-xs text-white/40">{new Date(a.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
                {status.status === 'QUALIFIED' && (
                  <div className="relative">
                    <div className="absolute -left-[29px] w-4 h-4 rounded-full bg-green-500" />
                    <p className="text-sm font-medium text-white">Qualified</p>
                    <p className="text-xs text-white/40">{new Date(status.mainFiling.qualificationDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <Button className="w-full" onClick={handleFileAmendment} disabled={loading || status.status === 'QUALIFIED'}>
                  <FileText className="w-4 h-4 mr-2" /> File Amendment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
