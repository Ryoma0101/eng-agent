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

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-6">
        {/* Welcome */}
        <h1 className="mb-6 text-3xl font-bold text-slate-900">
          こんにちは、{mockCurrentUser.displayName}さん
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
