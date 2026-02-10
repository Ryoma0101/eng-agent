---
description: このプロジェクトのデザインガイドライン（カラー、タイポグラフィ、レイアウト）
---

# デザインガイドライン

## カラーパレット（SCREENS.md準拠）

| 用途                 | Tailwind Class                 | 使用場面                   |
| -------------------- | ------------------------------ | -------------------------- |
| **メインテキスト**   | `text-slate-900`               | 見出し、重要テキスト       |
| **サブテキスト**     | `text-slate-700`               | 本文                       |
| **CTA / アクセント** | `text-blue-600`, `bg-blue-600` | ボタン、リンク、ハイライト |
| **スコア良**         | `text-green-600`               | 高スコア表示               |
| **注意**             | `text-yellow-600`              | 警告メッセージ             |
| **エラー**           | `text-red-600`                 | エラー表示                 |
| **非活性**           | `text-slate-400`               | 無効テキスト               |
| **背景**             | `bg-slate-50`                  | ページ背景                 |
| **カード背景**       | `bg-white`                     | カードコンポーネント       |

## タイポグラフィ

| 要素         | Tailwind Class           |
| ------------ | ------------------------ |
| H1           | `text-4xl font-bold`     |
| H2           | `text-2xl font-semibold` |
| H3           | `text-xl font-bold`      |
| 本文         | `text-base`              |
| キャプション | `text-sm text-slate-500` |
| 数値（大）   | `text-6xl font-bold`     |
| 数値（中）   | `text-2xl font-bold`     |

## レイアウト

| パターン         | Class                                           |
| ---------------- | ----------------------------------------------- |
| ページ全体       | `min-h-screen bg-slate-50 p-6`                  |
| コンテンツ最大幅 | `max-w-7xl mx-auto px-4`                        |
| フォーム最大幅   | `mx-auto max-w-3xl`                             |
| カード間スペース | `mb-6` or `gap-4`                               |
| グリッド3列      | `grid grid-cols-1 gap-4 sm:grid-cols-3`         |
| 中央配置         | `flex min-h-screen items-center justify-center` |

## shadcn/uiの使い方

### Button

```tsx
<Button size="lg">Primary CTA</Button>
<Button variant="outline">Secondary</Button>
<Button variant="ghost">Tertiary</Button>
```

### Card

```tsx
<Card className="p-6">
  <h3 className="mb-4 font-semibold">タイトル</h3>
  <p className="text-slate-600">内容</p>
</Card>
```

### Badge

```tsx
<Badge>Medium</Badge>
<Badge variant="outline">150-200 words</Badge>
```

## レスポンシブ対応

- モバイルファースト（375px基準）
- ブレークポイント: `sm:640px`, `md:768px`, `lg:1024px`
- グリッドは `grid-cols-1` → `sm:grid-cols-2` → `lg:grid-cols-3`
