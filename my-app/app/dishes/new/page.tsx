'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDishStore } from '@/store/dishStore';
import { fileToDataURL, removeImageBackground, resizeImage } from '@/lib/image-processing';

export default function NewDishPage() {
  const router = useRouter();
  const addDish = useDishStore((state) => state.addDish);

  const [name, setName] = useState('');
  const [widthCm, setWidthCm] = useState(10);
  const [heightCm, setHeightCm] = useState(10);
  const [originalImage, setOriginalImage] = useState<string>('');
  const [processedImage, setProcessedImage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      setError('');

      // 元画像をData URLに変換
      const dataURL = await fileToDataURL(file);

      // リサイズ（メモリ節約）
      const resizedDataURL = await resizeImage(dataURL);
      setOriginalImage(resizedDataURL);

      // 背景除去処理
      const processed = await removeImageBackground(file);
      setProcessedImage(processed);

      setIsProcessing(false);
    } catch (err) {
      console.error(err);
      setError('画像の処理に失敗しました。もう一度お試しください。');
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('器の名前を入力してください');
      return;
    }

    if (!originalImage || !processedImage) {
      setError('画像をアップロードしてください');
      return;
    }

    if (widthCm <= 0 || heightCm <= 0) {
      setError('サイズは0より大きい値を入力してください');
      return;
    }

    // 器を追加
    addDish({
      name,
      widthCm,
      heightCm,
      originalImage,
      processedImage,
    });

    // マイ器リストページに戻る
    router.push('/dishes');
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.push('/dishes')}
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            ← 戻る
          </button>
        </div>

        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">
          器を登録
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm">
          {/* 画像アップロード */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              器の写真（真上から撮影）
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isProcessing}
              className="block w-full text-sm text-zinc-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-zinc-900 file:text-white
                hover:file:bg-zinc-700
                dark:file:bg-zinc-50 dark:file:text-zinc-900
                dark:hover:file:bg-zinc-200
                disabled:opacity-50"
            />

            {isProcessing && (
              <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                画像を処理中... （数秒かかる場合があります）
              </p>
            )}

            {/* プレビュー */}
            {originalImage && processedImage && !isProcessing && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-zinc-500 mb-1">元画像</p>
                  <img
                    src={originalImage}
                    alt="元画像"
                    className="w-full h-40 object-contain bg-zinc-100 dark:bg-zinc-800 rounded"
                  />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">背景除去後</p>
                  <img
                    src={processedImage}
                    alt="背景除去後"
                    className="w-full h-40 object-contain bg-zinc-100 dark:bg-zinc-800 rounded"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 名前 */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              器の名前
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: 大皿、小鉢、カップ"
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg
                bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100
                focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 focus:border-transparent"
            />
          </div>

          {/* サイズ */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                横幅（cm）
              </label>
              <input
                type="number"
                value={widthCm}
                onChange={(e) => setWidthCm(Number(e.target.value))}
                min="0.1"
                step="0.1"
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg
                  bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100
                  focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                縦幅（cm）
              </label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                min="0.1"
                step="0.1"
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg
                  bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100
                  focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 focus:border-transparent"
              />
            </div>
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* 送信ボタン */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900
              font-medium rounded-lg hover:bg-zinc-700 dark:hover:bg-zinc-200
              disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            登録する
          </button>
        </form>
      </div>
    </div>
  );
}
