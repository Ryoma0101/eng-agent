# Login/Auth（ログイン画面）

**ファイル**: `src/app/(public)/login/page.tsx`  
**優先度**: 高  
**実装時間**: 40分

---

## 🎯 目的・役割

- **ユーザー識別**: GoogleログインOR匿名ログイン
- **参加障壁の低減**: 匿名ログイン推奨で気軽に開始
- **Firebase Authとの統合**: 認証情報をグローバル管理

---

## 📐 画面レイアウト

```
┌─────────────────────────────────────────┐
│                                         │
│            🔐 ログイン                  │
│                                         │
│   ┌───────────────────────────────┐    │
│   │                               │    │
│   │  [🔵 Googleでログイン]        │    │
│   │                               │    │
│   │  [👤 匿名でログイン]          │    │
│   │                               │    │
│   └───────────────────────────────┘    │
│                                         │
│   匿名ログインなら今すぐ開始できます    │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📦 UI要素一覧

### 1. ログインカード

| 要素                     | コンポーネント               | 内容                                   |
| ------------------------ | ---------------------------- | -------------------------------------- |
| **タイトル**             | `<h2>`                       | 「ログイン」                           |
| **Googleログインボタン** | `Button`                     | 「Googleでログイン」                   |
| **匿名ログインボタン**   | `Button` (variant="outline") | 「匿名でログイン」                     |
| **注釈**                 | `<p>`                        | 「匿名ログインなら今すぐ開始できます」 |

---

## 🔌 データ取得/API呼び出し

### Firebase Auth関数

```typescript
// lib/firebase/auth.ts
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function signInAnonymously() {
  const result = await signInAnonymouslyFirebase(auth);
  return result.user;
}
```

---

## 🧩 状態管理

```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const router = useRouter();

async function handleGoogleLogin() {
  try {
    setLoading(true);
    await signInWithGoogle();
    router.push('/dashboard');
  } catch (err) {
    setError('ログインに失敗しました');
  } finally {
    setLoading(false);
  }
}

async function handleAnonymousLogin() {
  try {
    setLoading(true);
    await signInAnonymously();
    router.push('/dashboard');
  } catch (err) {
    setError('ログインに失敗しました');
  } finally {
    setLoading(false);
  }
}
```

---

## 🧭 ナビゲーション

| アクション             | 遷移先                 |
| ---------------------- | ---------------------- |
| **Googleログイン成功** | `/dashboard`           |
| **匿名ログイン成功**   | `/dashboard`           |
| **ログイン失敗**       | エラー表示、画面留まる |

---

## 🎨 使用コンポーネント（shadcn/ui）

- `Button` - ログインボタン
- `Card` - ログインカード
- `Alert` - エラー表示

---

## 📁 ファイル配置

```
src/
├── app/
│   └── (public)/
│       └── login/
│           └── page.tsx             ← Login
│
├── components/
│   ├── auth/
│   │   └── LoginForm.tsx            ← ログインフォーム
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       └── alert.tsx
│
└── lib/
    ├── firebase/
    │   └── auth.ts                  ← Auth ヘルパー
    └── hooks/
        └── useAuth.ts               ← 認証状態フック
```

---

## 💻 実装例

```tsx
// src/app/(public)/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithGoogle, signInAnonymously } from '@/lib/firebase/auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleGoogleLogin() {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (err) {
      setError('ログインに失敗しました');
    } finally {
      setLoading(false);
    }
  }

  async function handleAnon() {
    try {
      setLoading(true);
      setError(null);
      await signInAnonymously();
      router.push('/dashboard');
    } catch (err) {
      setError('ログインに失敗しました');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md p-8">
        <h2 className="mb-6 text-center text-2xl font-bold">ログイン</h2>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <Button className="w-full" onClick={handleGoogleLogin} disabled={loading}>
            🔵 Googleでログイン
          </Button>

          <Button variant="outline" className="w-full" onClick={handleAnon} disabled={loading}>
            👤 匿名でログイン
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          匿名ログインなら今すぐ開始できます
        </p>
      </Card>
    </div>
  );
}
```

---

## ✅ チェックリスト

- [ ] Googleログインボタンが表示される
- [ ] 匿名ログインボタンが表示される
- [ ] Googleログイン成功で `/dashboard` へ遷移
- [ ] 匿名ログイン成功で `/dashboard` へ遷移
- [ ] エラー時に Alert が表示される
- [ ] ローディング中はボタン無効化

---

## 🚀 実装優先度

**Phase 1: MVP必須**

---

## 📚 参考

- Firebase Auth ドキュメント
- shadcn/ui Alert コンポーネント
