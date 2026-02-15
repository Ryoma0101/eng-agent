'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import type { Submission } from '@/types';

interface SubmissionWithTitle extends Submission {
  questTitle?: string | null;
}

interface SubmissionListProps {
  submissions: SubmissionWithTitle[];
  demoMode?: boolean;
}

const INITIAL_DISPLAY_COUNT = 5;

function getDifficultyFromScore(total: number): 'easy' | 'medium' | 'hard' {
  if (total >= 90) return 'hard';
  if (total >= 80) return 'medium';
  return 'easy';
}

export default function SubmissionList({ submissions, demoMode = false }: SubmissionListProps) {
  const [showAll, setShowAll] = useState(false);
  const resultHref = demoMode ? '/demo/result' : '/result';

  if (submissions.length === 0) {
    return <Card className="p-6 text-center text-sm text-slate-500">まだ提出がありません</Card>;
  }

  // 新しい順
  const sorted = [...submissions].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );

  const displayedSubmissions = showAll ? sorted : sorted.slice(0, INITIAL_DISPLAY_COUNT);
  const hasMore = sorted.length > INITIAL_DISPLAY_COUNT;

  return (
    <Card>
      <div className="flex items-center gap-2 p-4 pb-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
          <Clock className="h-4 w-4 text-slate-600" />
        </div>
        <h3 className="font-semibold text-slate-900">過去の提出</h3>
      </div>

      <div className="divide-y divide-slate-100">
        {displayedSubmissions.map((sub) => {
          const date = new Date(sub.submittedAt);
          const dateStr = date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          });
          const title = sub.questTitle || sub.questId;
          const difficulty = getDifficultyFromScore(sub.scores.total);

          return (
            <div key={sub.submissionId} className="flex items-center justify-between px-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-slate-700">{title}</div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs text-slate-400">{dateStr}</span>
                  <Badge variant="outline" className="text-xs">
                    {difficulty}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-lg font-bold text-blue-600">{sub.scores.total}pt</div>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`${resultHref}?submissionId=${sub.submissionId}`}>詳細</Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {hasMore && (
        <div className="border-t border-slate-100 p-3 text-center">
          <Button variant="ghost" size="sm" onClick={() => setShowAll(!showAll)}>
            {showAll ? '折りたたむ' : `すべて表示（${sorted.length}件）`}
          </Button>
        </div>
      )}
    </Card>
  );
}
