"use client";

import { useEffect, useState, useMemo } from "react";
import { getAllHeroImages } from "@/lib/hero";

// 淡入淡出時間（毫秒）
const FADE_DURATION_MS = 1500;
// 每張圖停留時間（毫秒）
const DISPLAY_DURATION_MS = 5000;
// 手機端防閃爍緩衝時間 (關鍵修正)
const MOBILE_BUFFER_MS = 200;

export default function Hero() {
  // 使用 useMemo 確保圖片陣列穩定
  const heroImages = useMemo(() => getAllHeroImages(), []);

  // 1. 狀態管理
  const [baseIndex, setBaseIndex] = useState(0);
  const [overlayIndex, setOverlayIndex] = useState(1 % heroImages.length);
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(false);
  
  // 圖片比例
  const [imageRatio, setImageRatio] = useState<number>(1.5);

  // 2. 自動輪播核心邏輯
  useEffect(() => {
    if (heroImages.length <= 1) return;

    let resetTimer: NodeJS.Timeout;
    let bufferTimer: NodeJS.Timeout;

    const loopTimer = setInterval(() => {
      // --- 步驟 A: 開始淡入下一張圖 ---
      setTransitionEnabled(true);
      setOverlayOpacity(1);

      // --- 步驟 B: 淡入結束後的重置工作 ---
      resetTimer = setTimeout(() => {
        // 1. 先把底層換成新圖 (此時頂層還是 100% 不透明，擋著底層)
        setBaseIndex((prev) => (prev + 1) % heroImages.length);
        
        // 2. 【關鍵修正】不要立刻隱藏頂層！
        // 給手機瀏覽器一點時間 (MOBILE_BUFFER_MS) 去解碼和渲染底層的新圖
        bufferTimer = setTimeout(() => {
          // 3. 瞬間關閉動畫，準備重置
          setTransitionEnabled(false);
          
          // 4. 這時候底層肯定畫好了，現在隱藏頂層才安全
          setOverlayOpacity(0);
          
          // 5. 準備下下一張圖給頂層
          setOverlayIndex((prev) => (prev + 1) % heroImages.length);
        }, MOBILE_BUFFER_MS);

      }, FADE_DURATION_MS);

    }, DISPLAY_DURATION_MS + FADE_DURATION_MS);

    return () => {
      clearInterval(loopTimer);
      clearTimeout(resetTimer);
      clearTimeout(bufferTimer);
    };
  }, [heroImages.length]);

  // 3. 比例計算 (保持不變)
  useEffect(() => {
    if (heroImages.length === 0) return;
    const currentSrc = heroImages[baseIndex].src;
    const img = new Image();
    img.src = currentSrc;
    img.onload = () => {
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        setImageRatio(img.height / img.width * 1.5);
      }
    };
  }, [baseIndex, heroImages]);

  // 4. 預載頂層圖片 (防止淡入時黑畫面)
  useEffect(() => {
     if (heroImages.length === 0) return;
     const nextSrc = heroImages[overlayIndex].src;
     const img = new Image();
     img.src = nextSrc;
  }, [overlayIndex, heroImages]);

  if (!heroImages.length) return null;

  return (
      <div
      className="hero-wrapper relative"
        style={{
                "--img-ratio": imageRatio.toString(),
        } as React.CSSProperties}
    >
      {/* 層 1: 底層 (Base) */}
      <div
        className="hero-container-base"
        style={{
          backgroundImage: `url('${heroImages[baseIndex].src}')`,
        }}
        role="img"
        aria-label={heroImages[baseIndex].alt}
      ></div>
      
      {/* 層 2: 頂層 (Overlay) */}
      <div
        className="hero-container-overlay"
        style={{
          backgroundImage: `url('${heroImages[overlayIndex].src}')`,
          opacity: overlayOpacity,
          transition: transitionEnabled ? `opacity ${FADE_DURATION_MS}ms ease-in-out` : 'none',
        }}
      ></div>

      <style jsx>{`
        .hero-wrapper {
          position: relative;
          width: 100%;
          height: 100dvh;
          min-height: 100vh;
          overflow: hidden;
          display: block;
          z-index: 1;
          background-color: #000; /* 防止圖片載入前的白底 */
        }

        .hero-container-base,
        .hero-container-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
          /* 強制開啟 GPU 加速，解決手機端渲染閃爍 */
          transform: translateZ(0); 
          will-change: opacity;
        }

        .hero-container-base {
          z-index: 1;
        }
        
        .hero-container-overlay {
          z-index: 2;
        }

        /* ===== 響應式佈局 (嚴格保留您的手機版設定) ===== */
        @supports not (height: 100dvh) {
          .hero-wrapper {
            height: 100vh;
          }
        }
        
        /* 手機與平板 */
        @media screen and (max-width: 1024px) {
          .hero-wrapper {
            height: auto;
            min-height: 100dvh;
            aspect-ratio: 1 / var(--img-ratio, 1.5);
            /* 允許高度彈性 */
            min-height: 0;
          }

          .hero-container-base,
          .hero-container-overlay {
             background-size: cover; 
          }
        }
        
        @media screen and (max-width: 767px) {
          .hero-wrapper {
            margin-top: 0; 
          }
          .hero-container-base,
          .hero-container-overlay {
             background-size: cover !important; 
          }
        }
        
        @media screen and (max-width: 1024px) and (orientation: landscape) {
          .hero-wrapper {
            height: 100dvh !important;
            min-height: 100vh !important;
            aspect-ratio: unset !important;
          }
          .hero-container-base,
          .hero-container-overlay {
             background-size: cover !important; 
          }
        }
      `}</style>
    </div>
  );
}