'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/shared/Header';
import UserInfo from '@/components/profile/UserInfo';
import UserStats from '@/components/profile/UserStats';
import ScoreTrend from '@/components/profile/ScoreTrend';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/firebase/auth-context';
import { apiClient } from '@/lib/api-client';
import type { UserProfile } from '@/types';

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut: authSignOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<Pick<
    UserProfile,
    'totalSubmissions' | 'averageScore' | 'streak' | 'scoreBreakdown'
  > | null>(null);

  useEffect(() => {
    if (!user) return;

    Promise.allSettled([
      apiClient<{
        submissions: Array<{ scores: UserProfile['scoreBreakdown'] & { total: number } }>;
      }>('/api/submissions/list'),
      apiClient<{
        averageTotal: number;
        averageContext: number;
        averageFluency: number;
        averageGrammar: number;
        averageLogic: number;
      }>('/api/average'),
      apiClient<{ streak: number }>('/api/users/me/stats'),
    ])
      .then(([submissionsResult, averageResult, statsResult]) => {
        const submissions =
          submissionsResult.status === 'fulfilled' ? submissionsResult.value.submissions : [];

        const count = submissions.length;
        const averageRaw = averageResult.status === 'fulfilled' ? averageResult.value : null;
        const averageTotal = averageRaw?.averageTotal ?? 0;
        const averageGrammar = averageRaw?.averageGrammar ?? 0;
        const averageLogic = averageRaw?.averageLogic ?? 0;
        const averageContext = averageRaw?.averageContext ?? 0;
        const averageFluency = averageRaw?.averageFluency ?? 0;

        const averageScore = Number.isFinite(averageTotal) ? Math.round(averageTotal) : 0;
        const scoreBreakdown = {
          grammar: Number.isFinite(averageGrammar) ? Math.round(averageGrammar) : 0,
          logic: Number.isFinite(averageLogic) ? Math.round(averageLogic) : 0,
          context: Number.isFinite(averageContext) ? Math.round(averageContext) : 0,
          fluency: Number.isFinite(averageFluency) ? Math.round(averageFluency) : 0,
        };
        const streak = statsResult.status === 'fulfilled' ? statsResult.value.streak : 0;

        setProfileData({
          totalSubmissions: count,
          averageScore,
          streak,
          scoreBreakdown,
        });
      })
      .finally(() => setLoading(false));
  }, [user]);

  const userProfile: UserProfile = {
    uid: user?.uid ?? 'unknown',
    displayName: user?.displayName || 'User',
    email: user?.email ?? null,
    photoURL: user?.photoURL ?? null,
    totalSubmissions: profileData?.totalSubmissions ?? 0,
    averageScore: profileData?.averageScore ?? 0,
    streak: profileData?.streak ?? 0,
    badges: [],
    createdAt: user?.metadata.creationTime
      ? new Date(user.metadata.creationTime).toISOString()
      : new Date().toISOString(),
    scoreBreakdown: profileData?.scoreBreakdown ?? {
      grammar: 0,
      logic: 0,
      context: 0,
      fluency: 0,
    },
  };

  async function handleLogout() {
    await authSignOut();
    router.push('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-6">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">プロフィール</h1>
        </div>

        {/* User Info */}
        <div className="mb-6">
          <UserInfo profile={userProfile} />
        </div>

        {loading ? <p className="mb-6 text-slate-500">読み込み中...</p> : null}

        {/* Stats */}
        <div className="mb-6">
          <UserStats profile={userProfile} />
        </div>

        {/* Score Trend */}
        <div className="mb-6">
          <ScoreTrend scoreBreakdown={userProfile.scoreBreakdown} />
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button variant="destructive" className="gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            ログアウト
          </Button>
          <Link href="/dashboard">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              ダッシュボードへ戻る
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
