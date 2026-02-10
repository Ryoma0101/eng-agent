---
description: 新しい画面ブランチを作成し、モックデータ付きのページ＋コンポーネントを実装するワークフロー
---

# 画面ブランチ作成ワークフロー

このワークフローは、1画面1ブランチの方針で新しい画面を実装する際の手順です。

## 前提

- `develop` ブランチが存在すること
- shadcn/ui がセットアップ済み
- モックデータは `src/lib/mock-data.ts` に集約

## 手順

1. **develop ブランチから新規ブランチを作成**

```bash
git checkout develop
git pull origin develop
git checkout -b feat/{screen-name}-page
```

2. **必要な shadcn/ui コンポーネントを追加**

```bash
# 必要に応じて追加（例: textarea, badge, alert）
pnpm dlx shadcn@latest add {component-name}
```

3. **画面のドキュメントを確認**

`doc/screens/{screen-name}.md` を読み、以下を把握：

- レイアウト構成
- 使用コンポーネント
- 必要な状態管理
- ナビゲーション先

4. **ファイルを作成**

- `src/app/{screen-name}/page.tsx` — ページ本体
- `src/components/{screen-name}/` — 画面固有コンポーネント
- モックデータは `src/lib/mock-data.ts` からインポート

5. **デザイン方針**

- カラー: `SCREENS.md` のslate/blueパレット準拠
- コンポーネント: shadcn/ui を積極利用（Card, Button, Badge等）
- レイアウト: `max-w-7xl mx-auto px-4`（全体）/ `max-w-3xl`（フォーム系）
- レスポンシブ: モバイルファースト

6. **ビルド＆Lint確認**

// turbo

```bash
pnpm lint
```

// turbo

```bash
pnpm build
```

7. **ブラウザで目視確認**

```bash
pnpm dev
```

ブラウザで `http://localhost:3000/{screen-name}` を開き、以下を確認：

- レイアウトが崩れていないか
- モバイル（375px）とデスクトップ（1280px）のレスポンシブ
- ボタン等のインタラクション

8. **コミット＆プッシュ**

```bash
git add .
git commit -m "feat({screen-name}): {screen-name}画面のレイアウト実装"
git push origin feat/{screen-name}-page
```
