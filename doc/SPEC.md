# 技術仕様書

**最終更新**：2026年2月9日  
**バージョン**：1.0

---

## 1. システムアーキテクチャ

```
┌─────────────────────────────────────────────────────────────┐
│                      ユーザーブラウザ                          │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS
┌──────────────────────▼──────────────────────────────────────┐
│                   Vercel (Next.js)                           │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ App Router (Client)                                      │ │
│  │ - Landing Page                                           │ │
│  │ - Quest View                                             │ │
│  │ - Submission Form                                        │ │
│  │ - Leaderboard                                            │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Route Handlers (Node Runtime) + Server Actions           │ │
│  │ - /api/auth/* → Firebase Auth                            │ │
│  │ - /api/quests/* → Firestore Query                        │ │
│  │ - /api/submissions/* → Score Processing                  │ │
│  │ - /api/scoring/* → OpenAI API Call                       │ │
│  │ - /api/leaderboard/* → Firestore Aggregation            │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   ┌────▼──┐      ┌───▼────┐    ┌───▼────┐
   │Firebase│      │OpenAI  │    │Sentry  │
   │(Auth + │      │GPT-4   │    │(Logs)  │
   │Firestore)     │        │    │        │
   └────────┘      └────────┘    └────────┘
```

---

## 2. 技術スタック（決定済み）

| レイヤー               | 技術                         | 理由                             |
| ---------------------- | ---------------------------- | -------------------------------- |
| **Frontend Framework** | Next.js 16 (App Router)      | SSR/SSG対応、DevX良好            |
| **Language**           | TypeScript                   | 型安全性                         |
| **UI Library**         | shadcn/ui + Tailwind CSS     | アクセシビリティ、カスタマイズ性 |
| **Authentication**     | Firebase Auth                | Googleログイン対応               |
| **Database**           | Firestore                    | リアルタイム、スキーマ柔軟性     |
| **Backend**            | Next.js Route Handlers       | Node runtime、ストリーミング対応 |
| **AI API**             | OpenAI GPT-4                 | 採点品質、JSON形式対応           |
| **Hosting**            | Vercel                       | Next.js最適化、デプロイ自動化    |
| **Monitoring**         | Vercel Logs + Sentry（任意） | エラー追跡                       |
| **Package Manager**    | pnpm                         | 高速、ディスク効率               |

---

## 3. Firestore スキーマ設計

### Collection: `users`

```typescript
{
  uid: string; // Firebase Auth UID
  email: string; // メールアドレス
  displayName: string; // ユーザー表示名
  photoURL: string | null; // プロフィール画像
  totalScore: number; // 累積スコア
  submissionCount: number; // 提出回数
  badge: string | null; // 現在の称号
  createdAt: Timestamp; // アカウント作成時刻
  updatedAt: Timestamp; // 最終更新時刻
}
```

### Collection: `quests`

```typescript
{
  questId: string; // 一意ID（date + hash）
  date: string; // YYYY-MM-DD (JST)
  title: string; // 問題タイトル
  prompt: string; // 問題文
  wordCountMin: number; // 最小字数
  wordCountMax: number; // 最大字数
  difficulty: 'easy' | 'medium' | 'hard';
  category: string; // ビジネス/テクノロジー/など
  isActive: boolean; // 受付中フラグ
  createdAt: Timestamp;
}
```

### Collection: `submissions`

```typescript
{
  submissionId: string;           // 一意ID
  questId: string;                // 参照: quests.questId
  userId: string;                 // 参照: users.uid
  answer: string;                 // ユーザーの解答テキスト
  wordCount: number;              // 字数カウント
  scores: {
    grammar: number;              // 0-25
    logic: number;                // 0-25
    context: number;              // 0-25
    fluency: number;              // 0-25
    total: number;                // 0-100（w1..w4で加算）
  };
  feedback: string;               // AI生成フィードバック（任意）
  isCorrect?: boolean;            // ルール検査（字数等）結果
  submittedAt: Timestamp;
  scoredAt: Timestamp;            // 採点完了時刻
  processingTime: number;         // 採点所要時間（ms）
}
```

### Collection: `leaderboards`

**Document Path**: `/leaderboards/daily/{YYYY-MM-DD}`

