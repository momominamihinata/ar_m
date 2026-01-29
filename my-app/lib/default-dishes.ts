import { Dish } from '@/types/dish';

/**
 * デフォルトの器データ
 * public/フォルダ内の切り抜き済み画像を使用
 *
 * サイズは目安の値です。実際の器のサイズに合わせて調整してください。
 */
export const DEFAULT_DISHES: Omit<Dish, 'id' | 'createdAt'>[] = [
  {
    name: '器1',
    widthCm: 10,
    heightCm: 10,
    originalImage: '/器1.jpg',
    processedImage: '/器1_processed.png',
  },
  {
    name: '器2',
    widthCm: 15,
    heightCm: 15,
    originalImage: '/器2.jpg',
    processedImage: '/器2_processed.png',
  },
  {
    name: '器3',
    widthCm: 20,
    heightCm: 20,
    originalImage: '/器3.jpg',
    processedImage: '/器3_processed.png',
  },
  {
    name: '器4',
    widthCm: 12,
    heightCm: 12,
    originalImage: '/器4.jpg',
    processedImage: '/器4_processed.png',
  },
  {
    name: '器5',
    widthCm: 6,
    heightCm: 6,
    originalImage: '/器5.jpg',
    processedImage: '/器5_processed.png',
  },
  {
    name: '器6',
    widthCm: 16,
    heightCm: 16,
    originalImage: '/器6.jpg',
    processedImage: '/器6_processed.png',
  },
  {
    name: '器7',
    widthCm: 6,
    heightCm: 6,
    originalImage: '/器7.jpg',
    processedImage: '/器7_processed.png',
  },
  {
    name: '器8',
    widthCm: 13,
    heightCm: 13,
    originalImage: '/器8_processed.png',
    processedImage: '/器8_processed.png',
  },
  {
    name: '器10',
    widthCm: 5,
    heightCm: 5,
    originalImage: '/器10.jpg',
    processedImage: '/器10_processed.png',
  },
  {
    name: '器11',
    widthCm: 17,
    heightCm: 17,
    originalImage: '/器11.jpg',
    processedImage: '/器11_processed.png',
  },
  {
    name: 'おぼん1',
    widthCm: 35,
    heightCm: 25,
    originalImage: '/おぼん1.jpg',
    processedImage: '/おぼん1_processed.png',
  },
  {
    name: 'マット1',
    widthCm: 40,
    heightCm: 30,
    originalImage: '/マット1.jpg',
    processedImage: '/マット1_processed.png',
  },
];

/**
 * デフォルトの背景画像パス
 */
export const DEFAULT_BACKGROUND_IMAGE = '/机2.png';
