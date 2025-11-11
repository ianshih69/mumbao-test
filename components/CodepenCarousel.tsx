"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import $ from "jquery";
import "./CodepenCarousel.css";

export default function CodepenCarousel() {
  const inited = useRef(false);

  useEffect(() => {
    // 讓 owl.carousel 能找到 jQuery
    (window as any).jQuery = $;
    (window as any).$ = $;

    const boot = async () => {
      if (inited.current) return;

      // @ts-expect-error third-party lib has no official types; shimed in /types
      await import("owl.carousel/dist/owl.carousel.js");

      const $owl = $(".loop");
      if (!$owl.length) return;

      $owl.owlCarousel({
        loop: true,
        autoplay: true,
        autoplayHoverPause: true,
        autoplayTimeout: 3000,
        autoplaySpeed: 800,
        margin: 15,

        // 手機～中等：保留你原本「置中、左右露一點」
        center: true,
        stagePadding: 15,
        items: 1.2,

        // 斷點：最大頁面顯示「完整三張」
        responsive: {
          640: { items: 1.6, stagePadding: 20, center: true },
          768: { items: 2.0, stagePadding: 24, center: true },
          1024: { items: 2.4, stagePadding: 24, center: true },
          1280: { items: 3, stagePadding: 0, center: false },  // ★ 三張、取消置中與 padding
          1536: { items: 3, stagePadding: 0, center: false },  // ★ 三張
        },

        // 需要的話可留著動畫，不影響三張滿版
        animateOut: "slide-up",
        animateIn: "slide-down",
      });

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
    <section className="cards">
      <div className="owl-wrapper">
        <div className="loop owl-carousel owl-theme">
          {[1, 2, 3, 4, 5].map((num) => (
            <article className="card" key={num}>
              <div className="card__content relative w-full">
                {/* 左上角 1~5 編號 */}
                <span
                  className="absolute left-3 top-3 z-10 inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-black/70 px-3 text-sm font-semibold text-white"
                  aria-label={`第 ${num} 張`}
                >
                  {num}
                </span>

                {/* 圖片：/images/page3/page3-1.webp ~ page3-5.webp */}
                <div className="relative w-full" style={{ aspectRatio: "6 / 7" }}>
                  <Image
                    src={`/images/page3/page3-${num}.webp`}
                    alt={`房客介紹 ${num}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 33vw"
                    className="object-cover rounded-xl"
                    priority={num <= 2}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
