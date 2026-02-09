# AI英作文スコアリングプラットフォーム

2031年、生成AIと協働して英語で仕事をすることが当たり前になります。しかし既存の英語学習は「問題を解く」だけで、実務に直結していません。

このプラットフォームは、英作文を"競技"として楽しみながら、同時に「実務でそのまま使えるアウトプット」を生成するAIエージェントです。スコアだけでなく、英語で仕事を遂行する力を鍛えます。

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

## 📝 ライセンス

このプロジェクトはWILLとTNDのハッカソンチーム3により開発されています。

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
