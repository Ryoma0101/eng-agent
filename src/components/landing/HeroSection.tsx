import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="flex flex-col items-start gap-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-300/60 bg-white/70 px-4 py-1.5 text-xs font-semibold tracking-[0.3em] text-slate-600 uppercase">
          AI x Writing League
        </div>

        <h1 className="text-4xl leading-tight font-[var(--font-display)] text-slate-900 sm:text-5xl">
          Write with intent.
          <br />
          Score with clarity.
          <br />
          Compete every day.
        </h1>

        <p className="max-w-xl text-base leading-relaxed text-slate-600">
          英作文を&quot;競技&quot;として楽しみながら、実務で使えるアウトプットを磨く。
          1日1題のクエストが、英語の思考速度を引き上げます。
        </p>

        <div className="mt-2 flex flex-wrap gap-3">
          <Link href="/login">
            <Button
              size="lg"
              className="gap-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
            >
              Start Training
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/demo/dashboard">
            <Button size="lg" variant="outline" className="rounded-xl border-slate-300">
              デモを見る
            </Button>
          </Link>
        </div>

        <div className="mt-4 grid w-full grid-cols-3 gap-4 text-sm text-slate-600">
          <div className="rounded-2xl border border-white/60 bg-white/70 p-4">
            <p className="text-xs tracking-[0.2em] text-slate-400 uppercase">Daily</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">1 Quest</p>
          </div>
          <div className="rounded-2xl border border-white/60 bg-white/70 p-4">
            <p className="text-xs tracking-[0.2em] text-slate-400 uppercase">Scoring</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">4 Axes</p>
          </div>
          <div className="rounded-2xl border border-white/60 bg-white/70 p-4">
            <p className="text-xs tracking-[0.2em] text-slate-400 uppercase">Rank</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">Top 10</p>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="rounded-3xl border border-white/70 bg-white/70 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.15)] backdrop-blur">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
              Today&apos;s Quest
            </p>
            <span className="rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1 text-xs text-slate-600">
              150-200 words
            </span>
          </div>
          <h3 className="mt-4 text-xl font-semibold text-slate-900">Weak Yen, Global Strategy</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Discuss the impact of a weaker yen on exporters. Consider profitability, global
            competitiveness, and supply chain resilience.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            {[
              { label: 'Grammar', value: '22/25' },
              { label: 'Logic', value: '20/25' },
              { label: 'Context', value: '23/25' },
              { label: 'Fluency', value: '21/25' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-200/70 bg-white p-4">
                <p className="text-xs text-slate-400">{item.label}</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