```typescript
{
  date: string; // YYYY-MM-DD (JST)
  topUsers: Array<{
    rank: number; // 1, 2, 3, ...
    userId: string;
    displayName: string;
    score: number;
    submissionCount: number; // その日の提出数
    lastSubmittedAt: Timestamp; // 同点の場合の判定材料
  }>;
  generatedAt: Timestamp; // ランキング生成時刻
}
```

**Document Path**: `/leaderboards/weekly/{YYYY-Www}`（例：2026-W06）

```typescript
{
  week: string; // YYYY-Www形式
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  topUsers: Array<{
    rank: number;
    userId: string;
    displayName: string;
    totalScore: number; // 週間総計
    submissionCount: number;
  }>;
  generatedAt: Timestamp;
}
```

### Collection: `audit_logs`

```typescript
{
  timestamp: Timestamp;
  eventType: string; // "submission", "score_error", "user_signup"
  userId: string;
  details: Record<string, any>;
}
```

---

## 4. API 仕様

### 4.1 認証 API

#### `POST /api/auth/signin`

ユーザーログイン（Googleログイン）

**リクエスト**

```json
{
  "provider": "google",
  "token": "idToken"
}
```

**レスポンス** (200)

```json
{
  "uid": "user123",
  "email": "user@example.com",
  "displayName": "User Name"
}
```

**エラー** (401/400)

```json
{ "error": "Authentication failed" }
```

---

### 4.2 クエスト API

#### `GET /api/quests/today`

本日のクエストを取得

**レスポンス** (200)

```json
{
  "questId": "2026-02-09_quest001",
  "date": "2026-02-09",
  "title": "円安と輸出企業",
  "prompt": "円安が輸出企業に与える影響について...",
  "wordCountMin": 150,
  "wordCountMax": 200,
  "difficulty": "medium",
  "category": "economics"
}
```

---

### 4.3 提出・採点 API

#### `POST /api/submissions`

解答を提出し、採点を実行

**リクエスト**

```json
{
  "questId": "2026-02-09_quest001",
  "answer": "In response to the falling yen..."
}
```

**レスポンス** (200 - ストリーミングまたはポーリング)

```json
{
  "submissionId": "sub_abc123",
  "questId": "2026-02-09_quest001",
  "userId": "user123",
  "answer": "In response to...",
  "wordCount": 175,
  "scores": {
    "grammar": 22,
    "logic": 24,
    "context": 20,
    "fluency": 21,
    "total": 87
  },
  "feedback": "Good structure, but consider...",
  "submittedAt": "2026-02-09T10:30:00Z",
  "scoredAt": "2026-02-09T10:30:45Z",
  "processingTime": 2300
}
```

**エラーハンドリ**

| ステータス | エラー         | 対応                                |
| ---------- | -------------- | ----------------------------------- |
| 400        | 字数不足/超過  | ルール検査で即座に返却              |
| 400        | 無効なQuestId  | quest存在チェック                   |
| 429        | レート制限超過 | 1クエストあたり3回まで              |
| 500        | AI采点失敗     | リトライ（最大3回）→ 保留状態で記録 |
| 504        | タイムアウト   | 30秒以上応答がない場合              |

---

### 4.4 ランキング API

#### `GET /api/leaderboard/daily`

本日のランキングを取得

**クエリ**

```
?limit=10&offset=0
```

**レスポンス** (200)

```json
{
  "date": "2026-02-09",
  "topUsers": [
    {
      "rank": 1,
      "userId": "user_xyz",
      "displayName": "Alice",
      "score": 95,
      "submissionCount": 2,
      "lastSubmittedAt": "2026-02-09T11:50:00Z"
    },
    {
      "rank": 2,
      "userId": "user_abc",
      "displayName": "Bob",
      "score": 92,
      "submissionCount": 1,
      "lastSubmittedAt": "2026-02-09T10:30:00Z"
    }
  ],
  "totalUsers": 42
}
```

#### `GET /api/leaderboard/weekly`

週間ランキングを取得

**クエリ**

```
?week=2026-W06&limit=20
```

**レスポンス** (200)

```json
{
  "week": "2026-W06",
  "startDate": "2026-02-03",
  "endDate": "2026-02-09",
  "topUsers": [...],
  "totalUsers": 42
}
```

