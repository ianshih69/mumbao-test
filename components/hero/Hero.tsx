"use client";

import { useEffect, useState } from "react";
import { getCurrentHeroImage } from "@/lib/hero";

export default function Hero() {
  const [imageRatio, setImageRatio] = useState<number | null>(null);
  const currentImage = getCurrentHeroImage();

  useEffect(() => {
    // 動態獲取圖片尺寸
    const img = new Image();
    img.src = currentImage.src;
    img.onload = () => {
      const ratio = img.height / img.width;
      // 高度增加50%，所以比例也要增加50%
      setImageRatio(ratio * 1.5);
    };
  }, [currentImage.src]);

  return (
    <>
      <div
        className="hero-container"
        role="img"
        aria-label={currentImage.alt}
        style={{
          ...(imageRatio
            ? {
                "--img-ratio": imageRatio.toString(),
              }
            : {}),
        } as React.CSSProperties}
      ></div>
      <style jsx>{`
        .hero-container {
          position: relative;
          width: 100%;
          height: 100dvh;
          min-height: 100vh;
          overflow: hidden;
          display: block;
          background-image: url('${currentImage.src}');
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
          background-attachment: scroll;
        }
        @supports not (height: 100dvh) {
          .hero-container {
            height: 100vh;
          }
        }
        /* 手機端和平板電腦端：使用圖片比例來設置容器高度，完整顯示圖片 */
        @media screen and (max-width: 1024px) {
          .hero-container {
            height: auto;
            min-height: 100dvh;
          }
          /* 如果已獲取圖片比例，使用 aspect-ratio 讓容器比例與圖片匹配 */
          .hero-container {
            aspect-ratio: 1 / var(--img-ratio, 1.5);
            height: auto;
            min-height: 0;
            background-size: 100% 100%;
          }
        }
        /* 橫向手機和平板保持全屏 */
        @media screen and (max-width: 1024px) and (orientation: landscape) {
          .hero-container {
            height: 100dvh !important;
            min-height: 100vh !important;
            aspect-ratio: unset !important;
          }
        }
      `}</style>
    </>
  );
}

