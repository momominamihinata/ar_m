import { removeBackground } from '@imgly/background-removal';

/**
 * 画像ファイルをData URLに変換
 */
export const fileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Data URLをBlobに変換
 */
export const dataURLToBlob = (dataURL: string): Blob => {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

/**
 * BlobをData URLに変換
 */
export const blobToDataURL = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * 画像の背景を除去
 * @param imageSource - 画像ファイルまたはData URL
 * @returns 背景除去後の画像（Data URL）
 */
export const removeImageBackground = async (
  imageSource: File | string
): Promise<string> => {
  try {
    // 背景除去処理
    const blob = await removeBackground(imageSource);

    // BlobをData URLに変換
    const dataURL = await blobToDataURL(blob);
    return dataURL;
  } catch (error) {
    console.error('背景除去エラー:', error);
    throw new Error('画像の背景除去に失敗しました');
  }
};

/**
 * 画像をリサイズ（メモリ節約のため）
 */
export const resizeImage = (
  dataURL: string,
  maxWidth: number = 1024,
  maxHeight: number = 1024
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // アスペクト比を保ちながらリサイズ
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = dataURL;
  });
};
