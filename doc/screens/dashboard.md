# Dashboard（ホーム画面）

**Issue**: [#13](https://github.com/Ryoma0101/enquests/issues/13)  
**ファイル**: `src/app/(protected)/dashboard/page.tsx`  
**優先度**: ★最重要  
**実装時間**: 1時間

---

## 🎯 目的・役割

- **ハブ機能**: すべての機能への起点
- **Today's Quest**: ワンタップで問題へ誘導
- **モチベーション維持**: 今日のスコア、順位、連続日数（Streak）を表示

---

## 📐 画面レイアウト

```
┌─────────────────────────────────────────┐
│  [Header] Dashboard  Ranking  History   │
├─────────────────────────────────────────┤
│  こんにちは、Userさん                   │
│                                         │
│  ┌───────────────────────────────┐    │
│  │ 📝 Today's Quest              │    │
│  │ 「円安が輸出企業に...」       │     │
│  │                               │    │
│  │   [Start Quest →]             │    │
│  └───────────────────────────────┘    │
│                                         │
│  ┌─────┐ ┌─────┐ ┌─────┐            │
│  │今日の│ │順位 │ │連続 │            │
│  │89pt │ │#12  │ │3日  │            │
│  └─────┘ └─────┘ └─────┘            │
│                                         │
│  最近の提出                              │
│  ┌───────────────────────────────┐    │
│  │ #1 88pt Yesterday             │    │
│  │ #2 92pt 2 days ago            │    │
│  └───────────────────────────────┘    │
└─────────────────────────────────────────┘
```

---

## 📦 UI要素一覧

### 1. ウェルカムメッセージ

```typescript
<h1>こんにちは、{user.displayName || 'User'}さん</h1>
```

### 2. Today's Quest カード

| 要素               | コンポーネント | 内容                 |
| ------------------ | -------------- | -------------------- |
| **タイトル**       | `Card` header  | 「📝 Today's Quest」 |
| **問題文（抜粋）** | `<p>`          | 最初の50文字         |
| **CTAボタン**      | `Button`       | 「Start Quest →」    |

### 3. 統計カード（3つ）

```typescript
const stats = [
  { label: '今日のスコア', value: '89pt' },
  { label: '順位', value: '#12' },
  { label: '連続日数', value: '3日' },
];
```

### 4. 最近の提出（3件）

```typescript
<ul>
  {recentSubmissions.map(sub => (
    <li key={sub.id}>
      #{sub.rank} {sub.score}pt {sub.date}
    </li>
  ))}
</ul>
```

---

## 🔌 データ取得/API呼び出し

### API呼び出し

```typescript
// 1. 今日のクエストを取得
const quest = await fetch('/api/quests/today').then((r) => r.json());

// 2. 今日の自分のスコアを取得
const myScore = await fetch(`/api/users/${uid}/today-score`).then((r) => r.json());

// 3. 今日のランキングから自分の順位を取得
const ranking = await fetch('/api/leaderboard/daily').then((r) => r.json());
const myRank = ranking.topUsers.findIndex((u) => u.userId === uid) + 1;

// 4. ストリーク（連続日数）
const streak = await fetch(`/api/users/${uid}/streak`).then((r) => r.json());

// 5. 最近の提出履歴（3件）
const recent = await fetch(`/api/submissions?userId=${uid}&limit=3`).then((r) => r.json());
```

---

## 🧩 状態管理

```typescript
const { user } = useAuth();
const [quest, setQuest] = useState<Quest | null>(null);
const [stats, setStats] = useState({ score: 0, rank: 0, streak: 0 });
const [recent, setRecent] = useState<Submission[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchData() {
    // 並列取得
    const [q, s, r] = await Promise.all([
      fetchTodayQuest(),
      fetchMyStats(),
      fetchRecentSubmissions(),
    ]);
    setQuest(q);
    setStats(s);
    setRecent(r);
    setLoading(false);
  }
  fetchData();
}, [user]);
```

---

## 🧭 ナビゲーション

| アクション             | 遷移先                           |
| ---------------------- | -------------------------------- |
| **Start Quest**        | `/quest?questId={quest.questId}` |
| **Ranking**            | `/ranking`                       |
| **History**            | `/history`                       |
| **Profile**            | `/profile`                       |
| **最近の提出クリック** | `/result?submissionId={sub.id}`  |

---

## 🎨 使用コンポーネント（shadcn/ui）

- `Card` - Today's Quest カード、統計カード
- `Button` - Start Quest ボタン
- `Skeleton` - ローディング時

---

## 📁 ファイル配置

```
src/
├── app/
│   └── (protected)/
│       └── dashboard/
│           └── page.tsx             ← Dashboard
│
├── components/
│   ├── dashboard/
│   │   ├── QuestCard.tsx            ← Today's Quest
│   │   ├── StatsCards.tsx           ← 統計カード×3
│   │   └── RecentSubmissions.tsx    ← 最近の提出
│   ├── shared/
│   │   └── Header.tsx               ← 共通ヘッダー
│   └── ui/
│       ├── card.tsx
│       ├── button.tsx
│       └── skeleton.tsx
│
└── lib/
    ├── hooks/
    │   └── useDashboardData.ts      ← Dashboard用データ取得フック
    └── api/
        └── client.ts                ← API呼び出しヘルパー
```

---

## 💻 実装例

```tsx
// src/app/(protected)/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [quest, setQuest] = useState(null);
  const [stats, setStats] = useState({ score: 0, rank: 0, streak: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [q, s] = await Promise.all([
        fetch('/api/quests/today').then((r) => r.json()),
        fetch(`/api/users/${user?.uid}/stats`).then((r) => r.json()),
      ]);
      setQuest(q);
      setStats(s);
      setLoading(false);
    }
    if (user) fetchData();
  }, [user]);

  if (loading) return <Skeleton className="h-screen" />;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1 className="mb-6 text-3xl font-bold">こんにちは、{user?.displayName || 'User'}さん</h1>

      {/* Today's Quest */}
      <Card className="mb-6 p-6">
        <h2 className="mb-4 text-xl font-semibold">📝 Today's Quest</h2>
        <p className="mb-4 text-slate-600">{quest?.prompt.substring(0, 50)}...</p>
        <Button onClick={() => router.push(`/quest?questId=${quest?.questId}`)}>
          Start Quest →
        </Button>
      </Card>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">{stats.score}pt</div>
          <div className="text-sm text-slate-500">今日のスコア</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">#{stats.rank}</div>
          <div className="text-sm text-slate-500">順位</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">{stats.streak}日</div>
          <div className="text-sm text-slate-500">連続</div>
        </Card>
      </div>
    </div>
  );
}
```

---

## ✅ チェックリスト

- [ ] Today's Quest カードが表示される
- [ ] Start Quest ボタンで `/quest` に遷移
- [ ] 今日のスコア/順位/ストリークが表示される
- [ ] 最近の提出履歴が表示される
- [ ] ローディング状態が Skeleton で表示される
- [ ] 認証チェックが動作

---

## 🚀 実装優先度

**Phase 1: MVP必須**

---

## 📝 補足

- **Streak（連続日数）**: 初期は簡易実装でOK（Firestoreで `lastVisitedDate` を管理）
- **最近の提出**: Phase 2 で実装でも可
