'use client';

import { useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDishStore } from '@/store/dishStore';
import Dish2DPlacement from '@/components/Dish2DPlacement';
import IOSSimpleAR from '@/components/IOSSimpleAR';
import { isIOS } from '@/lib/device-detection';

export default function ARPage() {
  const router = useRouter();
  const { selectedDishes } = useDishStore();
  const searchParams = useSearchParams();

  // NOTE: AR（カメラAR）は開発途中のため、ユーザー向けUIからは到達できないようにする。
  // 開発時のみ `?mode=camera-ar` で確認できるよう残している。
  const requestedMode = searchParams.get('mode');
  const shouldShowCameraAR = useMemo(() => {
    return requestedMode === 'camera-ar' && isIOS();
  }, [requestedMode]);

  useEffect(() => {
    // 選択された器がない場合は戻る
    if (selectedDishes.length === 0) {
      router.push('/dishes');
      return;
    }
  }, [selectedDishes, router]);

  // カメラARモード（開発用：UIからは到達不可）
  if (shouldShowCameraAR) {
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
          </div>
        </div>
        <IOSSimpleAR />
      </div>
    );
  }

  // 配置モード（2D）
  {
    return (
      <div className="h-screen flex flex-col">
        {/* ヘッダー */}
        <div className="bg-[#f4f4f4] border-b border-[#c39665] p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/dishes')}
              className="text-[#6f3f1e] hover:text-[#915524]"
            >
              ← 戻る
            </button>
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#6f3f1e]">
                配置モード
              </span>
            </div>
          </div>
        </div>
        <Dish2DPlacement />
      </div>
    );
  }
}
