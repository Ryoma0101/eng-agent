'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Chrome, UserRound, Loader2 } from 'lucide-react';

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogleLogin() {
    try {
      setLoading(true);
      setError(null);
      // TODO: Firebase Auth連携
      // await signInWithGoogle();
      window.location.href = '/dashboard';
    } catch {
      setError('ログインに失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  }

  async function handleAnonymousLogin() {
    try {
      setLoading(true);
      setError(null);
      // TODO: Firebase Auth連携
      // await signInAnonymously();
      window.location.href = '/dashboard';
    } catch {
      setError('ログインに失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md p-8">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-slate-900">ログイン</h2>
        <p className="mt-2 text-sm text-slate-500">アカウントを選択してトレーニングを開始</p>
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
            <span className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-400">or</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full gap-2"
          size="lg"
          onClick={handleAnonymousLogin}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <UserRound className="h-4 w-4" />
          )}
          匿名でログイン
        </Button>
      </div>

      <p className="mt-6 text-center text-xs text-slate-400">
        匿名ログインなら登録不要で今すぐ開始できます
      </p>
    </Card>
  );
}
