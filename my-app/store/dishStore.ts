import { create } from 'zustand';
import { Dish, PlacedDish, PlacedDish2D } from '@/types/dish';

interface DishStore {
  dishes: Dish[];
  selectedDishes: string[]; // ARで配置する器のID配列
  placedDishes: PlacedDish[];

  // 2D配置モード用
  backgroundImage: string | null; // 背景画像（Data URL）
  placedDishes2D: PlacedDish2D[];

  // 器の追加
  addDish: (dish: Omit<Dish, 'id' | 'createdAt'>) => void;

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
}

export const useDishStore = create<DishStore>((set) => ({
  dishes: [],
  selectedDishes: [],
  placedDishes: [],
  backgroundImage: null,
  placedDishes2D: [],

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

  placeDish2D: (placedDish) => set((state) => ({
    placedDishes2D: [...state.placedDishes2D, placedDish],
  })),

  updatePlacedDish2D: (dishId, updates) => set((state) => ({
    placedDishes2D: state.placedDishes2D.map((pd) =>
      pd.dishId === dishId ? { ...pd, ...updates } : pd
    ),
  })),

  removePlacedDish2D: (dishId) => set((state) => ({
    placedDishes2D: state.placedDishes2D.filter((pd) => pd.dishId !== dishId),
  })),

  clearPlacedDishes2D: () => set({ placedDishes2D: [] }),
}));