---

## 5. 採点アルゴリズム詳細

### 5.1 LLM採点（GPT-4）

**プロンプトテンプレート**

```
You are an expert English business writing evaluator.
Score the following essay on 4 dimensions (each 0-25):

1. Grammar (G): Grammatical accuracy, sentence structure
2. Logic (L): Coherence, logical flow, persuasiveness
3. Context (C): Appropriate vocabulary, business terminology
4. Fluency (F): Natural expression, readability

---
QUESTION:
{{ prompt }}

WORD COUNT REQUIREMENT: {{ wordCountMin }}-{{ wordCountMax }}

---
ESSAY:
{{ answer }}

---
Return a JSON object with this exact format:
{
  "grammar": <0-25>,
  "logic": <0-25>,
  "context": <0-25>,
  "fluency": <0-25>,
  "feedback": "<short feedback in English>"
}
```

**実装**

- **呼び出し**：Route Handler (`/api/submissions`)
- **モデル**：`gpt-4` or `gpt-4-turbo`
- **Temperature**：0.3（安定性重視）
- **Max tokens**：500
- **Timeout**：30秒

### 5.2 ルール補正

採点後に以下のルール検査を実行：

```typescript
function applyRuleCorrection(
  scores: Scores,
  answer: string,
  wordCountMin: number,
  wordCountMax: number
): Scores {
  const wordCount = answer.split(/\s+/).length;

  // 字数不足 → -5点
  if (wordCount < wordCountMin) {
    scores.total = Math.max(0, scores.total - 5);
  }

  // 字数超過 → -3点
  if (wordCount > wordCountMax) {
    scores.total = Math.max(0, scores.total - 3);
  }

  // 極端に短い（50語未満）→ 採点保留
  if (wordCount < 50) {
    return { ...scores, total: -1, isCorrect: false };
  }

  return scores;
}
```

### 5.3 スコア正規化

```typescript
const WEIGHTS = {
  grammar: 0.25,
  logic: 0.3,
  context: 0.25,
  fluency: 0.2,
};

const totalScore = Math.round(
  scores.grammar * WEIGHTS.grammar +
    scores.logic * WEIGHTS.logic +
    scores.context * WEIGHTS.context +
    scores.fluency * WEIGHTS.fluency
);
```

---

## 6. リアルタイム・ランキング生成

### 方式：日付キービルドアップ + クエリ時集計

```typescript
// /api/leaderboard/daily
async function getDailyLeaderboard(limit = 10) {
  const today = getTodayJST(); // "YYYY-MM-DD"

  // 1. 本日のSubmissionを全件取得
  const submissions = await db
    .collection('submissions')
    .where('submittedAt', '>=', startOfDayJST(today))
    .where('submittedAt', '<', startOfDayJST(tomorrow))
    .get();

  // 2. ユーザーごとにスコア集計（最後の提出スコア）
  const userScores = new Map();
  for (const doc of submissions.docs) {
    const { userId, scores, submittedAt } = doc.data();
    if (!userScores.has(userId) || submittedAt > userScores.get(userId).lastSubmittedAt) {
      userScores.set(userId, {
        total: scores.total,
        lastSubmittedAt: submittedAt,
        count: (userScores.get(userId)?.count ?? 0) + 1,
      });
    }
  }

  // 3. ランキング生成（スコア降順、同点時は提出時間早い順）
  const ranking = Array.from(userScores.entries())
    .sort(([, a], [, b]) => {
      if (b.total !== a.total) return b.total - a.total;
      return a.lastSubmittedAt - b.lastSubmittedAt;
    })
    .slice(0, limit)
    .map((entry, index) => ({
      rank: index + 1,
      ...entry,
    }));

  return ranking;
}
```

### キャッシング戦略

```typescript
// オプション：デイリーランキングをキャッシュ
// /leaderboards/daily/{YYYY-MM-DD} document
// TTL: 24時間（翌日0:00 JSTにリセット）
```

---

## 7. 環境変数管理

### `.env.local` 必須項目

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx

# OpenAI
OPENAI_API_KEY=sk-xxx

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### アクセス制御

