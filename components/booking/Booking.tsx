"use client";

import Link from "next/link";
import { getBookingData } from "@/lib/booking";

export default function Booking() {
  const booking = getBookingData();

  return (
    <>
      <section className="relative w-full py-16 bg-[#A4835E]">
        <div className="mx-auto max-w-6xl px-4">
          {/* 使用明確的高度和相對定位，確保容器有高度 */}
          <div
            className="relative w-full overflow-hidden border border-gray-300 bg-black booking-container"
            style={{
              height: "400px", // 移動端固定高度
              minHeight: "400px",
            }}
          >
            {/* 背景圖片 - 確保圖片填滿容器 */}
            <img
              src={booking.image}
              alt={booking.title}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ zIndex: 1 }}
              loading="lazy"
              decoding="async"
            />

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

        {/* 響應式樣式 - 桌面端使用不同高度 */}
        <style jsx>{`
          @media (min-width: 768px) {
            .booking-container {
              height: 300px !important;
              min-height: 300px !important;
            }
          }
        `}</style>
      </section>
    </>
  );
}

