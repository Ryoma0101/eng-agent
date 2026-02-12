# EnQuest

2031年、生成AIと協働して英語で仕事をすることが当たり前になります。しかし既存の英語学習は「問題を解く」だけで、実務に直結していません。

**EnQuest**は、英作文を"競技"として楽しみながら、同時に「実務でそのまま使えるアウトプット」を生成するAIエージェントです。スコアだけでなく、英語で仕事を遂行する力を鍛えます。

**WILLとTNDのハッカソンチーム3の製作物**

## 🚀 クイックスタート

### 前提条件

- **Node.js**: v20系
- **パッケージマネージャ**: pnpm

### インストール

```bash
# 依存関係をインストール
pnpm install

# 環境変数を設定
cp .env.example .env.local
# .env.local を編集して各キーを入力
```

### 開発サーバー起動

```bash
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## 📋 利用可能なコマンド

```bash
# 開発サーバー起動
pnpm dev

# 本番ビルド
pnpm build

# 本番サーバー起動
pnpm start

# コード品質チェック（Lint）
pnpm lint

# Lintエラーを自動修正
pnpm lint:fix

# コードフォーマット
pnpm format

# フォーマットチェック
pnpm format:check
```

## 🏗️ ディレクトリ構成

```
src/
├── app/                    # ルーティング（App Router）
├── components/             # React コンポーネント
│   └── ui/                 # shadcn/ui コンポーネント
├── lib/
│   ├── firebase/          # Firebase 設定・認証
│   └── utils/             # ユーティリティ関数
├── server/                # サーバーサイドロジック（AI採点・生成）
└── types/                 # TypeScript型定義・Zodスキーマ
```

## 🛠️ 採用技術

### フレームワーク・ライブラリ

- **Next.js 16** - React フレームワーク（App Router）
- **React 19** - UI ライブラリ
- **TypeScript** - 型安全性
- **Tailwind CSS 4** - スタイリング
- **shadcn/ui** - UIコンポーネント集

### 開発ツール

- **Prettier** - コードフォーマッタ（prettier-plugin-tailwindcss 対応）
- **ESLint 9** - Linter
- **Husky** - Git Hooks
- **lint-staged** - ステージ済みファイルに対するLint実行

### バックエンド・サービス

- **Firebase** - 認証・ホスティング・データベース
- **OpenAI API** - AI採点・生成エンジン

## ⚙️ 環境変数

`.env.local` に以下を設定してください：

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# OpenAI
OPENAI_API_KEY=

# Database
DATABASE_URL=

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📦 Git Hooks

このプロジェクトは Husky + lint-staged を使用して、自動的にコードを検証・フォーマットします：

- **Pre-commit Hook**: ステージ済みファイルに対して ESLint + Prettier を実行

## 🔐 セキュリティ

- `.env.local` は `.gitignore` に含まれています（コミットされません）
- Firebase の認証キーは `.env.example` で管理され、実際のキーは環境変数から読み込みます
- `NEXT_PUBLIC_*` で始まる変数のみクライアント側でアクセス可能です

## � ドキュメント

プロジェクトのドキュメントは `doc/` ディレクトリに集約されています：

| ファイル                         | 内容                                                      |
| -------------------------------- | --------------------------------------------------------- |
| [doc/CONTEXT.md](doc/CONTEXT.md) | プロジェクトのコンセプト、市場課題、主要機能              |
| [doc/SPEC.md](doc/SPEC.md)       | 技術仕様書、API設計、Firestore スキーマ、採点アルゴリズム |

**開発時は必ず目を通してください。**

---

## 🌳 ブランチ戦略 & 開発ワークフロー

このプロジェクトは **GitHub Flow** ベースで運用します。

### ブランチルール

#### 主なブランチ

| ブランチ  | 用途               | 保護ルール                       |
| --------- | ------------------ | -------------------------------- |
| `main`    | 本番・デプロイ対象 | ✅ PRレビュー必須、CI/CD通過必須 |
| `develop` | 開発統合ブランチ   | ✅ PRレビュー必須                |

#### 機能ブランチの命名規則

```
feat/{feature-name}         # 新機能実装
  例: feat/leaderboard-display

fix/{issue-name}            # バグ修正
  例: fix/scoring-calculation-bug

docs/{doc-name}             # ドキュメント更新
  例: docs/api-specification

refactor/{component-name}   # リファクタリング
  例: refactor/quest-page-component

test/{feature-name}         # テスト追加
  例: test/api-error-handling

chore/{task-name}           # 依存関係更新など
  例: chore/upgrade-typescript
