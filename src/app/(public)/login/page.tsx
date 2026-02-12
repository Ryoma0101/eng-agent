'use client';

import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          トップへ戻る
        </Link>
      </div>

      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-slate-900">EnQuest</h1>
        <p className="mt-2 text-slate-600">デモモードでアプリの機能を試してみましょう</p>
      </div>

      <LoginForm />
    </div>
  );
}
