"use client";

import { useEffect, useRef, useMemo } from "react";
import Script from "next/script";
import Image from "next/image";

export default function CodepenCarousel() {
  const images = useMemo(
    () => [1, 2, 3, 4, 5].map((n) => `/images/page3/page3-${n}.webp`),
    []
  );
  const initialized = useRef(false);

  useEffect(() => {
    const tryInit = () => {
      if (initialized.current) return;
      const $: any = (window as any).jQuery || (window as any).$;
      if ($ && $.fn && $.fn.owlCarousel) {
        // === JS 取自 main.js:contentReference[oaicite:3]{index=3}===
        const $owl = $(".loop");
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
        initialized.current = true;
      }
    };
    const id = setInterval(tryInit, 150);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* === 外部套件 === */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.2.0/assets/owl.carousel.min.css"
      />
      <Script src="https://code.jquery.com/jquery-3.6.0.min.js" strategy="afterInteractive" />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.2.0/owl.carousel.min.js"
        strategy="afterInteractive"
      />

      {/* === 內嵌 CSS（取自 styles.css）:contentReference[oaicite:4]{index=4} === */}
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
          align-items: flex-end;
          height: 19em;
          padding: 1em;
          margin: 1em 0;
          border-radius: 4px;
          opacity: 0.7;
          transform: scale(0.87);
          transition: transform 0.4s 0.5s ease-out, opacity 1s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
          position: relative;
        }
        .active .card {
          box-shadow: 0 0px 1em rgba(0, 0, 0, 0.2);
          transform: box-shadow 0.3s ease, transform 0.1s 0.4s ease-in, opacity 0.4s ease;
        }
        .card__content {
          display: flex;
          align-items: center;
          text-align: center;
          color: #fff;
          opacity: 1;
          position: relative;
          z-index: 2;
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


        .owl-theme .owl-dots .owl-dot span {
          width: 4em;
          height: 4px;
          margin: 0 0.5em;
          background: #d6d6d6;
          display: block;
          -webkit-backface-visibility: visible;
          transition: opacity 0.2s ease;
          border-radius: 0;
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
      `}</style>

      {/* === HTML 結構 (取自 index.html):contentReference[oaicite:5]{index=5} === */}
      <section className="cards">
        <div className="owl-wrapper">
          <div className="loop owl-carousel owl-theme">
            {images.map((src, i) => (
              <article key={src} className="card" style={{ position: "relative", overflow: "hidden" }}>
                <Image
                  src={src}
                  alt={`圖片 ${i + 1}`}
                  fill
                  className="object-cover"
                  priority={i < 3}
                  draggable={false}
                  style={{ zIndex: 0 }}
                />
                <div className="card__content">
                  <h4 className="card__title">
                    <span>圖片 {i + 1}</span>
                  </h4>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
