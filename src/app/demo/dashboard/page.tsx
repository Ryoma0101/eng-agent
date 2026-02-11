'use client';

import Header from '@/components/shared/Header';
import QuestCard from '@/components/dashboard/QuestCard';
import StatsCards from '@/components/dashboard/StatsCards';
import RecentSubmissions from '@/components/dashboard/RecentSubmissions';
import {
  mockCurrentUser,
  mockTodayQuest,
  mockUserStats,
  mockRecentSubmissions,
} from '@/lib/mock-data';

export default function DemoDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header demoMode={true} />

      <main className="mx-auto max-w-4xl px-4 py-6">
        {/* Demo Mode Banner */}
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
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
                  現在デモモードで動作しています。データは保存されず、ランキングには反映されません。
                  実際のアカウントでログインすると、進捗が保存されランキングに参加できます。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome */}
        <h1 className="mb-6 text-3xl font-bold text-slate-900">
          こんにちは、{mockCurrentUser.displayName}さん
          <span className="ml-2 text-sm font-normal text-slate-500">(デモユーザー)</span>
        </h1>

        {/* Today's Quest */}
        <div className="mb-6">
          <QuestCard quest={mockTodayQuest} />
        </div>

        {/* Stats */}
        <div className="mb-6">
          <StatsCards stats={mockUserStats} />
        </div>

        {/* Recent Submissions */}
        <div className="mb-6">
          <RecentSubmissions submissions={mockRecentSubmissions} />
        </div>
      </main>
    </div>
  );
}
