# API スキーマ定義

**最終更新**: 2026年2月10日
**バージョン**: 1.0
**対象**: バックエンド開発者向け

---

## 概要

このドキュメントは、フロントエンドの実装から逆算した **必要最小限の API 仕様** です。
各画面が実際にどのデータを使っているかを基に設計しています。

### 認証方式

- Firebase Auth の ID トークンを `Authorization: Bearer <idToken>` ヘッダーで送信
- 全ての `/api/*` エンドポイントでサーバー側トークン検証を実施
- トークン未指定 or 無効 → `401 Unauthorized`

### 共通エラーレスポンス

```json
{
  "error": "エラーメッセージ"
}
```

| ステータス | 意味                     |
| ---------- | ------------------------ |
| 400        | リクエスト不正           |
| 401        | 未認証 / トークン無効    |
| 404        | リソースが見つからない   |
| 429        | レート制限超過           |
| 500        | サーバー内部エラー       |

---

## 画面 → API 対応表

| 画面        | 使用 API                                            |
| ----------- | --------------------------------------------------- |
| Dashboard   | `GET /api/quests/today` + `GET /api/users/me/stats` |
| Quest       | `GET /api/quests/today` + `POST /api/submissions`   |
| Result      | `GET /api/submissions/:submissionId`                 |
| Ranking     | `GET /api/leaderboard/daily`                         |

---

## 1. 認証 API

### `POST /api/auth/signup`

Google ログイン後、Firebase ID トークンをサーバーに送信してセッションを確立する。

**リクエスト**

```json
{
  "uid": "eyJhbGciOiJSUzI1NiIs...",
  "displayName": "hogehoge",
  "email": "hoge@hoge.com"
}
```

**レスポンス (200)**

```json
{
  "id": "user_abc123",
  "email": "user@example.com",
  "displayName": "Taro Yamada"
}
```

**処理フロー**

1. `idToken` を Firebase Admin SDK で検証
2. Firestore `users` コレクションにユーザーが存在しなければ新規作成
3. 存在すれば `updatedAt` を更新
4. ユーザー情報を返却

---

## 2. クエスト API

### `GET /api/quests/today`

本日のアクティブなクエストを1件返す。

> Dashboard の `QuestCard` と Quest 画面の `QuestPrompt` が使用。

**レスポンス (200)**

```json
{
  "questId": "2026-02-10_quest001",
  "date": "2026-02-10",
  "title": "円安と輸出企業",
  "prompt": "Discuss the impact of a weaker yen on Japanese export companies from three different perspectives: profitability, competitiveness in global markets, and supply chain management.",
  "wordCountMin": 150,
  "wordCountMax": 200,
  "difficulty": "medium",
  "category": "economics"
}
```

**エラー**

| ステータス | 条件                               |
| ---------- | ---------------------------------- |
| 404        | 本日のクエストが存在しない         |

**Firestore クエリ**

```
quests コレクションから date == 今日(JST) かつ isActive == true のドキュメントを1件取得
```

---

## 3. 提出・採点 API

### `POST /api/submissions/create`

英作文を提出し、AI 採点を実行して結果を返す。

> Quest 画面の `handleSubmit` が呼び出す。レスポンスの `submissionId` を使って Result 画面に遷移する。

**リクエスト**

```json
{
  "questId": "2026-02-10_quest001",
  "answer": "In response to the depreciation of the yen, our company will prioritize cost-efficiency while maintaining..."
}

header
userId: eyJhbGciOiJSUzI1NiIs...
```

**バリデーション（サーバー側）**

| チェック項目       | 条件                                       | エラー |
| ------------------ | ------------------------------------------ | ------ |
| questId            | Firestore に存在し `isActive == true`       | 400    |
| answer             | 空文字でない                               | 400    |
| 単語数             | `wordCountMin` 以上 `wordCountMax` 以下     | 400    |
| レート制限         | 同一ユーザー・同一クエストで3回まで         | 429    |

**レスポンス (200)**

```json
{
  "submissionId": "sub_abc123",
  "questId": "2026-02-10_quest001",
  "userId": "user_abc123",
  "answer": "In response to the depreciation of the yen...",
  "wordCount": 175,
  "scores": {
    "grammar": 22,
    "logic": 24,
    "context": 20,
    "fluency": 21,
    "total": 87
  },
  "feedback": "Good logical structure with clear three-perspective approach. Consider using more specific business terminology in your analysis of supply chain impacts.",
  "createdAt": "2026-02-10T09:30:00Z",
  "updateAt": "2026-02-10T09:30:45Z"
}
```

**処理フロー**

```
1. リクエストバリデーション（questId存在確認、単語数チェック、レート制限）
2. Firestore に submission ドキュメントを作成（scores は空、ステータス: pending）
3. OpenAI API で採点実行（リトライ最大3回）
   → プロンプトで grammar / logic / context / fluency を各 0-25 で採点させる
   → feedback テキストも同時に生成
4. スコア計算: total = grammar + logic + context + fluency
5. Firestore の submission ドキュメントを更新（scores, feedback, scoredAt, processingTime）
6. Firestore の users ドキュメントを更新（totalScore 加算、submissionCount +1）
7. レスポンス返却
```

**採点プロンプト（概要）**

```
以下の英作文を4つの観点で採点してください（各0-25点）:
- Grammar: 文法の正確さ、文構造
- Logic: 論理展開の整合性、説得力
- Context: 文脈に適した語彙、ビジネス用語
- Fluency: 自然な言い回し、読みやすさ

また、改善点を含む feedback を日本語で生成してください。

[問題文]
{quest.prompt}

[解答]
{answer}
```

**タイムアウト・エラー**

