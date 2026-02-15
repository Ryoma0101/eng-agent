'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/shared/Header';
import QuestPrompt from '@/components/quest/QuestPrompt';
import AnswerForm from '@/components/quest/AnswerForm';
import { apiClient, ApiError } from '@/lib/api-client';
import type { Quest } from '@/types';

export default function QuestPage() {
  const router = useRouter();

  const [quest, setQuest] = useState<Quest | null>(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // クエスト取得
  useEffect(() => {
    apiClient<Quest>('/api/quests/today')
      .then(setQuest)
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : '問題の取得に失敗しました');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const words = answer.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
  }, [answer]);

  async function handleSubmit() {
    if (!quest) return;

    if (wordCount < quest.wordCountMin || wordCount > quest.wordCountMax) {
      setError(`単語数は ${quest.wordCountMin}-${quest.wordCountMax} words にしてください`);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await apiClient('/api/submissions/create', {
        method: 'POST',
        body: { questId: quest.questId, answer },
      });

      // 採点完了後 Result 画面へ遷移
      router.push('/result');
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : '提出に失敗しました。もう一度お試しください。'
      );
    } finally {
      setSubmitting(false);
    }
  }

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

  if (!quest) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-6">
          <h1 className="mb-4 text-3xl font-bold text-slate-900">クエスト</h1>
          <p className="text-red-600">{error || '今日のクエストが見つかりません'}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="mb-6 text-3xl font-bold text-slate-900">クエスト</h1>

        <div className="mb-6">
          <QuestPrompt quest={quest} />
        </div>

        <AnswerForm
          answer={answer}
          onAnswerChange={setAnswer}
          wordCount={wordCount}
          wordCountMin={quest.wordCountMin}
          wordCountMax={quest.wordCountMax}
          submitting={submitting}
          error={error}
          onSubmit={handleSubmit}
        />
      </main>
    </div>
  );
}
