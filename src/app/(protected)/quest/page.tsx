'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/shared/Header';
import QuestPrompt from '@/components/quest/QuestPrompt';
import AnswerForm from '@/components/quest/AnswerForm';
import { mockTodayQuest } from '@/lib/mock-data';

export default function QuestPage() {
  const router = useRouter();

  const quest = mockTodayQuest;
  const [answer, setAnswer] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const words = answer.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
  }, [answer]);

  async function handleSubmit() {
    if (wordCount < quest.wordCountMin || wordCount > quest.wordCountMax) {
      setError(`単語数は ${quest.wordCountMin}-${quest.wordCountMax} words にしてください`);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // TODO: API連携 POST /api/submissions
      // デモ用に遅延を入れてresultページへ遷移
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push(`/result?submissionId=sub_001`);
    } catch {
      setError('提出に失敗しました。もう一度お試しください。');
    } finally {
      setSubmitting(false);
    }
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
