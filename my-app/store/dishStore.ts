import { create } from 'zustand';
import { Dish, PlacedDish, PlacedDish2D } from '@/types/dish';
import { DEFAULT_DISHES, DEFAULT_BACKGROUND_IMAGE } from '@/lib/default-dishes';

interface DishStore {
  dishes: Dish[];
  selectedDishes: string[]; // ARで配置する器のID配列
  placedDishes: PlacedDish[];

  // 2D配置モード用
  backgroundImage: string | null; // 背景画像（Data URL）
  placedDishes2D: PlacedDish2D[];

  // 初期化済みフラグ
  isInitialized: boolean;

  // デフォルトデータで初期化
  initializeWithDefaults: () => void;

  // 器の追加
  addDish: (dish: Omit<Dish, 'id' | 'createdAt'>) => void;

  // 器の更新（画像の背景除去処理完了時などに使用）
  updateDish: (dishId: string, updates: Partial<Omit<Dish, 'id' | 'createdAt'>>) => void;

  // 器の削除
  removeDish: (dishId: string) => void;

  // 全ての器をクリア
  clearDishes: () => void;

  // ARで配置する器を選択/解除
  toggleDishSelection: (dishId: string) => void;

  // 選択された器をすべてクリア
  clearSelection: () => void;

  // AR空間に器を配置
  placeDish: (placedDish: PlacedDish) => void;

  // 配置された器を更新
  updatePlacedDish: (dishId: string, updates: Partial<PlacedDish>) => void;

  // 配置された器を削除
  removePlacedDish: (dishId: string) => void;

  // 全ての配置をクリア
  clearPlacedDishes: () => void;

  // 2D配置モード用
  setBackgroundImage: (imageUrl: string | null) => void;
  placeDish2D: (placedDish: PlacedDish2D) => void;
  updatePlacedDish2D: (dishId: string, updates: Partial<PlacedDish2D>) => void;
  removePlacedDish2D: (dishId: string) => void;
  clearPlacedDishes2D: () => void;

  // z-index操作
  bringToFront: (dishId: string) => void;  // 最前面に移動
  sendToBack: (dishId: string) => void;    // 最背面に移動
  bringForward: (dishId: string) => void;  // 1つ前に移動
  sendBackward: (dishId: string) => void;  // 1つ後ろに移動
}

