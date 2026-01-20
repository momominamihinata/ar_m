'use client';

import { useRouter } from 'next/navigation';
import { useDishStore } from '@/store/dishStore';

export default function DishesPage() {
  const router = useRouter();
  const { dishes, selectedDishes, removeDish, toggleDishSelection, clearSelection } = useDishStore();

  const handleStartAR = () => {
    if (selectedDishes.length === 0) {
      alert('ARで配置する器を選択してください');
      return;
    }
    router.push('/ar');
  };

  const handleDelete = (dishId: string) => {
    if (confirm('この器を削除しますか？')) {
      removeDish(dishId);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.push('/')}
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            ← ホームへ戻る
          </button>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            マイ器リスト
          </h1>
          <button
            onClick={() => router.push('/dishes/new')}
            className="px-6 py-2 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900
              font-medium rounded-lg hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
          >
            + 器を追加
          </button>
        </div>

        {dishes.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-12 text-center shadow-sm">
            <p className="text-zinc-500 dark:text-zinc-400 mb-4">
              まだ器が登録されていません
            </p>
            <button
              onClick={() => router.push('/dishes/new')}
              className="text-zinc-900 dark:text-zinc-50 font-medium hover:underline"
            >
              最初の器を登録する →
            </button>
          </div>
        ) : (
          <>
            {/* 選択状態の表示 */}
            {selectedDishes.length > 0 && (
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex justify-between items-center">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {selectedDishes.length}個の器を選択中
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={clearSelection}
                    className="px-4 py-1 text-sm text-blue-700 dark:text-blue-300 hover:underline"
                  >
                    選択解除
                  </button>
                  <button
                    onClick={handleStartAR}
                    className="px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    ARモードで配置
                  </button>
                </div>
              </div>
            )}

            {/* 器リスト */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dishes.map((dish) => {
                const isSelected = selectedDishes.includes(dish.id);
                return (
                  <div
                    key={dish.id}
                    className={`bg-white dark:bg-zinc-900 rounded-lg p-4 shadow-sm cursor-pointer transition-all
                      ${isSelected ? 'ring-2 ring-blue-500' : 'hover:shadow-md'}
                    `}
                    onClick={() => toggleDishSelection(dish.id)}
                  >
                    {/* 画像 */}
                    <div className="mb-3 h-40 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                      <img
                        src={dish.processedImage}
                        alt={dish.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* 情報 */}
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
                      {dish.name}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                      {dish.widthCm} × {dish.heightCm} cm
                    </p>

                    {/* 選択状態 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleDishSelection(dish.id);
                          }}
                          className="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-xs text-zinc-500">AR配置</span>
                      </div>

                      {/* 削除ボタン */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(dish.id);
                        }}
                        className="text-xs text-red-600 dark:text-red-400 hover:underline"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ARモード開始ボタン（下部固定） */}
            {selectedDishes.length > 0 && (
              <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10">
                <button
                  onClick={handleStartAR}
                  className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-full
                    shadow-lg hover:bg-blue-700 transition-colors"
                >
                  ARモードで配置する ({selectedDishes.length}個)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
