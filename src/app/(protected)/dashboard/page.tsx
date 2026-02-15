'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/shared/Header';
import QuestCard from '@/components/dashboard/QuestCard';
import StatsCards from '@/components/dashboard/StatsCards';
import { useAuth } from '@/lib/firebase/auth-context';
import { apiClient } from '@/lib/api-client';
import type { Quest, UserStats } from '@/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const displayName = user?.displayName || 'User';

  const [quest, setQuest] = useState<Quest | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    Promise.allSettled([
      apiClient<Quest>('/api/quests/today'),
      apiClient<UserStats>('/api/users/me/stats'),
    ]).then(([questResult, statsResult]) => {
      if (questResult.status === 'fulfilled') setQuest(questResult.value);
      if (statsResult.status === 'fulfilled') setStats(statsResult.value);
      setLoading(false);
    });
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-6">
        {/* Welcome */}
        <h1 className="mb-6 text-3xl font-bold text-slate-900">こんにちは、{displayName}さん</h1>

        {/* Today's Quest */}
        <div className="mb-6">
          {loading ? (
            <p className="text-slate-500">読み込み中...</p>
          ) : quest ? (
            <QuestCard quest={quest} />
          ) : (
            <p className="text-slate-500">今日のクエストはまだ配信されていません</p>
          )}
        </div>

        {/* Stats */}
        <div className="mb-6">
          <StatsCards stats={stats ?? { todayScore: 0, rank: 0, streak: 0 }} />
        </div>
      </main>
    </div>
  );
}
