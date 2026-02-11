'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Chrome, Loader2 } from 'lucide-react';

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
      </div>

      <p className="mt-6 text-center text-xs text-slate-400">
        Googleアカウントでログインすると、進捗が保存されランキングに参加できます
      </p>
    </Card>
  );
}
