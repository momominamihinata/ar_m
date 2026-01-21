# 貢献ガイド

このプロジェクトへの貢献に興味を持っていただき、ありがとうございます！このドキュメントでは、プロジェクトへの貢献方法について説明します。

## 目次

- [行動規範](#行動規範)
- [貢献の方法](#貢献の方法)
- [開発環境のセットアップ](#開発環境のセットアップ)
- [開発ワークフロー](#開発ワークフロー)
- [コーディング規約](#コーディング規約)
- [コミットメッセージ](#コミットメッセージ)
- [プルリクエストのガイドライン](#プルリクエストのガイドライン)
- [問題報告](#問題報告)

---

## 行動規範

このプロジェクトに参加するすべての人は、互いに尊重し、建設的なコミュニケーションを心がけてください。

### 期待される行動

- 親切で礼儀正しいコミュニケーション
- 異なる視点や経験の尊重
- 建設的なフィードバックの提供と受容
- コミュニティの利益を最優先に考える

### 禁止される行動

- ハラスメントや差別的な言動
- トローリングや侮辱的なコメント
- 他者のプライバシーの侵害
- その他プロフェッショナルでない行為

---

## 貢献の方法

### 1. バグ報告

バグを見つけた場合:

1. 既存のIssueを検索して、同じ問題が報告されていないか確認
2. 見つからない場合は、新しいIssueを作成
3. 以下の情報を含める:
   - バグの説明
   - 再現手順
   - 期待される動作
   - 実際の動作
   - 環境情報（ブラウザ、OS、デバイスなど）
   - スクリーンショット（可能であれば）

### 2. 機能リクエスト

新しい機能を提案する場合:

1. 既存のIssueを検索して、同じ提案がないか確認
2. 新しいIssueを作成し、以下を含める:
   - 機能の説明
   - なぜその機能が必要か
   - 使用例やユースケース
   - 可能であれば、実装のアイデア

### 3. コード貢献

コードで貢献する場合:

1. Issueを選ぶか、新しいIssueを作成
2. フォークして開発
3. プルリクエストを送信

---

## 開発環境のセットアップ

### 必要な環境

- Node.js 20以上
- npm、yarn、pnpm、または bun
- Git
- モダンなブラウザ（Chrome、Safari、Firefox、Edgeなど）

### セットアップ手順

```bash
# リポジトリをフォーク
# GitHubのWebインターフェースでForkボタンをクリック

# フォークしたリポジトリをクローン
git clone https://github.com/YOUR_USERNAME/my-app.git
cd my-app

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev

# ブラウザで http://localhost:3000 を開く
```

### ブランチの設定

```bash
# 開発用のブランチを作成
git checkout -b feature/your-feature-name

# または
git checkout -b fix/bug-description
```

---

## 開発ワークフロー

### 1. コードを書く

```bash
# 開発サーバーを起動（ホットリロード有効）
npm run dev

# コードを編集
# app/, components/, lib/ などのファイルを編集
```

### 2. Lintチェック

```bash
# ESLintでコードをチェック
npm run lint

# 自動修正（可能な場合）
npm run lint -- --fix
```

### 3. ビルドテスト

```bash
# プロダクションビルドをテスト
npm run build

# ビルドが成功することを確認
npm start
```

### 4. コミット

```bash
# 変更をステージング
git add .

# コミット（後述のコミットメッセージ規約に従う）
git commit -m "feat: add new feature"
```

### 5. プッシュ

```bash
# リモートにプッシュ
git push origin feature/your-feature-name
```

### 6. プルリクエスト

1. GitHubでプルリクエストを作成
2. テンプレートに従って記入
3. レビューを待つ

---

## コーディング規約

### TypeScript

```typescript
// ✅ 良い例
interface Dish {
  id: string;
  name: string;
  widthCm: number;
}

const addDish = (dish: Omit<Dish, 'id'>): Dish => {
  return {
    ...dish,
    id: crypto.randomUUID(),
  };
};

// ❌ 悪い例
const addDish = (dish: any) => {  // any型を避ける
  return { ...dish, id: Math.random().toString() };
};
```

### React コンポーネント

```tsx
// ✅ 良い例: 関数コンポーネント + TypeScript
interface Props {
  name: string;
  onSubmit: () => void;
}

export default function Component({ name, onSubmit }: Props) {
  return (
    <div>
      <h1>{name}</h1>
      <button onClick={onSubmit}>Submit</button>
    </div>
  );
}

// ❌ 悪い例: 型定義なし
export default function Component({ name, onSubmit }) {
  // ...
}
```

### ファイル命名規則

- **コンポーネント**: `PascalCase.tsx`
  - 例: `Dish2DPlacement.tsx`, `IOSSimpleAR.tsx`
- **ユーティリティ**: `kebab-case.ts`
  - 例: `image-processing.ts`, `device-detection.ts`
- **ページ**: `page.tsx` (Next.js App Router規約)
- **ストア**: `camelCase.ts`
  - 例: `dishStore.ts`

### スタイリング（Tailwind CSS）

```tsx
// ✅ 良い例: 読みやすい複数行
<div className="
  flex items-center justify-between
  p-4 bg-white dark:bg-zinc-900
  rounded-lg shadow-sm
">
  {/* content */}
</div>

// ✅ 良い例: 条件付きクラス
<div className={`
  base-class
  ${isActive ? 'active-class' : 'inactive-class'}
`}>
  {/* content */}
</div>

// ❌ 悪い例: 1行が長すぎる
<div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-lg shadow-sm hover:shadow-md transition-all">
```

### インポート順序

```typescript
// 1. React / Next.js
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 2. 外部ライブラリ
import { create } from 'zustand';

// 3. 内部インポート（絶対パス）
import { useDishStore } from '@/store/dishStore';
import { removeImageBackground } from '@/lib/image-processing';
import { Dish } from '@/types/dish';

// 4. 相対インポート
import DishCard from './DishCard';
```

---

## コミットメッセージ

### フォーマット

```
<type>: <subject>

<body (optional)>

<footer (optional)>
```

### Type

- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `style`: コードの意味に影響しない変更（空白、フォーマット、セミコロンなど）
- `refactor`: バグ修正や機能追加ではないコードの変更
- `perf`: パフォーマンス改善
- `test`: テストの追加や修正
- `chore`: ビルドプロセスやツールの変更

### 例

```bash
# 機能追加
git commit -m "feat: add dish rotation feature in 2D mode"

# バグ修正
git commit -m "fix: camera not starting on iOS Safari"

# ドキュメント
git commit -m "docs: update README with setup instructions"

# リファクタリング
git commit -m "refactor: simplify image processing pipeline"

# パフォーマンス
git commit -m "perf: optimize background removal for large images"
```

### 詳細なコミットメッセージの例

```
feat: add dish rotation feature in 2D mode

Users can now rotate dishes in 2D placement mode using rotation buttons.
Each click rotates the dish by 45 degrees.

Closes #123
```

---

## プルリクエストのガイドライン

### プルリクエストを送る前に

- [ ] コードがlintエラーなしでビルドできる
- [ ] 関連するドキュメントを更新した
- [ ] コミットメッセージが規約に従っている
- [ ] 既存の機能が壊れていないことを確認した

### プルリクエストのタイトル

コミットメッセージと同じ形式:

```
feat: add dish rotation feature
fix: resolve camera initialization bug
docs: improve API documentation
```

### プルリクエストの説明

```markdown
## 概要
この変更の簡単な説明

## 変更内容
- 変更点1
- 変更点2
- 変更点3

## 関連Issue
Closes #123

## スクリーンショット（該当する場合）
![screenshot](url)

## テスト方法
1. 手順1
2. 手順2
3. 期待される結果

## チェックリスト
- [ ] コードがビルドできる
- [ ] Lintエラーがない
- [ ] ドキュメントを更新した
- [ ] 既存機能が壊れていない
```

### レビュープロセス

1. プルリクエストを作成
2. 自動チェック（Lint、ビルド）が通過するまで待つ
3. レビュアーからのフィードバックに対応
4. 必要に応じて修正とプッシュを繰り返す
5. 承認されたらマージ

---

## 問題報告

### バグ報告テンプレート

```markdown
## バグの説明
何が起きているか

## 再現手順
1. '...'に移動
2. '...'をクリック
3. '...'まで下にスクロール
4. エラーが表示される

## 期待される動作
何が起きるべきか

## スクリーンショット
該当する場合、スクリーンショットを追加

## 環境
- OS: [例: macOS 14.0]
- ブラウザ: [例: Chrome 120]
- デバイス: [例: iPhone 15]
- バージョン: [例: 0.1.0]

## 追加情報
その他の関連情報
```

### 機能リクエストテンプレート

```markdown
## 機能の説明
提案する機能の簡単な説明

## 動機
なぜこの機能が必要か

## 詳細な説明
機能がどのように動作すべきか

## 代替案
検討した代替案

## 追加情報
その他の関連情報やスクリーンショット
```

---

## 開発のヒント

### デバッグ

```typescript
// コンソールログを使用
console.log('Debug:', { dishes, selectedDishes });

// React DevTools を使用
// Chrome/Firefox拡張機能をインストール

// Zustand DevTools を使用（オプション）
import { devtools } from 'zustand/middleware';

export const useDishStore = create(
  devtools((set) => ({
    // ...store definition
  }))
);
```

### パフォーマンステスト

```bash
# Lighthouse でパフォーマンスをチェック
npm run build
npm start

# Chrome DevTools > Lighthouse でレポートを実行
```

### よくある問題

#### 1. 背景除去が遅い

```typescript
// 画像を事前にリサイズ
const resized = await resizeImage(dataURL, 800, 800);
const processed = await removeImageBackground(resized);
```

#### 2. カメラが起動しない

```typescript
// HTTPS経由でアクセスしているか確認
// localhost以外はHTTPSが必要
```

#### 3. ビルドエラー

```bash
# node_modules を削除して再インストール
rm -rf node_modules
npm install

# キャッシュをクリア
rm -rf .next
npm run build
```

---

## テストの追加（今後）

現在、テストは実装されていませんが、将来的には以下のテストを追加予定:

### ユニットテスト

```typescript
// lib/__tests__/image-processing.test.ts
import { resizeImage } from '../image-processing';

describe('resizeImage', () => {
  it('should resize image to specified dimensions', async () => {
    // テストコード
  });
});
```

### コンポーネントテスト

```typescript
// components/__tests__/Dish2DPlacement.test.tsx
import { render, screen } from '@testing-library/react';
import Dish2DPlacement from '../Dish2DPlacement';

describe('Dish2DPlacement', () => {
  it('renders without crashing', () => {
    render(<Dish2DPlacement />);
    // アサーション
  });
});
```

---

## コミュニティ

### 質問や議論

- GitHub Discussionsで質問や議論を開始
- 既存のIssueやPRにコメント

### サポート

質問がある場合:
1. README.mdを確認
2. 既存のIssueを検索
3. 新しいIssueを作成（質問タグ付き）

---

## ライセンス

貢献したコードは、プロジェクトと同じMITライセンスでリリースされます。

---

## 謝辞

このプロジェクトへの貢献に感謝します！あなたの時間と努力は、このアプリケーションをより良いものにします。

---

## 参考リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
