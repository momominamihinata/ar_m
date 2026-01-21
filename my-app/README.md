# 器ARコーディネート

買いたい器と家の机の相性を確認できるWebアプリケーション

## 概要

このアプリケーションは、購入を検討している器（皿、鉢、カップなど）を実際の机やテーブルに配置してシミュレーションできるツールです。器の写真を撮影してアップロードすると、自動で背景が除去され、AR（拡張現実）または2D配置モードで実際のサイズ感を確認できます。

## 主な機能

### 1. 器の登録
- 器の写真を真上から撮影してアップロード
- AIによる自動背景除去処理
- 器のサイズ（横幅・縦幅）をセンチメートル単位で記録
- 元画像と背景除去後の画像をプレビュー表示

### 2. マイ器リスト
- 登録した器の一覧表示
- 複数の器を選択してAR配置
- 器の削除機能
- 選択状態の視覚的なフィードバック

### 3. ARモード（iOS/iPad）
- **カメラARモード**: カメラ映像に器を重ねて表示
  - タップで器を配置
  - ドラッグで自由に移動
  - 拡大・縮小機能
- **2D配置モード**: 固定サイズ（60cm × 40cm）の仮想スペースで配置
  - 背景画像のアップロード（3:2の比率に自動クロップ）
  - 実物のサイズに基づいた正確な表示
  - 器の回転、拡大・縮小機能

### 4. 2D配置モード（PC/その他のデバイス）
- 机やテーブルの写真を背景として使用
- 横60cm × 縦40cmのスペースとして計算
- 器を自由に配置、移動、回転
- スケール調整機能
- マウスまたはタッチ操作に対応

## 技術スタック

### フロントエンド
- **Next.js 16.1.4**: React フレームワーク（App Router使用）
- **React 19.2.3**: UIライブラリ
- **TypeScript 5**: 型安全性
- **Tailwind CSS 4**: スタイリング
- **Zustand 5.0.10**: 状態管理

### 画像処理
- **@imgly/background-removal 1.7.0**: AI背景除去

### その他
- ESLint: コード品質管理
- PostCSS: CSS処理

## プロジェクト構造

```
my-app/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # ホームページ
│   ├── layout.tsx               # ルートレイアウト
│   ├── dishes/
│   │   ├── page.tsx            # マイ器リスト
│   │   └── new/
│   │       └── page.tsx        # 器の新規登録
│   └── ar/
│       └── page.tsx            # ARモード
│
├── components/                   # Reactコンポーネント
│   ├── Dish2DPlacement.tsx     # 2D配置モード
│   └── IOSSimpleAR.tsx         # iOSカメラARモード
│
├── lib/                         # ユーティリティ関数
│   ├── image-processing.ts     # 画像処理（背景除去、リサイズ、クロップ）
│   └── device-detection.ts     # デバイス判定
│
├── store/                       # 状態管理
│   └── dishStore.ts            # Zustandストア
│
├── types/                       # TypeScript型定義
│   └── dish.ts                 # 器関連の型定義
│
└── public/                      # 静的ファイル
```

## データモデル

### Dish（器）
```typescript
interface Dish {
  id: string;              // 一意のID
  name: string;            // 器の名前（例: 大皿、小鉢）
  widthCm: number;         // 横幅（cm）
  heightCm: number;        // 縦幅（cm）
  originalImage: string;   // 元の画像（Data URL）
  processedImage: string;  // 背景除去後の画像（Data URL）
  createdAt: Date;         // 作成日時
}
```

### PlacedDish2D（2D配置情報）
```typescript
interface PlacedDish2D {
  dishId: string;    // 器のID
  x: number;         // X座標（px）
  y: number;         // Y座標（px）
  scale: number;     // スケール倍率（1.0 = 実寸）
  rotation: number;  // 回転角度（度）
}
```

## セットアップ

### 前提条件
- Node.js 20以上
- npm、yarn、pnpm、またはbun

### インストール

```bash
# リポジトリのクローン
git clone <repository-url>
cd my-app

# 依存関係のインストール
npm install
# または
yarn install
# または
pnpm install
```

### 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
# または
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを表示します。

### ビルド

```bash
# プロダクションビルド
npm run build

# プロダクションサーバーの起動
npm start
```

### Lint

```bash
npm run lint
```

## 使い方

### 1. 器の登録
1. ホーム画面で「器を登録」をクリック
2. 器の写真を真上から撮影してアップロード
3. 器の名前を入力（例: 大皿、カップ）
4. 横幅と縦幅をセンチメートル単位で入力
5. 背景除去処理が自動的に実行されます
6. 「登録する」ボタンで保存

