# アーキテクチャドキュメント

## 概要

このドキュメントは、器ARコーディネートアプリケーションのアーキテクチャと設計思想について説明します。

## アーキテクチャパターン

### クライアントサイドアーキテクチャ

このアプリケーションは**完全なクライアントサイドアプリケーション**として設計されており、以下の特徴があります：

1. **バックエンド不要**: すべての処理がブラウザ内で完結
2. **データ永続化なし**: 現在はメモリ内のみでデータを保持（リロードでリセット）
3. **プライバシー重視**: ユーザーの画像データは外部サーバーに送信されない

### フロントエンドアーキテクチャ

```
┌─────────────────────────────────────────────────────────┐
│                     Next.js App Router                   │
│                      (app/ directory)                    │
└─────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Page       │  │  Components  │  │   Store      │
│  Components  │  │              │  │   (Zustand)  │
└──────────────┘  └──────────────┘  └──────────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           ▼
                  ┌──────────────┐
                  │  Lib Utils   │
                  │  - Image     │
                  │  - Device    │
                  └──────────────┘
```

## レイヤー構成

### 1. プレゼンテーション層（Presentation Layer）

**場所**: `app/` と `components/`

**責務**:
- UIの表示とユーザーインタラクション
- ページルーティング
- レイアウト管理

**主要コンポーネント**:

```
app/
├── page.tsx                    # ホームページ（ランディング）
├── layout.tsx                  # ルートレイアウト
├── dishes/
│   ├── page.tsx               # 器リスト表示・選択
│   └── new/page.tsx          # 器の新規登録フォーム
└── ar/page.tsx               # AR/2D配置モードの切り替え

components/
├── Dish2DPlacement.tsx       # 2D配置UI（背景画像 + 器配置）
└── IOSSimpleAR.tsx           # iOS カメラAR UI
```

### 2. ビジネスロジック層（Business Logic Layer）

**場所**: `store/`

**責務**:
- アプリケーション状態の管理
- ビジネスルールの実装
- データの整合性維持

**状態管理フロー**:

```
User Action
    │
    ▼
Component Event Handler
    │
    ▼
Zustand Store Action
    │
    ├─→ State Update
    │       │
    │       ▼
    │   Re-render Components
    │
    └─→ Side Effects
```

### 3. ユーティリティ層（Utility Layer）

**場所**: `lib/`

**責務**:
- 画像処理
- デバイス検出
- 汎用的なヘルパー関数

**モジュール**:
- `image-processing.ts`: 背景除去、リサイズ、クロップ
- `device-detection.ts`: iOS/Android/PC の判定

### 4. 型定義層（Type Definition Layer）

**場所**: `types/`

**責務**:
- TypeScript型定義
- データモデルの定義
- 型安全性の確保

## データフロー

### 器の登録フロー

```
1. User uploads image
   │
   ▼
2. FileReader converts to Data URL
   │
   ▼
3. resizeImage() (max 1024x1024)
   │
   ▼
4. removeImageBackground() (@imgly/background-removal)
   │
   ▼
5. User inputs name & size
   │
   ▼
6. addDish() in dishStore
   │
   ▼
7. Store updates with new dish
   │
   ▼
8. Navigate to /dishes
```

### AR配置フロー

```
1. User selects dishes (toggleDishSelection)
   │
   ▼
2. Navigate to /ar
   │
   ├─→ iOS Device
   │   │
   │   ├─→ 2D Mode (default)
   │   │   └─→ Dish2DPlacement component
   │   │
   │   └─→ Camera AR Mode (optional)
   │       └─→ IOSSimpleAR component
   │
   └─→ PC/Other Device
       └─→ 2D Mode only
           └─→ Dish2DPlacement component
```

### 2D配置モードのデータフロー

```
1. User uploads background image
   │
   ▼
2. cropToAspectRatio() (3:2 ratio)
   │
   ▼
3. setBackgroundImage() in store
   │
   ▼
4. User adds dishes to canvas
   │
   ▼
5. placeDish2D() with initial position
   │
   ▼
6. User drags/scales/rotates
   │
   ▼
7. updatePlacedDish2D() on each change
   │
   ▼
8. Real-time rendering with cm-to-pixel conversion
```

## 状態管理詳細

### Zustand Store 設計

```typescript
interface DishStore {
  // 永続的な状態
  dishes: Dish[];                    // 登録された器のマスターリスト

  // 一時的な状態（ページ遷移で維持）
  selectedDishes: string[];          // AR配置用に選択された器のID
  placedDishes: PlacedDish[];        // 3D AR配置情報（未使用）

  // 2D配置モード専用の状態
  backgroundImage: string | null;    // 背景画像
  placedDishes2D: PlacedDish2D[];   // 2D配置情報

  // アクション（省略）
}
```

### 状態のライフサイクル

```
App Load
  │
  ▼
Initial State (empty)
  │
  ├─→ User adds dishes → dishes[] grows
  │
  ├─→ User selects dishes → selectedDishes[] updates
  │
  └─→ Page reload → All state reset (no persistence)
```

## コンポーネント設計

### コンポーネントの責務分離

1. **Page Components** (`app/*/page.tsx`)
   - ルーティングエントリーポイント
   - データフェッチ（現在は不要）
   - レイアウト構造
   - Store へのアクセス

2. **UI Components** (`components/`)
   - 再利用可能なUI部品
   - プレゼンテーションロジックのみ
   - Props経由でデータを受け取る

### コンポーネント階層

