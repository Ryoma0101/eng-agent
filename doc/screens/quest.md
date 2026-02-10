# Quest（問題回答画面）

**ファイル**: `src/app/(protected)/quest/page.tsx`  
**優先度**: ★最重要（コア体験）  
**実装時間**: 50分

---

## 🎯 目的・役割

- **コア体験**: 英作文を入力する場所
- **即座フィードバック**: Submit後にスコアリング
- **快適な入力体験**: レスポンシブテキストエリア、文字数カウント

---

## 📐 画面レイアウト

```
┌─────────────────────────────────────────┐
│  [Header] Quest                         │
├─────────────────────────────────────────┤
│  📝 Today's Quest                       │
│                                         │
│  問題文：                                │
│  「円安が輸出企業に与える影響について、 │
│   3つの観点から論じなさい」             │
│                                         │
│  字数指定：150-200 words                │
│  難易度：Medium                          │
│                                         │
│  ┌───────────────────────────────┐    │
│  │                               │    │
│  │  [Textarea: 英作文を入力]     │    │
│  │                               │    │
│  │                               │    │
│  │                               │    │
│  └───────────────────────────────┘    │
│                                         │
│  文字数: 87 / 150-200 words             │
│                                         │
│  [Submit for Scoring]                   │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📦 UI要素一覧

### 1. 問題文カード

| 要素 | コンポーネント | 内容 |
|------|----------------|------|
| **タイトル** | `<h2>` | 「📝 Today's Quest」 |
| **問題文** | `<p>` | クエストの全文 |
| **字数指定** | `<p>` | 「150-200 words」 |
| **難易度** | `Badge` | 「Medium」 |

### 2. 入力フォーム

| 要素 | コンポーネント | 内容 |
|------|----------------|------|
| **Textarea** | `Textarea` (shadcn) | 英作文入力 |
| **文字数カウント** | `<p>` | 「87 / 150-200 words」 |
| **Submitボタン** | `Button` | 「Submit for Scoring」 |

---

## 🔌 データ取得/API呼び出し

### 1. クエスト取得

```typescript
const questId = searchParams.get('questId');
const quest = await fetch(`/api/quests/${questId}`).then(r => r.json());
```

### 2. 提出・採点

```typescript
async function handleSubmit() {
  const response = await fetch('/api/submissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      questId: quest.questId,
      answer: answerText,
    }),
  });

  const result = await response.json();
  // { submissionId, scores, feedback }

  router.push(`/result?submissionId=${result.submissionId}`);
}
```

---

## 🧩 状態管理

```typescript
const [quest, setQuest] = useState<Quest | null>(null);
const [answer, setAnswer] = useState('');
const [wordCount, setWordCount] = useState(0);
const [submitting, setSubmitting] = useState(false);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const words = answer.trim().split(/\s+/).filter(Boolean).length;
  setWordCount(words);
}, [answer]);

async function handleSubmit() {
  // バリデーション
  if (wordCount < quest.wordCountMin || wordCount > quest.wordCountMax) {
    setError(`字数は ${quest.wordCountMin}-${quest.wordCountMax} words です`);
    return;
  }

  try {
    setSubmitting(true);
    const result = await submitAnswer(quest.questId, answer);
    router.push(`/result?submissionId=${result.submissionId}`);
  } catch (err) {
    setError('提出に失敗しました');
  } finally {
    setSubmitting(false);
  }
}
```

---

## 🧭 ナビゲーション

| アクション | 遷移先 |
|-----------|-------|
| **Submit成功** | `/result?submissionId={id}` |
| **戻る** | `/dashboard` |

---

## 🎨 使用コンポーネント（shadcn/ui）

- `Card` - 問題文カード
- `Textarea` - 英作文入力
- `Button` - Submit ボタン
- `Badge` - 難易度表示
- `Alert` - エラー表示

---

## 📁 ファイル配置

```
src/
├── app/
│   └── (protected)/
│       └── quest/
│           └── page.tsx             ← Quest
│
├── components/
│   ├── quest/
│   │   ├── QuestPrompt.tsx          ← 問題文表示
│   │   ├── AnswerForm.tsx           ← 解答入力フォーム
│   │   └── WordCounter.tsx          ← 文字数カウンタ
│   └── ui/
│       ├── card.tsx
│       ├── textarea.tsx
│       ├── button.tsx
│       ├── badge.tsx
│       └── alert.tsx
│
└── lib/
    └── api/
        └── submissions.ts           ← 提出API呼び出し
```

---

## 💻 実装例

```tsx
// src/app/(protected)/quest/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function QuestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const questId = searchParams.get('questId');

  const [quest, setQuest] = useState(null);
  const [answer, setAnswer] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchQuest() {
      const q = await fetch(`/api/quests/${questId}`).then((r) => r.json());
      setQuest(q);
    }
    fetchQuest();
  }, [questId]);

  useEffect(() => {
    const words = answer.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
  }, [answer]);

  async function handleSubmit() {
    if (wordCount < quest.wordCountMin || wordCount > quest.wordCountMax) {
      setError(`字数は ${quest.wordCountMin}-${quest.wordCountMax} words です`);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const result = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questId, answer }),
      }).then((r) => r.json());

      router.push(`/result?submissionId=${result.submissionId}`);
    } catch {
      setError('提出に失敗しました');
    } finally {
      setSubmitting(false);
    }
  }

  if (!quest) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <Card className="mx-auto max-w-3xl p-6">
        <h2 className="mb-4 text-2xl font-bold">📝 Today's Quest</h2>

        <div className="mb-6 space-y-2">
          <p className="text-slate-700">{quest.prompt}</p>
          <div className="flex gap-2">
            <Badge variant="outline">
              {quest.wordCountMin}-{quest.wordCountMax} words
            </Badge>
            <Badge>{quest.difficulty}</Badge>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Textarea
          placeholder="英作文を入力してください..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={12}
          className="mb-2"
        />

        <p className="mb-4 text-sm text-slate-500">
          文字数: {wordCount} / {quest.wordCountMin}-{quest.wordCountMax} words
        </p>

        <Button onClick={handleSubmit} disabled={submitting} className="w-full">
          {submitting ? '提出中...' : 'Submit for Scoring'}
        </Button>
      </Card>
    </div>
  );
}
```

---

## ✅ チェックリスト

- [ ] 問題文が表示される
- [ ] Textarea で英作文を入力できる
- [ ] 文字数がリアルタイムでカウントされる
- [ ] 字数条件外の場合エラー表示
- [ ] Submit で `/result` に遷移
- [ ] 提出中はボタン無効化

---

## 🚀 実装優先度

**Phase 1: MVP必須**

---

## 📝 補足

- **自動保存**: 将来的に `localStorage` で下書き保存
- **タイムアウト**: 30秒以上経過したらアラート
