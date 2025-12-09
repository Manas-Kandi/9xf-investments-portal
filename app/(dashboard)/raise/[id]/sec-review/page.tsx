import { redirect } from 'next/navigation';
import { getSecReviewStatus } from '@/app/actions/sec-review';
import CommentTracker from './comment-tracker';

export default async function SecReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const status = await getSecReviewStatus(id);

  if (!status) {
    redirect('/dashboard');
  }

  if (status.status === 'NOT_FILED') {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Not Filed</h1>
        <p className="text-white/50">Please file your Form 1-A to start the SEC review process.</p>
      </div>
    );
  }

  return <CommentTracker status={status} raiseId={id} />;
}
