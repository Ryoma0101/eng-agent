'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/shared/Header';
import ScoreSummary from '@/components/result/ScoreSummary';
import ScoreBreakdown from '@/components/result/ScoreBreakdown';
import FeedbackCard from '@/components/result/FeedbackCard';
import { Card } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { ArrowRight, Home } from 'lucide-react';
import { apiClient, ApiError } from '@/lib/api-client';
import type { Scores } from '@/types';

interface SubmissionResult {
  submissionId: string;
  questId: string;
  questDate: string;
  questTitle: string;
  prompt: string;
  userId: string;
  answer: string;
  wordCount: number;
  scores: Scores;
  feedback: string;
  createdAt: string;
  updatedAt: string;
}

function ResultContent() {
  const router = useRouter();
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient<SubmissionResult>('/api/submissions/get')
      .then(setResult)
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : '結果の取得に失敗しました');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-6">
          <p className="text-slate-500">読み込み中...</p>
        </main>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="mx-auto max-w-3xl space-y-4 px-4 py-6">
          <h1 className="text-3xl font-bold text-slate-900">採点結果</h1>
          <p className="text-red-600">
            {error || '提出が見つかりません。ダッシュボードからクエストに挑戦してください。'}
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
          <ScoreSummary total={result.scores.total} scoredAt={result.questDate} />

          {/* Topic */}
          <Card className="p-6">
            <h2 className="mb-2 text-lg font-semibold text-slate-900">トピック</h2>
            <p className="text-base font-medium text-slate-800">{result.questTitle}</p>
          </Card>

          {/* Question */}
          <Card className="p-6">
            <h2 className="mb-2 text-lg font-semibold text-slate-900">質問</h2>
            <p className="leading-relaxed whitespace-pre-wrap text-slate-700">{result.prompt}</p>
          </Card>

          {/* Your answer */}
          <Card className="p-6">
            <h2 className="mb-2 text-lg font-semibold text-slate-900">あなたの回答</h2>
            <p className="mb-2 text-sm text-slate-500">{result.wordCount} words</p>
            <p className="leading-relaxed whitespace-pre-wrap text-slate-700">{result.answer}</p>
          </Card>

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
