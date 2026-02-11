'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <main className="w-full max-w-2xl px-4">
        <Card className="mx-auto border-0 bg-white shadow-lg dark:bg-slate-900">
          <div className="flex flex-col items-center gap-8 px-8 py-12 text-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                AI英作文スコアリング
              </h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                英語で仕事をする力を鍛えるプラットフォーム
              </p>
            </div>

            <p className="max-w-md text-base leading-relaxed text-slate-600 dark:text-slate-300">
              生成AIと協働して、英作文を&quot;競技&quot;として楽しみながら、実務で使えるアウトプットを生成します。
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-lg">
                <Link href="/result">スタートする</Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-lg">
                詳細を見る
              </Button>
            </div>

            <div className="mt-8 grid w-full grid-cols-2 gap-4 pt-8 sm:grid-cols-3">
              <div className="rounded-lg bg-slate-50 p-4 text-center dark:bg-slate-800">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">AI</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">スコアリング</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-4 text-center dark:bg-slate-800">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">実務</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">エージェント</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-4 text-center dark:bg-slate-800">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">競技</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">楽しい学習</div>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
