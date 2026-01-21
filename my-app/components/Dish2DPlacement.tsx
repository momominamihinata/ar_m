'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useDishStore } from '@/store/dishStore';
import { fileToDataURL, cropToAspectRatio } from '@/lib/image-processing';

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
  const [containerDimensions, setContainerDimensions] = useState<{
    width: number;
    height: number;
    offsetX: number;
    offsetY: number;
    pixelsPerCm: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 背景のサイズ（cm）
  const BACKGROUND_WIDTH_CM = 60;
  const BACKGROUND_HEIGHT_CM = 40;

  const selectedDishObjects = dishes.filter((d) => selectedDishes.includes(d.id));

  // 背景画像の表示サイズとピクセル/cm比率を計算
  const getBackgroundDimensions = useCallback(() => {
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
  }, []);

  // useEffectでコンテナのサイズを計算して状態に保存
  useEffect(() => {
    const updateDimensions = () => {
      const dimensions = getBackgroundDimensions();
      setContainerDimensions(dimensions);
    };

    // 初回計算
    updateDimensions();

    // ウィンドウリサイズ時に再計算
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [backgroundImage, getBackgroundDimensions]); // backgroundImageが変わった時も再計算

  // 背景画像アップロード
  const handleBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // ファイルをData URLに変換
      const dataURL = await fileToDataURL(file);

      // 3:2の比率にクロップ（横60cm × 縦40cm）
      const croppedDataURL = await cropToAspectRatio(dataURL, 3, 2);

      setBackgroundImage(croppedDataURL);
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

    if (!containerDimensions) return;

    // 背景の中央に配置
    placeDish2D({
      dishId,
      x: containerDimensions.offsetX + containerDimensions.width / 2,
      y: containerDimensions.offsetY + containerDimensions.height / 2,
      scale: 1.0,
      rotation: 0,
    });
  };

  // ドラッグ開始（マウス）
  const handleDragStart = (e: React.MouseEvent, dishId: string) => {
    const placed = placedDishes2D.find((pd) => pd.dishId === dishId);
    if (!placed) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // マウスのコンテナ内相対座標を計算
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setDraggedDishId(dishId);
    setDragOffset({
      x: mouseX - placed.x,
      y: mouseY - placed.y,
    });
  };

  // ドラッグ中（マウス）
  const handleDragMove = (e: React.MouseEvent) => {
    if (!draggedDishId) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // マウスのコンテナ内相対座標を計算
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const x = mouseX - dragOffset.x;
    const y = mouseY - dragOffset.y;

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

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const touch = e.touches[0];
    // タッチのコンテナ内相対座標を計算
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;

    setDraggedDishId(dishId);
    setDragOffset({
      x: touchX - placed.x,
      y: touchY - placed.y,
    });
  };

  // タッチ移動
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!draggedDishId) return;
    e.preventDefault();

    const touch = e.touches[0];
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // タッチのコンテナ内相対座標を計算
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;

    const x = touchX - dragOffset.x;
    const y = touchY - dragOffset.y;

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
        bg-[#f4f4f4] dark:bg-[#915524]
        border-r md:border-r border-t md:border-t-0 border-[#c39665] dark:border-[#6f3f1e]
        overflow-y-auto
        max-h-[70vh] md:max-h-none
      `}>
        <div className="p-4 space-y-6">
          {/* 背景画像アップロード */}
          <div>
            <h3 className="font-semibold text-[#6f3f1e] dark:text-[#f4f4f4] mb-3">
              背景画像（机・テーブル）
            </h3>
            <div className="mb-3 p-3 bg-[#c39665]/20 dark:bg-[#6f3f1e]/40 border border-[#c39665] dark:border-[#6f3f1e] rounded-lg">
              <p className="text-xs text-[#6f3f1e] dark:text-[#f4f4f4]">
                背景は <strong>{BACKGROUND_WIDTH_CM} × {BACKGROUND_HEIGHT_CM} cm</strong> として扱われます
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleBackgroundUpload}
              className="block w-full text-sm text-[#6f3f1e]
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-[#915524] file:text-[#f4f4f4]
                hover:file:bg-[#6f3f1e]
                dark:file:bg-[#c39665] dark:file:text-[#6f3f1e]
                dark:hover:file:bg-[#d8ba9d]"
            />
            {backgroundImage && (
              <button
                onClick={() => setBackgroundImage(null)}
                className="mt-2 text-xs text-red-700 dark:text-red-400 hover:underline"
              >
                背景をクリア
              </button>
            )}
          </div>

          {/* 器リスト */}
          <div>
            <h3 className="font-semibold text-[#6f3f1e] dark:text-[#f4f4f4] mb-3">
              配置する器 ({selectedDishObjects.length}個)
            </h3>
            <div className="space-y-2">
              {selectedDishObjects.map((dish) => {
                const isPlaced = placedDishes2D.some((pd) => pd.dishId === dish.id);
                return (
                  <div
                    key={dish.id}
                    className="p-3 bg-[#d8ba9d] dark:bg-[#6f3f1e] rounded-lg"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <img
                        src={dish.processedImage}
                        alt={dish.name}
                        className="w-12 h-12 object-contain bg-white dark:bg-[#915524] rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#6f3f1e] dark:text-[#f4f4f4]">
                          {dish.name}
                        </p>
                        <p className="text-xs text-[#6f3f1e] dark:text-[#f4f4f4] opacity-80">
                          {dish.widthCm} × {dish.heightCm} cm
                        </p>
                      </div>
                    </div>
                    {isPlaced ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-[#6f3f1e] dark:text-[#f4f4f4]">
                          <span>スケール:</span>
                          <span>{(placedDishes2D.find(pd => pd.dishId === dish.id)?.scale || 1).toFixed(1)}x</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleScaleChange(dish.id, -0.1)}
                            className="flex-1 px-2 py-1 text-xs bg-[#c39665] dark:bg-[#915524] text-[#f4f4f4] rounded hover:bg-[#915524] dark:hover:bg-[#6f3f1e]"
                          >
                            縮小
                          </button>
                          <button
                            onClick={() => handleScaleChange(dish.id, 0.1)}
                            className="flex-1 px-2 py-1 text-xs bg-[#c39665] dark:bg-[#915524] text-[#f4f4f4] rounded hover:bg-[#915524] dark:hover:bg-[#6f3f1e]"
                          >
                            拡大
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRotate(dish.id, 45)}
                            className="flex-1 px-2 py-1 text-xs bg-[#c39665] dark:bg-[#915524] text-[#f4f4f4] rounded hover:bg-[#915524] dark:hover:bg-[#6f3f1e]"
                          >
                            回転
                          </button>
                          <button
                            onClick={() => removePlacedDish2D(dish.id)}
                            className="flex-1 px-2 py-1 text-xs bg-red-200 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded hover:bg-red-300 dark:hover:bg-red-900/60"
                          >
                            削除
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddDishToCanvas(dish.id)}
                        className="w-full px-3 py-1 text-sm bg-[#915524] dark:bg-[#c39665] text-[#f4f4f4] dark:text-[#6f3f1e] rounded hover:bg-[#6f3f1e] dark:hover:bg-[#d8ba9d]"
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
      <div className="flex-1 bg-[#c39665] dark:bg-[#6f3f1e] relative overflow-hidden">
        {/* モバイル用: サイドバー開閉ボタン */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden fixed bottom-4 right-4 z-30 bg-[#915524] dark:bg-[#c39665] text-[#f4f4f4] dark:text-[#6f3f1e] p-4 rounded-full shadow-lg"
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
              <p className="text-lg text-[#6f3f1e] dark:text-[#f4f4f4] mb-2 font-medium">
                背景画像をアップロードしてください
              </p>
              <p className="text-sm text-[#6f3f1e] dark:text-[#f4f4f4] opacity-80 mb-4">
                机やテーブルの写真を選択してください
              </p>
              <div className="text-left bg-[#d8ba9d] dark:bg-[#915524] rounded-lg p-4 text-sm">
                <p className="font-medium text-[#6f3f1e] dark:text-[#f4f4f4] mb-2">
                  ヒント：
                </p>
                <ul className="list-disc list-inside space-y-1 text-[#6f3f1e] dark:text-[#f4f4f4]">
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
            <div className="absolute top-4 left-4 bg-[#6f3f1e]/80 text-[#f4f4f4] px-3 py-2 rounded text-xs backdrop-blur">
              背景サイズ: {BACKGROUND_WIDTH_CM} × {BACKGROUND_HEIGHT_CM} cm
            </div>

            {/* 配置された器 */}
            {containerDimensions && placedDishes2D.map((placed) => {
              const dish = dishes.find((d) => d.id === placed.dishId);
              if (!dish) return null;

              // 背景のピクセル/cm比率を使用
              const widthPx = dish.widthCm * containerDimensions.pixelsPerCm * placed.scale;
              const heightPx = dish.heightCm * containerDimensions.pixelsPerCm * placed.scale;

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
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#6f3f1e]/80 text-[#f4f4f4] px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
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
