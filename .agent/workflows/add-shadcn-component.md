---
description: shadcn/uiコンポーネントをプロジェクトに追加する方法
---

# shadcn/ui コンポーネント追加

## 概要

このプロジェクトは shadcn/ui (new-york スタイル) を使用。
設定ファイル: `components.json`

## コンポーネント追加コマンド

// turbo
```bash
pnpm dlx shadcn@latest add {component-name}
```

例:
```bash
pnpm dlx shadcn@latest add textarea badge alert skeleton progress separator avatar scroll-area
```

## 現在導入済みのコンポーネント

- button
- card
- dialog
- input
- sonner
- tabs

## コンポーネントの保存先

`src/components/ui/{component-name}.tsx`

## インポート方法

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
```

## 注意事項

- `components.json` の `style` は `"new-york"`
- `iconLibrary` は `"lucide"`（Lucide React）
- パスエイリアス: `@/components`, `@/lib`, `@/hooks`
