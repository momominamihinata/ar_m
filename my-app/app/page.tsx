'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            器ARコーディネート
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            買いたい器と家の机の相性を確認できるWebアプリ
          </p>
        </div>

        {/* 機能説明 */}
        <div className="mb-12 bg-white dark:bg-zinc-900 rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-6">
            使い方
          </h2>
          <ol className="space-y-4 text-zinc-700 dark:text-zinc-300">
            <li className="flex gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-full font-semibold">
                1
              </span>
              <span>器の写真を真上から撮影してアップロード</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-full font-semibold">
                2
              </span>
              <span>器のサイズ（縦横のセンチメートル）を入力</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-full font-semibold">
                3
              </span>
              <span>背景が自動で除去され、器だけの画像に加工されます</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-full font-semibold">
                4
              </span>
              <span>ARモードで机に器を配置して、サイズ感や配置を確認</span>
            </li>
          </ol>
        </div>

        {/* アクションボタン */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/dishes/new"
            className="group bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900
              rounded-lg p-8 shadow-sm hover:shadow-md transition-all"
          >
            <div className="text-4xl mb-4">📸</div>
            <h3 className="text-xl font-semibold mb-2">器を登録</h3>
            <p className="text-sm text-zinc-300 dark:text-zinc-700">
              写真をアップロードして器を追加
            </p>
            <div className="mt-4 text-sm font-medium group-hover:translate-x-1 transition-transform">
              始める →
            </div>
          </Link>

          <Link
            href="/dishes"
            className="group bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700
              text-zinc-900 dark:text-zinc-50 rounded-lg p-8 shadow-sm hover:shadow-md transition-all"
          >
            <div className="text-4xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold mb-2">マイ器リスト</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              登録した器を確認してAR配置
            </p>
            <div className="mt-4 text-sm font-medium group-hover:translate-x-1 transition-transform">
              見る →
            </div>
          </Link>
        </div>

        {/* 注意事項 */}
        <div className="mt-12 space-y-4">
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
            <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">
              📱 iPhone / iPad
            </h3>
            <p className="text-sm text-purple-800 dark:text-purple-400">
              iOSデバイスではカメラARモードが利用できます。
              カメラ映像に器を重ねて表示し、タップで配置、ドラッグで自由に移動できます。
              2D配置モードへの切り替えも可能です。
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2">
              💻 PC / その他のデバイス
            </h3>
            <p className="text-sm text-green-800 dark:text-green-400">
              PCやAndroidなどのデバイスでは2D配置モードが利用できます。
              机の写真（横100cm×縦70cm想定）を背景にアップロードして、器を自由に配置・調整できます。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
