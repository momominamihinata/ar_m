'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDishStore } from '@/store/dishStore';
import { fileToDataURL, removeImageBackground, resizeImage, trimTransparentPixels } from '@/lib/image-processing';

export default function NewDishPage() {
  const router = useRouter();
  const addDish = useDishStore((state) => state.addDish);

  const [name, setName] = useState('');
  const [widthCm, setWidthCm] = useState<string>('10');
  const [heightCm, setHeightCm] = useState<string>('10');
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

      // 透明部分をトリミング（器だけの領域にする）
      const trimmed = await trimTransparentPixels(processed);
      setProcessedImage(trimmed);

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

    // サイズを数値に変換してバリデーション
    const width = Number(widthCm);
    const height = Number(heightCm);

    if (isNaN(width) || isNaN(height) || width < 0.1 || height < 0.1) {
      setError('サイズは0.1以上の数値を入力してください');
      return;
    }

    // 器を追加
    addDish({
      name,
      widthCm: width,
      heightCm: height,
      originalImage,
      processedImage,
    });

    // マイ器リストページに戻る
    router.push('/dishes');
  };

  return (
    <div className="min-h-screen bg-[#d8ba9d] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.push('/dishes')}
            className="text-[#6f3f1e] hover:text-[#915524]"
          >
            ← 戻る
          </button>
        </div>

        <h1 className="text-3xl font-bold text-[#6f3f1e] mb-8">
          器を登録
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-[#f4f4f4] rounded-lg p-6 shadow-sm">
          {/* 画像アップロード */}
          <div>
            <label className="block text-sm font-medium text-[#6f3f1e] mb-2">
              器の写真（真上から撮影）
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isProcessing}
              className="block w-full text-sm text-[#6f3f1e]
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-[#915524] file:text-[#f4f4f4]
                hover:file:bg-[#6f3f1e]
                disabled:opacity-50"
            />

            {isProcessing && (
              <p className="mt-2 text-sm text-[#915524]">
                画像を処理中... （数秒かかる場合があります）
              </p>
            )}

            {/* プレビュー */}
            {originalImage && processedImage && !isProcessing && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#6f3f1e] mb-1">元画像</p>
                  <img
                    src={originalImage}
                    alt="元画像"
                    className="w-full h-40 object-contain bg-[#d8ba9d] rounded"
                  />
                </div>
                <div>
                  <p className="text-xs text-[#6f3f1e] mb-1">背景除去後</p>
                  <img
                    src={processedImage}
                    alt="背景除去後"
                    className="w-full h-40 object-contain bg-[#d8ba9d] rounded"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 名前 */}
          <div>
            <label className="block text-sm font-medium text-[#6f3f1e] mb-2">
              器の名前
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: 大皿、小鉢、カップ"
              className="w-full px-4 py-2 border border-[#c39665] rounded-lg
                bg-white text-[#6f3f1e]
                focus:ring-2 focus:ring-[#915524] focus:border-transparent"
            />
          </div>

          {/* サイズ */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#6f3f1e] mb-2">
                横幅（cm）
              </label>
              <input
                type="number"
                value={widthCm}
                onChange={(e) => setWidthCm(e.target.value)}
                min="0.1"
                step="0.1"
                className="w-full px-4 py-2 border border-[#c39665] rounded-lg
                  bg-white text-[#6f3f1e]
                  focus:ring-2 focus:ring-[#915524] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6f3f1e] mb-2">
                縦幅（cm）
              </label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                min="0.1"
                step="0.1"
                className="w-full px-4 py-2 border border-[#c39665] rounded-lg
                  bg-white text-[#6f3f1e]
                  focus:ring-2 focus:ring-[#915524] focus:border-transparent"
              />
            </div>
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* 送信ボタン */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3 bg-[#915524] text-[#f4f4f4]
              font-medium rounded-lg hover:bg-[#6f3f1e]
              disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            登録する
          </button>
        </form>
      </div>
    </div>
  );
}
