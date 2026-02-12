import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-700">
        ✍️ AI × 英作文 × 競技
      </div>

      <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">EnQuest</h1>

      <p className="max-w-lg text-center text-base leading-relaxed text-slate-600">
        英作文を&quot;競技&quot;として楽しみながら、
        <br className="hidden sm:block" />
        実務で使えるアウトプットを生成するプラットフォーム
      </p>

      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <Link href="/login">
          <Button size="lg" className="gap-2 rounded-lg">
            Start Training
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
