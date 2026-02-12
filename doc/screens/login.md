# Login/Auth（ログイン画面）

**Issue**: [#3](https://github.com/Ryoma0101/enquests/issues/3)  
**ファイル**: `src/app/(public)/login/page.tsx`  
**優先度**: 高  
**実装時間**: 40分

---

## 🎯 目的・役割

- **ユーザー識別**: Googleログインによる認証
- **Firebase Authとの統合**: 認証情報をグローバル管理
- **参加障壁の低減**: シンプルなGoogleログインのみで開始

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
│   └───────────────────────────────┘    │
│                                         │
│   Googleアカウントでログインすると、    │
│   進捗が保存されランキングに参加できます│
│                                         │
└─────────────────────────────────────────┘
```

---

## 📦 UI要素一覧

### 1. ログインカード

| 要素                     | コンポーネント | 内容                                                                         |
| ------------------------ | -------------- | ---------------------------------------------------------------------------- |
| **タイトル**             | `<h2>`         | 「ログイン」                                                                 |
| **Googleログインボタン** | `Button`       | 「Googleでログイン」                                                         |
| **注釈**                 | `<p>`          | 「Googleアカウントでログインすると、進捗が保存されランキングに参加できます」 |

---

## 🔌 データ取得/API呼び出し

### 1. Firebase Auth 連携

```typescript
// 実装例（将来的に追加）
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase/auth';

const provider = new GoogleAuthProvider();

async function handleGoogleLogin() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    // ユーザー情報をFirestoreに保存 or 更新
    router.push('/dashboard');
  } catch (error) {
    console.error('Googleログインエラー:', error);
  }
}
```

---

## 🧩 状態管理

```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

---

## 🧭 ナビゲーション

| アクション             | 遷移先                 |
| ---------------------- | ---------------------- |
| **Googleログイン成功** | `/dashboard`           |
| **ログイン失敗**       | エラー表示、画面留まる |

---

## 🎨 使用コンポーネント（shadcn/ui）

- `Card` - ログインカード
- `Button` - Googleログインボタン
- `Alert` - エラー表示

---

## 📁 ファイル配置

```
src/
├── app/
│   └── (public)/
│       └── login/
│           └── page.tsx             ← Loginページ
│
├── components/
│   └── auth/
│       └── LoginForm.tsx            ← ログインフォーム
│
└── lib/
    └── firebase/
        ├── auth.ts                  ← Firebase Auth設定
        └── config.ts                ← Firebase設定
```

---

## 💻 実装例

```tsx
// src/components/auth/LoginForm.tsx
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
```

---

## ✅ チェックリスト

- [ ] Googleログインボタンが表示される
- [ ] Googleログイン成功で `/dashboard` へ遷移
- [ ] エラー時に Alert が表示される
- [ ] ローディング状態が適切に表示される

---

## 🚀 実装優先度

- **必須**: Googleログイン機能
- **任意**: Firebase Auth完全連携（初期はスタブ実装でも可）

---

## 📝 補足

- **初期実装**: スタブ実装（`window.location.href`）で進め、後でFirebase Auth連携
- **エラーハンドリング**: ユーザーフレンドリーなエラーメッセージ表示
- **レスポンシブ**: モバイル対応のデザイン