export const useDishStore = create<DishStore>((set) => ({
  dishes: [],
  selectedDishes: [],
  placedDishes: [],
  backgroundImage: null,
  placedDishes2D: [],
  isInitialized: false,

  // デフォルトデータで初期化
  initializeWithDefaults: () => set((state) => {
    // すでに初期化済みの場合は何もしない
    if (state.isInitialized || state.dishes.length > 0) {
      return state;
    }

    // デフォルトの器を追加
    const defaultDishes: Dish[] = DEFAULT_DISHES.map((dish) => ({
      ...dish,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }));

    return {
      dishes: defaultDishes,
      backgroundImage: DEFAULT_BACKGROUND_IMAGE,
      isInitialized: true,
    };
  }),

  addDish: (dish) => set((state) => ({
    dishes: [
      ...state.dishes,
      {
        ...dish,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      },
    ],
  })),

  updateDish: (dishId, updates) => set((state) => ({
    dishes: state.dishes.map((dish) =>
      dish.id === dishId ? { ...dish, ...updates } : dish
    ),
  })),

  removeDish: (dishId) => set((state) => ({
    dishes: state.dishes.filter((d) => d.id !== dishId),
    selectedDishes: state.selectedDishes.filter((id) => id !== dishId),
    placedDishes: state.placedDishes.filter((pd) => pd.dishId !== dishId),
    placedDishes2D: state.placedDishes2D.filter((pd) => pd.dishId !== dishId),
  })),

  clearDishes: () => set({ dishes: [], selectedDishes: [], placedDishes: [], placedDishes2D: [] }),

  toggleDishSelection: (dishId) => set((state) => ({
    selectedDishes: state.selectedDishes.includes(dishId)
      ? state.selectedDishes.filter((id) => id !== dishId)
      : [...state.selectedDishes, dishId],
  })),

  clearSelection: () => set({ selectedDishes: [] }),

  placeDish: (placedDish) => set((state) => ({
    placedDishes: [...state.placedDishes, placedDish],
  })),

  updatePlacedDish: (dishId, updates) => set((state) => ({
    placedDishes: state.placedDishes.map((pd) =>
      pd.dishId === dishId ? { ...pd, ...updates } : pd
    ),
  })),

  removePlacedDish: (dishId) => set((state) => ({
    placedDishes: state.placedDishes.filter((pd) => pd.dishId !== dishId),
  })),

  clearPlacedDishes: () => set({ placedDishes: [] }),

  // 2D配置モード用
  setBackgroundImage: (imageUrl) => set({ backgroundImage: imageUrl }),

  placeDish2D: (placedDish) => set((state) => {
    // 新しい器のzIndexは既存の最大値+1
    const maxZIndex = state.placedDishes2D.length > 0
      ? Math.max(...state.placedDishes2D.map(d => d.zIndex))
      : 0;

    return {
      placedDishes2D: [
        ...state.placedDishes2D,
        { ...placedDish, zIndex: placedDish.zIndex ?? maxZIndex + 1 }
      ],
    };
  }),

  updatePlacedDish2D: (dishId, updates) => set((state) => ({
    placedDishes2D: state.placedDishes2D.map((pd) =>
      pd.dishId === dishId ? { ...pd, ...updates } : pd
    ),
  })),

  removePlacedDish2D: (dishId) => set((state) => ({
    placedDishes2D: state.placedDishes2D.filter((pd) => pd.dishId !== dishId),
  })),

  clearPlacedDishes2D: () => set({ placedDishes2D: [] }),

  // 最前面に移動
  bringToFront: (dishId) => set((state) => {
    console.log('bringToFront called for:', dishId);
    // zIndexでソートして順序を取得
    const sorted = [...state.placedDishes2D].sort((a, b) => a.zIndex - b.zIndex);

    // すべてのzIndexを0から振り直し、対象の器を最後（最前面）に
    const reindexed = sorted.map((pd, index) => ({
      ...pd,
      zIndex: pd.dishId === dishId ? sorted.length : (index < sorted.findIndex(p => p.dishId === dishId) ? index : index)
    }));

    // より簡潔な実装: 対象を除外してソート→最後に対象を追加
    const others = sorted.filter(pd => pd.dishId !== dishId);
    const target = sorted.find(pd => pd.dishId === dishId);
    if (!target) return state;

    const result = [
      ...others.map((pd, i) => ({ ...pd, zIndex: i })),
      { ...target, zIndex: others.length }
    ];

    console.log('new order:', result.map(r => ({ id: r.dishId, zIndex: r.zIndex })));
    return { placedDishes2D: result };
  }),

  // 最背面に移動
  sendToBack: (dishId) => set((state) => {
    console.log('sendToBack called for:', dishId);
    // zIndexでソートして順序を取得
    const sorted = [...state.placedDishes2D].sort((a, b) => a.zIndex - b.zIndex);

    // 対象を除外してソート→最初に対象を追加
    const others = sorted.filter(pd => pd.dishId !== dishId);
    const target = sorted.find(pd => pd.dishId === dishId);
    if (!target) return state;

    const result = [
      { ...target, zIndex: 0 },
      ...others.map((pd, i) => ({ ...pd, zIndex: i + 1 }))
    ];

    console.log('new order:', result.map(r => ({ id: r.dishId, zIndex: r.zIndex })));
    return { placedDishes2D: result };
  }),

  // 1つ前に移動
  bringForward: (dishId) => set((state) => {
    console.log('bringForward called for:', dishId);
    // zIndexでソートして順序を取得
    const sorted = [...state.placedDishes2D].sort((a, b) => a.zIndex - b.zIndex);
    const currentIndex = sorted.findIndex(pd => pd.dishId === dishId);

    if (currentIndex === -1) {
      console.log('dish not found');
      return state;
    }

    if (currentIndex === sorted.length - 1) {
      console.log('already at front');
      return state; // すでに最前面
    }

    // 対象と次の要素を入れ替え
    const newSorted = [...sorted];
    [newSorted[currentIndex], newSorted[currentIndex + 1]] = [newSorted[currentIndex + 1], newSorted[currentIndex]];

    // zIndexを振り直し
    const result = newSorted.map((pd, i) => ({ ...pd, zIndex: i }));

    console.log('new order:', result.map(r => ({ id: r.dishId, zIndex: r.zIndex })));
    return { placedDishes2D: result };
  }),

  // 1つ後ろに移動
  sendBackward: (dishId) => set((state) => {
    console.log('sendBackward called for:', dishId);
    // zIndexでソートして順序を取得
    const sorted = [...state.placedDishes2D].sort((a, b) => a.zIndex - b.zIndex);
    const currentIndex = sorted.findIndex(pd => pd.dishId === dishId);

    if (currentIndex === -1) {
      console.log('dish not found');
      return state;
    }

    if (currentIndex === 0) {
      console.log('already at back');
      return state; // すでに最背面
    }

    // 対象と前の要素を入れ替え
    const newSorted = [...sorted];
    [newSorted[currentIndex], newSorted[currentIndex - 1]] = [newSorted[currentIndex - 1], newSorted[currentIndex]];

    // zIndexを振り直し
    const result = newSorted.map((pd, i) => ({ ...pd, zIndex: i }));

    console.log('new order:', result.map(r => ({ id: r.dishId, zIndex: r.zIndex })));
    return { placedDishes2D: result };
  }),
}));
