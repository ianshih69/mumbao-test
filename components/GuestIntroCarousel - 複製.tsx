"use client";

import React, { useEffect, useMemo, useRef } from "react";
import Image from "next/image";

/**
 * GuestIntroCarousel
 * 功能：
 * - 滑鼠按住拖曳左右滑（含慣性/動量捲動），觸控同樣支援。
 * - Scroll Snap 對齊卡片邊界，滑順不抖動。
 * - 最大視窗寬度時「同時只顯示三張」；中等螢幕顯示兩張；手機顯示一張。
 * - 卡片比例固定為 6 / 7，卡片之間固定 30px 間距。
 * - 圖片來源：/images/page3/page3-1.webp ~ page3-5.webp
 *
 * 使用：
 * 1) 將本檔存為 `components/GuestIntroCarousel.tsx`
 * 2) 圖片放到 `public/images/page3/` 目錄
 * 3) 在頁面引入：
 *    import GuestIntroCarousel from "@/components/GuestIntroCarousel";
 *    <GuestIntroCarousel />
 */
export default function GuestIntroCarousel() {
  const images = useMemo(
    () => [1, 2, 3, 4, 5].map((n) => `/images/page3/page3-${n}.webp`),
    []
  );

  const trackRef = useRef<HTMLDivElement | null>(null);

  // ----- Drag-to-scroll with momentum -----
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const lastX = useRef(0);
  const lastT = useRef(0);
  const vX = useRef(0);
  const raf = useRef<number | null>(null);
  const momentumStartTime = useRef(0);
  const totalMoveDistance = useRef(0); // 追蹤總移動距離
  const snapEnabled = useRef(true); // 控制是否啟用 snap

  const stopMomentum = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = null;
    momentumStartTime.current = 0;
  };

  const snapToNearest = () => {
    const el = trackRef.current;
    if (!el || !snapEnabled.current) return;
    
    // 計算卡片寬度（包含 gap）
    const firstCard = el.querySelector('article');
    if (!firstCard) return;
    
    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap = 30;
    const snapStep = cardWidth + gap;
    
    // 計算最近的 snap 位置
    const currentScroll = el.scrollLeft;
    let targetIndex = Math.round(currentScroll / snapStep);
    
    // 確保索引在有效範圍內
    const maxScrollableIndex = Math.floor((el.scrollWidth - el.clientWidth) / snapStep);
    const maxIndex = Math.min(maxScrollableIndex, images.length - 1);
    targetIndex = Math.max(0, Math.min(targetIndex, maxIndex));
    
    const targetScroll = targetIndex * snapStep;
    
    // 如果已經在目標位置，不需要動畫
    if (Math.abs(currentScroll - targetScroll) < 1) {
      return;
    }
    
    // 使用自訂的線性動畫，更流暢
    const distance = Math.abs(targetScroll - currentScroll);
    const duration = Math.max(300, Math.min(600, distance * 0.6)); // 300-600ms，根據距離調整
    const startTime = performance.now();
    const startScroll = currentScroll;
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // 線性插值（linear easing）- 完全線性，無加速減速
      const currentScrollPos = startScroll + (targetScroll - startScroll) * progress;
      el.scrollLeft = currentScrollPos;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  };

  const momentum = () => {
    const el = trackRef.current;
    if (!el) return;

    const now = performance.now();
    if (momentumStartTime.current === 0) {
      momentumStartTime.current = now;
    }

    const dt = now - momentumStartTime.current;
    momentumStartTime.current = now;

    // Friction / deceleration (調整為更平滑的減速)
    vX.current *= 0.94; // 0.92~0.96 之間，數值越大越滑順
    if (Math.abs(vX.current) < 0.08) {
      stopMomentum();
      momentumStartTime.current = 0;
      
      // 檢查是否在最後一張圖，如果是則回到最後一張圖的位置
      const firstCard = el.querySelector('article');
      if (firstCard) {
        const cardWidth = firstCard.getBoundingClientRect().width;
        const gap = 30;
        const snapStep = cardWidth + gap;
        const currentScroll = el.scrollLeft;
        const currentIndex = Math.round(currentScroll / snapStep);
        const maxScrollableIndex = Math.floor((el.scrollWidth - el.clientWidth) / snapStep);
        const maxIndex = Math.min(maxScrollableIndex, images.length - 1);
        
        // 如果當前索引接近或等於 maxIndex，確保回到最後一張圖的位置
        if (Math.abs(currentIndex - maxIndex) <= 0.5 || currentIndex >= maxIndex) {
          const targetScroll = maxIndex * snapStep;
          el.style.scrollBehavior = 'auto';
          const distance = Math.abs(targetScroll - currentScroll);
          const duration = Math.max(300, Math.min(600, distance * 0.6));
          const startTime = performance.now();
          const startScroll = currentScroll;
          
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentScrollPos = startScroll + (targetScroll - startScroll) * progress;
            el.scrollLeft = currentScrollPos;
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          
          requestAnimationFrame(animate);
          return;
        }
      }
      
      // 使用線性動畫 snap 到最近位置
      el.style.scrollBehavior = 'auto';
      snapToNearest();
      return;
    }
    // vX 單位是 px/ms，使用實際時間差，確保流暢
    const delta = vX.current * Math.min(dt, 20); // 限制最大時間差避免跳躍
    el.scrollLeft -= delta;
    raf.current = requestAnimationFrame(momentum);
  };

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const el = trackRef.current;
    if (!el) return;
    isDown.current = true;
    el.setPointerCapture(e.pointerId);
    startX.current = e.clientX;
    scrollStart.current = el.scrollLeft;
    lastX.current = e.clientX;
    lastT.current = performance.now();
    vX.current = 0;
    totalMoveDistance.current = 0; // 重置移動距離
    stopMomentum();
    // 關閉 smooth scroll 和 snap 以獲得即時響應
    el.style.scrollBehavior = 'auto';
    snapEnabled.current = false;
    // 暫時移除 snap 類別
    const innerDiv = el.querySelector('.flex');
    if (innerDiv) {
      innerDiv.classList.remove('snap-x', 'snap-mandatory');
    }
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const el = trackRef.current;
    if (!el || !isDown.current) return;
    e.preventDefault();
    e.stopPropagation();
    const dx = e.clientX - startX.current;
    el.scrollLeft = scrollStart.current - dx;
    
    // 追蹤總移動距離
    totalMoveDistance.current = Math.abs(dx);
    
    // compute velocity (更平滑的速度計算)
    const now = performance.now();
    const dt = now - lastT.current;
    if (dt > 0) {
      const dist = e.clientX - lastX.current;
      // 使用指數移動平均來平滑速度
      const instantVelocity = dist / dt;
      vX.current = vX.current * 0.7 + instantVelocity * 0.3;
    }
    lastX.current = e.clientX;
    lastT.current = now;
  };

  const onPointerUpOrLeave: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const el = trackRef.current;
    if (!el) return;
    if (isDown.current) {
      try { el.releasePointerCapture(e.pointerId); } catch {}
    }
    isDown.current = false;
    
    // 恢復 snap 類別
    const innerDiv = el.querySelector('.flex');
    if (innerDiv) {
      innerDiv.classList.add('snap-x', 'snap-mandatory');
    }
    
    // 判斷是否有移動（只要有移動就換圖，不會彈回）
    const hasMoved = totalMoveDistance.current > 0.5; // 0.5px 閾值，避免純點擊被誤判
    
    stopMomentum();
    snapEnabled.current = true;
    
    // 只要有移動，就移動到下一張圖（不會彈回）
    if (hasMoved) {
      // 計算移動方向
      const scrollDelta = el.scrollLeft - scrollStart.current;
      const firstCard = el.querySelector('article');
      if (firstCard) {
        const cardWidth = firstCard.getBoundingClientRect().width;
        const gap = 30;
        const snapStep = cardWidth + gap;
        const startIndex = Math.round(scrollStart.current / snapStep);
        
        // 計算最大可滾動索引（考慮視窗寬度和圖片數量）
        const maxScrollableIndex = Math.floor((el.scrollWidth - el.clientWidth) / snapStep);
        const maxIndex = Math.min(maxScrollableIndex, images.length - 1);
        
        // 如果是在最後一張圖（maxIndex），向右拖曳時允許拉到中間位置
        // 但放開後要回到最後一張圖的位置（第三個位置）
        // 檢查是否在最後一張圖，並且向右拖曳（scrollDelta < 0 表示向右）
        // 使用更寬鬆的判斷：如果 startIndex 接近或等於 maxIndex
        const isLastImage = Math.abs(startIndex - maxIndex) <= 0.5 || startIndex >= maxIndex;
        if (isLastImage && scrollDelta < 0) {
          // 在最後一張圖時向右拖曳，放開後回到最後一張圖的位置
          const targetIndex = maxIndex;
          const targetScroll = targetIndex * snapStep;
          
          // 停止慣性動畫，避免干擾
          stopMomentum();
          
          // 使用線性動畫回到最後一張圖的位置
          el.style.scrollBehavior = 'auto';
          const distance = Math.abs(targetScroll - el.scrollLeft);
          const duration = Math.max(300, Math.min(600, distance * 0.6));
          const startTime = performance.now();
          const startScrollPos = el.scrollLeft;
          
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentScrollPos = startScrollPos + (targetScroll - startScrollPos) * progress;
            el.scrollLeft = currentScrollPos;
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          
          requestAnimationFrame(animate);
          return;
        }
        
        // 根據移動方向決定下一張或上一張（只要有移動就換圖）
        let targetIndex = startIndex;
        if (Math.abs(scrollDelta) > 0) {
          // 只要有移動，根據方向決定
          if (scrollDelta < 0) {
            // 向右滑（scrollLeft 減少），下一張
            targetIndex = startIndex + 1;
          } else {
            // 向左滑（scrollLeft 增加），上一張
            targetIndex = startIndex - 1;
          }
        }
        
        // 確保索引在有效範圍內
        targetIndex = Math.max(0, Math.min(targetIndex, maxIndex));
        
        // 確保不會回到原位置（至少移動一張）
        if (targetIndex === startIndex && Math.abs(scrollDelta) > 0) {
          // 如果計算出來還是原位置，但確實有移動，強制移動一張
          if (scrollDelta < 0) {
            targetIndex = Math.min(startIndex + 1, maxIndex);
          } else {
            targetIndex = Math.max(startIndex - 1, 0);
          }
        }
        
        const targetScroll = targetIndex * snapStep;
        
        // 如果是在最後一張圖且向右拖曳，不啟動慣性動畫，直接回到最後一張圖位置
        const isLastImage2 = Math.abs(startIndex - maxIndex) <= 0.5 || startIndex >= maxIndex;
        if (isLastImage2 && scrollDelta < 0) {
          // 直接回到最後一張圖的位置
          el.style.scrollBehavior = 'auto';
          const distance = Math.abs(targetScroll - el.scrollLeft);
          const duration = Math.max(300, Math.min(600, distance * 0.6));
          const startTime = performance.now();
          const startScrollPos = el.scrollLeft;
          
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentScrollPos = startScrollPos + (targetScroll - startScrollPos) * progress;
            el.scrollLeft = currentScrollPos;
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          
          requestAnimationFrame(animate);
        } else if (Math.abs(vX.current) > 0.05) {
          // 如果速度足夠大，啟動慣性動畫（慣性動畫結束後會自動 snap）
          momentum();
        } else {
          // 速度太小，直接使用線性動畫 snap 到目標位置（確保換圖）
          el.style.scrollBehavior = 'auto';
          const distance = Math.abs(targetScroll - el.scrollLeft);
          const duration = Math.max(300, Math.min(600, distance * 0.6));
          const startTime = performance.now();
          const startScrollPos = el.scrollLeft;
          
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentScrollPos = startScrollPos + (targetScroll - startScrollPos) * progress;
            el.scrollLeft = currentScrollPos;
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          
          requestAnimationFrame(animate);
        }
      } else {
        // 如果找不到卡片，使用原來的 snap 邏輯
        el.style.scrollBehavior = 'auto';
        snapToNearest();
      }
    } else {
      // 沒有移動（純點擊），不移動
      el.style.scrollBehavior = 'auto';
    }
  };

  // Wheel smoothness (防止水平滾動卡頓)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        // already horizontal
        return;
      }
      // 直向滾輪轉為水平捲動（在滑鼠上也很好用）
      el.scrollLeft += e.deltaY;
      e.preventDefault();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel as any);
  }, []);

  // Keyboard arrow support
  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    const el = trackRef.current;
    if (!el) return;
    const step = el.clientWidth * 0.9;
    if (e.key === "ArrowRight") {
      el.scrollBy({ left: step, behavior: "smooth" });
    } else if (e.key === "ArrowLeft") {
      el.scrollBy({ left: -step, behavior: "smooth" });
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMomentum();
    };
  }, []);

  return (
    <section className="w-full py-6 md:py-8 lg:py-10">
      <div className="mx-auto max-w-[1400px] px-4">
        <header className="mb-4 md:mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">房客介紹</h2>
          <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 mt-1">按住圖片拖曳即可左右滑動</p>
        </header>

        <div
          ref={trackRef}
          className="relative overflow-x-auto overscroll-x-contain focus:outline-none"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch', // iOS 平滑滾動
            willChange: 'scroll-position', // 性能優化
            scrollBehavior: 'auto', // 不使用 CSS smooth，改用自訂動畫
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUpOrLeave}
          onPointerCancel={onPointerUpOrLeave}
          onPointerLeave={onPointerUpOrLeave}
          onKeyDown={onKeyDown}
          role="region"
          aria-label="房客介紹圖片滑動區"
          tabIndex={0}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          <div 
            className="flex gap-[30px] snap-x snap-mandatory touch-pan-x select-none cursor-grab active:cursor-grabbing px-4"
            style={{ willChange: 'transform' }} // 性能優化
          >
            {images.map((src, i) => (
              <article
                key={src}
                className="snap-start shadow-sm ring-1 ring-black/5 bg-white/70 backdrop-blur-sm overflow-hidden flex-shrink-0 basis-full sm:basis-[calc((100%-30px)/2)] lg:basis-[calc((100%-60px)/3)] group cursor-pointer"
                style={{ 
                  pointerEvents: 'auto', // 確保可以接收事件
                  userSelect: 'none', // 防止選取
                }}
              >
                <div className="relative w-full" style={{ aspectRatio: "6 / 7" }}>
                  <Image
                    src={src}
                    alt={`房客照片 ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                    priority={i < 3}
                    draggable={false}
                  />
                  {/* Hover 遮罩層 */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded text-black text-lg md:text-xl font-medium cursor-pointer">
                      詳細內容+
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
