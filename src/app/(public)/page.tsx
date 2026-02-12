'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import HeroSection from '@/components/landing/HeroSection';
import FeatureCards from '@/components/landing/FeatureCards';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="fixed top-0 z-50 flex w-full items-center justify-between bg-white/80 px-6 py-3 backdrop-blur-sm">
        <span className="text-lg font-bold text-slate-900">✍️ EnQuest</span>
        <Link href="/login">
          <Button variant="outline" size="sm">
            ログイン
          </Button>
        </Link>
      </header>

      {/* Main content */}
      <main className="w-full max-w-4xl px-4 pt-20 text-center">
        <HeroSection />
        <FeatureCards />
      </main>

      {/* Footer */}
      <footer className="mt-20 pb-8 text-center text-sm text-slate-400">
        &copy; 2026 EnQuest — Team 3
      </footer>
    </div>
  );
}
