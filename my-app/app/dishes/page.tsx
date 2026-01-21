'use client';

import { useRouter } from 'next/navigation';
import { useDishStore } from '@/store/dishStore';

export default function DishesPage() {
  const router = useRouter();
  const { dishes, selectedDishes, removeDish, toggleDishSelection, clearSelection } = useDishStore();

  const handleStartPlacement = () => {
    if (selectedDishes.length === 0) {
      alert('配置する器を選択してください');
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
    <div className="min-h-screen bg-[#d8ba9d] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.push('/')}
            className="text-[#6f3f1e] hover:text-[#915524]"
          >
            ← ホームへ戻る
          </button>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#6f3f1e]">
            マイ器リスト
          </h1>
          <button
            onClick={() => router.push('/dishes/new')}
            className="px-6 py-2 bg-[#915524] text-[#f4f4f4]
              font-medium rounded-lg hover:bg-[#6f3f1e] transition-colors"
          >
            + 器を追加
          </button>
        </div>

        {dishes.length === 0 ? (
          <div className="bg-[#f4f4f4] rounded-lg p-12 text-center shadow-sm">
            <p className="text-[#6f3f1e] mb-4">
              まだ器が登録されていません
            </p>
            <button
              onClick={() => router.push('/dishes/new')}
              className="text-[#915524] font-medium hover:underline"
            >
              最初の器を登録する →
            </button>
          </div>
        ) : (
          <>
            {/* 選択状態の表示 */}
            {selectedDishes.length > 0 && (
              <div className="mb-4 p-4 bg-[#c39665]/20 border border-[#c39665] rounded-lg flex justify-between items-center">
                <p className="text-sm text-[#6f3f1e]">
                  {selectedDishes.length}個の器を選択中
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={clearSelection}
                    className="px-4 py-1 text-sm text-[#6f3f1e] hover:underline"
                  >
                    選択解除
                  </button>
                  <button
                    onClick={handleStartPlacement}
                    className="px-4 py-1 text-sm bg-[#915524] text-[#f4f4f4] rounded hover:bg-[#6f3f1e] transition-colors"
                  >
                    配置画面へ
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
                    className={`bg-[#f4f4f4] rounded-lg p-4 shadow-sm cursor-pointer transition-all
                      ${isSelected ? 'ring-2 ring-[#915524]' : 'hover:shadow-md'}
                    `}
                    onClick={() => toggleDishSelection(dish.id)}
                  >
                    {/* 画像 */}
                    <div className="mb-3 h-40 bg-[#d8ba9d] rounded-lg overflow-hidden">
                      <img
                        src={dish.processedImage}
                        alt={dish.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* 情報 */}
                    <h3 className="font-semibold text-[#6f3f1e] mb-1">
                      {dish.name}
                    </h3>
                    <p className="text-sm text-[#6f3f1e] opacity-80 mb-2">
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
                          className="w-4 h-4 rounded border-[#c39665] text-[#915524] focus:ring-[#915524]"
                        />
                        <span className="text-xs text-[#6f3f1e]">配置に使用</span>
                      </div>

                      {/* 削除ボタン */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(dish.id);
                        }}
                        className="text-xs text-red-700 hover:underline"
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
                  onClick={handleStartPlacement}
                  className="px-8 py-4 bg-[#915524] text-[#f4f4f4] text-lg font-semibold rounded-full
                    shadow-lg hover:bg-[#6f3f1e] transition-colors"
                >
                  配置画面へ ({selectedDishes.length}個)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
