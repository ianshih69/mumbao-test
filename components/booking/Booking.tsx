"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBookingData } from "@/lib/booking";

export default function Booking() {
  const booking = getBookingData();
  const [imageRatio, setImageRatio] = useState<number | null>(null);

  useEffect(() => {
    // 動態獲取圖片尺寸
    const img = new Image();
    img.src = booking.image;
    img.onload = () => {
      const ratio = img.height / img.width;
      // 高度增加50%，所以比例也要增加50%
      setImageRatio(ratio * 1.5);
    };
  }, [booking.image]);

  return (
    <>
      <section className="relative w-full py-16 bg-[#A4835E]">
        <div className="booking-section-container">
          {/* 使用明確的高度和相對定位，確保容器有高度 */}
          {/* 桌面端：對齊 Room 頁面的圖片區域，使用 calc(100% + 1.5rem) */}
          <div
            className="booking-image-wrapper"
            style={{
              ...(imageRatio
                ? {
                    "--img-ratio": imageRatio.toString(),
                  }
                : {}),
            } as React.CSSProperties}
          >
            {/* 深色半透明遮罩 */}
            <div
              className="absolute inset-0 bg-black"
              style={{
                opacity: 0.4,
                zIndex: 2,
              }}
            ></div>

            {/* 中間內容：文字和按鈕 - 確保在最上層 */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center"
              style={{ zIndex: 3 }}
            >
              {/* 上方文字：預定您的假期 */}
              <h2
                className="text-white font-normal mb-6 md:mb-8"
                style={{
                  fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
                  textAlign: "center",
                }}
              >
                {booking.title}
              </h2>

              {/* 按鈕：白色邊框，半透明背景，左邊日曆圖標，右邊文字 */}
              <Link
                href={booking.buttonLink}
                className="inline-flex items-center gap-3 border border-white px-6 py-3 md:px-8 md:py-4 transition-colors"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(4px)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                }}
              >
                {/* 日曆圖標 */}
                <svg
                  className="text-white"
                  style={{ width: "24px", height: "24px" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {/* 按鈕文字 */}
                <span
                  className="text-white tracking-widest"
                  style={{
                    fontSize: "clamp(0.875rem, 2vw, 1rem)",
                  }}
                >
                  {booking.buttonText}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <style jsx>{`
        .booking-section-container {
          max-width: 72rem;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .booking-image-wrapper {
          position: relative;
          width: 100%;
          height: 400px;
          min-height: 400px;
          overflow: hidden;
          border: 1px solid rgba(209, 213, 219, 1);
          background-color: rgba(0, 0, 0, 1);
          background-image: url('${booking.image}');
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
        }

        @media (min-width: 768px) {
          .booking-section-container {
            padding: 0 1rem;
          }
          .booking-image-wrapper {
            width: calc(100% + 1.5rem);
            height: 300px;
            min-height: 300px;
            margin-left: -1rem;
          }
        }

        /* 手機端和平板電腦端：使用圖片比例來設置容器高度，完整顯示圖片 */
        @media screen and (max-width: 1024px) {
          .booking-image-wrapper {
            height: auto;
            min-height: 400px;
          }
          /* 如果已獲取圖片比例，使用 aspect-ratio 讓容器比例與圖片匹配 */
          .booking-image-wrapper {
            aspect-ratio: 1 / var(--img-ratio, 1.5);
            height: auto;
            min-height: 0;
            background-size: 100% 100%;
          }
        }

        /* 橫向手機和平板保持固定高度 */
        @media screen and (max-width: 1024px) and (orientation: landscape) {
          .booking-image-wrapper {
            height: 400px !important;
            min-height: 400px !important;
            aspect-ratio: unset !important;
            background-size: cover !important;
          }
        }
      `}</style>
    </>
  );
}

