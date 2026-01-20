'use client';

import { useState, useRef, useEffect } from 'react';
import { useDishStore } from '@/store/dishStore';

export default function IOSSimpleAR() {
  const { dishes, selectedDishes, placedDishes2D, placeDish2D, updatePlacedDish2D, removePlacedDish2D } = useDishStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState<string>('');
  const [draggedDishId, setDraggedDishId] = useState<string | null>(null);
  const [touchOffset, setTouchOffset] = useState({ x: 0, y: 0 });

  const selectedDishObjects = dishes.filter((d) => selectedDishes.includes(d.id));

  // カメラを起動
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // 背面カメラ
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error('カメラアクセスエラー:', err);
      setError('カメラへのアクセスが拒否されました。ブラウザの設定を確認してください。');
    }
  };

  // コンポーネントマウント時にカメラを起動
  useEffect(() => {
    startCamera();

    return () => {
      // クリーンアップ: カメラストリームを停止
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // 器をキャンバスに追加
  const handleAddDish = (dishId: string) => {
    if (placedDishes2D.some((pd) => pd.dishId === dishId)) return;

    const containerWidth = containerRef.current?.offsetWidth || window.innerWidth;
    const containerHeight = containerRef.current?.offsetHeight || window.innerHeight;

    placeDish2D({
      dishId,
      x: containerWidth / 2,
      y: containerHeight / 2,
      scale: 1.0,
      rotation: 0,
    });
  };

  // タッチ開始
  const handleTouchStart = (e: React.TouchEvent, dishId: string) => {
    e.preventDefault();
    const placed = placedDishes2D.find((pd) => pd.dishId === dishId);
    if (!placed) return;

    const touch = e.touches[0];
    setDraggedDishId(dishId);
    setTouchOffset({
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

    const x = touch.clientX - rect.left - touchOffset.x;
    const y = touch.clientY - rect.top - touchOffset.y;

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

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* カメラ映像 */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* AR オーバーレイ */}
      <div
        ref={containerRef}
        className="absolute inset-0"
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 配置された器 */}
        {placedDishes2D.map((placed) => {
          const dish = dishes.find((d) => d.id === placed.dishId);
          if (!dish) return null;

          // 画面サイズに応じた器のサイズ計算
          const baseSize = 150; // ベースサイズ（px）
          const widthPx = baseSize * (dish.widthCm / 20) * placed.scale;
          const heightPx = baseSize * (dish.heightCm / 20) * placed.scale;

          return (
            <div
              key={placed.dishId}
              className="absolute"
              style={{
                left: placed.x,
                top: placed.y,
                transform: `translate(-50%, -50%) rotate(${placed.rotation}deg)`,
                width: widthPx,
                height: heightPx,
              }}
              onTouchStart={(e) => handleTouchStart(e, placed.dishId)}
            >
              <img
                src={dish.processedImage}
                alt={dish.name}
                className="w-full h-full object-contain pointer-events-none"
                draggable={false}
              />
            </div>
          );
        })}
      </div>

      {/* UI コントロール */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pb-safe">
        {/* 器選択 */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
          {selectedDishObjects.map((dish) => {
            const isPlaced = placedDishes2D.some((pd) => pd.dishId === dish.id);
            return (
              <button
                key={dish.id}
                onClick={() => !isPlaced && handleAddDish(dish.id)}
                disabled={isPlaced}
                className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 ${
                  isPlaced
                    ? 'border-green-500 bg-green-500/20'
                    : 'border-white/50 bg-black/50 active:bg-white/20'
                }`}
              >
                <img
                  src={dish.processedImage}
                  alt={dish.name}
                  className="w-full h-full object-contain p-1"
                />
              </button>
            );
          })}
        </div>

        {/* 配置済み器のコントロール */}
        {placedDishes2D.length > 0 && (
          <div className="space-y-2">
            {placedDishes2D.map((placed) => {
              const dish = dishes.find((d) => d.id === placed.dishId);
              if (!dish) return null;

              return (
                <div
                  key={placed.dishId}
                  className="flex items-center gap-2 bg-black/70 rounded-lg p-2"
                >
                  <span className="text-white text-sm flex-1 truncate">
                    {dish.name}
                  </span>
                  <button
                    onClick={() => handleScaleChange(placed.dishId, -0.2)}
                    className="px-3 py-1 bg-white/20 text-white text-sm rounded active:bg-white/30"
                  >
                    縮小
                  </button>
                  <button
                    onClick={() => handleScaleChange(placed.dishId, 0.2)}
                    className="px-3 py-1 bg-white/20 text-white text-sm rounded active:bg-white/30"
                  >
                    拡大
                  </button>
                  <button
                    onClick={() => removePlacedDish2D(placed.dishId)}
                    className="px-3 py-1 bg-red-500/80 text-white text-sm rounded active:bg-red-500"
                  >
                    削除
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="absolute top-4 left-4 right-4 bg-red-500/90 text-white p-4 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* 説明 */}
      {!error && cameraActive && placedDishes2D.length === 0 && (
        <div className="absolute top-4 left-4 right-4 bg-black/70 text-white p-4 rounded-lg">
          <p className="text-sm">
            下のリストから器をタップして配置してください。配置した器はドラッグで移動できます。
          </p>
        </div>
      )}
    </div>
  );
}
