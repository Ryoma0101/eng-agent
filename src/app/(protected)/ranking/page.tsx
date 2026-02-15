'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/shared/Header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, TrendingUp, Users, Hash } from 'lucide-react';
import { useAuth } from '@/lib/firebase/auth-context';
import { apiClient } from '@/lib/api-client';

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

interface RankingEntry {
  rank: number;
  userId: string;
  displayName: string;
  photoURL: string | null;
  score: number;
}

interface LeaderboardResponse {
  date: string;
  ranking: RankingEntry[];
  totalUsers: number;
}

export default function RankingPage() {
  const { user } = useAuth();
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  const currentDate = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    if (!user) return;
    apiClient<LeaderboardResponse>('/api/leaderboard/daily')
      .then((data) => {
        setRanking(data.ranking);
        setTotalUsers(data.totalUsers);
      })
      .catch((err) => console.error('Failed to load ranking:', err))
      .finally(() => setLoading(false));
  }, [user]);

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

  const currentUser = ranking.find((r) => r.userId === user?.uid);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-6">
          <p className="text-slate-500">読み込み中...</p>
        </main>
      </div>
    );
  }

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
                <div className="text-2xl font-bold text-slate-900">{totalUsers}人</div>
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
                  {currentUser ? `${currentUser.rank}位` : '—'}
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
              const isCurrentUser = entry.userId === user?.uid;
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
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={entry.photoURL || undefined} alt={entry.displayName} />
                    <AvatarFallback className="bg-slate-200 text-xs font-bold text-slate-600">
                      {getInitials(entry.displayName)}
                    </AvatarFallback>
                  </Avatar>

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
