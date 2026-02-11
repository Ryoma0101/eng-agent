'use client';

import { useState } from 'react';
import Header from '@/components/shared/Header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp, Users, Hash } from 'lucide-react';

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const DEMO_RANKING = {
  date: '2026-02-10',
  totalUsers: 42,
  topUsers: [
    {
      rank: 1,
      userId: 'user_alice',
      displayName: 'Alice Chen',
      score: 95,
      submissionCount: 2,
      lastSubmittedAt: '2026-02-10T11:50:00Z',
    },
    {
      rank: 2,
      userId: 'user_bob',
      displayName: 'Bob Smith',
      score: 92,
      submissionCount: 1,
      lastSubmittedAt: '2026-02-10T10:30:00Z',
    },
    {
      rank: 3,
      userId: 'user_charlie',
      displayName: 'Charlie Park',
      score: 89,
      submissionCount: 1,
      lastSubmittedAt: '2026-02-10T10:10:00Z',
    },
    {
      rank: 4,
      userId: 'current_user',
      displayName: 'You',
      score: 87,
      submissionCount: 1,
      lastSubmittedAt: '2026-02-10T09:55:00Z',
    },
    {
      rank: 5,
      userId: 'user_david',
      displayName: 'David Kim',
      score: 85,
      submissionCount: 1,
      lastSubmittedAt: '2026-02-10T09:30:00Z',
    },
    {
      rank: 6,
      userId: 'user_emma',
      displayName: 'Emma Wilson',
      score: 83,
      submissionCount: 1,
      lastSubmittedAt: '2026-02-10T09:10:00Z',
    },
    {
      rank: 7,
      userId: 'user_frank',
      displayName: 'Frank Lee',
      score: 81,
      submissionCount: 1,
      lastSubmittedAt: '2026-02-10T08:45:00Z',
    },
    {
      rank: 8,
      userId: 'user_grace',
      displayName: 'Grace Taylor',
      score: 79,
      submissionCount: 1,
      lastSubmittedAt: '2026-02-10T08:20:00Z',
    },
    {
      rank: 9,
      userId: 'user_henry',
      displayName: 'Henry Martinez',
      score: 77,
      submissionCount: 1,
      lastSubmittedAt: '2026-02-10T08:05:00Z',
    },
    {
      rank: 10,
      userId: 'user_ivy',
      displayName: 'Ivy Anderson',
      score: 75,
      submissionCount: 1,
      lastSubmittedAt: '2026-02-10T07:50:00Z',
    },
  ],
};

const CURRENT_USER_ID = 'current_user';

export default function RankingPage() {
  const [ranking] = useState(DEMO_RANKING.topUsers);
  const currentDate = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return null;
    }
  };

  const currentUser = ranking.find((r) => r.userId === CURRENT_USER_ID);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-6">
        {/* Title */}
        <div className="mb-6 flex items-center gap-3">
          <Trophy className="h-7 w-7 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">今日のランキング</h1>
            <p className="text-sm text-slate-500">{currentDate}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{DEMO_RANKING.totalUsers}</div>
                <div className="text-xs text-slate-500">参加者数</div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <Hash className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {currentUser ? `#${currentUser.rank}` : '—'}
                </div>
                <div className="text-xs text-slate-500">あなたの順位</div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {currentUser ? `${currentUser.score}pt` : '—'}
                </div>
                <div className="text-xs text-slate-500">あなたのスコア</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Ranking List */}
        <Card>
          <div className="p-4 pb-2">
            <h3 className="font-semibold text-slate-900">ランキング TOP {ranking.length}</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {ranking.map((entry) => {
              const isCurrentUser = entry.userId === CURRENT_USER_ID;
              const medal = getMedalIcon(entry.rank);

              return (
                <div
                  key={entry.userId}
                  className={`flex items-center gap-4 px-4 py-3 ${
                    isCurrentUser ? 'bg-blue-50' : ''
                  }`}
                >
                  {/* Rank */}
                  <div className="flex w-10 items-center justify-center">
                    {medal ? (
                      <span className="text-xl">{medal}</span>
                    ) : (
                      <span className="text-sm font-semibold text-slate-500">{entry.rank}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">
                    {getInitials(entry.displayName)}
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium ${
                          isCurrentUser ? 'text-blue-900' : 'text-slate-700'
                        }`}
                      >
                        {entry.displayName}
                      </span>
                      {isCurrentUser && (
                        <Badge variant="secondary" className="text-xs">
                          あなた
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">提出 {entry.submissionCount}回</div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <div
                      className={`text-lg font-bold ${
                        isCurrentUser ? 'text-blue-600' : 'text-slate-900'
                      }`}
                    >
                      {entry.score}pt
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Footer Note */}
        <p className="mt-6 text-center text-sm text-slate-400">
          ランキングは毎日深夜に更新されます 🚀
        </p>
      </main>
    </div>
  );
}
