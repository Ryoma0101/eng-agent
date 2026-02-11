# Leaderboard API（バックエンド共有用）

目的: ランキング画面で使用するエンドポイントの最小スタブ設計を共有する。
優先度: 低（他画面の方が先）

## エンドポイント

- メソッド: GET
- パス: /api/leaderboard/daily
- クエリ:
  - limit（number, 任意, デフォルト10）
  - offset（number, 任意, デフォルト0）

## レスポンス (200)

```json
{
  "date": "2026-02-10",
  "topUsers": [
    {
      "rank": 1,
      "userId": "user_alice",
      "displayName": "Alice",
      "score": 95,
      "submissionCount": 2,
      "lastSubmittedAt": "2026-02-10T11:50:00Z"
    }
  ],
  "totalUsers": 42
}
```

## エラー

- 400: limit/offset が不正
- 500: 予期しないエラー

## スタブ実装（App Router）

```ts
// src/app/api/leaderboard/daily/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get('limit') ?? 10);
  const offset = Number(searchParams.get('offset') ?? 0);

  if (Number.isNaN(limit) || Number.isNaN(offset) || limit < 1 || offset < 0) {
    return NextResponse.json({ error: 'Invalid limit/offset' }, { status: 400 });
  }

  // TODO: Firestore集計に置き換える
  const topUsers = [
    {
      rank: 1,
      userId: 'user_alice',
      displayName: 'Alice',
      score: 95,
      submissionCount: 2,
      lastSubmittedAt: '2026-02-10T11:50:00Z',
    },
    {
      rank: 2,
      userId: 'user_bob',
      displayName: 'Bob',
      score: 92,
      submissionCount: 1,
      lastSubmittedAt: '2026-02-10T10:30:00Z',
    },
  ].slice(offset, offset + limit);

  return NextResponse.json({
    date: '2026-02-10',
    topUsers,
    totalUsers: 42,
  });
}
```

## 補足

- SPECに合わせた設計: GET /api/leaderboard/daily
- Ranking UIは topUsers + totalUsers を使用
- 本実装時にFirestore集計へ差し替え
- フロント側のデモ実装: [src/app/(protected)/ranking/page.tsx](src/app/(protected)/ranking/page.tsx)
