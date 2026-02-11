'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trophy, TrendingUp } from 'lucide-react';

// デモデータ - よりモダンなアバター生成関数
const getAvatarColor = (rank: number) => {
  const colors = [
    'from-pink-400 to-rose-600',
    'from-blue-400 to-cyan-600',
    'from-purple-400 to-indigo-600',
    'from-emerald-400 to-teal-600',
    'from-orange-400 to-amber-600',
    'from-violet-400 to-purple-600',
    'from-sky-400 to-blue-600',
    'from-fuchsia-400 to-pink-600',
    'from-lime-400 to-green-600',
    'from-red-400 to-rose-600',
  ];
  return colors[(rank - 1) % colors.length];
};

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
  const router = useRouter();
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

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-yellow-600 shadow-yellow-400/30';
      case 2:
        return 'from-slate-300 to-slate-500 shadow-slate-400/30';
      case 3:
        return 'from-orange-400 to-orange-600 shadow-orange-400/30';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="mx-auto max-w-4xl px-4 py-8 font-sans">
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

        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/demo/dashboard')}
            className="mb-4 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            ダッシュボードに戻る
          </Button>

          <div className="flex items-center gap-4">
            <div className="relative rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-3 shadow-lg shadow-blue-200">
              <Trophy className="h-8 w-8 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
                デモ - 今日のランキング
              </h1>
              <p className="mt-1 text-sm font-medium text-slate-600">{currentDate} (デモデータ)</p>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <Card className="mb-6 border-none bg-white/80 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-sm">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-3xl font-bold tracking-tight text-slate-900">
                {DEMO_RANKING.totalUsers}
              </div>
              <div className="text-xs font-medium tracking-wider text-slate-500 uppercase">
                総プレイヤー数
              </div>
            </div>
            <div className="space-y-1">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
                {ranking.find((r) => r.userId === CURRENT_USER_ID)?.rank || '-'}
              </div>
              <div className="text-xs font-medium tracking-wider text-slate-500 uppercase">
                あなたの順位
              </div>
            </div>
            <div className="space-y-1">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
                {ranking.find((r) => r.userId === CURRENT_USER_ID)?.score || '-'}
              </div>
              <div className="text-xs font-medium tracking-wider text-slate-500 uppercase">
                あなたのスコア
              </div>
            </div>
          </div>
        </Card>

        {/* Ranking List */}
        <Card className="overflow-hidden border-none bg-white/80 shadow-lg shadow-slate-200/50 backdrop-blur-sm">
          <div className="divide-y divide-slate-100">
            {ranking.map((entry) => {
              const isCurrentUser = entry.userId === CURRENT_USER_ID;
              const medal = getMedalIcon(entry.rank);
              const medalColor = getMedalColor(entry.rank);
              const isTopThree = entry.rank <= 3;

              return (
                <div
                  key={entry.userId}
                  className={`group relative flex items-center gap-4 p-4 transition-all hover:bg-slate-50 ${
                    isCurrentUser ? 'bg-gradient-to-r from-blue-50 to-purple-50' : ''
                  } ${isTopThree ? 'py-5' : ''}`}
                >
                  {/* Rank Badge */}
                  <div className="flex w-14 items-center justify-center">
                    {isTopThree ? (
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br shadow-lg ${medalColor}`}
                      >
                        <span className="text-xl font-bold text-white drop-shadow-sm">
                          {entry.rank}
                        </span>
                      </div>
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                        {entry.rank}
                      </div>
                    )}
                  </div>

                  {/* Avatar */}
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white shadow-md ${getAvatarColor(entry.rank)}`}
                  >
                    {getInitials(entry.displayName)}
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-base font-semibold tracking-tight ${
                          isCurrentUser ? 'text-blue-900' : 'text-slate-900'
                        }`}
                      >
                        {entry.displayName}
                      </span>
                      {isCurrentUser && (
                        <Badge
                          variant="secondary"
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-xs font-semibold text-white hover:from-blue-600 hover:to-cyan-600"
                        >
                          あなた
                        </Badge>
                      )}
                      {isTopThree && !isCurrentUser && (
                        <TrendingUp className="h-4 w-4 text-emerald-500" strokeWidth={2.5} />
                      )}
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-2">
                    <div
                      className={`text-right font-bold tracking-tight tabular-nums ${
                        isCurrentUser
                          ? 'text-2xl text-blue-600'
                          : isTopThree
                            ? 'text-xl text-slate-900'
                            : 'text-lg text-slate-700'
                      }`}
                    >
                      {entry.score}
                    </div>
                    <span className="text-sm font-medium text-slate-400">pts</span>
                  </div>

                  {/* Medal */}
                  {medal && (
                    <div className="text-3xl transition-all duration-300 group-hover:scale-125 group-hover:rotate-12">
                      {medal}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-slate-500">
            ランキングは毎日更新されます。デモモードではデータは保存されません。実際のアカウントでログインしてランキングに参加しましょう！
            🚀
          </p>
        </div>
      </div>
    </div>
  );
}
