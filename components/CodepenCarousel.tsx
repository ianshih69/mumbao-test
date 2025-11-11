"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import $ from "jquery";
import "./CodepenCarousel.css"; // 你的自訂樣式（含 dots 替代樣式）

export default function CodepenCarousel() {
  const inited = useRef(false);

  useEffect(() => {
    // 確保 jQuery 掛到 window，供 owl.carousel 使用
    (window as any).jQuery = $;
    (window as any).$ = $;

    const boot = async () => {
      if (inited.current) return;

      // 動態載入 owl.carousel（只在瀏覽器端執行，避免 SSR 出錯）
      await import("owl.carousel");

      const $owl = $(".loop");
      if (!$owl.length) return;

      // 與你 CodePen 同設定
      $owl.owlCarousel({
        autoplay: true,
        autoplayHoverPause: true,
        autoplayTimeout: 3000,
        autoplaySpeed: 800,
        center: true,
        items: 1.4,
        stagePadding: 15,
        loop: true,
        margin: 15,
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

                {/* 圖片：/images/page3/page3-1.webp ~ 5.webp */}
                <div className="relative w-full" style={{ aspectRatio: "6 / 7" }}>
                  <Image
                    src={`/images/page3/page3-${num}.webp`}
                    alt={`房客介紹 ${num}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