| ステータス | 条件                        | 対応                          |
| ---------- | --------------------------- | ----------------------------- |
| 500        | OpenAI API 失敗（3回リトライ後） | submission を `error` 状態で保存 |
| 504        | 30秒以上応答なし            | タイムアウトエラー返却        |

---

### `GET /api/submissions/get`

採点結果を取得する。

> Result 画面が `submissionId` をクエリパラメータで受け取り呼び出す。
>
**リクエスト**
header: userId

**レスポンス (200)**

```json
{
  "submissionId": "sub_abc123",
  "questId": "2026-02-10_quest001",
  "userId": "user_abc123",
  "answer": "In response to the depreciation of the yen...",
  "wordCount": 175,
  "scores": {
    "grammar": 22,
    "logic": 24,
    "context": 20,
    "fluency": 21,
    "total": 87
  },
  "feedback": "Good logical structure with clear three-perspective approach...",
  "submittedAt": "2026-02-10T09:30:00Z",
  "scoredAt": "2026-02-10T09:30:45Z",
  "processingTime": 2300
}
```

**エラー**

| ステータス | 条件                                         |
| ---------- | -------------------------------------------- |
| 404        | submissionId が存在しない                     |
| 403        | 他ユーザーの submission を閲覧しようとした場合 |

---

## 4. ユーザー統計 API

### `GET /api/users/me/stats`

認証中ユーザーのダッシュボード用統計を返す。

> Dashboard の `StatsCards` が使用。
**リクエスト**
header: userId

**レスポンス (200)**

```json
{
  "todayScore": 87,
  "rank": 4,
  "streak": 3
}
```

**計算ロジック**

| フィールド   | 算出方法                                                          |
| ------------ | ----------------------------------------------------------------- |
| `todayScore` | 今日の submissions から最高スコアの `total` を取得。未提出なら `0` |
| `rank`       | 今日の leaderboard における順位。未参加なら `0`                    |
| `streak`     | 過去の submissions から連続提出日数を計算                          |

---

## 5. ランキング API

### `GET /api/leaderboard/daily`

本日のデイリーランキングを返す。

> Ranking 画面が使用。

**クエリパラメータ**

| パラメータ | 型     | デフォルト | 説明         |
| ---------- | ------ | ---------- | ------------ |
| `limit`    | number | 10         | 取得件数     |
| `offset`   | number | 0          | オフセット   |

**レスポンス (200)**

```json
{
  "date": "2026-02-10",
  "rankings": [
    {
      "rank": 1,
      "userId": "user_alice",
      "displayName": "Alice Chen",
      "score": 95
    },
    {
      "rank": 2,
      "userId": "user_bob",
      "displayName": "Bob Smith",
      "score": 92
    }
  ],
  "totalUsers": 42
}
```

**計算ロジック**

```
1. 今日の submissions を全件取得
2. userId ごとに最高スコアを集計
3. スコア降順でソート（同点の場合は submittedAt が早い方が上位）
4. rank を振って limit/offset で切り出し
5. totalUsers = ユニークな userId の数
```

---

## Firestore スキーマ

フロントエンドの型定義 (`src/types/index.ts`) と対応しています。

### `users/{uid}`

```typescript
{
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  totalScore: number;        // 累積スコア（全 submission の total 合計）
  submissionCount: number;   // 総提出回数
  badge: string | null;      // 称号（将来実装）
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### `quests/{questId}`

```typescript
{
  questId: string;           // 例: "2026-02-10_quest001"
  date: string;              // "YYYY-MM-DD" (JST)
  title: string;
  prompt: string;
  wordCountMin: number;
  wordCountMax: number;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  isActive: boolean;
  createdAt: Timestamp;
}
```

### `submissions/{submissionId}`

```typescript
{
  submissionId: string;      // 例: "sub_abc123"
  questId: string;           // → quests.questId
  userId: string;            // → users.uid
  answer: string;
  wordCount: number;
  scores: {
    grammar: number;         // 0-25
    logic: number;           // 0-25
    context: number;         // 0-25
    fluency: number;         // 0-25
    total: number;           // 0-100
  };
  feedback: string;
  submittedAt: Timestamp;
  scoredAt: Timestamp;
  processingTime: number;    // ms
}
```

---

## フロントエンド型定義との対応

| フロントの型         | 使用画面             | 対応 API                          |
| -------------------- | -------------------- | --------------------------------- |
| `Quest`              | Dashboard, Quest     | `GET /api/quests/today`           |
| `Submission`         | Result               | `GET /api/submissions/:id`        |
| `Scores`             | Result               | （Submission に内包）             |
| `UserStats`          | Dashboard            | `GET /api/users/me/stats`         |
| `LeaderboardEntry`   | Ranking              | `GET /api/leaderboard/daily`      |
| `DailyLeaderboard`   | Ranking              | `GET /api/leaderboard/daily`      |
| `User`               | Dashboard（将来）    | `POST /api/auth/signin`           |

---

## 実装優先度

バックエンド開発の推奨順序：

### Phase 1: 最小動作（Quest → Result の一連のフロー）

1. **`GET /api/quests/today`** — Firestore から今日のクエスト取得
2. **`POST /api/submissions`** — 解答受付 + OpenAI 採点
3. **`GET /api/submissions/:submissionId`** — 採点結果取得

### Phase 2: ダッシュボード・ランキング

4. **`GET /api/users/me/stats`** — ユーザー統計
5. **`GET /api/leaderboard/daily`** — デイリーランキング

### Phase 3: 認証

6. **`POST /api/auth/signin`** — Google ログイン連携

> **注意**: Phase 3 が完成するまでは、フロントエンドは認証なしで動作します（モックデータ使用）。
> Phase 1 が完成すれば、Quest → Result の **コア体験** がデモ可能になります。
