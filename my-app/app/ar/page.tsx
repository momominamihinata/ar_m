'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas } from '@react-three/fiber';
import { XR, createXRStore } from '@react-three/xr';
import * as THREE from 'three';
import { useDishStore } from '@/store/dishStore';
import Dish2DPlacement from '@/components/Dish2DPlacement';

// 器を表示するコンポーネント
function DishPlane({
  imageUrl,
  widthCm,
  heightCm,
  position
}: {
  imageUrl: string;
  widthCm: number;
  heightCm: number;
  position: [number, number, number];
}) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(imageUrl, (loadedTexture) => {
      loadedTexture.colorSpace = THREE.SRGBColorSpace;
      setTexture(loadedTexture);
    });
  }, [imageUrl]);

  // cmをメートルに変換（Three.jsの単位系）
  const widthM = widthCm / 100;
  const heightM = heightCm / 100;

  if (!texture) return null;

  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[widthM, heightM]} />
      <meshBasicMaterial
        map={texture}
        transparent={true}
        side={THREE.DoubleSide}
        alphaTest={0.1}
      />
    </mesh>
  );
}

// ARシーンコンポーネント
function ARScene() {
  const { dishes, selectedDishes } = useDishStore();
  const selectedDishObjects = dishes.filter((d) => selectedDishes.includes(d.id));

  // 選択された器を円形に配置
  const spacing = 0.2; // 20cm間隔
  const positions: [number, number, number][] = selectedDishObjects.map((_, index) => {
    const angle = (index / selectedDishObjects.length) * Math.PI * 2;
    const radius = 0.3;
    return [
      Math.cos(angle) * radius,
      0.01, // 地面の少し上
      Math.sin(angle) * radius,
    ];
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 5, 5]} intensity={1} />

      {selectedDishObjects.map((dish, index) => (
        <DishPlane
          key={dish.id}
          imageUrl={dish.processedImage}
          widthCm={dish.widthCm}
          heightCm={dish.heightCm}
          position={positions[index]}
        />
      ))}

      {/* 参照用のグリッド（開発時） */}
      <gridHelper args={[2, 20]} position={[0, 0, 0]} />
    </>
  );
}

export default function ARPage() {
  console.log('ARPage component rendered');

  const router = useRouter();
  const { selectedDishes, dishes } = useDishStore();

  console.log('Selected dishes:', selectedDishes);
  console.log('All dishes:', dishes);

  const [isARSupported, setIsARSupported] = useState<boolean | null>(null);
  const [mode, setMode] = useState<'ar' | '2d'>('ar'); // 'ar' or '2d'
  const [xrStore] = useState(() => createXRStore());

  useEffect(() => {
    console.log('useEffect started, selectedDishes:', selectedDishes);

    // 選択された器がない場合は戻る
    if (selectedDishes.length === 0) {
      console.log('No dishes selected, redirecting to /dishes');
      router.push('/dishes');
      return;
    }

    console.log('Checking WebXR support...');
    console.log('navigator.xr exists:', 'xr' in navigator);

    // WebXRのサポート確認
    if ('xr' in navigator) {
      console.log('WebXR API detected');
      navigator.xr
        ?.isSessionSupported('immersive-ar')
        .then((supported) => {
          console.log('WebXR immersive-ar supported:', supported);
          setIsARSupported(supported);
          // PCの場合は2Dモードをデフォルトにする（手動切り替え可能）
          // モバイルの場合は自動でARモードを試す
          if (!supported) {
            console.log('Setting mode to 2D');
            setMode('2d');
          } else {
            console.log('AR is supported, staying in AR mode');
          }
        })
        .catch((error) => {
          console.error('WebXR support check error:', error);
          setIsARSupported(false);
          setMode('2d');
        });
    } else {
      console.log('WebXR API not found in navigator');
      setIsARSupported(false);
      setMode('2d');
    }
  }, [selectedDishes, router]);

  const handleStartAR = () => {
    // XRStoreを使ってARセッションを開始
    xrStore.enterAR();
  };

  const selectedDishObjects = dishes.filter((d) => selectedDishes.includes(d.id));

  // 2Dモードの場合
  if (mode === '2d') {
    return (
      <div className="h-screen flex flex-col">
        {/* ヘッダー */}
        <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/dishes')}
              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              ← 戻る
            </button>
            <div className="flex items-center gap-4">
              <div>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  2D配置モード
                </span>
                {isARSupported !== null && (
                  <div className="text-xs text-zinc-400 dark:text-zinc-500">
                    WebXR AR: {isARSupported ? '対応' : '非対応'}
                  </div>
                )}
              </div>
              {isARSupported && (
                <button
                  onClick={() => setMode('ar')}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  ARモードに切替
                </button>
              )}
              {!isARSupported && isARSupported !== null && (
                <div className="text-xs text-zinc-400 dark:text-zinc-500 max-w-xs">
                  このブラウザはWebXR ARに対応していません
                </div>
              )}
            </div>
          </div>
        </div>
        <Dish2DPlacement />
      </div>
    );
  }

  // ARモード
  return (
    <div className="relative w-full h-screen bg-black">
      {/* ヘッダー */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/70 to-transparent">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/dishes')}
            className="text-white hover:text-zinc-300"
          >
            ← 戻る
          </button>
          <button
            onClick={() => setMode('2d')}
            className="px-4 py-2 bg-white/20 text-white text-sm rounded backdrop-blur hover:bg-white/30"
          >
            2Dモードに切替
          </button>
        </div>
      </div>

      {/* 情報パネル */}
      <div className="absolute top-20 left-4 right-4 z-10 bg-white/90 dark:bg-zinc-900/90 rounded-lg p-4 shadow-lg backdrop-blur">
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
          選択中の器 ({selectedDishObjects.length}個)
        </h2>
        <div className="flex flex-wrap gap-2">
          {selectedDishObjects.map((dish) => (
            <div
              key={dish.id}
              className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded"
            >
              {dish.name} ({dish.widthCm}×{dish.heightCm}cm)
            </div>
          ))}
        </div>
      </div>

      {/* AR Canvas */}
      {isARSupported === null ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-white">ARサポートを確認中...</p>
        </div>
      ) : (
        <Canvas>
          <XR store={xrStore}>
            <ARScene />
          </XR>
        </Canvas>
      )}

      {/* AR開始ボタン（ARサポート時） */}
      {isARSupported && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <button
            onClick={handleStartAR}
            className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-full
              shadow-lg hover:bg-blue-700 transition-colors"
          >
            ARを開始
          </button>
        </div>
      )}

      {/* 操作説明 */}
      <div className="absolute bottom-4 left-4 right-4 z-10 bg-black/70 rounded-lg p-3 backdrop-blur">
        <p className="text-xs text-white/80 text-center">
          「ARを開始」ボタンをタップして、カメラで机を映してください
        </p>
      </div>
    </div>
  );
}
