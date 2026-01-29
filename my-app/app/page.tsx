'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#d8ba9d] py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#6f3f1e] mb-4">
            器と机コーディネート
          </h1>
        </div>

        {/* 機能説明 */}
        <div className="mb-12 bg-[#f4f4f4] rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-[#6f3f1e] mb-6">
            使い方
          </h2>
          <ol className="space-y-4 text-[#6f3f1e]">
            <li className="flex gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-[#915524] text-[#f4f4f4] rounded-full font-semibold">
                1
              </span>
              <span>器の写真を真上から撮影してアップロード</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-[#915524] text-[#f4f4f4] rounded-full font-semibold">
                2
              </span>
              <span>器のサイズ（縦横のセンチメートル）を入力</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-[#915524] text-[#f4f4f4] rounded-full font-semibold">
                3
              </span>
              <span>背景が自動で除去され、器だけの画像に加工されます</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-[#915524] text-[#f4f4f4] rounded-full font-semibold">
                4
              </span>
              <span>配置モードで机に器を配置して、サイズ感や配置を確認</span>
            </li>
          </ol>
        </div>

        {/* アクションボタン */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <Link
            href="/dishes"
            className="group bg-[#915524] text-[#f4f4f4]
              rounded-lg p-8 shadow-sm hover:shadow-md transition-all"
          >
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-semibold mb-2">マイ器リスト</h3>
            <p className="text-sm opacity-90">
              登録済みの器を確認・配置する
            </p>
            <div className="mt-4 text-sm font-medium group-hover:translate-x-1 transition-transform">
              見る →
            </div>
          </Link>

          <Link
            href="/dishes/new"
            className="group bg-[#6f3f1e] text-[#f4f4f4]
              rounded-lg p-8 shadow-sm hover:shadow-md transition-all"
          >
            <div className="text-4xl mb-4">📸</div>
            <h3 className="text-xl font-semibold mb-2">器を登録</h3>
            <p className="text-sm opacity-90">
              写真をアップロードして器を追加
            </p>
            <div className="mt-4 text-sm font-medium group-hover:translate-x-1 transition-transform">
              始める →
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}
