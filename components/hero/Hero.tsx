"use client";

import { useEffect, useState } from "react";
import { getAllHeroImages } from "@/lib/hero";

// 淡入淡出時間（毫秒），您可以根據需求調整
const FADE_DURATION_MS = 800; 

export default function Hero() {
  const [imageRatio, setImageRatio] = useState<number>(1.5);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // 新增：控制淡出狀態。true = 頂層圖片 (新圖) opacity: 0
  const [isFadingOut, setIsFadingOut] = useState(false);
  
  const heroImages = getAllHeroImages();
  const currentImage = heroImages[currentIndex];
  
  // 新增：儲存上一張已載入圖片的 src，作為過渡期間的底層圖片
  const [transitionSrc, setTransitionSrc] = useState(currentImage.src);

  // 1. 圖片自動切換邏輯 (每 5 秒)
  useEffect(() => {
    // 總循環時間 = 5秒顯示 + 淡出時間
    const interval = setInterval(() => {
      
      // 步驟 1: 觸發淡出動畫
      // 頂層圖片 (currentImage.src) 將開始從 opacity: 1 過渡到 opacity: 0
      setIsFadingOut(true);

      // 步驟 2: 在淡出時間結束後，切換到下一張圖片
      const switchIndexTimer = setTimeout(() => {
        // 真正切換圖片索引 (觸發下一個 useEffect)
        setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
      }, FADE_DURATION_MS);

      return () => clearTimeout(switchIndexTimer);

    }, 5000 + FADE_DURATION_MS); // 總切換時間 = 5秒顯示 + 800ms淡出

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // 2. 圖片載入和比例計算邏輯 (在新圖片切換後執行)
  useEffect(() => {
    const img = new Image();
    let isCancelled = false;
    
    const handleLoad = () => {
      if (isCancelled) return;
      
      if (img.naturalWidth === 0 || img.naturalHeight === 0) {
        setIsFadingOut(false);
        return;
      }
      
      const ratio = img.height / img.width;
      // 高度增加50%，所以比例也要增加50%
      setImageRatio(ratio * 1.5);
      
      // 步驟 3: 新圖片載入完成，開始淡入
      // 設為 false，頂層圖片 (新圖) 將從 opacity: 0 過渡到 opacity: 100
      setIsFadingOut(false);
      
      // 步驟 4: 更新底層圖片，為下一次切換做準備
      setTransitionSrc(currentImage.src);
    };

    img.onload = handleLoad;
    img.onerror = () => {
      if (isCancelled) return;
      setImageRatio(1.5);
      setIsFadingOut(false);
      setTransitionSrc(currentImage.src);
    };

    // 先設置事件處理器，再設置 src
    img.src = currentImage.src;

    if (img.complete && img.naturalWidth > 0) {
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

  // 為了實現淡入淡出，我們需要將原來的 .hero-container 變成一個包裹層 (.hero-wrapper)，
  // 並在內部放置兩個 div 來實現圖片層疊效果。
  return (
    <div
      className="hero-wrapper relative"
      role="img"
      aria-label={currentImage.alt}
      style={{
        "--img-ratio": imageRatio.toString(),
      } as React.CSSProperties}
    >
      {/* 1. 底層：始終顯示舊圖或前一張圖 (用於過渡時的穩定背景) */}
      <div
        className="hero-container-base"
        style={{
          backgroundImage: `url('${transitionSrc}')`,
        }}
      ></div>
      
      {/* 2. 頂層：顯示新圖，並控制淡入淡出 */}
      <div
        className={`hero-container-active ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}
        style={{
          backgroundImage: `url('${currentImage.src}')`,
        }}
      ></div>

      <style jsx>{`
        /* 容器通用設定 (取代原來的 .hero-container) */
        .hero-wrapper {
          position: relative;
          width: 100%;
          height: 100dvh;
          min-height: 100vh;
          overflow: hidden;
          display: block;
          z-index: 1; /* 確保 Hero 在 Header 下方，但背景圖能顯示 */
        }

        /* 圖片層通用設定 */
        .hero-container-base,
        .hero-container-active {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
          background-attachment: scroll;
        }

        /* 淡入淡出效果：只應用在頂層圖片 */
        .hero-container-active {
          transition: opacity ${FADE_DURATION_MS}ms ease-in-out;
          z-index: 2; 
        }

        /* 確保底圖層在頂層之下 */
        .hero-container-base {
          z-index: 1; 
        }

        /* ===== 響應式佈局 (從原程式碼複製並調整父容器名稱) ===== */
        @supports not (height: 100dvh) {
          .hero-wrapper {
            height: 100vh;
          }
        }
        
        /* 手機端和平板電腦端：使用圖片比例來設置容器高度，完整顯示圖片 */
        @media screen and (max-width: 1024px) {
          .hero-wrapper {
            height: auto;
            min-height: 100dvh;
          }
          /* 如果已獲取圖片比例，使用 aspect-ratio 讓容器比例與圖片匹配 */
          .hero-wrapper {
            aspect-ratio: 1 / var(--img-ratio, 1.5);
            height: auto;
            min-height: 0;
          }

          /* 在小螢幕上，確保背景尺寸是 100% 100% 以符合 aspect-ratio */
          .hero-container-base,
          .hero-container-active {
             background-size: 100% 100%;
          }
        }
        
        /* 手機版（md 以下）：保持與桌機一致，hero 從頁面最上方開始，header 壓在 hero 圖上 */
        @media screen and (max-width: 767px) {
          .hero-wrapper {
            margin-top: 0; /* 移除 margin-top，讓 hero 從頁面最上方開始 */
          }
          .hero-container-base,
          .hero-container-active {
             background-size: cover !important; /* 覆蓋 1024px 媒體查詢中的 100% 100% */
          }
        }
        
        /* 橫向手機和平板保持全屏 */
        @media screen and (max-width: 1024px) and (orientation: landscape) {
          .hero-wrapper {
            height: 100dvh !important;
            min-height: 100vh !important;
            aspect-ratio: unset !important;
          }
          .hero-container-base,
          .hero-container-active {
             background-size: cover !important; /* 確保橫向時使用 cover */
          }
        }
      `}</style>
    </div>
  );
}