```

**ルール**

- ブランチ名は**英小文字 + ハイフン**で統一
- スラッシュ `/` で種類を分類
- オブジェクト指向的に、短く明確に

---

### 開発フロー

```
1. develop から機能ブランチを切る
   $ git checkout develop
   $ git pull origin develop
   $ git checkout -b feat/my-feature

2. 機能実装・コミット
   $ git add .
   $ git commit -m "feat: 〇〇機能を追加"
   → Husky + lint-staged が自動実行

3. PRを作成（develop へ）
   - PR タイトル：[feat] 機能の説明
   - PR 説明：取り組む内容、スクリーンショット等
   - Reviewers を指定

4. レビューで指摘 → 修正・追加コミット
   $ git commit -m "fix: PR レビューで指摘された〇〇を修正"

5. Approve を得て、Merge
   → CI/CD が main にデプロイ（自動）

6. 統合テスト後、本番 Release
```

---

### コミットメッセージ慣例

[Conventional Commits](https://www.conventionalcommits.org/) に準拠：

```
<type>(<scope>): <description>

<body>（オプション）

<footer>（オプション）
```

#### 例

```
feat(scoring): AI採点APIをOpenAIに統合

- GPT-4を使用した4次元採点（G/L/C/F）
- リトライロジックを実装
- 採点結果をFirestoreに保存

Fixes #123
```

#### Type の種類

| Type       | 意味                       |
| ---------- | -------------------------- |
| `feat`     | 新機能                     |
| `fix`      | バグ修正                   |
| `docs`     | ドキュメント               |
| `style`    | コード整形（機能変更なし） |
| `refactor` | コード改善                 |
| `perf`     | パフォーマンス改善         |
| `test`     | テスト追加・修正           |
| `chore`    | 依存関係更新など           |

---

### PR（プルリクエスト）チェックリスト

PRを作成する前に、以下を確認してください：

- [ ] ブランチ名が命名規則に従っている
- [ ] `pnpm lint` でエラーがない
- [ ] `pnpm format` でフォーマット済み
- [ ] コミットメッセージが Conventional Commits に準拠
- [ ] 関連する doc/ のドキュメントを更新した（必要に応じて）
- [ ] `.env.example` に新しい環境変数を追加した（必要に応じて）
- [ ] 機能の動作確認を手動で実施

---

### 開発中のローカルチェック

```bash
# 1. 依存関係をインストール
pnpm install

# 2. 環境変数を設定
cp .env.example .env.local
# → Firebase, OpenAI キーを入力

# 3. 開発サーバー起動
pnpm dev
# → http://localhost:3000

# 4. 機能テスト（手動）
# → ブラウザで動作確認

# 5. コード品質チェック
pnpm lint
pnpm format:check

# 6. すべてOKならコミット＆プッシュ
git add .
git commit -m "feat: ..."
git push origin feat/my-feature
```

---

### CI/CD パイプライン

このプロジェクトは **Vercel** で自動デプロイされます：

| ステップ | 実行環境 | 動作                              |
| -------- | -------- | --------------------------------- |
| Build    | Vercel   | `pnpm build`                      |
| Lint     | Vercel   | `pnpm lint`                       |
| Preview  | Vercel   | PR毎にプレビューURL生成           |
| Deploy   | Vercel   | `main` へのマージ後、本番デプロイ |

---

## 💡 開発のベストプラクティス

### 実装前に

1. **doc/SPEC.md を読む** → 技術決定事項を把握
2. **既存コードを確認** → 重複実装を避ける
3. **Firestore スキーマを確認** → 設計済みのコレクションを活用

### 実装中に

1. **型安全性を重視** → TypeScript の型アノテーション忘れずに
2. **エラーハンドリング** → try-catch で適切に処理
3. **ログ出力** → 本番デバッグのため `console.error()` を活用
4. **コンポーネントの粒度** → shadcn/ui を活用して再利用性を高める

### Firestore との連携

```typescript
// 推奨：サーバーアクション or Route Handler で DB操作
// -server.ts ファイルに処理をまとめる

// 例: src/server/submissions.ts
'use server';
import { db } from '@/lib/firebase';

export async function saveSubmission(data: SubmissionData) {
  // Firestore 書き込み
}
```

---

## 🐛 トラブルシューティング

| 問題                    | 原因           | 解決策                           |
| ----------------------- | -------------- | -------------------------------- |
| `pnpm dev` が起動しない | 環境変数未設定 | `.env.local` を確認              |
| `lint` エラー           | インデント不正 | `pnpm format` を実行             |
| Firebase 接続エラー     | キー設定ミス   | Firebase Console で確認          |
| OpenAI API エラー       | レート制限     | doc/SPEC.md の「レート制限」参照 |

---

