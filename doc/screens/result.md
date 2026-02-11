# Result（採点・添削画面）

**Issue**: [#5](https://github.com/Ryoma0101/eng-agent/issues/5)  
**ファイル**: `src/app/(protected)/result/page.tsx`  
**優先度**: ★最重要（差別化ポイント）  
**実装時間**: 1時間

---

## 🎯 目的・役割

- **成果物の提示**: AIによる採点結果を可視化
- **差別化ポイント**: G/L/C/Fレーダーチャート、添削済み完成版、フレーズ抽出
- **エージェント感**: 「成果物」が得られる体験

---

## 📐 画面レイアウト

```
┌─────────────────────────────────────────┐
│  [Header] Result                        │
├─────────────────────────────────────────┤
│  🎉 採点完了！                          │
│                                         │
│  ┌───────────────────────────────┐    │
│  │  総合スコア                   │    │
│  │      87/100                   │    │
│  └───────────────────────────────┘    │
│                                         │
│  ┌───────────────────────────────┐    │
│  │  [レーダーチャート]           │    │
│  │   Grammar: 22/25              │    │
│  │   Logic: 24/25                │    │
│  │   Context: 20/25              │    │
│  │   Fluency: 21/25              │    │
│  └───────────────────────────────┘    │
│                                         │
│  AI Feedback:                           │
│  「論理構成は良好ですが...」            │
│                                         │
│  [添削済み完成版] (Phase 2)             │
│  [フレーズ抽出] (Phase 2)               │
│                                         │
│  [→ ランキングを見る] [→ ホームへ]     │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📦 UI要素一覧

### Phase 1: MVP（必須）

| 要素                     | コンポーネント | 内容                 |
| ------------------------ | -------------- | -------------------- |
| **タイトル**             | `<h1>`         | 「🎉 採点完了！」    |
| **総合スコア**           | `Card`         | 「87/100」大きく表示 |
| **スコア内訳**           | `Card`         | G/L/C/F 各スコア     |
| **AI Feedback**          | `<p>`          | フィードバック文章   |
| **ナビゲーションボタン** | `Button` ×2    | Ranking, Dashboard   |

### Phase 2: 完全版（時間あれば）

| 要素                 | コンポーネント      | 内容                   |
| -------------------- | ------------------- | ---------------------- |
| **レーダーチャート** | Chart.js / Recharts | G/L/C/F 可視化         |
| **添削済み完成版**   | `<pre>` or Card     | AI が修正した英文      |
| **フレーズ抽出**     | `Badge` ×N          | 「使えるフレーズ」一覧 |
| **Copyボタン**       | `Button`            | クリップボードにコピー |

---

## 🔌 データ取得/API呼び出し

### 1. 提出結果取得

```typescript
const submissionId = searchParams.get('submissionId');
const result = await fetch(`/api/submissions/${submissionId}`).then(r => r.json());

// レスポンス例
{
  submissionId: "sub_abc123",
  questId: "2026-02-10_quest001",
  answer: "...",
  scores: {
    grammar: 22,
    logic: 24,
    context: 20,
    fluency: 21,
    total: 87
  },
  feedback: "Good structure, but consider...",
  scoredAt: "2026-02-10T10:30:45Z"
}
```

---

## 🧩 状態管理

```typescript
const [result, setResult] = useState<SubmissionResult | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchResult() {
    const data = await fetch(`/api/submissions/${submissionId}`).then((r) => r.json());
    setResult(data);
    setLoading(false);
  }
  fetchResult();
}, [submissionId]);
```

---

## 🧭 ナビゲーション

| アクション           | 遷移先                 |
| -------------------- | ---------------------- |
| **ランキングを見る** | `/ranking`             |
| **ホームへ**         | `/dashboard`           |
| **Copy**             | クリップボードにコピー |

---

## 🎨 使用コンポーネント（shadcn/ui）

- `Card` - スコア表示カード
- `Button` - ナビゲーションボタン
- `Badge` - Phase 2: フレーズ表示
- `Progress` - Phase 2: 各項目のバー表示
- **外部ライブラリ**: Recharts（レーダーチャート）

---

## 📁 ファイル配置

```
src/
├── app/
│   └── (protected)/
│       └── result/
│           └── page.tsx             ← Result
│
├── components/
│   ├── result/
│   │   ├── ScoreSummary.tsx         ← 総合スコア
│   │   ├── ScoreBreakdown.tsx       ← G/L/C/F内訳
│   │   ├── FeedbackCard.tsx         ← AI Feedback
│   │   ├── RadarChart.tsx           ← Phase 2: レーダーチャート
│   │   ├── CorrectedVersion.tsx     ← Phase 2: 添削版
│   │   └── PhraseExtraction.tsx     ← Phase 2: フレーズ
│   └── ui/
│       ├── card.tsx
│       ├── button.tsx
│       ├── badge.tsx
│       └── progress.tsx
│
└── lib/
    └── api/
        └── submissions.ts           ← 提出結果取得
