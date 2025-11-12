"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import $ from "jquery";

// ===== 圖片配置：所有圖檔相關設定都在這裡 =====
const IMAGE_CONFIG = {
  // 圖片基礎路徑
  basePath: "/images/page3",
  // 圖片檔案格式
  format: "webp",
  // 圖片數量
  count: 5,
  // 圖片寬高比
  aspectRatio: "314 / 367",
  // 圖片 alt 文字前綴
  altPrefix: "房客介紹",
  // 優先載入的圖片數量（前 N 張使用 priority）
  priorityCount: 2,
  // 響應式 sizes 設定
  sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 33vw",
} as const;

// 生成圖片數據陣列
const imageData = Array.from({ length: IMAGE_CONFIG.count }, (_, index) => {
  const num = index + 1;
  return {
    id: num,
    src: `${IMAGE_CONFIG.basePath}/page3-${num}.${IMAGE_CONFIG.format}`,
    alt: `${IMAGE_CONFIG.altPrefix} ${num}`,
    priority: num <= IMAGE_CONFIG.priorityCount,
    label: `第 ${num} 張`,
  };
});

// ===== 組件 =====
export default function CodepenCarousel() {
  const inited = useRef(false);

  useEffect(() => {
    // 讓 owl.carousel 能找到 jQuery
    (window as any).jQuery = $;
    (window as any).$ = $;

    const boot = async () => {
      if (inited.current) return;

      // @ts-expect-error third-party lib has no official types
      await import("owl.carousel/dist/owl.carousel.js");

      const $owl = $(".loop");
      if (!$owl.length) return;

      // @ts-expect-error owl.carousel plugin method
      $owl.owlCarousel({
        loop: true,
        autoplay: true,
        autoplayHoverPause: true,
        autoplayTimeout: 3000,
        autoplaySpeed: 800,
        margin: 20,

        // 手機～中等：保留你原本「置中、左右露一點」
        center: true,
        stagePadding: 15,
        items: 1.2,

        // 斷點：最大頁面顯示「完整三張」
        responsive: {
          640: { items: 1.6, stagePadding: 20, center: true, margin: 20 },
          768: { items: 2.0, stagePadding: 24, center: true, margin: 20 },
          1024: { items: 2.4, stagePadding: 24, center: true, margin: 20 },
          1280: { items: 3, stagePadding: 0, center: false, margin: 20 },  // ★ 三張、取消置中與 padding
          1536: { items: 3, stagePadding: 0, center: false, margin: 20 },  // ★ 三張
        },

        // 需要的話可留著動畫，不影響三張滿版
        animateOut: "slide-up",
        animateIn: "slide-down",
      });

      // 強制設置間距為 20px - 使用多種方式確保生效
      const forceMargin = () => {
        $owl.find(".owl-item").each(function() {
          const $item = $(this);
          $item.css("margin-right", "20px");
          $item.css("margin-left", "0");
          $item.css("padding-right", "0");
          $item.css("padding-left", "0");
          // 也移除內部的 card 的 margin
          $item.find(".card").css("margin-left", "0").css("margin-right", "0");
        });
      };

      // 立即執行
      forceMargin();

      // 延遲執行（確保 OwlCarousel 初始化完成）
      setTimeout(forceMargin, 100);
      setTimeout(forceMargin, 300);

      // 監聽 resize 和 update 事件
      $owl.on("resized.owl.carousel", forceMargin);
      $owl.on("refreshed.owl.carousel", forceMargin);
      $owl.on("updated.owl.carousel", forceMargin);

      inited.current = true;
    };

    boot();

    // 卸載時銷毀
    return () => {
      try {
        const $owl = $(".loop");
        // @ts-ignore
        $owl.trigger && $owl.trigger("destroy.owl.carousel");
      } catch {}
    };
  }, []);

  return (
    <>
      <section className="cards">
        <div className="owl-wrapper">
          <div className="loop owl-carousel owl-theme">
            {imageData.map((image) => (
              <article className="card" key={image.id}>
                <div className="card__content relative w-full">
                  {/* 左上角編號 */}
                  <span
                    className="absolute left-3 top-3 z-10 inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-black/70 px-3 text-sm font-semibold text-white"
                    aria-label={image.label}
                  >
                    {image.id}
                  </span>

                  {/* 圖片 */}
                  <div className="relative w-full" style={{ aspectRatio: IMAGE_CONFIG.aspectRatio }}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes={IMAGE_CONFIG.sizes}
                      className="object-cover rounded-xl"
                      priority={image.priority}
                      draggable={false}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 所有樣式都在這裡 ===== */}
      <style jsx global>{`
        html {
          font-family: "Poppins";
          margin: 0;
          padding: 0;
        }

        .card,
        .owl-item {
          transition: all 1s ease-out;
          -webkit-backface-visibility: hidden;
          -webkit-transform: translateZ(0) scale(1, 1);
        }

        /* 直接控制圖片之間的間距 - 使用 CSS 變數以便動態調整 */
        .owl-item {
          margin-right: 0 !important;
          padding-right: 0 !important;
        }

        /* 確保 OwlCarousel 的 margin 設置生效 */
        .loop .owl-item {
          margin-right: 0 !important;
        }

        .owl-wrapper {
          position: relative;
          height: 100vh;
          width: 100%;
          margin: 0;
          padding: 0;
        }

        .cards {
          position: relative;
          height: 100vh;
          width: 100%;
          padding: 4em 0;
          background-color: #fefefe;
        }

        .card {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          height: auto;
          padding: 0;
          margin: 1em 0;
          margin-left: 0;
          margin-right: 0;
          border-radius: 4px;
          opacity: 0.7;
          transform: scale(0.87);
          transition: transform 0.4s 0.5s ease-out, opacity 1s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }

        /* 確保卡片內容容器寬度 100%，高度由 aspect-ratio 控制 */
        .card__content {
          width: 100%;
          position: relative;
        }

        /* 設置圖片之間的間距為 20px */
        .loop .owl-item {
          margin-right: 20px !important;
          margin-left: 0 !important;
          padding-right: 0 !important;
          padding-left: 0 !important;
        }

        .loop .owl-item .card {
          margin-left: 0 !important;
          margin-right: 0 !important;
        }

        .active .card {
          box-shadow: 0 0px 1em rgba(0, 0, 0, 0.2);
          transform: box-shadow 0.3s ease, transform 0.1s 0.4s ease-in, opacity 0.4s ease;
        }

        .active .card__content {
          opacity: 1;
          transition: opacity 0.4s ease;
        }

        .card__title {
          display: inline-block;
          font-size: 2em;
          overflow: hidden;
        }

        .card__title span {
          display: inline-block;
          animation: slide-up 0.4s 0s ease both;
        }

        .center.active .card__title span,
        .center.active.cloned:last-child .card__title span {
          opacity: 1;
          animation: slide-down 0.4s 0.4s ease both;
          transition: transform 0.3s 0.4s ease, opacity 0.3s ease;
        }

        .center .card {
          opacity: 1;
          transform: scale(1);
        }

        .center .card:hover {
          box-shadow: 0 8px 16px -5px rgba(0, 0, 0, 0.4);
        }

        .owl-item:nth-of-type(1n) .card {
          background-color: #ff527b;
        }

        .owl-item:nth-of-type(2n) .card {
          background-color: #ffcc8f;
        }

        .owl-item:nth-of-type(3n) .card {
          background-color: #ff8f2f;
        }

        .owl-item:nth-of-type(4n) .card {
          background-color: #2480fe;
        }

        .owl-theme .owl-dots .owl-dot span {
          width: 4em;
          height: 4px;
          margin: 0 0.5em;
          background: #d6d6d6;
          display: block;
          transition: opacity 0.2s ease;
        }

        .owl-theme .owl-dots .owl-dot.active span,
        .owl-theme .owl-dots .owl-dot:hover span {
          background: #ff527b;
        }

        @keyframes slide-down {
          0% {
            opacity: 0;
            transform: translate3d(0, -120%, 0);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0%, 0);
          }
        }

        @keyframes slide-up {
          0% {
            opacity: 1;
            transform: translate3d(0, 0%, 0);
          }
          100% {
            opacity: 0;
            transform: translate3d(0, -120%, 0);
          }
        }

        /* === 取代 owl.theme.default.css 的必要規則（無 hack 版） === */
        .owl-theme .owl-nav {
          margin-top: 10px;
          text-align: center;
        }

        .owl-theme .owl-dots {
          text-align: center;
          -webkit-tap-highlight-color: transparent;
        }

        .owl-theme .owl-dots .owl-dot {
          display: inline-block;
        }

        .owl-theme .owl-dots .owl-dot span {
          width: 10px;
          height: 10px;
          margin: 5px 7px;
          background: #d6d6d6;
          display: block;
          border-radius: 30px;
          transition: opacity 0.2s ease;
        }

        .owl-theme .owl-dots .owl-dot.active span,
        .owl-theme .owl-dots .owl-dot:hover span {
          background: #ff527b; /* 這裡可以換成你的主色 */
        }

        /* ==== 移除卡片預設的粉紅背景與陰影 ==== */

        /* 把每張卡片背景清成透明 */
        .card {
          background: transparent !important;
          box-shadow: none !important;
        }

        /* 移除被 OwlCarousel 複製的 cloned 卡片的任何底色 */
        .owl-item,
        .owl-item.cloned,
        .owl-stage,
        .owl-stage-outer {
          background: transparent !important;
          box-shadow: none !important;
        }

        /* 移除 CodePen 原主題設定的彩色 nth-of-type 顏色 */
        .owl-item:nth-of-type(1n) .card,
        .owl-item:nth-of-type(2n) .card,
        .owl-item:nth-of-type(3n) .card,
        .owl-item:nth-of-type(4n) .card,
        .owl-item:nth-of-type(5n) .card {
          background: transparent !important;
        }

        /* 若 OwlCarousel 產生左右陰影（多半是 box-shadow 或 overlay） */
        .owl-stage::before,
        .owl-stage::after {
          content: none !important;
          display: none !important;
          background: none !important;
          box-shadow: none !important;
        }

        /* === 大螢幕：顯示完整三張，取消 CodePen 的縮放/陰影 === */
        @media (min-width: 1280px) {
          /* Owl 已把寬度切成 3 等份；把卡片還原成 1:1 尺寸與不透明 */
          .owl-carousel.loop .owl-item .card {
            transform: none !important;
            opacity: 1 !important;
            box-shadow: none !important;
            background: transparent !important;
          }

          /* 取消「只讓中間一張放大」的規則，三張都一樣大 */
          .owl-carousel.loop .center .card,
          .owl-carousel.loop .active .card {
            transform: none !important;
            opacity: 1 !important;
            box-shadow: none !important;
          }

          /* 不需要額外外距，避免看起來被裁切 */
          .owl-carousel.loop .owl-stage {
            margin: 0 !important;
          }

          /* 確保所有卡片高度一致，由 aspect-ratio 控制 */
          .owl-carousel.loop .owl-item {
            display: flex;
            align-items: stretch;
          }

          .owl-carousel.loop .owl-item .card {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
          }

          .owl-carousel.loop .owl-item .card__content {
            width: 100%;
            flex: 1;
            display: flex;
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}
