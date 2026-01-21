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

/**
 * 透明部分を除去して画像をトリミング（背景除去後の画像用）
 * @param dataURL - 背景除去後の画像（Data URL）
 * @returns トリミングされた画像（Data URL）
 */
export const trimTransparentPixels = (dataURL: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // 画像を描画
      ctx.drawImage(img, 0, 0);

      // ピクセルデータを取得
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      // 透明でないピクセルの範囲を見つける
      let minX = canvas.width;
      let minY = canvas.height;
      let maxX = 0;
      let maxY = 0;

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const i = (y * canvas.width + x) * 4;
          const alpha = pixels[i + 3];

          // アルファ値が一定以上（ほぼ不透明）のピクセル
          if (alpha > 10) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      // 見つからなかった場合は元の画像を返す
      if (minX > maxX || minY > maxY) {
        resolve(dataURL);
        return;
      }

      // 少し余白を追加（5px程度）
      const padding = 5;
      minX = Math.max(0, minX - padding);
      minY = Math.max(0, minY - padding);
      maxX = Math.min(canvas.width - 1, maxX + padding);
      maxY = Math.min(canvas.height - 1, maxY + padding);

      const trimWidth = maxX - minX + 1;
      const trimHeight = maxY - minY + 1;

      // 新しいキャンバスを作成してトリミング
      const trimCanvas = document.createElement('canvas');
      trimCanvas.width = trimWidth;
      trimCanvas.height = trimHeight;
      const trimCtx = trimCanvas.getContext('2d');
      if (!trimCtx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // トリミングした部分を描画
      trimCtx.drawImage(
        canvas,
        minX,
        minY,
        trimWidth,
        trimHeight,
        0,
        0,
        trimWidth,
        trimHeight
      );

      resolve(trimCanvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = dataURL;
  });
};

/**
 * 画像を5:7の比率にクロップ（中央基準）
 * @param dataURL - 元の画像（Data URL）
 * @returns クロップされた画像（Data URL）
 */
export const cropToAspectRatio = (
  dataURL: string,
  targetWidth: number = 5,
  targetHeight: number = 7
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const imgWidth = img.width;
      const imgHeight = img.height;
      const targetRatio = targetWidth / targetHeight; // 5:7 = 0.714...
      const imgRatio = imgWidth / imgHeight;

      let cropWidth: number;
      let cropHeight: number;
      let offsetX: number;
      let offsetY: number;

      if (imgRatio > targetRatio) {
        // 画像が横長すぎる場合、幅を切り取る
        cropHeight = imgHeight;
        cropWidth = imgHeight * targetRatio;
        offsetX = (imgWidth - cropWidth) / 2;
        offsetY = 0;
      } else {
        // 画像が縦長すぎる場合、高さを切り取る
        cropWidth = imgWidth;
        cropHeight = imgWidth / targetRatio;
        offsetX = 0;
        offsetY = (imgHeight - cropHeight) / 2;
      }

      const canvas = document.createElement('canvas');
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // 中央からクロップ
      ctx.drawImage(
        img,
        offsetX,
        offsetY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.onerror = reject;
    img.src = dataURL;
  });
};