- **NEXT*PUBLIC*\* **：クライアント側でアクセス可能（秘密情報を含めない）
- **その他**：サーバー側のみ（Route Handler）

---

## 8. エラーハンドリング・リトライ戦略

### AI採点失敗時のフロー

```
提出
  ↓
AI採点API呼び出し
  ↓
[ SUCCESS ] → スコア保存
  ↓
[ FAILURE - リトライ可能 ]
  ↓
リトライ1 (3秒待機)
  ↓
[ SUCCESS / FAILURE ]
  ↓
[ リトライ2 (10秒待機) ]
  ↓
[ SUCCESS / FAILURE ]
  ↓
[ リトライ3 (30秒待機) ]
  ↓
[ SUCCESS ] → スコア保存
  ↓
[ FINAL FAILURE ] → 保留状態(status="pending")
    → 管理者にログ
    → ユーザーに通知：「採点中です...」
    → 後でバッチ処理でリトライ
```

### 実装例

```typescript
async function scoreSubmissionWithRetry(
  submission: Submission,
  maxRetries = 3
): Promise<Scores | null> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const scores = await callOpenAIScoring(submission);
      return scores;
    } catch (error) {
      const waitTime = [3000, 10000, 30000][attempt];
      console.warn(`Scoring failed, retry ${attempt + 1}/${maxRetries} after ${waitTime}ms`);
      await new Promise((r) => setTimeout(r, waitTime));
    }
  }
  return null; // 最終失敗 → 保留
}
```

---

## 9. パフォーマンス・スケーリング

### レート制限

```typescript
// ユーザーごとの提出制限
const SUBMISSION_LIMIT_PER_QUEST = 3;
const SUBMISSION_LIMIT_PER_DAY = 10;

// OpenAI API制限
const OPENAI_RPM = 3500; // Requests per minute（プランに応じて）
const OPENAI_TPM = 90000; // Tokens per minute
```

### キャッシング戦略

| 対象                   | TTL   | キー構成                    |
| ---------------------- | ----- | --------------------------- |
| クエスト情報           | 24h   | `quests:{questId}`          |
| ユーザープロフィール   | 1h    | `user:{uid}`                |
| デイリーランキング     | 1h    | `leaderboard:daily:{date}`  |
| ウィークリーランキング | 1週間 | `leaderboard:weekly:{week}` |

---

## 10. セキュリティ

### 認証

- Firebase Auth + JWT トークン検証
- ユーザーは `uid` で識別
- CORS設定：`https://yourdomain.com` のみ許可

### API呼び出しの保護

```typescript
// Route Handler内でのトークン検証
export async function POST(request: Request) {
  const session = await getSession(); // Firebase Admin SDK
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }
  // 処理継続
}
```

### 秘密情報

- OpenAI キーはサーバーサイドのみで使用
- Firestore Rules で行レベルセキュリティ設定
- 本番環境では Vercel Secrets Manager を使用

---

## 11. デプロイ・運用

### デプロイメントパイプライン

```
git push to main
  ↓
GitHub Actions / Vercel Webhook
  ↓
pnpm install
  ↓
pnpm build
  ↓
pnpm lint（ESLint + Prettier）
  ↓
[ PASS ] → Vercel デプロイ
  ↓
[ FAIL ] → ビルド失敗通知
```

### モニタリング

- **Vercel Logs**：ログ確認
- **Sentry**（任意）：エラー追跡
- **Firebase Console**：DB状況確認
- **Google Cloud Console**：API quota確認

---

## 12. 今後の拡張予定

- [ ] ウィークリー集計の自動化（Cloud Tasks）
- [ ] SNS共有機能（Twitter/LinkedIn）
- [ ] 称号システムのUI実装
- [ ] 外部ニュースAPI連携（NewsAPI）
- [ ] ユーザースタディングの分析ダッシュボード
- [ ] 多言語対応（日本語→英語）
- [ ] モバイルアプリ化（React Native）

---

## 13. 参考・リソース

- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Firebase Admin SDK](https://firebase.google.com/docs/database/admin/start)
- [OpenAI API Docs](https://platform.openai.com/docs/guides/gpt-4)
- [Firestore Best Practices](https://cloud.google.com/firestore/docs/best-practices)