```

---

## 💻 実装例（Phase 1: MVP）

```tsx
// src/app/(protected)/result/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('submissionId');

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResult() {
      const data = await fetch(`/api/submissions/${submissionId}`).then((r) => r.json());
      setResult(data);
      setLoading(false);
    }
    fetchResult();
  }, [submissionId]);

  if (loading || !result) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold">🎉 採点完了！</h1>

        {/* 総合スコア */}
        <Card className="mb-6 p-8 text-center">
          <h2 className="mb-2 text-lg text-slate-600">総合スコア</h2>
          <div className="text-6xl font-bold text-blue-600">{result.scores.total}</div>
          <div className="text-sm text-slate-500">/100</div>
        </Card>

        {/* スコア内訳 */}
        <Card className="mb-6 p-6">
          <h3 className="mb-4 font-semibold">スコア詳細</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-slate-500">Grammar</div>
              <div className="text-2xl font-bold">{result.scores.grammar}/25</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Logic</div>
              <div className="text-2xl font-bold">{result.scores.logic}/25</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Context</div>
              <div className="text-2xl font-bold">{result.scores.context}/25</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Fluency</div>
              <div className="text-2xl font-bold">{result.scores.fluency}/25</div>
            </div>
          </div>
        </Card>

        {/* AI Feedback */}
        <Card className="mb-6 p-6">
          <h3 className="mb-2 font-semibold">AI Feedback</h3>
          <p className="text-slate-700">{result.feedback}</p>
        </Card>

        {/* ナビゲーション */}
        <div className="flex gap-4">
          <Button onClick={() => router.push('/ranking')} variant="outline">
            ランキングを見る
          </Button>
          <Button onClick={() => router.push('/dashboard')}>ホームへ</Button>
        </div>
      </div>
    </div>
  );
}
```

---

## ✅ チェックリスト（Phase 1）

- [ ] 総合スコアが大きく表示される
- [ ] G/L/C/F のスコア内訳が表示される
- [ ] AI Feedback が表示される
- [ ] ランキング/ホームへのボタンが動作

## ✅ チェックリスト（Phase 2）

- [ ] レーダーチャートが表示される
- [ ] 添削済み完成版が表示される
- [ ] フレーズ抽出が表示される
- [ ] Copyボタンでクリップボードにコピー

---

## 🚀 実装優先度

- **Phase 1**: MVP必須（総合スコア + 内訳 + Feedback）
- **Phase 2**: 時間あれば（レーダーチャート、添削版、フレーズ）

---

## 📝 補足

- **レーダーチャート**: `recharts` ライブラリ推奨
  ```bash
  pnpm add recharts
  ```
- **添削版**: API で修正案を生成する必要あり（Phase 2）
- **フレーズ抽出**: 正規表現 or LLM で抽出
