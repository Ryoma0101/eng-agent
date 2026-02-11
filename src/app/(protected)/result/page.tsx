'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Target, MessageCircle, ArrowRight, Home, Copy } from 'lucide-react';

// ===== Types =====

type ScoreDimensions = {
  grammar: number;
  logic: number;
  context: number;
  fluency: number;
};

type ScoreBreakdown = ScoreDimensions & {
  total: number; // 0-100, -1 の場合は採点保留
  isCorrect: boolean;
};

export type SubmissionResult = {
  submissionId: string;
  questId: string;
  userId: string | null;
  answer: string;
  wordCount: number;
  scores: ScoreBreakdown;
  feedback: string;
  submittedAt: string;
  scoredAt: string;
  processingTime: number;
  // Phase 2 fields (添削・フレーズ抽出)
  correctedAnswer?: string;
  phrases?: string[];
};

// ===== Page Component =====

export default function ResultPage() {
  const router = useRouter();

  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // submissionId がなくてもデモモードでAPI呼び出し可能（Next.js で /result 単体アクセス時）
    const fetchResult = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch('/api/submissions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            questId: 'demo_quest', // 仮のクエストID。実装時に差し替え
            answer:
              'In response to the depreciation of the yen, our company will prioritize cost-efficiency while maintaining the quality of our core services. We will review existing vendor contracts, renegotiate terms where appropriate, and accelerate our shift toward higher-margin digital offerings.',
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || 'Failed to fetch submission result');
        }

        const data = (await res.json()) as SubmissionResult;
        setResult(data);
      } catch (e) {
        console.error('Failed to fetch /api/submissions', e);
        setError('採点APIの呼び出しに失敗しました。APIキーやネットワーク設定を確認してください。');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-10">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-base text-slate-600">採点結果を取得しています...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-slate-50 py-10">
        <div className="mx-auto max-w-7xl space-y-4 px-4">
          <h1 className="text-4xl font-bold text-slate-900">Result</h1>
          <Card className="border-0 bg-white p-6 shadow-sm">
            <p className="text-base text-red-600">
              {error ?? '採点結果の取得に失敗しました。時間をおいて再度お試しください。'}
            </p>
          </Card>
          <Button variant="outline" onClick={() => router.push('/')}>
            ホームへ戻る
          </Button>
        </div>
      </div>
    );
  }

  const totalScore = result.scores.total;
  const totalScoreRatio = Math.min(Math.max(totalScore, 0), 100) / 100;

  const handleCopyCorrected = async () => {
    if (!result.correctedAnswer) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(result.correctedAnswer);
      }
    } catch {
      // 失敗時も特にエラー表示はせず無視（将来トーストに差し替え）
    }
  };

  const handleCopyPhrases = async () => {
    if (!result.phrases?.length) return;
    const text = result.phrases.join('\n');
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      }
    } catch {
      // no-op
    }
  };

  const scoreItems: { key: keyof ScoreDimensions; label: string; max: number }[] = [
    { key: 'grammar', label: 'Grammar (G)', max: 25 },
    { key: 'logic', label: 'Logic (L)', max: 30 },
    { key: 'context', label: 'Context (C)', max: 20 },
    { key: 'fluency', label: 'Fluency (F)', max: 25 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <header className="mb-8">
          <h1 className="flex items-center gap-3 text-4xl font-bold text-slate-900">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <span>Result</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            🎉 採点完了！ あなたの英作文の成果を確認しましょう。
          </p>
        </header>

        <main className="space-y-8">
          {/* 総合スコア */}
          <section>
            <Card className="border-0 bg-white shadow-sm">
              <div className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-2xl font-semibold text-slate-900">
                    <Trophy className="h-6 w-6 text-blue-600" />
                    <span>総合スコア</span>
                  </h2>
                  <p className="mt-2 text-base text-slate-600">
                    Grammar / Logic / Context / Fluency を総合したスコアです。
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Submission ID: <span className="font-mono">{result.submissionId}</span>
                  </p>
                </div>

                <div className="relative flex items-center justify-center">
                  <div className="relative h-40 w-40 rounded-full bg-gradient-to-br from-blue-50 to-slate-100 shadow-inner">
                    <div className="absolute inset-4 rounded-full border-4 border-blue-100" />
                    <div
                      className="absolute inset-4 rounded-full border-4 border-blue-600"
                      style={{
                        clipPath: 'polygon(50% 0%, 100% 0, 100% 100%, 0 100%, 0 0)',
                        opacity: 0.85,
                      }}
                    />
                    <div className="absolute inset-8 flex flex-col items-center justify-center text-center">
                      <span className="text-sm font-medium text-slate-500">Score</span>
                      <span className="text-5xl font-bold text-slate-900">
                        {totalScore}
                        <span className="text-2xl text-slate-400">/100</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-between gap-2 border-t bg-slate-50/80 px-8 py-4 text-sm text-slate-500">
                <span>
                  採点日時:{' '}
                  <span className="font-mono">{new Date(result.scoredAt).toLocaleString()}</span>
                </span>
                <span>
                  処理時間: <span className="font-mono">{result.processingTime} ms</span>
                </span>
              </div>
            </Card>
          </section>

          {/* スコア内訳 + 簡易レーダー */}
          <section className="grid gap-6 md:grid-cols-[2fr,1.5fr]">
            {/* 内訳カード */}
            <Card className="border-0 bg-white shadow-sm">
              <div className="p-6">
                <h2 className="mb-4 text-2xl font-semibold text-slate-900">スコア内訳</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {scoreItems.map(({ key, label, max }) => {
                    const value = result.scores[key];
                    const ratio = Math.min(Math.max(value, 0), max) / max;
                    return (
                      <div
                        key={key}
                        className="rounded-lg border border-slate-100 bg-slate-50/60 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-500">{label}</span>
                          <span className="font-mono text-xs text-slate-400">
                            {Math.round(ratio * 100)}%
                          </span>
                        </div>
                        <div className="mt-2 flex items-end justify-between">
                          <span className="text-2xl font-bold text-slate-900">
                            {value}
                            <span className="ml-1 text-xs text-slate-400">/{max}</span>
                          </span>
                        </div>
                        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-blue-600"
                            style={{ width: `${ratio * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* 簡易レーダーチャート（rechartsの代替表示） */}
            <Card className="border-0 bg-white shadow-sm">
              <div className="p-6">
                <h2 className="flex items-center gap-2 text-2xl font-semibold text-slate-900">
                  <Target className="h-5 w-5 text-slate-700" />
                  <span>G / L / C / F レーダー（簡易表示）</span>
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  ライブラリ導入前の簡易可視化です。将来的に Recharts
                  製レーダーチャートに差し替え予定です。
                </p>
                <div className="mt-6 flex items-center justify-center">
                  <div className="relative h-40 w-40">
                    <div className="absolute inset-0 rounded-full border border-slate-200" />
                    <div className="absolute inset-3 rounded-full border border-slate-200" />
                    <div className="absolute inset-6 rounded-full border border-slate-200" />

                    {/* 4軸の点をスコア比率に応じて配置 */}
                    {scoreItems.map(({ key, max }, index) => {
                      const value = result.scores[key];
                      const ratio = Math.min(Math.max(value, 0), max) / max; // 0-1
                      const angle = (index / scoreItems.length) * Math.PI * 2 - Math.PI / 2;
                      const radius = 70 * ratio;
                      const x = 80 + radius * Math.cos(angle);
                      const y = 80 + radius * Math.sin(angle);
                      return (
                        <div
                          key={key}
                          className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600 shadow-sm"
                          style={{ left: `${x / 2}px`, top: `${y / 2}px` }}
                        />
                      );
                    })}
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500">
                  {scoreItems.map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-full bg-blue-600" />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </section>

          {/* AI Feedback */}
          <section>
            <Card className="border-0 bg-white shadow-sm">
              <div className="p-6">
                <h2 className="flex items-center gap-2 text-2xl font-semibold text-slate-900">
                  <MessageCircle className="h-5 w-5 text-slate-700" />
                  <span>AI Feedback</span>
                </h2>
                <p className="mt-3 text-base text-slate-700">{result.feedback}</p>
              </div>
            </Card>
          </section>

          {/* Phase 2: 添削済み完成版 & フレーズ抽出（MOCK） */}
          <section className="grid gap-6 md:grid-cols-2">
            {/* 添削済み完成版 */}
            <Card className="border-0 bg-white shadow-sm">
              <div className="flex items-center justify-between gap-2 border-b px-6 py-4">
                <h2 className="text-2xl font-semibold text-slate-900">添削済み完成版（Mock）</h2>
                {result.correctedAnswer && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={handleCopyCorrected}
                  >
                    <Copy className="h-4 w-4" />
                    <span className="text-xs">Copy</span>
                  </Button>
                )}
              </div>
              <div className="max-h-72 overflow-auto px-6 py-4">
                {result.correctedAnswer ? (
                  <pre className="text-sm whitespace-pre-wrap text-slate-800">
                    {result.correctedAnswer}
                  </pre>
                ) : (
                  <p className="text-sm text-slate-500">
                    添削済み完成版は Phase 2 で実装予定です。
                  </p>
                )}
              </div>
            </Card>

            {/* フレーズ抽出 */}
            <Card className="border-0 bg-white shadow-sm">
              <div className="flex items-center justify-between gap-2 border-b px-6 py-4">
                <h2 className="text-2xl font-semibold text-slate-900">使えるフレーズ（Mock）</h2>
                {result.phrases?.length ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={handleCopyPhrases}
                  >
                    <Copy className="h-4 w-4" />
                    <span className="text-xs">Copy</span>
                  </Button>
                ) : null}
              </div>
              <div className="px-6 py-4">
                {result.phrases?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {result.phrases.map((phrase) => (
                      <span
                        key={phrase}
                        className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                      >
                        {phrase}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">フレーズ抽出は Phase 2 で実装予定です。</p>
                )}
              </div>
            </Card>
          </section>

          {/* ナビゲーション */}
          <section className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => router.push('/ranking')}
              >
                <ArrowRight className="h-4 w-4" />
                <span>ランキングを見る</span>
              </Button>
              <Button
                className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => router.push('/')}
              >
                <Home className="h-4 w-4" />
                <span>ホームへ</span>
              </Button>
            </div>
            <p className="text-sm text-slate-500">
              さらにスコアを伸ばすには、新しいクエストに挑戦してみましょう。
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
