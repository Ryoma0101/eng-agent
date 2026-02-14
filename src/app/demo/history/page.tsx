'use client';

import Link from 'next/link';
import Header from '@/components/shared/Header';
import ProgressChart from '@/components/history/ProgressChart';
import WeaknessAnalysis from '@/components/history/WeaknessAnalysis';
import SubmissionList from '@/components/history/SubmissionList';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { mockSubmissionHistory } from '@/lib/mock-data';

export default function DemoHistoryPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header demoMode={true} />

      <main className="mx-auto max-w-4xl px-4 py-6">
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
                  サンプルデータを表示しています。実際のアカウントでログインするとあなたのデータが表示されます。
                </p>
              </div>
            </div>
          </div>
        </div>

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
        <Link href="/demo/dashboard">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            ダッシュボードへ戻る
          </Button>
        </Link>
      </main>
    </div>
  );
}
