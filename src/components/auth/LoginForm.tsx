'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Chrome, Loader2, User } from 'lucide-react';
import { signInWithGoogle } from '@/lib/firebase/auth';

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleGoogleLogin() {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
      // ログイン成功後、ダッシュボードへリダイレクト
      router.push('/dashboard');
    } catch (error: unknown) {
      // ユーザーがログインダイアログをキャンセルした場合
      if (error instanceof Error && error.message === 'auth/popup-closed-by-user') {
        // エラーメッセージを表示しない
        return;
      }
      setError('ログインに失敗しました。もう一度お試しください。');
      console.error('Google login error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDemoLogin() {
    try {
      setLoading(true);
      setError(null);
      // デモモード用のページに遷移
      router.push('/demo/dashboard');
    } catch {
      setError('デモモードの起動に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md p-8">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-slate-900">ログイン</h2>
        <p className="mt-2 text-sm text-slate-500">Googleアカウントでトレーニングを開始</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        <Button className="w-full gap-2" size="lg" onClick={handleGoogleLogin} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Chrome className="h-4 w-4" />}
          Googleでログイン
        </Button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-500">または</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full gap-2"
          size="lg"
          onClick={handleDemoLogin}
          disabled={loading}
        >
          <User className="h-4 w-4" />
          デモモードで試す
        </Button>
      </div>

      <p className="mt-6 text-center text-xs text-slate-400">
        Googleアカウントでログインすると、進捗が保存されランキングに参加できます
      </p>
      <p className="mt-2 text-center text-xs text-slate-400">
        デモモードではサンプルデータを使用し、進捗は保存されません
      </p>
    </Card>
  );
}
