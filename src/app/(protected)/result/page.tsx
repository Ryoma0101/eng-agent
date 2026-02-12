'use client';

import { Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/shared/Header';
import ScoreSummary from '@/components/result/ScoreSummary';
import ScoreBreakdown from '@/components/result/ScoreBreakdown';
import FeedbackCard from '@/components/result/FeedbackCard';

import { Button } from '@/components/ui/button';
import { ArrowRight, Home } from 'lucide-react';
import { mockSubmissionHistory } from '@/lib/mock-data';
import type { Submission } from '@/types';

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('submissionId');

  // TODO: API連携 GET /api/submissions/${submissionId}
  // デモ用にモックデータから該当のsubmissionを検索
  const result = useMemo<Submission | null>(() => {
    if (!submissionId) return null;
    return mockSubmissionHistory.find((s) => s.submissionId === submissionId) ?? null;
  }, [submissionId]);

  if (!result) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="mx-auto max-w-3xl space-y-4 px-4 py-6">
          <h1 className="text-3xl font-bold text-slate-900">採点結果</h1>
          <p className="text-red-600">
            提出が見つかりません。ダッシュボードからクエストに挑戦してください。
          </p>
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            ホームへ戻る
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="mb-6 text-3xl font-bold text-slate-900">採点完了！</h1>

        <div className="space-y-6">
          {/* 総合スコア */}
          <ScoreSummary
            total={result.scores.total}
            scoredAt={result.scoredAt}
            processingTime={result.processingTime}
          />

          {/* スコア内訳 */}
          <ScoreBreakdown scores={result.scores} />

          {/* AI Feedback */}
          <FeedbackCard feedback={result.feedback} />

          {/* ナビゲーション */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="gap-2" onClick={() => router.push('/ranking')}>
                <ArrowRight className="h-4 w-4" />
                ランキングを見る
              </Button>
              <Button className="gap-2" onClick={() => router.push('/dashboard')}>
                <Home className="h-4 w-4" />
                ホームへ
              </Button>
            </div>
            <p className="text-sm text-slate-400">
              さらにスコアを伸ばすには、新しいクエストに挑戦してみましょう。
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <p className="text-slate-500">読み込み中...</p>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
