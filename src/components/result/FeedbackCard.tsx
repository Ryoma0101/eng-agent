// src/components/result/FeedbackCard.tsx
import { Card } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

interface FeedbackCardProps {
  feedback: string;
}

export default function FeedbackCard({ feedback }: FeedbackCardProps) {
  return (
    <Card className="border-0 bg-white shadow-sm">
      <div className="p-6">
        <h2 className="flex items-center gap-2 text-2xl font-semibold text-slate-900">
          <MessageCircle className="h-5 w-5 text-slate-700" />
          <span>AI Feedback</span>
        </h2>
        <p className="mt-3 text-base whitespace-pre-wrap text-slate-700">{feedback}</p>
      </div>
    </Card>
  );
}
