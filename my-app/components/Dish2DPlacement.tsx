'use client';

import { useState, useRef } from 'react';
import { useDishStore } from '@/store/dishStore';
import { fileToDataURL } from '@/lib/image-processing';

export default function Dish2DPlacement() {
  const {
    dishes,
    selectedDishes,
    backgroundImage,
    setBackgroundImage,
    placedDishes2D,
    placeDish2D,
    updatePlacedDish2D,
    removePlacedDish2D,
  } = useDishStore();

  const [draggedDishId, setDraggedDishId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 背景のサイズ（cm）
  const BACKGROUND_WIDTH_CM = 100;
  const BACKGROUND_HEIGHT_CM = 70;

  const selectedDishObjects = dishes.filter((d) => selectedDishes.includes(d.id));

  // 背景画像の表示サイズとピクセル/cm比率を計算
  const getBackgroundDimensions = () => {
    if (!containerRef.current) return null;

    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;

    // 背景のアスペクト比
    const bgAspectRatio = BACKGROUND_WIDTH_CM / BACKGROUND_HEIGHT_CM;
    const containerAspectRatio = containerWidth / containerHeight;

    let bgDisplayWidth: number;
    let bgDisplayHeight: number;

    // アスペクト比に基づいて表示サイズを計算（contain方式）
    if (containerAspectRatio > bgAspectRatio) {
      // コンテナの方が横長
      bgDisplayHeight = containerHeight;
      bgDisplayWidth = containerHeight * bgAspectRatio;
    } else {
      // コンテナの方が縦長
      bgDisplayWidth = containerWidth;
      bgDisplayHeight = containerWidth / bgAspectRatio;
    }

    // ピクセル/cm比率
    const pixelsPerCm = bgDisplayWidth / BACKGROUND_WIDTH_CM;

    // 背景の表示開始位置（中央揃え）
    const offsetX = (containerWidth - bgDisplayWidth) / 2;
    const offsetY = (containerHeight - bgDisplayHeight) / 2;

    return {
      width: bgDisplayWidth,
      height: bgDisplayHeight,
      offsetX,
      offsetY,
      pixelsPerCm,
    };
  };

  // 背景画像アップロード
  const handleBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataURL = await fileToDataURL(file);
      setBackgroundImage(dataURL);
    } catch (error) {
      console.error('背景画像の読み込みに失敗しました', error);
    }
  };

  // 器をキャンバスに追加
  const handleAddDishToCanvas = (dishId: string) => {
    // すでに配置されている場合はスキップ
    if (placedDishes2D.some((pd) => pd.dishId === dishId)) {
      return;
    }

    const bgDimensions = getBackgroundDimensions();
    if (!bgDimensions) return;

    // 背景の中央に配置
    placeDish2D({
      dishId,
      x: bgDimensions.offsetX + bgDimensions.width / 2,
      y: bgDimensions.offsetY + bgDimensions.height / 2,
      scale: 1.0,
      rotation: 0,
    });
  };

  // ドラッグ開始（マウス）
  const handleDragStart = (e: React.MouseEvent, dishId: string) => {
    const placed = placedDishes2D.find((pd) => pd.dishId === dishId);
    if (!placed) return;

    setDraggedDishId(dishId);
    setDragOffset({
      x: e.clientX - placed.x,
      y: e.clientY - placed.y,
    });
  };

  // ドラッグ中（マウス）
  const handleDragMove = (e: React.MouseEvent) => {
    if (!draggedDishId) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;

    updatePlacedDish2D(draggedDishId, { x, y });
  };

  // ドラッグ終了（マウス）
  const handleDragEnd = () => {
    setDraggedDishId(null);
  };

  // タッチ開始
  const handleTouchStart = (e: React.TouchEvent, dishId: string) => {
    const placed = placedDishes2D.find((pd) => pd.dishId === dishId);
    if (!placed) return;

    const touch = e.touches[0];
    setDraggedDishId(dishId);
    setDragOffset({
      x: touch.clientX - placed.x,
      y: touch.clientY - placed.y,
    });
  };

  // タッチ移動
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!draggedDishId) return;
    e.preventDefault();

    const touch = e.touches[0];
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = touch.clientX - rect.left - dragOffset.x;
    const y = touch.clientY - rect.top - dragOffset.y;

    updatePlacedDish2D(draggedDishId, { x, y });
  };

  // タッチ終了
  const handleTouchEnd = () => {
    setDraggedDishId(null);
  };

  // スケール変更
  const handleScaleChange = (dishId: string, delta: number) => {
    const placed = placedDishes2D.find((pd) => pd.dishId === dishId);
    if (!placed) return;

    const newScale = Math.max(0.5, Math.min(3.0, placed.scale + delta));
    updatePlacedDish2D(dishId, { scale: newScale });
  };

  // 回転
  const handleRotate = (dishId: string, delta: number) => {
    const placed = placedDishes2D.find((pd) => pd.dishId === dishId);
    if (!placed) return;

    const newRotation = (placed.rotation + delta) % 360;
    updatePlacedDish2D(dishId, { rotation: newRotation });
  };

  return (
    <div className="flex flex-col md:flex-row h-screen relative">
      {/* サイドバー（デスクトップ: 左側、モバイル: 下部ドロワー） */}
      <div className={`
        md:w-80 md:relative md:translate-y-0
        fixed bottom-0 left-0 right-0 z-20
        transform transition-transform duration-300
        ${isSidebarOpen ? 'translate-y-0' : 'translate-y-full'}
        md:transform-none
        bg-white dark:bg-zinc-900
        border-r md:border-r border-t md:border-t-0 border-zinc-200 dark:border-zinc-800
        overflow-y-auto
        max-h-[70vh] md:max-h-none
      `}>
        <div className="p-4 space-y-6">
          {/* 背景画像アップロード */}
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
              背景画像（机・テーブル）
            </h3>
            <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                背景は <strong>{BACKGROUND_WIDTH_CM} × {BACKGROUND_HEIGHT_CM} cm</strong> として扱われます
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleBackgroundUpload}
              className="block w-full text-sm text-zinc-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-zinc-900 file:text-white
                hover:file:bg-zinc-700
                dark:file:bg-zinc-50 dark:file:text-zinc-900
                dark:hover:file:bg-zinc-200"
            />
            {backgroundImage && (
              <button
                onClick={() => setBackgroundImage(null)}
                className="mt-2 text-xs text-red-600 dark:text-red-400 hover:underline"
              >
                背景をクリア
              </button>
            )}
          </div>

          {/* 器リスト */}
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
              配置する器 ({selectedDishObjects.length}個)
            </h3>
            <div className="space-y-2">
              {selectedDishObjects.map((dish) => {
                const isPlaced = placedDishes2D.some((pd) => pd.dishId === dish.id);
                return (
                  <div
                    key={dish.id}
                    className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <img
                        src={dish.processedImage}
                        alt={dish.name}
                        className="w-12 h-12 object-contain bg-white dark:bg-zinc-900 rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                          {dish.name}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {dish.widthCm} × {dish.heightCm} cm
                        </p>
                      </div>
                    </div>
                    {isPlaced ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
                          <span>スケール:</span>
                          <span>{(placedDishes2D.find(pd => pd.dishId === dish.id)?.scale || 1).toFixed(1)}x</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleScaleChange(dish.id, -0.1)}
                            className="flex-1 px-2 py-1 text-xs bg-zinc-200 dark:bg-zinc-700 rounded hover:bg-zinc-300 dark:hover:bg-zinc-600"
                          >
                            縮小
                          </button>
                          <button
                            onClick={() => handleScaleChange(dish.id, 0.1)}
                            className="flex-1 px-2 py-1 text-xs bg-zinc-200 dark:bg-zinc-700 rounded hover:bg-zinc-300 dark:hover:bg-zinc-600"
                          >
                            拡大
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRotate(dish.id, 45)}
                            className="flex-1 px-2 py-1 text-xs bg-zinc-200 dark:bg-zinc-700 rounded hover:bg-zinc-300 dark:hover:bg-zinc-600"
                          >
                            回転
                          </button>
                          <button
                            onClick={() => removePlacedDish2D(dish.id)}
                            className="flex-1 px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50"
                          >
                            削除
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddDishToCanvas(dish.id)}
                        className="w-full px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        キャンバスに追加
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* キャンバスエリア */}
      <div className="flex-1 bg-zinc-100 dark:bg-zinc-950 relative overflow-hidden">
        {/* モバイル用: サイドバー開閉ボタン */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden fixed bottom-4 right-4 z-30 bg-blue-600 text-white p-4 rounded-full shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isSidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {!backgroundImage ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md p-8">
              <div className="text-6xl mb-4">📷</div>
              <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-2 font-medium">
                背景画像をアップロードしてください
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                机やテーブルの写真を選択してください
              </p>
              <div className="text-left bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4 text-sm">
                <p className="font-medium text-zinc-900 dark:text-zinc-50 mb-2">
                  ヒント：
                </p>
                <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400">
                  <li>背景は {BACKGROUND_WIDTH_CM}×{BACKGROUND_HEIGHT_CM}cm として計算されます</li>
                  <li>できるだけ真上から撮影した写真が最適です</li>
                  <li>机全体が映るように撮影してください</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div
            ref={containerRef}
            className="relative w-full h-full"
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          >
            {/* 背景サイズ表示 */}
            <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded text-xs backdrop-blur">
              背景サイズ: {BACKGROUND_WIDTH_CM} × {BACKGROUND_HEIGHT_CM} cm
            </div>

            {/* 配置された器 */}
            {placedDishes2D.map((placed) => {
              const dish = dishes.find((d) => d.id === placed.dishId);
              if (!dish) return null;

              const bgDimensions = getBackgroundDimensions();
              if (!bgDimensions) return null;

              // 背景のピクセル/cm比率を使用
              const widthPx = dish.widthCm * bgDimensions.pixelsPerCm * placed.scale;
              const heightPx = dish.heightCm * bgDimensions.pixelsPerCm * placed.scale;

              return (
                <div
                  key={placed.dishId}
                  className="absolute cursor-move hover:ring-2 hover:ring-blue-500 rounded touch-none"
                  style={{
                    left: placed.x,
                    top: placed.y,
                    transform: `translate(-50%, -50%) rotate(${placed.rotation}deg)`,
                    width: widthPx,
                    height: heightPx,
                  }}
                  onMouseDown={(e) => handleDragStart(e, placed.dishId)}
                  onTouchStart={(e) => handleTouchStart(e, placed.dishId)}
                >
                  <img
                    src={dish.processedImage}
                    alt={dish.name}
                    className="w-full h-full object-contain pointer-events-none"
                    draggable={false}
                  />
                  {/* 器の情報表示（ホバー時） */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                    {dish.name} ({dish.widthCm}×{dish.heightCm}cm)
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
