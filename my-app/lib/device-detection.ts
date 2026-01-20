/**
 * デバイス検出ユーティリティ
 */

export const isIOS = (): boolean => {
  if (typeof window === 'undefined') return false;

  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
};

export const isAndroid = (): boolean => {
  if (typeof window === 'undefined') return false;

  const userAgent = window.navigator.userAgent.toLowerCase();
  return /android/.test(userAgent);
};

export const isMobile = (): boolean => {
  return isIOS() || isAndroid();
};

export const getDeviceType = (): 'ios' | 'android' | 'desktop' => {
  if (isIOS()) return 'ios';
  if (isAndroid()) return 'android';
  return 'desktop';
};
