---
description: Gitブランチの作成・切り替え・マージの手順
---

# Git ブランチ管理

## ブランチ戦略

```
main（本番） ← develop（開発統合） ← feat/*（機能ブランチ）
```

## 命名規則

```
feat/{feature-name}      # 新機能
fix/{issue-name}         # バグ修正
docs/{doc-name}          # ドキュメント
refactor/{component}     # リファクタリング
```

## 新しい機能ブランチの作成

```bash
git checkout develop
git pull origin develop
git checkout -b feat/{feature-name}
```

## コミットメッセージ規則（Conventional Commits）

```
feat(scope): 説明        # 新機能
fix(scope): 説明         # バグ修正
docs(scope): 説明        # ドキュメント
style(scope): 説明       # フォーマット
refactor(scope): 説明    # リファクタリング
chore(scope): 説明       # 依存関係更新等
```

例:
```bash
git commit -m "feat(dashboard): Dashboard画面のレイアウト実装"
```

## PRチェックリスト

- [ ] `pnpm lint` でエラーなし
- [ ] `pnpm build` でビルド成功
- [ ] コミットメッセージがConventional Commits準拠
- [ ] ブランチ名が命名規則に従っている
