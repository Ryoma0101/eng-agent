# Ranking（ランキング画面）

**Issue**: [#2](https://github.com/Ryoma0101/eng-agent/issues/2)  
**ファイル**: `src/app/(protected)/ranking/page.tsx`  
**優先度**: Phase 2（競技性）  
**実装時間**: 40分

---

## 🎯 目的・役割

- **競技性**: 日次ランキングでモチベーション向上
- **スポーツ感**: 「今日のTOP 10」を見せる
- **比較**: 自分の順位とスコアを確認

---

## 📐 画面レイアウト

```
┌─────────────────────────────────────────┐
│  [Header] Ranking                       │
├─────────────────────────────────────────┤
│  🏆 Today's TOP 10                      │
│                                         │
│  日付: 2026/02/10                       │
│                                         │
│  ┌───────────────────────────────┐    │
│  │ #1  Alice       95 pts 🥇    │    │
│  ├───────────────────────────────┤    │
│  │ #2  Bob         92 pts 🥈    │    │
│  ├───────────────────────────────┤    │
│  │ #3  Charlie     89 pts 🥉    │    │
│  ├───────────────────────────────┤    │
│  │ #4  You         87 pts ⭐    │    │  ← 自分
│  ├───────────────────────────────┤    │
│  │ #5  David       85 pts       │    │
│  │ ...                           │    │
│  └───────────────────────────────┘    │
│                                         │
│  [← 戻る]                               │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📦 UI要素一覧

| 要素 | コンポーネント | 内容 |
|------|----------------|------|
| **タイトル** | `<h1>` | 「🏆 Today's TOP 10」 |
| **日付** | `<p>` | 「2026/02/10」 |
| **ランキングリスト** | `Card` ×N | 順位、ユーザー名、スコア |
| **メダル** | Emoji | 🥇🥈🥉 |
| **自分のハイライト** | `bg-blue-100` | 自分の行を強調 |
| **戻るボタン** | `Button` | Dashboard へ |

---

## 🔌 データ取得/API呼び出し

### 1. ランキング取得

```typescript
const ranking = await fetch('/api/leaderboard/daily?limit=10&offset=0').then(r => r.json());

// レスポンス例
{
  date: "2026-02-10",
  topUsers: [
    {
      rank: 1,
      userId: "user_alice",
      displayName: "Alice",
      score: 95,
      submissionCount: 2,
      lastSubmittedAt: "2026-02-10T11:50:00Z"
    },
    {
      rank: 2,
      userId: "user_bob",
      displayName: "Bob",
      score: 92,
      submissionCount: 1,
      lastSubmittedAt: "2026-02-10T10:30:00Z"
    }
  ],
  totalUsers: 42
}
```

---

## 🧩 状態管理

```typescript
const [ranking, setRanking] = useState([]);
const [loading, setLoading] = useState(true);
const [currentUserId, setCurrentUserId] = useState<string | null>(null);

useEffect(() => {
  async function fetchRanking() {
    const today = new Date().toISOString().split('T')[0];
    const data = await fetch(`/api/leaderboards?date=${today}`).then(r => r.json());
    setRanking(data.rankings);
    setLoading(false);
  }

  // 現在のユーザーIDを取得
  const user = auth.currentUser;
  setCurrentUserId(user?.uid || null);

  fetchRanking();
}, []);
```

---

## 🧭 ナビゲーション

| アクション | 遷移先 |
|-----------|-------|
| **戻る** | `/dashboard` |

---

## 🎨 使用コンポーネント（shadcn/ui）

- `Card` - ランキングカード
- `Button` - 戻るボタン
- `Badge` - メダル表示（オプション）

---

## 📁 ファイル配置

```
src/
├── app/
│   └── (protected)/
│       └── ranking/
│           └── page.tsx             ← Ranking
│
├── components/
│   ├── ranking/
│   │   ├── RankingList.tsx          ← ランキングリスト
│   │   └── RankingItem.tsx          ← 各ユーザー行
│   └── ui/
│       ├── card.tsx
│       ├── button.tsx
│       └── badge.tsx
│
└── lib/
    └── api/
        └── leaderboards.ts          ← ランキング取得
```

---

## 💻 実装例

```tsx
// src/app/(protected)/ranking/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';

export default function RankingPage() {
  const router = useRouter();
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    async function fetchRanking() {
      const today = new Date().toISOString().split('T')[0];
      const data = await fetch(`/api/leaderboards?date=${today}`).then((r) =>
        r.json()
      );
      setRanking(data.rankings);
      setLoading(false);
    }

    const user = auth.currentUser;
    setCurrentUserId(user?.uid || null);

    fetchRanking();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-3xl font-bold">🏆 Today's TOP 10</h1>
        <p className="mb-6 text-slate-600">
          {new Date().toLocaleDateString('ja-JP')}
        </p>

        <Card className="mb-6">
          {ranking.map((entry, idx) => {
            const isCurrentUser = entry.userId === currentUserId;
            const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '';

            return (
              <div
                key={entry.userId}
                className={`flex items-center justify-between border-b p-4 last:border-b-0 ${
                  isCurrentUser ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 text-center font-bold">#{entry.rank}</div>
                  <div className="font-medium">
                    {entry.displayName}
                    {isCurrentUser && ' (You)'}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="font-bold text-blue-600">{entry.score} pts</div>
                  {medal && <span className="text-2xl">{medal}</span>}
                </div>
              </div>
            );
          })}
        </Card>

        <Button onClick={() => router.push('/dashboard')} variant="outline">
          ← 戻る
        </Button>
      </div>
    </div>
  );
}
```

---

## ✅ チェックリスト

- [ ] TOP 10 が表示される
- [ ] 自分の行がハイライトされる
- [ ] メダル（🥇🥈🥉）が表示される
- [ ] 戻るボタンで Dashboard へ遷移

---

## 🚀 実装優先度

**Phase 2: 競技性**

---

## 📝 補足

- **全体ランキング**: 将来的に「All Time」ランキングも追加可能
- **フィルター**: 難易度別、週間ランキングなど
