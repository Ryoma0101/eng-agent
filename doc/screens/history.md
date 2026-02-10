# History/Progress（履歴・成長画面）

**ファイル**: `src/app/(protected)/history/page.tsx`  
**優先度**: Phase 3（継続性）  
**実装時間**: 50分

---

## 🎯 目的・役割

- **継続性**: 過去の提出履歴を一覧表示
- **成長の可視化**: スコア推移グラフ、弱点分析
- **振り返り**: 過去の問題と解答を確認

---

## 📐 画面レイアウト

```
┌─────────────────────────────────────────┐
│  [Header] History                       │
├─────────────────────────────────────────┤
│  📊 あなたの成長記録                     │
│                                         │
│  ┌───────────────────────────────┐    │
│  │  [スコア推移グラフ]           │    │
│  │   (折れ線グラフ)              │    │
│  │   87 → 89 → 92 → 95           │    │
│  └───────────────────────────────┘    │
│                                         │
│  弱点分析:                              │
│  - Grammar が平均より低い              │
│  - Context が改善傾向                   │
│                                         │
│  過去の提出:                            │
│  ┌───────────────────────────────┐    │
│  │ 2026/02/10  87pts  Medium    │    │
│  ├───────────────────────────────┤    │
│  │ 2026/02/09  85pts  Easy      │    │
│  ├───────────────────────────────┤    │
│  │ 2026/02/08  83pts  Medium    │    │
│  └───────────────────────────────┘    │
│                                         │
│  [← 戻る]                               │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📦 UI要素一覧

### Phase 3: 継続性（時間あれば）

| 要素                 | コンポーネント | 内容                                  |
| -------------------- | -------------- | ------------------------------------- |
| **タイトル**         | `<h1>`         | 「📊 あなたの成長記録」               |
| **スコア推移グラフ** | Recharts       | 折れ線グラフ                          |
| **弱点分析**         | `Card`         | 「Grammar が低い」など                |
| **履歴リスト**       | `Card` ×N      | 日付、スコア、難易度                  |
| **詳細ボタン**       | `Button`       | クリックで `/result?submissionId=...` |
| **戻るボタン**       | `Button`       | Dashboard へ                          |

---

## 🔌 データ取得/API呼び出し

### 1. 提出履歴取得

```typescript
const history = await fetch(`/api/submissions?userId=${userId}`).then(r => r.json());

// レスポンス例
{
  submissions: [
    {
      submissionId: "sub_abc123",
      questId: "2026-02-10_quest001",
      score: 87,
      difficulty: "Medium",
      submittedAt: "2026-02-10T10:30:45Z"
    },
    ...
  ],
  stats: {
    averageScore: 86,
    totalSubmissions: 12,
    weaknesses: ["grammar", "context"]
  }
}
```

---

## 🧩 状態管理

```typescript
const [history, setHistory] = useState([]);
const [stats, setStats] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchHistory() {
    const user = auth.currentUser;
    const data = await fetch(`/api/submissions?userId=${user.uid}`).then((r) => r.json());
    setHistory(data.submissions);
    setStats(data.stats);
    setLoading(false);
  }
  fetchHistory();
}, []);
```

---

## 🧭 ナビゲーション

| アクション     | 遷移先                      |
| -------------- | --------------------------- |
| **詳細を見る** | `/result?submissionId={id}` |
| **戻る**       | `/dashboard`                |

---

## 🎨 使用コンポーネント（shadcn/ui）

- `Card` - 履歴カード、弱点分析
- `Button` - 戻るボタン、詳細ボタン
- **外部ライブラリ**: Recharts（折れ線グラフ）

---

## 📁 ファイル配置

```
src/
├── app/
│   └── (protected)/
│       └── history/
│           └── page.tsx             ← History
│
├── components/
│   ├── history/
│   │   ├── ProgressChart.tsx        ← スコア推移グラフ
│   │   ├── WeaknessAnalysis.tsx     ← 弱点分析
│   │   └── SubmissionList.tsx       ← 履歴リスト
│   └── ui/
│       ├── card.tsx
│       └── button.tsx
│
└── lib/
    └── api/
        └── submissions.ts           ← 履歴取得
```

---

## 💻 実装例（シンプル版）

```tsx
// src/app/(protected)/history/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      const user = auth.currentUser;
      const data = await fetch(`/api/submissions?userId=${user.uid}`).then((r) => r.json());
      setHistory(data.submissions);
      setLoading(false);
    }
    fetchHistory();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold">📊 あなたの成長記録</h1>

        {/* スコア推移グラフ（Phase 3で実装） */}
        <Card className="mb-6 p-6">
          <h3 className="mb-4 font-semibold">スコア推移</h3>
          <div className="h-48 text-center text-slate-400">グラフ実装予定（Recharts）</div>
        </Card>

        {/* 弱点分析（Phase 3で実装） */}
        <Card className="mb-6 p-6">
          <h3 className="mb-4 font-semibold">弱点分析</h3>
          <ul className="list-inside list-disc text-slate-700">
            <li>Grammar が平均より低い傾向</li>
            <li>Context が改善傾向</li>
          </ul>
        </Card>

        {/* 過去の提出 */}
        <Card className="mb-6">
          <h3 className="border-b p-4 font-semibold">過去の提出</h3>
          {history.map((entry) => (
            <div
              key={entry.submissionId}
              className="flex items-center justify-between border-b p-4 last:border-b-0"
            >
              <div>
                <div className="font-medium">
                  {new Date(entry.submittedAt).toLocaleDateString('ja-JP')}
                </div>
                <div className="text-sm text-slate-500">{entry.difficulty}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="font-bold text-blue-600">{entry.score} pts</div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/result?submissionId=${entry.submissionId}`)}
                >
                  詳細
                </Button>
              </div>
            </div>
          ))}
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

## ✅ チェックリスト（Phase 3）

- [ ] 過去の提出履歴が一覧表示される
- [ ] 詳細ボタンで Result 画面へ遷移
- [ ] スコア推移グラフが表示される（Recharts）
- [ ] 弱点分析が表示される
- [ ] 戻るボタンで Dashboard へ遷移

---

## 🚀 実装優先度

**Phase 3: 継続性（時間あれば）**

---

## 📝 補足

- **グラフライブラリ**: Rechartsで折れ線グラフを実装
  ```bash
  pnpm add recharts
  ```
- **弱点分析**: 各スコアの平均を計算してアドバイス生成
