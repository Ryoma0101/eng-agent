import { Card } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

interface FeedbackCardProps {
  feedback: string;
}

export default function FeedbackCard({ feedback }: FeedbackCardProps) {
  return (
    <Card className="p-6">
      <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-900">
        <MessageCircle className="h-5 w-5 text-slate-700" />
        AI Feedback
      </h3>
      <p className="leading-relaxed text-slate-700">{feedback}</p>
    </Card>
  );
}
