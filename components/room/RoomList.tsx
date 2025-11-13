"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { roomImageGroups } from "@/lib/room";
import { useLazyImage } from "@/hooks/useLazyImage";

// 導入 Swiper 樣式
import "swiper/css";
import "swiper/css/pagination";

export default function RoomList() {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const dotsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement | null>(null);
  const { isVisible, shouldLoad } = useLazyImage({
    immediate: false,
    threshold: 0.1,
    elementRef: sectionRef,
  });

  // 更新圓圈指示器樣式
  useEffect(() => {
    dotsRef.current.forEach((dot, i) => {
      if (dot) {
        if (i === activeIndex) {
          dot.style.setProperty("background-color", "white", "important");
          dot.style.transform = "scale(1.25)";
        } else {
          dot.style.setProperty("background-color", "rgba(255, 255, 255, 0.4)", "important");
          dot.style.transform = "scale(1)";
        }
      }
    });
  }, [activeIndex]);

  return (
    <>
      <section className="room-list-section" ref={sectionRef}>
        <div className="room-list-container">
          {/* 桌面端標題列：上左圓圈、上中標題、上右更多連結 */}
          <div className="room-list-header-desktop">
            {/* 上左：4個圓圈分頁指示器 */}
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
                      // 立即設置初始狀態
                      if (i === activeIndex) {
                        el.style.setProperty("background-color", "white", "important");
                        el.style.transform = "scale(1.25)";
                      } else {
                        el.style.setProperty("background-color", "rgba(255, 255, 255, 0.4)", "important");
                        el.style.transform = "scale(1)";
                      }
                    }
                  }}
                />
              ))}
            </div>

            {/* 上中：房型標題（絕對居中） */}
            <h2 className="room-list-title-center">房型</h2>

            {/* 上右：更多+連結 */}
            <Link href="/rooms" className="room-list-more-link" style={{ color: "white" }}>
              更多 ＋
            </Link>
          </div>

          {/* 移動端：房型標題 */}
          <div className="room-list-header-mobile">
            <h2 className="room-list-title-mobile">房型</h2>
          </div>

          {/* 移動端：圓點和更多連結的容器 */}
          <div className="room-list-mobile-controls">
            {/* 移動端：四個圓點在圖外左上方 */}
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
                      // 立即設置初始狀態
                      if (i === activeIndex) {
                        el.style.setProperty("background-color", "white", "important");
                        el.style.transform = "scale(1.25)";
                      } else {
                        el.style.setProperty("background-color", "rgba(255, 255, 255, 0.4)", "important");
                        el.style.transform = "scale(1)";
                      }
                    }
                  }}
                />
              ))}
            </div>

            {/* 移動端："更多 +" 在圖外右上方 */}
            <div className="room-list-more-mobile-top">
              <Link href="/rooms" className="room-list-more-link-mobile" style={{ color: "white" }}>
                更多 ＋
              </Link>
            </div>
          </div>

          {/* 兩欄圖片 - 使用 Swiper */}
          <div className="room-list-swiper-wrapper">
            <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            grabCursor={true}
            speed={500}
            watchSlidesProgress={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              el: ".room-list-swiper-pagination",
              clickable: true,
              bulletClass: "room-list-pagination-bullet",
              bulletActiveClass: "room-list-pagination-bullet-active",
            }}
            onSwiper={(swiper) => {
              setSwiperInstance(swiper);
              // 初始化時設置正確的索引
              setActiveIndex(swiper.realIndex);
            }}
            onSlideChange={(swiper) => {
              // 處理 loop 模式下的真實索引
              const realIndex = swiper.realIndex;
              setActiveIndex(realIndex);
            }}
            onSlideChangeTransitionStart={(swiper) => {
              // 在切換開始時也更新索引，確保及時更新
              const realIndex = swiper.realIndex;
              setActiveIndex(realIndex);
            }}
            className="room-list-swiper"
          >
            {roomImageGroups.map((g, i) => (
              <SwiperSlide key={i} className="room-list-slide">
                <div className="room-list-grid">
                  {/* Left image: 3:4 直式 */}
                  <div className="room-list-image-left">
                    {shouldLoad && (
                      <img
                        src={g.left}
                        alt={`房型圖片 ${i + 1} - 左`}
                        loading="lazy"
                        decoding="async"
                        className="room-list-image"
                        style={{
                          opacity: isVisible ? 1 : 0,
                          transition: "opacity 0.8s ease-out",
                        }}
                      />
                    )}
                  </div>

                  {/* Right image: 5:3 橫式 */}
                  <div className="room-list-image-right">
                    {shouldLoad && (
                      <img
                        src={g.right}
                        alt={`房型圖片 ${i + 1} - 右`}
                        loading="lazy"
                        decoding="async"
                        className="room-list-image"
                        style={{
                          opacity: isVisible ? 1 : 0,
                          transition: "opacity 0.8s ease-out",
                        }}
                      />
                    )}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          </div>

          {/* Swiper 分頁指示器（隱藏，因為我們用自定義的圓圈） */}
          <div className="room-list-swiper-pagination" style={{ display: "none" }}></div>
        </div>
      </section>
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

        /* 桌面端標題列 */
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

         /* Swiper 相關樣式 */
         .room-list-swiper {
           width: 100%;
           overflow: hidden;
           height: 100%;
         }

         /* 手機端：確保 Swiper 有高度 */
         @media (max-width: 767px) {
           .room-list-swiper {
             height: auto;
             min-height: 60vh;
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
          color: white !important;
          text-decoration: none;
          font-size: 1rem;
          transition: opacity 0.3s ease;
        }

        .room-list-more-link:hover {
          opacity: 0.8;
        }

         /* Swiper 包裝器 */
         .room-list-swiper-wrapper {
           position: relative;
           width: 100%;
         }

         /* 手機端：確保 Swiper 容器有高度 */
         @media (max-width: 767px) {
           .room-list-swiper-wrapper {
             min-height: 60vh;
           }
         }

        /* 移動端標題列 */
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

        /* 移動端：圓點和更多連結的容器 */
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

        /* 移動端：四個圓點在圖外左上方 */
        .room-list-dots-mobile {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 0.375rem;
        }

         /* 圖片網格 */
         .room-list-grid {
           display: grid;
           grid-template-columns: 1fr;
           /* 手機端：上圖高度減少 1/4 後再增加 1/3 (2.25 * 4/3 = 3)，下圖高度增加 1/4 (4 * 5/4 = 5) */
           grid-template-rows: 3fr 5fr;
           gap: 0.75rem;
           /* 確保 grid 有足夠的高度 */
           min-height: 0;
         }

         /* 手機端：確保 grid 容器有高度 */
         @media (max-width: 767px) {
           .room-list-grid {
             height: auto;
             min-height: 60vh;
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

         /* 手機端：移除 aspect-ratio，讓 grid-template-rows 控制高度 */
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

        /* 桌面端左圖移除 aspect ratio */
        @media (min-width: 768px) {
          .room-list-image-left {
            aspect-ratio: unset !important;
            height: 100% !important;
          }
        }

        /* 移動端："更多 +" 在圖外右上方 */
        .room-list-more-mobile-top {
          display: block;
        }

        .room-list-more-link-mobile {
          color: white !important;
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

