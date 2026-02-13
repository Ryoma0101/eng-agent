import Link from 'next/link';
import { Card } from '@/components/ui/card';
import type { Submission } from '@/types';

interface RecentSubmissionsProps {
  submissions: Submission[];
}

export default function RecentSubmissions({ submissions }: RecentSubmissionsProps) {
  if (submissions.length === 0) {
    return <Card className="p-6 text-center text-sm text-slate-500">まだ提出がありません</Card>;
  }

  return (
    <Card>
      <div className="p-4 pb-2">
        <h3 className="font-semibold text-slate-900">最近の提出</h3>
      </div>
      <div className="divide-y divide-slate-100">
        {submissions.map((sub) => {
          const date = new Date(sub.submittedAt);
          const dateStr = date.toLocaleDateString('ja-JP', {
            month: 'short',
            day: 'numeric',
          });

          return (
            <Link
              key={sub.submissionId}
              href={`/result?submissionId=${sub.submissionId}`}
              className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-slate-50"
            >
              <div>
                <div className="text-sm font-medium text-slate-700">
                  {sub.questId.split('_')[0]}
                </div>
                <div className="text-xs text-slate-400">{dateStr}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">{sub.scores.total}pt</div>
                <div className="text-xs text-slate-400">
                  G:{sub.scores.grammar} L:{sub.scores.logic} C:{sub.scores.context} F:
                  {sub.scores.fluency}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
