# Landing（トップ画面）

**ファイル**: `src/app/(public)/page.tsx`  
**優先度**: 高  
**実装時間**: 30分

---

## 🎯 目的・役割

- **世界観の提示**: AIスコアリングプラットフォームとしてのブランディング
- **ログイン誘導**: 「Start Training」で参加障壁を下げる
- **初回訪問者への訴求**: コンセプトを一目で理解させる

---

## 📐 画面レイアウト

```
┌─────────────────────────────────────────┐
│  [Header]  Logo             [Login]     │
├─────────────────────────────────────────┤
│                                         │
│         🎯 AI英作文スコアリング          │
│                                         │
│   英作文を"競技"として楽しみながら、    │
│   実務で使えるアウトプットを生成         │
│                                         │
│       [Start Training →]                │
│                                         │
│  ┌─────┐  ┌─────┐  ┌─────┐            │
│  │ AI  │  │実務 │  │競技 │            │
│  │採点 │  │直結 │  │楽しい│            │
│  └─────┘  └─────┘  └─────┘            │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📦 UI要素一覧

### 1. ヒーローセクション

| 要素 | コンポーネント | 内容 |
|------|----------------|------|
| **見出し** | `<h1>` | 「AI英作文スコアリング」 |
| **サブコピー** | `<p>` | 「英作文を"競技"として楽しみながら...」 |
| **CTAボタン** | `Button` (shadcn) | 「Start Training」 |

### 2. 特徴カード（3つ）

```typescript
const features = [
  {
    icon: "🎯",
    title: "AI採点",
    description: "スコアリング"
  },
  {
    icon: "💼",
    title: "実務",
    description: "エージェント"
  },
  {
    icon: "🏆",
    title: "競技",
    description: "楽しい学習"
  }
];
```

### 3. ヘッダー（右上）

- **Loginボタン**: `/login` へのリンク

---

## 🔌 データ取得/API呼び出し

**なし**（静的コンテンツのみ）

---

## 🧩 状態管理

**なし**（認証状態チェックのみ）

```typescript
// ログイン済みなら /dashboard へリダイレクト
const { user, loading } = useAuth();

useEffect(() => {
  if (!loading && user) {
    router.push('/dashboard');
  }
}, [user, loading]);
```

---

## 🧭 ナビゲーション

| アクション | 遷移先 |
|-----------|-------|
| **Start Training** | `/login` |
| **Login** | `/login` |
| **（認証済み）** | `/dashboard` へ自動遷移 |

---

## 🎨 使用コンポーネント（shadcn/ui）

- `Button` - CTAボタン
- `Card` - 特徴カード

---

## 📁 ファイル配置

```
src/
├── app/
│   └── (public)/
│       └── page.tsx                 ← Landing
│
└── components/
    ├── landing/
    │   ├── HeroSection.tsx          ← ヒーローセクション
    │   └── FeatureCards.tsx         ← 特徴カード
    └── ui/
        ├── button.tsx
        └── card.tsx
```

---

## 💻 実装例

```tsx
// src/app/(public)/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Landing() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const features = [
    { icon: '🎯', title: 'AI採点', desc: 'スコアリング' },
    { icon: '💼', title: '実務', desc: 'エージェント' },
    { icon: '🏆', title: '競技', desc: '楽しい学習' },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <main className="w-full max-w-4xl text-center">
        <h1 className="text-5xl font-bold tracking-tight text-slate-900">
          AI英作文スコアリング
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          英作文を&quot;競技&quot;として楽しみながら、
          <br />
          実務で使えるアウトプットを生成
        </p>

        <Button
          size="lg"
          className="mt-8"
          onClick={() => router.push('/login')}
        >
          Start Training →
        </Button>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="p-6 text-center">
              <div className="text-4xl">{f.icon}</div>
              <h3 className="mt-4 text-xl font-bold">{f.title}</h3>
              <p className="text-sm text-slate-500">{f.desc}</p>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
```

---

## ✅ チェックリスト

- [ ] ヒーローセクションが表示される
- [ ] 「Start Training」ボタンが `/login` に遷移
- [ ] 特徴カードが3つ表示される
- [ ] 認証済みユーザーは `/dashboard` へ自動遷移
- [ ] レスポンシブ対応（モバイル/デスクトップ）

---

## 🚀 実装優先度

**Phase 1: MVP必須**

---

## 📚 参考

- 既存のトップページ（`src/app/page.tsx`）を上書き
- シンプルに、30分で完成させる
