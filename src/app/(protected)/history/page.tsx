'use client';

import Link from 'next/link';
import Header from '@/components/shared/Header';
import ProgressChart from '@/components/history/ProgressChart';
import WeaknessAnalysis from '@/components/history/WeaknessAnalysis';
import SubmissionList from '@/components/history/SubmissionList';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { mockSubmissionHistory } from '@/lib/mock-data';

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-6">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">あなたの成長記録</h1>
          <p className="mt-1 text-sm text-slate-500">過去の提出履歴とスコア推移を確認できます</p>
        </div>

        {/* Score Progress Chart */}
        <div className="mb-6">
          <ProgressChart submissions={mockSubmissionHistory} />
        </div>

        {/* Weakness Analysis */}
        <div className="mb-6">
          <WeaknessAnalysis submissions={mockSubmissionHistory} />
        </div>

        {/* Submission History List */}
        <div className="mb-6">
          <SubmissionList submissions={mockSubmissionHistory} />
        </div>

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
