import { Card } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

interface ScoreSummaryProps {
  total: number;
  scoredAt: string;
}

export default function ScoreSummary({ total, scoredAt }: ScoreSummaryProps) {
  return (
    <Card className="p-6">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
            <Trophy className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">総合スコア</h2>
            <p className="text-sm text-slate-500">Grammar / Logic / Context / Fluency の総合評価</p>
          </div>
        </div>

        <div className="text-center">
          <span className="text-5xl font-bold text-blue-600">{total}</span>
          <span className="text-2xl text-slate-400"> / 100</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 border-t border-slate-100 pt-4 text-xs text-slate-400">
        <span>
          採点日時:{' '}
          <span className="font-mono">{new Date(scoredAt).toLocaleDateString('ja-JP')}</span>
        </span>
      </div>
    </Card>
  );
}
