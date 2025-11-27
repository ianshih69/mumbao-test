"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules"; // ★ 多加 EffectFade
import type { Swiper as SwiperType } from "swiper";
import { roomImageGroups } from "@/lib/room";
import { useLazyImage } from "@/hooks/useLazyImage";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade"; // ★ 加上淡入淡出樣式

export default function RoomList() {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const dotsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement | null>(null);

  const { isVisible, shouldLoad } = useLazyImage({
    immediate: false,
    threshold: 0.1,
    rootMargin: "200px",
    elementRef: sectionRef,
  });

  const [imageLoadedMap, setImageLoadedMap] = useState<Record<string, boolean>>(
    {}
  );
  const [autoplayEnabled, setAutoplayEnabled] = useState(false);
  const autoplayCheckIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 檢查指定索引的圖片是否已載入
  const checkImagesLoaded = (index: number): boolean => {
    const leftKey = `left-${index}`;
    const rightKey = `right-${index}`;
    const leftLoaded = imageLoadedMap[leftKey] ?? false;
    const rightLoaded = imageLoadedMap[rightKey] ?? false;
    return leftLoaded && rightLoaded;
  };

  // 獲取下一張的索引（考慮 loop）
  const getNextIndex = (currentIndex: number): number => {
    return (currentIndex + 1) % roomImageGroups.length;
  };

  // 等待圖片載入完成後繼續 autoplay
  const waitForImagesAndResume = (targetIndex: number) => {
    // 清除之前的 interval
    if (autoplayCheckIntervalRef.current) {
      clearInterval(autoplayCheckIntervalRef.current);
      autoplayCheckIntervalRef.current = null;
    }

    // 如果圖片已載入，直接繼續
    if (checkImagesLoaded(targetIndex)) {
      if (swiperInstance) {
        swiperInstance.autoplay?.start();
        setAutoplayEnabled(true);
      }
      return;
    }

    // 輪詢檢查圖片是否已載入（最多等待 10 秒）
    let attempts = 0;
    const maxAttempts = 100; // 100 * 100ms = 10 秒
    const checkInterval = setInterval(() => {
      attempts++;
      if (checkImagesLoaded(targetIndex) || attempts >= maxAttempts) {
        if (autoplayCheckIntervalRef.current) {
          clearInterval(autoplayCheckIntervalRef.current);
          autoplayCheckIntervalRef.current = null;
        }
        if (swiperInstance) {
          swiperInstance.autoplay?.start();
          setAutoplayEnabled(true);
        }
      }
    }, 100);
    
    // 保存 interval ID 以便清理
    autoplayCheckIntervalRef.current = checkInterval;
  };

  // 清理 interval
  useEffect(() => {
    return () => {
      if (autoplayCheckIntervalRef.current) {
        clearInterval(autoplayCheckIntervalRef.current);
        autoplayCheckIntervalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const preloadImages = () => {
      roomImageGroups.forEach((group, index) => {
        const leftKey = `left-${index}`;
        const rightKey = `right-${index}`;

        const leftImg = new window.Image();
        let leftLoaded = false;
        leftImg.onload = () => {
          if (!leftLoaded) {
            leftLoaded = true;
            setImageLoadedMap((prev) => ({ ...prev, [leftKey]: true }));
          }
        };
        leftImg.onerror = () => {
          if (!leftLoaded) {
            leftLoaded = true;
            setImageLoadedMap((prev) => ({ ...prev, [leftKey]: true }));
          }
        };
        leftImg.src = group.left;

        const rightImg = new window.Image();
        let rightLoaded = false;
        rightImg.onload = () => {
          if (!rightLoaded) {
            rightLoaded = true;
            setImageLoadedMap((prev) => ({ ...prev, [rightKey]: true }));
          }
        };
        rightImg.onerror = () => {
          if (!rightLoaded) {
            rightLoaded = true;
            setImageLoadedMap((prev) => ({ ...prev, [rightKey]: true }));
          }
        };
        rightImg.src = group.right;

        if (leftImg.complete && leftImg.naturalWidth > 0) {
          setTimeout(() => {
            if (!leftLoaded) {
              leftLoaded = true;
              setImageLoadedMap((prev) => ({ ...prev, [leftKey]: true }));
            }
          }, 0);
        }
        if (rightImg.complete && rightImg.naturalWidth > 0) {
          setTimeout(() => {
            if (!rightLoaded) {
              rightLoaded = true;
              setImageLoadedMap((prev) => ({ ...prev, [rightKey]: true }));
            }
          }, 0);
        }
      });
    };

    preloadImages();
  }, []);

  // 當第一張圖片載入完成後，啟動 autoplay
  useEffect(() => {
    if (checkImagesLoaded(0) && swiperInstance && !autoplayEnabled) {
      swiperInstance.autoplay?.start();
      setAutoplayEnabled(true);
    }
  }, [imageLoadedMap, swiperInstance, autoplayEnabled]);

  useEffect(() => {
    dotsRef.current.forEach((dot, i) => {
      if (!dot) return;
      if (i === activeIndex) {
        dot.style.setProperty("background-color", "white", "important");
        dot.style.transform = "scale(1.25)";
      } else {
        dot.style.setProperty(
          "background-color",
          "rgba(255, 255, 255, 0.4)",
          "important"
        );
        dot.style.transform = "scale(1)";
      }
    });
  }, [activeIndex]);

  return (
    <>
      <section className="room-list-section" ref={sectionRef}>
        <div className="room-list-container">
          {/* 桌機 header */}
          <div className="room-list-header-desktop">
            <div className="room-list-dots">
              {roomImageGroups.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    swiperInstance?.slideTo(i);
                    setActiveIndex(i);
                  }}
                  aria-label={`切換到第 ${i + 1} 頁`}
                  className="room-list-dot"
                  ref={(el) => {
                    if (el) {
                      dotsRef.current[i] = el;
                      // 設置初始樣式，確保所有圓點都有正確的樣式
                      if (i === activeIndex) {
                        el.style.setProperty(
                          "background-color",
                          "white",
                          "important"
                        );
                        el.style.transform = "scale(1.25)";
                      } else {
                        el.style.setProperty(
                          "background-color",
                          "rgba(255, 255, 255, 0.4)",
                          "important"
                        );
                        el.style.transform = "scale(1)";
                      }
                    }
                  }}
                />
              ))}
            </div>

            <h2 className="room-list-title-center">房型</h2>

            <Link href="/rooms" className="room-list-more-link text-white">
              更多 ＋
            </Link>
          </div>

          {/* 手機標題 */}
          <div className="room-list-header-mobile">
            <h2 className="room-list-title-mobile">房型</h2>
          </div>

          {/* 手機：圓點 + 更多 */}
          <div className="room-list-mobile-controls">
            <div className="room-list-dots-mobile">
              {roomImageGroups.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    swiperInstance?.slideTo(i);
                    setActiveIndex(i);
                  }}
                  aria-label={`切換到第 ${i + 1} 頁`}
                  className="room-list-dot"
                  ref={(el) => {
                    if (el) {
                      dotsRef.current[i] = el;
                    }
                  }}
                />
              ))}
            </div>

            <div className="room-list-more-mobile-top">
              <Link href="/rooms" className="room-list-more-link-mobile text-white">
                更多 ＋
              </Link>
            </div>
          </div>

          {/* Swiper */}
          <div className="room-list-swiper-wrapper">
            <Swiper
              modules={[Autoplay, Pagination, EffectFade]}  // ★ 加上 EffectFade 模組
              effect="fade"                                 // ★ 使用淡入淡出效果
              fadeEffect={{ crossFade: true }}             // ★ 前一張淡出 + 下一張淡入
              spaceBetween={0}
              slidesPerView={1}
              loop={true}
              grabCursor={true}
              speed={600}
              watchSlidesProgress={true}
              autoplay={
                autoplayEnabled
                  ? {
                      delay: 3000,
                      disableOnInteraction: false,
                    }
                  : false
              }
              pagination={{
                el: ".room-list-swiper-pagination",
                clickable: true,
                bulletClass: "room-list-pagination-bullet",
                bulletActiveClass: "room-list-pagination-bullet-active",
              }}
              onSwiper={(swiper) => {
                setSwiperInstance(swiper);
                setActiveIndex(swiper.realIndex);
              }}
              onSlideChange={(swiper) => {
                setActiveIndex(swiper.realIndex);
                
                // 切換後檢查下一張圖片是否已載入
                const nextIndex = getNextIndex(swiper.realIndex);
                if (!checkImagesLoaded(nextIndex)) {
                  // 如果下一張圖片未載入，暫停 autoplay
                  swiper.autoplay?.stop();
                  setAutoplayEnabled(false);
                  // 等待圖片載入完成後再繼續
                  waitForImagesAndResume(nextIndex);
                }
              }}
              onAutoplayTimeLeft={(swiper, timeLeft, percentage) => {
                // 在 autoplay 即將觸發前（剩餘 200ms 時）檢查下一張圖片
                if (timeLeft < 200 && autoplayEnabled) {
                  const nextIndex = getNextIndex(swiper.realIndex);
                  if (!checkImagesLoaded(nextIndex)) {
                    // 如果下一張圖片未載入，暫停 autoplay
                    swiper.autoplay?.stop();
                    setAutoplayEnabled(false);
                    // 等待圖片載入完成後再繼續
                    waitForImagesAndResume(nextIndex);
                  }
                }
              }}
              className="room-list-swiper"
            >
              {roomImageGroups.map((g, i) => {
                const leftKey = `left-${i}`;
                const rightKey = `right-${i}`;
                const leftLoaded = imageLoadedMap[leftKey] ?? false;
                const rightLoaded = imageLoadedMap[rightKey] ?? false;

                return (
                  <SwiperSlide key={i} className="room-list-slide">
                    <div className="room-list-grid">
                      {/* 左圖 */}
                      <div className="room-list-image-left">
                        <img
                          src={g.left}
                          alt={`房型圖片 ${i + 1} - 左`}
                          loading="eager"
                          decoding="async"
                          className="room-list-image"
                        />
                      </div>
                      {/* 右圖 */}
                      <div className="room-list-image-right">
                        <img
                          src={g.right}
                          alt={`房型圖片 ${i + 1} - 右`}
                          loading="eager"
                          decoding="async"
                          className="room-list-image"
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>

          <div
            className="room-list-swiper-pagination"
            style={{ display: "none" }}
          ></div>
        </div>
      </section>

      {/* 原本的 CSS 全留著 */}
      <style jsx>{`
        .room-list-section {
          background-color: #a4835e;
          padding: 4rem 0;
        }

        @media (min-width: 768px) {
          .room-list-section {
            padding: 6rem 0;
          }
        }

        .room-list-container {
          max-width: 72rem;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .room-list-header-desktop {
          display: none;
          position: relative;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.25rem;
        }

        @media (min-width: 768px) {
          .room-list-header-desktop {
            display: flex;
          }
        }

        .room-list-dots {
          display: flex;
          align-items: center;
          gap: 0.375rem;
        }

        .room-list-dot {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 9999px;
          border: none;
          background-color: rgba(255, 255, 255, 0.4) !important;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .room-list-dot:hover {
          background-color: rgba(255, 255, 255, 0.6) !important;
        }

        .room-list-swiper {
          width: 100%;
          overflow: hidden;
          height: 100%;
        }

        @media (max-width: 767px) {
          .room-list-swiper {
            height: auto;
            min-height: 420px;
          }
        }

        .room-list-slide {
          width: 100%;
          opacity: 1;
        }

        .room-list-swiper-pagination {
          display: none;
        }

        .room-list-title-center {
          position: absolute;
          left: 50%;
          transform: translateX(-50%) translateY(-2.5rem);
          font-size: 1.875rem;
          font-weight: 400;
          letter-spacing: 0.15em;
          color: white;
          margin: 0;
        }

        .room-list-more-link {
          color: #ffffff !important;
          text-decoration: none;
          font-size: 1rem;
          transition: opacity 0.3s ease;
        }

        .room-list-more-link:hover {
          opacity: 0.8;
        }

        .room-list-swiper-wrapper {
          position: relative;
          width: 100%;
        }

        @media (max-width: 767px) {
          .room-list-swiper-wrapper {
            min-height: 420px;
          }
        }


        .room-list-header-mobile {
          display: block;
          margin-bottom: 0.5rem;
          margin-top: -2.5rem;
        }

        @media (min-width: 768px) {
          .room-list-header-mobile {
            display: none;
          }
        }

        .room-list-title-mobile {
          text-align: center;
          font-size: 1.5rem;
          font-weight: 400;
          letter-spacing: 0.15em;
          color: white;
          margin: 0 0 0.5rem 0;
        }

        .room-list-mobile-controls {
          display: none;
          position: relative;
          margin-bottom: 0.75rem;
          padding: 0 1rem;
          justify-content: space-between;
          align-items: center;
        }

        @media (max-width: 767px) {
          .room-list-mobile-controls {
            display: flex;
          }
        }

        @media (min-width: 768px) {
          .room-list-mobile-controls {
            display: none;
          }
        }

        .room-list-dots-mobile {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 0.375rem;
        }

        .room-list-grid {
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: 3fr 5fr;
          gap: 0.75rem;
          min-height: 0;
        }

        @media (max-width: 767px) {
          .room-list-grid {
            height: auto;
            min-height: 420px;
          }
        }

        @media (min-width: 768px) {
          .room-list-grid {
            grid-template-columns: 40% 60%;
            grid-template-rows: none;
            gap: 1.5rem;
          }
        }

        .room-list-image-left,
        .room-list-image-right {
          position: relative;
          width: 100%;
          min-width: 0;
          overflow: hidden;
          border: 1px solid white;
          background-color: #a4835e;
        }

        @media (max-width: 767px) {
          .room-list-image-left,
          .room-list-image-right {
            aspect-ratio: unset !important;
            height: 100% !important;
            width: 100% !important;
          }
        }

        @media (min-width: 768px) {
          .room-list-image-left {
            aspect-ratio: 3 / 4;
            height: 100%;
          }

          .room-list-image-right {
            aspect-ratio: 5 / 3;
            height: 100%;
          }
        }

        .room-list-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        @media (min-width: 768px) {
          .room-list-image-left {
            aspect-ratio: unset !important;
            height: 100% !important;
          }
        }


        .room-list-more-mobile-top {
          display: block;
        }

        .room-list-more-link-mobile {
          color: #ffffff !important;
          text-decoration: none;
          font-size: 0.875rem;
          transition: opacity 0.3s ease;
        }

        .room-list-more-link-mobile:hover {
          opacity: 0.8;
        }
      `}</style>
    </>
  );
}