### 2. ARで配置
1. 「マイ器リスト」から配置したい器を選択（チェックボックス）
2. 「ARモードで配置する」ボタンをクリック
3. デバイスに応じたモードが表示されます

#### iPhone/iPadの場合
- デフォルトで2D配置モードが表示されます
- 「カメラARに切替」ボタンでカメラARモードに切り替え可能
- カメラARモード:
  - カメラへのアクセス許可が必要です
  - 下部のリストから器をタップして配置
  - 配置した器はドラッグで移動可能
  - 拡大・縮小ボタンでサイズ調整

#### PC/その他のデバイスの場合
- 2D配置モードが表示されます
- 背景画像（机の写真）をアップロード
  - 画像は自動的に3:2の比率にクロップされます
  - 背景は60cm × 40cmとして扱われます
- サイドバーから「キャンバスに追加」で器を配置
- 器をドラッグして移動
- サイドバーのボタンで拡大・縮小・回転

## 注意事項

### カメラARモード（iOS）
- Safari または Chrome を推奨
- カメラへのアクセス許可が必要です
- 背面カメラ（環境カメラ）を使用します
- 明るい場所で使用することを推奨

### 2D配置モード
- 背景画像は横60cm × 縦40cmとして計算されます
- 正確なサイズ感を得るには、実際の机を真上から撮影することを推奨
- 画像は自動的に3:2の比率にクロップされます

### ブラウザサポート
- モダンブラウザ（Chrome、Safari、Edge、Firefox）
- iOS Safari 12以上（カメラAR機能）
- モバイルデバイス（タッチ操作対応）

### パフォーマンス
- 背景除去処理は数秒かかる場合があります
- 画像は自動的に1024×1024pxにリサイズされます（メモリ節約）
- 画像データはブラウザのメモリ内に保存されます（永続化なし）

## 今後の拡張案

- [ ] データの永続化（LocalStorage、IndexedDB、またはバックエンド連携）
- [ ] 複数の背景画像を保存・切り替え
- [ ] 配置したシーンのスクリーンショット機能
- [ ] WebXR AR Module を使用した本格的なARサポート
- [ ] 器のカテゴリ分類機能
- [ ] 器のお気に入り機能
- [ ] 配置パターンのプリセット機能
- [ ] ソーシャルシェア機能

## ライセンス

MIT License

## 開発者向け情報

### 主要な依存関係

```json
{
  "@imgly/background-removal": "^1.7.0",
  "next": "16.1.4",
  "react": "19.2.3",
  "react-dom": "19.2.3",
  "zustand": "^5.0.10"
}
```

### 状態管理（Zustand）

アプリケーションの状態は `store/dishStore.ts` で一元管理されています。

主要な状態:
- `dishes`: 登録された器の配列
- `selectedDishes`: AR配置用に選択された器のID配列
- `placedDishes2D`: 2D配置モードで配置された器の情報
- `backgroundImage`: 2D配置モードの背景画像

### 画像処理

`lib/image-processing.ts` には以下の関数が含まれます:

- `fileToDataURL()`: ファイルをData URLに変換
- `removeImageBackground()`: AI背景除去処理
- `resizeImage()`: 画像のリサイズ（メモリ節約）
- `cropToAspectRatio()`: 指定比率でクロップ（3:2など）

### デバイス検出

`lib/device-detection.ts` でデバイスタイプを判定:

- `isIOS()`: iOSデバイスか判定
- `isAndroid()`: Androidデバイスか判定
- `isMobile()`: モバイルデバイスか判定
- `getDeviceType()`: デバイスタイプを取得（'ios' | 'android' | 'desktop'）

## トラブルシューティング

### カメラが起動しない（iOS）
- ブラウザの設定でカメラへのアクセスを許可してください
- Safari または Chrome を使用してください
- HTTPSでアクセスしているか確認してください（localhost以外）

### 背景除去が失敗する
- 画像サイズが大きすぎる可能性があります
- ブラウザのメモリが不足している可能性があります
- ページをリロードして再度試してください

### 器のサイズが正しく表示されない
- 2D配置モードでは背景が60cm × 40cmとして計算されます
- 器のサイズ（cm）が正しく入力されているか確認してください
- スケール設定を確認してください

## 貢献

バグ報告や機能リクエストは Issue でお願いします。

## 参考リンク

- [Next.js ドキュメント](https://nextjs.org/docs)
- [React ドキュメント](https://react.dev)
- [Tailwind CSS ドキュメント](https://tailwindcss.com/docs)
- [Zustand ドキュメント](https://zustand-demo.pmnd.rs)
- [@imgly/background-removal](https://github.com/imgly/background-removal-js)
