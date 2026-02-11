import { Card } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import type { Submission } from '@/types';

interface ProgressChartProps {
  submissions: Submission[];
}

export default function ProgressChart({ submissions }: ProgressChartProps) {
  // 古い順に並び替え
  const sorted = [...submissions].sort(
    (a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
  );

  const maxScore = 100;

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
          <BarChart3 className="h-4 w-4 text-blue-600" />
        </div>
        <h3 className="font-semibold text-slate-900">スコア推移</h3>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-slate-500">まだ提出がありません</p>
      ) : (
        <div className="flex items-end gap-3">
          {sorted.map((sub) => {
            const height = (sub.scores.total / maxScore) * 100;
            const date = new Date(sub.submittedAt);
            const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;

            return (
              <div key={sub.submissionId} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs font-medium text-slate-700">{sub.scores.total}</span>
                <div className="relative w-full" style={{ height: '120px' }}>
                  <div
                    className="absolute bottom-0 w-full rounded-t-md bg-blue-500 transition-all hover:bg-blue-600"
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500">{dateStr}</span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
