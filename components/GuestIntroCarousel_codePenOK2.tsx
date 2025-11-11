"use client";

import { useEffect, useRef, useMemo } from "react";
import Script from "next/script";
import Image from "next/image";

export default function CodepenCarousel() {
  const images = useMemo(
    () => [1, 2, 3, 4, 5].map((n) => `/images/page3/page3-${n}.webp`),
    []
  );
  const inited = useRef(false);

  useEffect(() => {
    // 等待 jQuery + OwlCarousel2 載入完成後再初始化
    const tryInit = () => {
      if (inited.current) return;
      const $: any = (window as any).jQuery || (window as any).$;
      if ($ && $.fn && $.fn.owlCarousel) {
        // --- 來自你的 main.js --- (已保留行為)  :contentReference[oaicite:3]{index=3}
        $(".custom-carousel").owlCarousel({
          autoWidth: true,
          loop: true,
        });
        $(".custom-carousel .item").on("click", function () {
          $(".custom-carousel .item").not($(this)).removeClass("active");
          $(this).toggleClass("active");
        });

        inited.current = true;
      }
    };

    const id = setInterval(tryInit, 120);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* 先載 CSS（OwlCarousel2） */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css"
      />

      {/* 再載 JS：jQuery -> OwlCarousel2 */}
      <Script src="https://code.jquery.com/jquery-3.6.0.min.js" strategy="afterInteractive" />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js"
        strategy="afterInteractive"
      />

      {/* 直接把你的 CSS 放到 global（去掉 @charset，保留 @import）  :contentReference[oaicite:4]{index=4} */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");

        * { margin: 0; padding: 0; }
        body { font-family: "Roboto", sans-serif; font-size: 16px; }
        .clear { clear: both; }
        img { max-width: 100%; border: 0; }
        ul, ol { list-style: none; }
        a { text-decoration: none; color: inherit; outline: none; transition: all .4s ease-in-out; }
        a:hover { color: #e73700; }
        h3 { margin: 0 0 10px; font-size: 28px; line-height: 36px; }
        button { outline: none !important; }

        .game-section { padding: 60px 50px; }
        .game-section .owl-stage { margin: 15px 0; display: flex; }
        .game-section .item {
          margin: 0 15px 60px; width: 320px; height: 400px; display: flex; align-items: flex-end;
          border-radius: 16px; overflow: hidden; position: relative;
          transition: all .4s ease-in-out; cursor: pointer;
        }
        .game-section .item.active { width: 500px; box-shadow: 12px 40px 40px rgba(0,0,0,.25); }
        .game-section .item:after { content: ""; display: block; position: absolute; height: 100%; width: 100%; left: 0; top: 0;
          background-image: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1)); z-index: 1; }
        .game-section .item-desc {
          padding: 0 24px 12px; color: #fff; position: relative; z-index: 2; overflow: hidden;
          transform: translateY(calc(100% - 54px)); transition: all .4s ease-in-out;
        }
        .game-section .item.active .item-desc { transform: none; }
        .game-section .item-desc p { opacity: 0; transform: translateY(32px); transition: all .4s ease-in-out .2s; }
        .game-section .item.active .item-desc p { opacity: 1; transform: translateY(0); }
        .game-section .owl-theme.custom-carousel .owl-dots { margin-top: -20px; position: relative; z-index: 5; }

        @media (min-width: 992px) and (max-width: 1199px) {
          h3 { margin: 0 0 8px; font-size: 24px; line-height: 32px; }
          .game-section { padding: 50px 30px; }
          .game-section .item { margin: 0 12px 60px; width: 260px; height: 360px; }
          .game-section .item.active { width: 400px; }
          .game-section .item-desc { transform: translateY(calc(100% - 46px)); }
        }
        @media (min-width: 768px) and (max-width: 991px) {
          h3 { margin: 0 0 8px; font-size: 24px; line-height: 32px; }
          .game-section { padding: 50px 30px 40px; }
          .game-section .item { margin: 0 12px 60px; width: 240px; height: 330px; }
          .game-section .item.active { width: 360px; }
          .game-section .item-desc { transform: translateY(calc(100% - 42px)); }
        }
        @media (max-width: 767px) {
          body { font-size: 14px; }
          h3 { margin: 0 0 8px; font-size: 19px; line-height: 24px; }
          .game-section { padding: 30px 15px 20px; }
          .game-section .item { margin: 0 10px 40px; width: 200px; height: 280px; }
          .game-section .item.active { width: 270px; box-shadow: 6px 10px 10px rgba(0,0,0,.25); }
          .game-section .item-desc { padding: 0 14px 5px; transform: translateY(calc(100% - 42px)); }
        }
      `}</style>

      {/* === 你的 HTML 結構（改為 JSX）  :contentReference[oaicite:5]{index=5} === */}
      <section className="game-section">
        <div className="owl-carousel custom-carousel owl-theme">
          {images.map((src, i) => (
            <div
              key={src}
              className={i === 0 ? "item active" : "item"}
              style={{ position: "relative" }}
            >
              <Image
                src={src}
                alt={`圖片 ${i + 1}`}
                fill
                className="object-cover"
                priority={i < 3}
                draggable={false}
                style={{ zIndex: 0 }}
              />
              <div className="item-desc">
                <h3>圖片 {i + 1}</h3>
                <p>
                  這是第 {i + 1} 張圖片
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
