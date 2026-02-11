# Profile（プロフィール画面）

**Issue**: [#15](https://github.com/Ryoma0101/eng-agent/issues/15)  
**ファイル**: `src/app/(protected)/profile/page.tsx`  
**優先度**: 任意（Phase 3）  
**実装時間**: 30分

---

## 🎯 目的・役割

- **自己認識**: ユーザー情報の確認
- **実績**: バッジ、総スコアなど
- **設定**: ログアウト

---

## 📐 画面レイアウト

```
┌─────────────────────────────────────────┐
│  [Header] Profile                       │
├─────────────────────────────────────────┤
│  👤 プロフィール                         │
│                                         │
│  ┌───────────────────────────────┐    │
│  │  [Avatar/Icon]                │    │
│  │  Alice                        │    │
│  │  alice@example.com            │    │
│  └───────────────────────────────┘    │
│                                         │
│  実績:                                  │
│  🏆 12 提出完了                         │
│  📊 平均スコア: 86 pts                  │
│  🔥 連続日数: 5 日                      │
│                                         │
│  バッジ:                                │
│  🥇 初提出 🥈 10回達成 🥉 高得点       │
│                                         │
│  [ログアウト]                           │
│  [← 戻る]                               │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📦 UI要素一覧

| 要素                 | コンポーネント | 内容                           |
| -------------------- | -------------- | ------------------------------ |
| **タイトル**         | `<h1>`         | 「👤 プロフィール」            |
| **ユーザー情報**     | `Card`         | Avatar, Name, Email            |
| **実績**             | `Card`         | 提出回数、平均スコア、連続日数 |
| **バッジ**           | `Badge` ×N     | 各種バッジ                     |
| **ログアウトボタン** | `Button`       | ログアウト → `/login`          |
| **戻るボタン**       | `Button`       | Dashboard へ                   |

---

## 🔌 データ取得/API呼び出し

### 1. ユーザー情報取得

```typescript
const user = auth.currentUser;
const profile = await fetch(`/api/users/${user.uid}`).then(r => r.json());

// レスポンス例
{
  userId: "user_abc123",
  displayName: "Alice",
  email: "alice@example.com",
  totalSubmissions: 12,
  averageScore: 86,
  streak: 5,
  badges: ["first_submission", "10_submissions", "high_score"]
}
```

---

## 🧩 状態管理

```typescript
const [profile, setProfile] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchProfile() {
    const user = auth.currentUser;
    const data = await fetch(`/api/users/${user.uid}`).then((r) => r.json());
    setProfile(data);
    setLoading(false);
  }
  fetchProfile();
}, []);

async function handleLogout() {
  await signOut(auth);
  router.push('/login');
}
```

---

## 🧭 ナビゲーション

| アクション     | 遷移先       |
| -------------- | ------------ |
| **ログアウト** | `/login`     |
| **戻る**       | `/dashboard` |

---

## 🎨 使用コンポーネント（shadcn/ui）

- `Card` - プロフィールカード、実績カード
- `Button` - ログアウト、戻る
- `Badge` - バッジ表示
- `Avatar` - アバター表示（オプション）

---

## 📁 ファイル配置

```
src/
├── app/
│   └── (protected)/
│       └── profile/
│           └── page.tsx             ← Profile
│
├── components/
│   ├── profile/
│   │   ├── UserInfo.tsx             ← ユーザー情報
│   │   ├── UserStats.tsx            ← 実績表示
│   │   └── BadgeList.tsx            ← バッジ一覧
│   └── ui/
│       ├── card.tsx
│       ├── button.tsx
│       ├── badge.tsx
│       └── avatar.tsx
│
└── lib/
    └── api/
        └── users.ts                 ← ユーザー情報取得
```

---

## 💻 実装例

```tsx
// src/app/(protected)/profile/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      const user = auth.currentUser;
      if (!user) {
        router.push('/login');
        return;
      }

      const data = await fetch(`/api/users/${user.uid}`).then((r) => r.json());
      setProfile(data);
      setLoading(false);
    }
    fetchProfile();
  }, [router]);

  async function handleLogout() {
    await signOut(auth);
    router.push('/login');
  }

  if (loading || !profile) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-3xl font-bold">👤 プロフィール</h1>

        {/* ユーザー情報 */}
        <Card className="mb-6 p-6">
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl">
              👤
            </div>
            <div>
              <h2 className="text-xl font-bold">{profile.displayName}</h2>
              <p className="text-sm text-slate-500">{profile.email}</p>
            </div>
          </div>
        </Card>

        {/* 実績 */}
        <Card className="mb-6 p-6">
          <h3 className="mb-4 font-semibold">実績</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-600">🏆 提出完了</span>
              <span className="font-bold">{profile.totalSubmissions} 回</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">📊 平均スコア</span>
              <span className="font-bold">{profile.averageScore} pts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">🔥 連続日数</span>
              <span className="font-bold">{profile.streak} 日</span>
            </div>
          </div>
        </Card>

        {/* バッジ */}
        <Card className="mb-6 p-6">
          <h3 className="mb-4 font-semibold">バッジ</h3>
          <div className="flex flex-wrap gap-2">
            {profile.badges.map((badge) => (
              <Badge key={badge} variant="secondary">
                {badge}
              </Badge>
            ))}
          </div>
        </Card>

        {/* アクション */}
        <div className="flex gap-4">
          <Button onClick={handleLogout} variant="destructive">
            ログアウト
          </Button>
          <Button onClick={() => router.push('/dashboard')} variant="outline">
            ← 戻る
          </Button>
        </div>
      </div>
    </div>
  );
}
```

---

## ✅ チェックリスト

- [ ] ユーザー情報（名前、メール）が表示される
- [ ] 実績（提出回数、平均スコア、連続日数）が表示される
- [ ] バッジが表示される
- [ ] ログアウトボタンが動作
- [ ] 戻るボタンで Dashboard へ遷移

---

## 🚀 実装優先度

**Phase 3: 任意（時間あれば）**

---

## 📝 補足

- **Avatar**: Firebase Auth の photoURL を使用可能
- **バッジ**: 将来的に条件達成で自動付与
