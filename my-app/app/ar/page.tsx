'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDishStore } from '@/store/dishStore';
import Dish2DPlacement from '@/components/Dish2DPlacement';
import IOSSimpleAR from '@/components/IOSSimpleAR';
import { isIOS } from '@/lib/device-detection';

export default function ARPage() {
  const router = useRouter();
  const { selectedDishes } = useDishStore();
  const [mode, setMode] = useState<'camera-ar' | '2d'>('camera-ar');
  const [isIOSDevice, setIsIOSDevice] = useState(false);

  useEffect(() => {
    // 選択された器がない場合は戻る
    if (selectedDishes.length === 0) {
      router.push('/dishes');
      return;
    }

    // iOSデバイスかチェック
    const iosDetected = isIOS();
    setIsIOSDevice(iosDetected);

    // デフォルトは2Dモード（iOS含む）
    setMode('2d');
  }, [selectedDishes, router]);

  // 2Dモードの場合
  if (mode === '2d') {
    return (
      <div className="h-screen flex flex-col">
        {/* ヘッダー */}
        <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/dishes')}
              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              ← 戻る
            </button>
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                2D配置モード
              </span>
              {isIOSDevice && (
                <button
                  onClick={() => setMode('camera-ar')}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  カメラARに切替
                </button>
              )}
            </div>
          </div>
        </div>
        <Dish2DPlacement />
      </div>
    );
  }

  // カメラARモード（iOS）
  return (
    <div className="h-screen flex flex-col">
      {/* ヘッダー */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/70 to-transparent">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/dishes')}
            className="text-white hover:text-zinc-300"
          >
            ← 戻る
          </button>
          <button
            onClick={() => setMode('2d')}
            className="px-4 py-2 bg-white/20 text-white text-sm rounded backdrop-blur hover:bg-white/30"
          >
            2Dモードに切替
          </button>
        </div>
      </div>
      <IOSSimpleAR />
    </div>
  );
}
