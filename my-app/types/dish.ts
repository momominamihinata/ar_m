// 器の型定義
export interface Dish {
  id: string;
  name: string;
  widthCm: number;    // 横幅（cm）
  heightCm: number;   // 縦幅（cm）
  originalImage: string;   // 元の画像（Data URL）
  processedImage: string;  // 背景除去後の画像（Data URL）
  createdAt: Date;
}

// AR空間に配置された器
export interface PlacedDish {
  dishId: string;
  position: { x: number; y: number; z: number };
  rotation: number; // Y軸周りの回転（ラジアン）
  scale: number;    // スケール倍率
}

// 2D配置モード用の器配置情報
export interface PlacedDish2D {
  dishId: string;
  x: number;        // X座標（px）
  y: number;        // Y座標（px）
  scale: number;    // スケール倍率（1.0 = 実寸）
  rotation: number; // 回転角度（度）
  zIndex: number;   // 重なり順（大きいほど前面）
}
