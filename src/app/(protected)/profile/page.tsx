'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/shared/Header';
import UserInfo from '@/components/profile/UserInfo';
import UserStats from '@/components/profile/UserStats';
import BadgeList from '@/components/profile/BadgeList';
import ScoreTrend from '@/components/profile/ScoreTrend';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LogOut } from 'lucide-react';
import { mockUserProfile } from '@/lib/mock-data';

export default function ProfilePage() {
  const router = useRouter();

  function handleLogout() {
    // TODO: Firebase Auth連携
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
          <UserInfo profile={mockUserProfile} />
        </div>

        {/* Stats */}
        <div className="mb-6">
          <UserStats profile={mockUserProfile} />
        </div>

        {/* Badges */}
        <div className="mb-6">
          <BadgeList badges={mockUserProfile.badges} />
        </div>

        {/* Score Trend */}
        <div className="mb-6">
          <ScoreTrend scoreBreakdown={mockUserProfile.scoreBreakdown} />
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