```
app/ar/page.tsx (AR Mode Selector)
├─ Dish2DPlacement (2D Mode)
│  ├─ Background Image Display
│  ├─ Dish Canvas with Drag & Drop
│  └─ Sidebar Controls
│
└─ IOSSimpleAR (iOS Camera AR)
   ├─ Video Stream (camera feed)
   ├─ Dish Overlay (positioned dishes)
   └─ Bottom Controls (dish list + controls)
```

## 画像処理パイプライン

### 背景除去処理

```
Input: File or Blob
  │
  ▼
@imgly/background-removal
  │ (runs ML model in browser)
  │ (WebAssembly + WebGL)
  │
  ▼
Output: Blob (PNG with transparency)
  │
  ▼
Convert to Data URL
  │
  ▼
Store in dishStore
```

### 技術選定理由

**@imgly/background-removal** を選択した理由:
- ブラウザ内で完結（サーバー不要）
- 高品質な背景除去
- WebAssembly + WebGL で高速
- プライバシー保護（画像がサーバーに送信されない）

## デバイス対応戦略

### レスポンシブデザイン

```
Desktop (≥768px)
├─ Sidebar: Fixed left
├─ Canvas: Flexible right
└─ Mouse drag & drop

Mobile (<768px)
├─ Sidebar: Bottom drawer
├─ Canvas: Full screen
└─ Touch drag & drop
```

### AR機能の分岐

```
Device Detection
  │
  ├─→ iOS
  │   ├─ 2D Mode (default, safer)
  │   └─ Camera AR (optional, experimental)
  │
  ├─→ Android
  │   └─ 2D Mode only (camera AR not supported)
  │
  └─→ Desktop
      └─ 2D Mode only
```

## パフォーマンス最適化

### 1. 画像リサイズ

```typescript
// メモリ節約のため、大きな画像を制限
resizeImage(dataURL, maxWidth: 1024, maxHeight: 1024)
```

**理由**:
- 背景除去処理の高速化
- ブラウザメモリ使用量の削減
- レンダリングパフォーマンスの向上

### 2. クライアントサイドキャッシング

- Data URL形式で画像を保存（Base64）
- メモリ内キャッシュ（永続化なし）

### 3. React レンダリング最適化

- Zustand の selector 機能で不要な再レンダリングを防止
- イベントハンドラーの適切なメモ化
- ドラッグ中の高頻度更新の最適化

## セキュリティとプライバシー

### データ保護

1. **画像データ**
   - ブラウザのメモリ内のみに保存
   - サーバーへの送信なし
   - ページリロードで完全削除

2. **カメラアクセス**
   - ユーザーの明示的な許可が必要
   - `getUserMedia()` API を使用
   - ストリームはコンポーネントアンマウント時に停止

### XSS対策

- React の自動エスケープを活用
- Data URL の検証（将来的に実装予定）
- `dangerouslySetInnerHTML` の使用回避

## 拡張性

### 将来の拡張ポイント

1. **データ永続化**
   ```
   Browser (Memory)
       │
       ├─→ IndexedDB (offline storage)
       ├─→ LocalStorage (simple data)
       └─→ Backend API (sync across devices)
   ```

2. **認証・マルチユーザー**
   ```
   Current: Single user, no auth
       │
       ▼
   Future: Multi-user with Firebase/Supabase
   ```

3. **本格的なAR**
   ```
   Current: Simple camera overlay
       │
       ▼
   Future: WebXR Device API
           └─→ 平面検出
           └─→ 3Dモデル配置
           └─→ 照明・影の計算
   ```

4. **ソーシャル機能**
   ```
   Current: Local only
       │
       ▼
   Future: Share configurations
           └─→ URL sharing
           └─→ Image export
           └─→ SNS integration
   ```

## テスト戦略（今後の実装）

### 推奨テストレイヤー

```
1. Unit Tests (Jest + Testing Library)
   └─→ lib/ utilities
   └─→ store/ actions

2. Integration Tests
   └─→ Component + Store interactions

3. E2E Tests (Playwright)
   └─→ User workflows
   └─→ Image upload → Background removal → AR placement
```

## デプロイ戦略

### 推奨プラットフォーム

1. **Vercel** (推奨)
   - Next.js に最適化
   - 自動プレビューデプロイ
   - Edge Functions サポート

2. **Netlify**
   - 同様の機能セット
   - フォーム処理などの追加機能

3. **GitHub Pages**
   - Static export 対応
   - 無料ホスティング

### ビルド設定

```json
// package.json
{
  "scripts": {
    "build": "next build",
    "export": "next export"  // 静的エクスポート（オプション）
  }
}
```

## トレードオフと設計判断

### 1. クライアントサイド vs サーバーサイド

**決定**: クライアントサイドのみ

**理由**:
- プライバシー保護（画像がサーバーに送信されない）
- インフラコスト削減
- オフライン動作可能

**トレードオフ**:
- データ永続化なし（現時点）
- デバイス間同期なし

### 2. Data URL vs Object URL

**決定**: Data URL

**理由**:
- 永続化が容易（将来的に）
- シリアライズ可能
- Store に直接保存可能

**トレードオフ**:
- メモリ使用量が大きい
- パフォーマンスがやや劣る

### 3. Zustand vs Redux

**決定**: Zustand

**理由**:
- シンプルなAPI
- ボイラープレート最小
- 小〜中規模アプリに最適

**トレードオフ**:
- Redux DevTools の統合が弱い
- ミドルウェアエコシステムが小さい

### 4. カメラAR vs WebXR

**決定**: シンプルなカメラオーバーレイ

**理由**:
- 実装が簡単
- ブラウザサポートが広い
- プロトタイプとして十分

**トレードオフ**:
- 平面検出なし
- 3D表示なし
- ARとしては機能が限定的

## 参考資料

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [MediaDevices API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
