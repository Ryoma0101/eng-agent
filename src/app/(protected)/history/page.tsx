'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/shared/Header';
import ProgressChart from '@/components/history/ProgressChart';
import WeaknessAnalysis from '@/components/history/WeaknessAnalysis';
import SubmissionList from '@/components/history/SubmissionList';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/firebase/auth-context';
import { apiClient } from '@/lib/api-client';
import type { Submission } from '@/types';

interface SubmissionWithTitle extends Submission {
  questTitle?: string | null;
}

export default function HistoryPage() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<SubmissionWithTitle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    apiClient<{ submissions: SubmissionWithTitle[] }>('/api/submissions/list')
      .then((data) => setSubmissions(data.submissions))
      .catch((err) => console.error('Failed to load history:', err))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-6">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">あなたの成長記録</h1>
          <p className="mt-1 text-sm text-slate-500">過去の提出履歴とスコア推移を確認できます</p>
        </div>

        {loading ? (
          <p className="text-slate-500">読み込み中...</p>
        ) : submissions.length === 0 ? (
          <p className="text-slate-500">まだ提出履歴がありません</p>
        ) : (
          <>
            {/* Score Progress Chart */}
            <div className="mb-6">
              <ProgressChart submissions={submissions} />
            </div>

            {/* Weakness Analysis */}
            <div className="mb-6">
              <WeaknessAnalysis submissions={submissions} />
            </div>

            {/* Submission History List */}
            <div className="mb-6">
              <SubmissionList submissions={submissions} />
            </div>
          </>
        )}

        {/* Back to Dashboard */}
        <Link href="/dashboard">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            ダッシュボードへ戻る
          </Button>
        </Link>
      </main>
    </div>
  );
}
