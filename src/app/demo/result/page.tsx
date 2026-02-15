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

function DemoResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('submissionId');

  // デモ用にモックデータから該当のsubmissionを検索
  const result = useMemo<Submission | null>(() => {
    if (!submissionId) return null;
    return mockSubmissionHistory.find((s) => s.submissionId === submissionId) ?? null;
  }, [submissionId]);

  if (!result) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header demoMode={true} />
        <main className="mx-auto max-w-3xl space-y-4 px-4 py-6">
          <h1 className="text-3xl font-bold text-slate-900">採点結果</h1>
          <p className="text-red-600">
            提出が見つかりません。ダッシュボードからクエストに挑戦してください。
          </p>
          <Button variant="outline" onClick={() => router.push('/demo/dashboard')}>
            ホームへ戻る
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header demoMode={true} />

      <main className="mx-auto max-w-3xl px-4 py-6">
        {/* Demo Mode Banner */}
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center">
            <div className="shrink-0">
              <svg className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">デモモードで実行中</h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>
                  サンプルの采点結果を表示しています。実際のアカウントでログインするとあなたの結果が表示されます。
                </p>
              </div>
            </div>
          </div>
        </div>

        <h1 className="mb-6 text-3xl font-bold text-slate-900">採点完了！</h1>

        <div className="space-y-6">
          {/* 総合スコア */}
          <ScoreSummary total={result.scores.total} scoredAt={result.scoredAt} />

          {/* スコア内訳 */}
          <ScoreBreakdown scores={result.scores} />

          {/* AI Feedback */}
          <FeedbackCard feedback={result.feedback} />

          {/* ナビゲーション */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => router.push('/demo/ranking')}
              >
                <ArrowRight className="h-4 w-4" />
                ランキングを見る
              </Button>
              <Button className="gap-2" onClick={() => router.push('/demo/dashboard')}>
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

export default function DemoResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <p className="text-slate-500">読み込み中...</p>
        </div>
      }
    >
      <DemoResultContent />
    </Suspense>
  );
}
