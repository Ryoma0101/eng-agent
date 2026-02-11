import { Card } from '@/components/ui/card';
import type { Scores } from '@/types';

interface ScoreBreakdownProps {
  scores: Scores;
}

const scoreItems: { key: keyof Omit<Scores, 'total'>; label: string }[] = [
  { key: 'grammar', label: 'Grammar (G)' },
  { key: 'logic', label: 'Logic (L)' },
  { key: 'context', label: 'Context (C)' },
  { key: 'fluency', label: 'Fluency (F)' },
];

export default function ScoreBreakdown({ scores }: ScoreBreakdownProps) {
  return (
    <Card className="p-6">
      <h3 className="mb-4 font-semibold text-slate-900">スコア内訳</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {scoreItems.map(({ key, label }) => {
          const value = scores[key];
          const ratio = Math.min(Math.max(value, 0), 25) / 25;

          return (
            <div key={key} className="rounded-lg bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">{label}</span>
                <span className="text-xs text-slate-400">{Math.round(ratio * 100)}%</span>
              </div>
              <div className="mt-1 text-2xl font-bold text-slate-900">
                {value}
                <span className="ml-1 text-xs text-slate-400">/ 25</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{ width: `${ratio * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
