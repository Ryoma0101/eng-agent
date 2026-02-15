'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import HeroSection from '@/components/landing/HeroSection';
import FeatureCards from '@/components/landing/FeatureCards';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#f7f4ef] font-[var(--font-body)] text-slate-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-10 -left-20 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="absolute top-40 right-[-6rem] h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute bottom-[-4rem] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-orange-200/40 blur-3xl" />
      </div>
      {/* Header */}
      <header className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-white/40 bg-white/70 px-6 py-3 backdrop-blur-lg">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="EnQuest" className="h-8 w-8" />
          <span className="text-lg font-bold text-slate-900">EnQuest</span>
        </Link>
        <Link href="/login">
          <Button variant="outline" size="sm" className="border-slate-300">
            ログイン
          </Button>
        </Link>
      </header>

      {/* Main content */}
      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 pt-24 pb-20">
        <HeroSection />
        <FeatureCards />

        <section className="mt-20 grid gap-8 rounded-3xl border border-white/60 bg-white/60 p-8 shadow-[0_10px_40px_rgba(15,23,42,0.08)] backdrop-blur">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-slate-500 uppercase">
              How It Works
            </p>
            <h2 className="mt-3 text-3xl font-[var(--font-display)] text-slate-900">
              1日1題、ビジネス英作文で実戦力を磨く
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Daily Quest',
                body: 'ニューステーマに基づく問いで、実務文脈のアウトプットを鍛える。',
              },
              {
                title: 'Instant Score',
                body: 'G/L/C/Fの4軸で採点し、改善ポイントを提示。',
              },
              {
                title: 'Rank & Grow',
                body: 'ランキングと継続記録でモチベーションを維持。',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200/60 bg-white p-6">
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 grid items-center gap-8 rounded-3xl border border-slate-200/60 bg-slate-900 px-8 py-10 text-white md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="text-3xl font-[var(--font-display)]">準備はできた？</h2>
            <p className="mt-3 text-sm text-slate-200">
              今日のクエストで、あなたの英語アウトプットを一段引き上げよう。
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link href="/login">
              <Button className="bg-white text-slate-900 hover:bg-slate-100">Start Training</Button>
            </Link>
            <Link href="/demo/dashboard">
              <Button variant="outline" className="border-white/40 text-white hover:bg-white/10">
                デモを見る
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-10 pb-10 text-center text-xs text-slate-500">
        &copy; 2026 EnQuest — Team 3
      </footer>
    </div>
  );
}
