# 画面設計書

**最終更新**：2026年2月10日  
**バージョン**：1.1

---

## 🗺️ 画面遷移図

```
[Landing]
   ↓
[Login/Auth]
   ↓
[Dashboard(Home)] ★最重要
   ├──→ [Quest(問題回答)] ★コア
   │         ↓
   │      [Result(採点/添削)] ★差別化
   │         ├──→ [Ranking]
   │         └──→ [Dashboard]
   │
   ├──→ [Ranking]
   ├──→ [History/Progress]
   └──→ [Profile]
```

---

## 📱 画面一覧



| 画面名 | パス | Issue | 優先度 | 実装時間 | 説明 |
|--------|------|-------|--------|----------|------|
| **Landing** | `/` | [#1](https://github.com/Ryoma0101/enquests/issues/1) | 高 | 30分 | 世界観提示＋ログイン誘導 |
| **Login/Auth** | `/login` | [#3](https://github.com/Ryoma0101/enquests/issues/3) | 高 | 40分 | ユーザー識別（Google/匿名） |
| **Dashboard** | `/dashboard` | [#13](https://github.com/Ryoma0101/enquests/issues/13) | 最重要 | 1h | ハブ画面、今日のクエスト表示 |
| **Quest** | `/quest` | [#4](https://github.com/Ryoma0101/enquests/issues/4) | 最重要 | 50分 | 英作文入力（コア体験） |
| **Result** | `/result` | [#5](https://github.com/Ryoma0101/enquests/issues/5) | 最重要 | 1h | 採点結果＋添削表示（差別化） |
| **Ranking** | `/ranking` | [#2](https://github.com/Ryoma0101/enquests/issues/2) | 高 | 45分 | デイリーランキング |
| **History** | `/history` | [#14](https://github.com/Ryoma0101/enquests/issues/14) | 中 | 50分 | 過去スコア・成長可視化 |
| **Profile** | `/profile` | [#15](https://github.com/Ryoma0101/enquests/issues/15) | 低 | 30分 | 称号・設定 |

---

## 🎯 実装優先度

### Phase 1: MVP（ハッカソン1日目）

- [#1](https://github.com/Ryoma0101/enquests/issues/1) Landing
- [#3](https://github.com/Ryoma0101/enquests/issues/3) Login/Auth
- [#13](https://github.com/Ryoma0101/enquests/issues/13) Dashboard
- [#4](https://github.com/Ryoma0101/enquests/issues/4) Quest
- [#5](https://github.com/Ryoma0101/enquests/issues/5) Result（簡易版）

### Phase 2: 競技性追加（2日目）
- [#2](https://github.com/Ryoma0101/enquests/issues/2) Ranking
- ⚠️ Result（完全版：レーダーチャート、フレーズ抽出）

### Phase 3: 継続性（3日目以降）
- [#14](https://github.com/Ryoma0101/enquests/issues/14) History/Progress
- [#15](https://github.com/Ryoma0101/enquests/issues/15) Profile

---

## 📂 ファイル配置

```
src/
├── app/
│   ├── (public)/          # 未認証でアクセス可能
│   │   ├── page.tsx       → Landing
│   │   └── login/
│   │       └── page.tsx   → Login
│   │
│   ├── (protected)/       # 認証必須
│   │   ├── dashboard/
│   │   │   └── page.tsx   → Dashboard
│   │   ├── quest/
│   │   │   └── page.tsx   → Quest
│   │   ├── result/
│   │   │   └── page.tsx   → Result
│   │   ├── ranking/
│   │   │   └── page.tsx   → Ranking
│   │   ├── history/
│   │   │   └── page.tsx   → History
│   │   └── profile/
│   │       └── page.tsx   → Profile
│   │
│   └── api/               # API Routes
│       ├── auth/
│       ├── quests/
│       ├── submissions/
│       └── leaderboard/
│
├── components/
│   ├── landing/           # Landing専用
│   ├── auth/              # Auth専用
│   ├── dashboard/         # Dashboard専用
│   ├── quest/             # Quest専用
│   ├── result/            # Result専用
│   ├── ranking/           # Ranking専用
│   ├── history/           # History専用
│   ├── shared/            # 共通コンポーネント
│   │   ├── Header.tsx
│   │   ├── Navigation.tsx
│   │   └── ScoreCard.tsx
│   └── ui/                # shadcn/ui
│
└── lib/
    ├── firebase/
    ├── hooks/
    └── utils/
```

---

## 🎨 共通デザイン原則

### カラーパレット

```typescript
colors: {
  primary: "slate-900",      // メイン
  secondary: "slate-700",    // サブ
  accent: "blue-600",        // CTA
  success: "green-600",      // スコア良
  warning: "yellow-600",     // 注意
  danger: "red-600",         // エラー
  muted: "slate-400",        // 非活性
}
```

### タイポグラフィ

- **見出し（H1）**: `text-4xl font-bold`
- **見出し（H2）**: `text-2xl font-semibold`
- **本文**: `text-base`
- **キャプション**: `text-sm text-slate-500`

### レイアウト

- **最大幅**: `max-w-7xl mx-auto px-4`
- **カード**: shadcn/ui `Card` コンポーネント
- **ボタン**: shadcn/ui `Button` コンポーネント

---

## 📋 共通コンポーネント

### Header（全画面共通）

```typescript
// components/shared/Header.tsx
- ロゴ
- ナビゲーション（Dashboard / Ranking / History / Profile）
- ユーザーアイコン
```

### Navigation（認証後）

```typescript
// components/shared/Navigation.tsx
-Dashboard - Ranking - History - Profile;
```

### ScoreCard（スコア表示）

```typescript
// components/shared/ScoreCard.tsx
props:
  - score: number (0-100)
  - breakdown?: { G, L, C, F }
  - size: "sm" | "md" | "lg"
```

---

## 📄 各画面の詳細設計

各画面の詳細は `doc/screens/` に配置されています：

| ファイル                             | 内容                           |
| ------------------------------------ | ------------------------------ |
| [landing.md](screens/landing.md)     | Landing（トップ）の詳細設計    |
| [login.md](screens/login.md)         | Login/Authの詳細設計           |
| [dashboard.md](screens/dashboard.md) | Dashboard（ホーム）の詳細設計  |
| [quest.md](screens/quest.md)         | Quest（問題回答）の詳細設計    |
| [result.md](screens/result.md)       | Result（採点・添削）の詳細設計 |
| [ranking.md](screens/ranking.md)     | Rankingの詳細設計              |
| [history.md](screens/history.md)     | History/Progressの詳細設計     |
| [profile.md](screens/profile.md)     | Profileの詳細設計              |

---

## 🔐 認証フロー

```
1. ユーザーが Landing にアクセス
2. "Start Training" ボタンクリック
3. → /login へ遷移
4. Googleログイン
5. → /dashboard へ遷移
6. 以降、認証状態を保持
```

### 認証状態管理

```typescript
// lib/hooks/useAuth.ts
- Firebase Auth の状態を監視
- user / loading / error を返す
- (protected) ルートで認証チェック
```

---

## 📡 データフロー

### Quest → Result の流れ

```
1. [Quest] ユーザーが英作文を入力
2. [Quest] Submit ボタンをクリック
3. → POST /api/submissions { questId, answer }
4. [API] OpenAI で採点
5. [API] Firestore に保存
6. ← { submissionId, scores, feedback }
7. [Result] スコア表示
8. [Result] 添削表示
```

### Dashboard のデータ取得

```
1. [Dashboard] マウント時に以下を取得:
   - GET /api/quests/today → 今日のクエスト
   - GET /api/leaderboard/daily → 今日のランキング
   - GET /api/users/{uid}/stats → 自分の統計
2. 取得したデータを表示
```

---

## 🚀 実装の進め方

### Step 1: 骨格作成（1時間）

```bash
# ルーティング作成
src/app/(public)/page.tsx
src/app/(public)/login/page.tsx
src/app/(protected)/dashboard/page.tsx
src/app/(protected)/quest/page.tsx
src/app/(protected)/result/page.tsx
src/app/(protected)/ranking/page.tsx
src/app/(protected)/history/page.tsx
src/app/(protected)/profile/page.tsx

# 共通コンポーネント
src/components/shared/Header.tsx
src/components/shared/Navigation.tsx
```

### Step 2: UIスタブ（各画面30-60分）

- ダミーデータで表示確認
- shadcn/ui コンポーネント配置
- レスポンシブ確認

### Step 3: API連携（各API 40-60分）

- スタブAPIを実装
- フロントから呼び出し
- エラーハンドリング

### Step 4: 統合テスト（1時間）

- 画面遷移確認
- データ連携確認
- エッジケース確認

---

## 🎯 ハッカソン向け削減案

時間が足りない場合の優先順位：

### 必須（削れない）

- Landing
- Login
- Dashboard
- Quest
- Result（簡易版）

### 推奨（競技性のため）

- Ranking

### 任意（削減可能）

- ❌ History（グラフ等）
- ❌ Profile（称号UI）
- ❌ Result の高度な機能（レーダーチャート、フレーズ抽出）

---

## 📚 参考リソース

- [Next.js App Router](https://nextjs.org/docs/app)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase Auth](https://firebase.google.com/docs/auth)
