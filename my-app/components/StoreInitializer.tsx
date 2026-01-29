'use client';

import { useEffect } from 'react';
import { useDishStore } from '@/store/dishStore';

/**
 * ストアの初期化を実行するコンポーネント
 * アプリ起動時に一度だけデフォルトデータを読み込む
 */
export default function StoreInitializer() {
  const { initializeWithDefaults } = useDishStore();

  useEffect(() => {
    // アプリ起動時にデフォルトデータで初期化（背景除去は行わない）
    initializeWithDefaults();
  }, [initializeWithDefaults]);

  return null;
}
