# API リファレンス

このドキュメントでは、アプリケーションの主要なコンポーネント、関数、型定義について説明します。

## 目次

- [Store API](#store-api)
- [Image Processing API](#image-processing-api)
- [Device Detection API](#device-detection-api)
- [Types](#types)
- [Components](#components)

---

## Store API

### DishStore

Zustand を使用したグローバル状態管理ストア。

**インポート**:
```typescript
import { useDishStore } from '@/store/dishStore';
```

**使用例**:
```typescript
const Component = () => {
  const dishes = useDishStore((state) => state.dishes);
  const addDish = useDishStore((state) => state.addDish);

  // または全体を取得
  const { dishes, addDish } = useDishStore();
};
```

### State

#### `dishes: Dish[]`
登録されたすべての器の配列。

#### `selectedDishes: string[]`
AR配置用に選択された器のID配列。

#### `placedDishes: PlacedDish[]`
3D AR空間に配置された器の情報（現在未使用）。

#### `backgroundImage: string | null`
2D配置モードの背景画像（Data URL形式）。

#### `placedDishes2D: PlacedDish2D[]`
2D配置モードで配置された器の情報。

### Actions

#### `addDish(dish: Omit<Dish, 'id' | 'createdAt'>): void`

新しい器を追加します。

**パラメータ**:
- `dish.name` (string): 器の名前
- `dish.widthCm` (number): 横幅（cm）
- `dish.heightCm` (number): 縦幅（cm）
- `dish.originalImage` (string): 元の画像（Data URL）
- `dish.processedImage` (string): 背景除去後の画像（Data URL）

**例**:
```typescript
addDish({
  name: '大皿',
  widthCm: 25,
  heightCm: 25,
  originalImage: 'data:image/png;base64,...',
  processedImage: 'data:image/png;base64,...',
});
```

#### `removeDish(dishId: string): void`

器を削除します。関連する選択状態や配置情報も同時に削除されます。

**パラメータ**:
- `dishId` (string): 削除する器のID

#### `clearDishes(): void`

すべての器と関連データをクリアします。

#### `toggleDishSelection(dishId: string): void`

器の選択状態をトグルします。すでに選択されている場合は解除、未選択の場合は選択します。

**パラメータ**:
- `dishId` (string): トグルする器のID

#### `clearSelection(): void`

すべての器の選択を解除します。

#### `setBackgroundImage(imageUrl: string | null): void`

2D配置モードの背景画像を設定します。

**パラメータ**:
- `imageUrl` (string | null): 背景画像のData URL、またはnull（クリア）

#### `placeDish2D(placedDish: PlacedDish2D): void`

2D配置モードで器を配置します。

**パラメータ**:
- `placedDish.dishId` (string): 器のID
- `placedDish.x` (number): X座標（px）
- `placedDish.y` (number): Y座標（px）
- `placedDish.scale` (number): スケール倍率
- `placedDish.rotation` (number): 回転角度（度）

**例**:
```typescript
placeDish2D({
  dishId: 'dish-123',
  x: 400,
  y: 300,
  scale: 1.0,
  rotation: 0,
});
```

#### `updatePlacedDish2D(dishId: string, updates: Partial<PlacedDish2D>): void`

配置された器の情報を更新します。

**パラメータ**:
- `dishId` (string): 更新する器のID
- `updates` (Partial\<PlacedDish2D\>): 更新する属性

**例**:
```typescript
// 位置のみ更新
updatePlacedDish2D('dish-123', { x: 450, y: 350 });

// スケールと回転を更新
updatePlacedDish2D('dish-123', { scale: 1.5, rotation: 45 });
```

#### `removePlacedDish2D(dishId: string): void`

2D配置から器を削除します。

**パラメータ**:
- `dishId` (string): 削除する器のID

#### `clearPlacedDishes2D(): void`

すべての2D配置情報をクリアします。

---

## Image Processing API

### `fileToDataURL(file: File): Promise<string>`

ファイルオブジェクトをData URL形式に変換します。

**パラメータ**:
- `file` (File): 変換するファイル

**戻り値**:
- `Promise<string>`: Data URL文字列

**例**:
```typescript
const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const dataURL = await fileToDataURL(file);
    console.log(dataURL); // "data:image/png;base64,..."
  }
};
```

### `dataURLToBlob(dataURL: string): Blob`

Data URL文字列をBlobオブジェクトに変換します。

**パラメータ**:
- `dataURL` (string): Data URL文字列

**戻り値**:
- `Blob`: Blobオブジェクト

### `blobToDataURL(blob: Blob): Promise<string>`

BlobオブジェクトをData URL形式に変換します。

**パラメータ**:
- `blob` (Blob): 変換するBlob

**戻り値**:
- `Promise<string>`: Data URL文字列

### `removeImageBackground(imageSource: File | string): Promise<string>`

画像の背景を自動で除去します。

**パラメータ**:
- `imageSource` (File | string): 画像ファイルまたはData URL

**戻り値**:
- `Promise<string>`: 背景除去後の画像（Data URL）

**例外**:
- エラー時に `Error` をスロー

**例**:
```typescript
try {
  const processedImage = await removeImageBackground(file);
  setProcessedImage(processedImage);
} catch (error) {
  console.error('背景除去に失敗しました:', error);
}
```

**注意**:
- 処理には数秒かかる場合があります
- メモリを多く使用するため、大きな画像は事前にリサイズすることを推奨

### `resizeImage(dataURL: string, maxWidth?: number, maxHeight?: number): Promise<string>`

画像をリサイズします。アスペクト比は維持されます。

**パラメータ**:
- `dataURL` (string): リサイズする画像のData URL
- `maxWidth` (number, optional): 最大幅（デフォルト: 1024）
- `maxHeight` (number, optional): 最大高さ（デフォルト: 1024）

**戻り値**:
- `Promise<string>`: リサイズ後の画像（Data URL）

**例**:
```typescript
const resized = await resizeImage(originalDataURL, 800, 800);
```

### `cropToAspectRatio(dataURL: string, targetWidth?: number, targetHeight?: number): Promise<string>`

画像を指定のアスペクト比でクロップします（中央基準）。

**パラメータ**:
- `dataURL` (string): クロップする画像のData URL
- `targetWidth` (number, optional): 目標幅の比率（デフォルト: 5）
- `targetHeight` (number, optional): 目標高さの比率（デフォルト: 7）

**戻り値**:
- `Promise<string>`: クロップ後の画像（Data URL）

**例**:
```typescript
// 5:7の比率でクロップ
const cropped = await cropToAspectRatio(dataURL);

// 16:9の比率でクロップ
const cropped169 = await cropToAspectRatio(dataURL, 16, 9);
```

---

## Device Detection API

### `isIOS(): boolean`

現在のデバイスがiOSかどうかを判定します。

**戻り値**:
- `boolean`: iOSの場合true

**例**:
```typescript
if (isIOS()) {
  console.log('iOSデバイスです');
}
```

### `isAndroid(): boolean`

現在のデバイスがAndroidかどうかを判定します。

**戻り値**:
- `boolean`: Androidの場合true

### `isMobile(): boolean`

現在のデバイスがモバイル（iOS or Android）かどうかを判定します。

**戻り値**:
- `boolean`: モバイルの場合true

**例**:
```typescript
if (isMobile()) {
  // モバイル専用の処理
}
```

### `getDeviceType(): 'ios' | 'android' | 'desktop'`

デバイスタイプを取得します。

**戻り値**:
- `'ios'`: iOSデバイス
- `'android'`: Androidデバイス
- `'desktop'`: PC/その他のデバイス

**例**:
```typescript
const deviceType = getDeviceType();
switch (deviceType) {
  case 'ios':
    // iOS専用の処理
    break;
  case 'android':
    // Android専用の処理
    break;
  case 'desktop':
    // デスクトップ専用の処理
    break;
}
```

---

## Types

### Dish

器の型定義。

```typescript
interface Dish {
  id: string;              // 一意のID（UUID）
  name: string;            // 器の名前
  widthCm: number;         // 横幅（cm）
  heightCm: number;        // 縦幅（cm）
  originalImage: string;   // 元の画像（Data URL）
  processedImage: string;  // 背景除去後の画像（Data URL）
  createdAt: Date;         // 作成日時
}
```

### PlacedDish

3D AR空間に配置された器の情報（現在未使用）。

```typescript
interface PlacedDish {
  dishId: string;
  position: { x: number; y: number; z: number };
  rotation: number;  // Y軸周りの回転（ラジアン）
  scale: number;     // スケール倍率
}
```

### PlacedDish2D

2D配置モードの器配置情報。

```typescript
interface PlacedDish2D {
  dishId: string;    // 器のID
  x: number;         // X座標（px）
  y: number;         // Y座標（px）
  scale: number;     // スケール倍率（1.0 = 実寸）
  rotation: number;  // 回転角度（度）
}
```

---

## Components

### Dish2DPlacement

2D配置モードのメインコンポーネント。

**場所**: `components/Dish2DPlacement.tsx`

**説明**:
- 背景画像をアップロードして、器を2D平面に配置
- 背景は60cm × 40cm として扱われる
- ドラッグ&ドロップで器を移動
- スケール、回転の調整が可能

**Props**: なし（Storeから直接データを取得）

**使用例**:
```tsx
import Dish2DPlacement from '@/components/Dish2DPlacement';

<Dish2DPlacement />
```

**主要機能**:
- 背景画像のアップロードと5:7比率への自動クロップ
- 器のキャンバスへの追加
- マウス/タッチドラッグ&ドロップ
- スケール調整（0.5x〜3.0x）
- 回転調整（45度単位）
- レスポンシブデザイン（PC/モバイル対応）

### IOSSimpleAR

iOS向けカメラARモードのコンポーネント。

**場所**: `components/IOSSimpleAR.tsx`

**説明**:
- カメラ映像を背景に器を重ねて表示
- タップで器を配置
- ドラッグで器を移動
- サイズ調整機能

**Props**: なし（Storeから直接データを取得）

**使用例**:
```tsx
import IOSSimpleAR from '@/components/IOSSimpleAR';

<IOSSimpleAR />
```

**主要機能**:
- 背面カメラの起動
- カメラ映像のリアルタイム表示
- 器のオーバーレイ表示
- タッチ操作による配置・移動
- スケール調整

**必要な権限**:
- カメラへのアクセス許可

---

## 定数

### 2D配置モードの背景サイズ

```typescript
const BACKGROUND_WIDTH_CM = 50;   // 横幅 50cm
const BACKGROUND_HEIGHT_CM = 70;  // 縦幅 70cm
```

これらの定数は、2D配置モードで器のサイズを正確に計算するために使用されます。

### 画像リサイズの最大サイズ

```typescript
const DEFAULT_MAX_WIDTH = 1024;
const DEFAULT_MAX_HEIGHT = 1024;
```

メモリ節約とパフォーマンス向上のため、画像は自動的にこのサイズ以下にリサイズされます。

---

## エラーハンドリング

### 画像処理エラー

```typescript
try {
  const processed = await removeImageBackground(file);
} catch (error) {
  console.error('背景除去エラー:', error);
  // ユーザーにエラーメッセージを表示
  alert('画像の処理に失敗しました。もう一度お試しください。');
}
```

### カメラアクセスエラー

```typescript
try {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'environment' }
  });
} catch (error) {
  console.error('カメラアクセスエラー:', error);
  setError('カメラへのアクセスが拒否されました。');
}
```

---

## ベストプラクティス

### 1. Storeアクセス

```typescript
// ❌ 悪い例: すべての状態を取得
const store = useDishStore();

// ✅ 良い例: 必要な状態のみを取得
const dishes = useDishStore((state) => state.dishes);
const addDish = useDishStore((state) => state.addDish);
```

### 2. 画像処理

```typescript
// ✅ 良い例: リサイズしてから背景除去
const dataURL = await fileToDataURL(file);
const resized = await resizeImage(dataURL);
const processed = await removeImageBackground(resized);
```

### 3. エラーハンドリング

```typescript
// ✅ 良い例: try-catchでエラーをキャッチ
const [error, setError] = useState('');

try {
  await someAsyncOperation();
} catch (err) {
  console.error(err);
  setError('操作に失敗しました');
}

// UIにエラーを表示
{error && <div className="error">{error}</div>}
```

---

## 参考資料

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Canvas API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [FileReader API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)
- [getUserMedia API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
