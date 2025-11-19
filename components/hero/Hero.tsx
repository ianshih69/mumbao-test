"use client";

import { useEffect, useState } from "react";
import { getAllHeroImages } from "@/lib/hero";

export default function Hero() {
  const [imageRatio, setImageRatio] = useState<number>(1.5); // 使用預設值，避免 null 導致的跳動
  const [currentIndex, setCurrentIndex] = useState(0);
  const heroImages = getAllHeroImages();
  const currentImage = heroImages[currentIndex];

  // 每 5 秒切換圖片
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  useEffect(() => {
    // 不要立即重置 imageRatio，保留舊值直到新圖片載入完成，避免高度跳動
    // setImageRatio(null); // 移除這行，避免切換圖片時高度跳動

    // 動態獲取圖片尺寸並確保圖片完全載入
    const img = new Image();
    let isCancelled = false;
    
    const handleLoad = () => {
      if (isCancelled) return;
      
      // 驗證圖片是否正確載入
      if (img.naturalWidth === 0 || img.naturalHeight === 0) {
        return;
      }
      
      const ratio = img.height / img.width;
      // 高度增加50%，所以比例也要增加50%
      setImageRatio(ratio * 1.5);
    };

    img.onload = handleLoad;
    img.onerror = () => {
      if (isCancelled) return;
      // 如果圖片載入失敗，使用預設比例避免永遠不顯示
      setImageRatio(1.5);
    };

    // 先設置事件處理器，再設置 src
    img.src = currentImage.src;

    // 如果圖片已經在快取中，使用 setTimeout 確保事件處理器已設置
    if (img.complete && img.naturalWidth > 0) {
      // 使用 setTimeout 確保 onload 事件處理器已經設置
      setTimeout(() => {
        if (!isCancelled) {
          handleLoad();
        }
      }, 0);
    }

    return () => {
      isCancelled = true;
      img.onload = null;
      img.onerror = null;
    };
  }, [currentImage.src]);

  return (
    <>
      <div
        className="hero-container"
        role="img"
        aria-label={currentImage.alt}
        style={{
          // 始終設置 --img-ratio，避免圖片載入前後高度跳動
          "--img-ratio": imageRatio.toString(),
        } as React.CSSProperties}
      ></div>
      <style jsx>{`
        .hero-container {
          position: relative;
          width: 100%;
          height: 100dvh;
          min-height: 100vh;
          overflow: hidden;
          display: block;
          background-image: url('${currentImage.src}');
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
          background-attachment: scroll;
          /* 確保 Hero 在 Header 下方，但背景圖能顯示 */
          z-index: 1;
        }
        @supports not (height: 100dvh) {
          .hero-container {
            height: 100vh;
          }
        }
        /* 手機端和平板電腦端：使用圖片比例來設置容器高度，完整顯示圖片 */
        @media screen and (max-width: 1024px) {
          .hero-container {
            height: auto;
            min-height: 100dvh;
          }
          /* 如果已獲取圖片比例，使用 aspect-ratio 讓容器比例與圖片匹配 */
          /* 使用穩定的預設值，避免圖片載入前後高度跳動 */
          .hero-container {
            aspect-ratio: 1 / var(--img-ratio, 1.5);
            height: auto;
            min-height: 0;
            background-size: 100% 100%;
          }
        }
        /* 手機版（md 以下）：保持與桌機一致，hero 從頁面最上方開始，header 壓在 hero 圖上 */
        @media screen and (max-width: 767px) {
          .hero-container {
            margin-top: 0; /* 移除 margin-top，讓 hero 從頁面最上方開始 */
            background-size: cover !important; /* 覆蓋 1024px 媒體查詢中的 100% 100% */
          }
        }
        /* 橫向手機和平板保持全屏 */
        @media screen and (max-width: 1024px) and (orientation: landscape) {
          .hero-container {
            height: 100dvh !important;
            min-height: 100vh !important;
            aspect-ratio: unset !important;
          }
        }
      `}</style>
    </>
  );
}

