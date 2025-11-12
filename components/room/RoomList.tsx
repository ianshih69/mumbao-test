"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { roomImageGroups } from "@/lib/room";

export default function RoomList() {
  const [idx, setIdx] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchCurrentX = useRef<number | null>(null);
  const isDragging = useRef(false);

  const restartTimer = () => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      setIdx((i) => (i + 1) % roomImageGroups.length);
    }, 3000);
  };

  useEffect(() => {
    restartTimer();
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  const goToPage = (pageIdx: number) => {
    setIdx(pageIdx);
    restartTimer();
  };

  const goPrev = () => {
    setIdx((i) => (i - 1 + roomImageGroups.length) % roomImageGroups.length);
    restartTimer();
  };

  const goNext = () => {
    setIdx((i) => (i + 1) % roomImageGroups.length);
    restartTimer();
  };

  // 觸控滑動處理
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchCurrentX.current = e.touches[0].clientX;
    isDragging.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = touchStartX.current - currentX;
    const deltaY = touchStartY.current - currentY;

    if (isDragging.current) {
      e.preventDefault();
      touchCurrentX.current = currentX;
      return;
    }

    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 10) {
      return;
    }

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      isDragging.current = true;
      e.preventDefault();
      touchCurrentX.current = currentX;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchStartX.current - touchEndX;
    const deltaY = touchStartY.current - touchEndY;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        goPrev();
      } else {
        goNext();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
    touchCurrentX.current = null;
    isDragging.current = false;
  };

  return (
    <>
      <section className="room-list-section">
        <div className="room-list-container">
          {/* 桌面端標題列：上左圓圈、上中標題、上右更多連結 */}
          <div className="room-list-header-desktop">
            {/* 上左：4個圓圈分頁指示器 */}
            <div className="room-list-dots">
              {roomImageGroups.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goToPage(i)}
                  aria-label={`切換到第 ${i + 1} 頁`}
                  className={`room-list-dot ${i === idx ? "room-list-dot-active" : ""}`}
                />
              ))}
            </div>

            {/* 上中：房型標題（絕對居中） */}
            <h2 className="room-list-title-center">房型</h2>

            {/* 上右：更多+連結 */}
            <Link href="/rooms" className="room-list-more-link">
              更多 ＋
            </Link>
          </div>

          {/* 移動端：房型標題、四個點置中 */}
          <div className="room-list-header-mobile">
            <h2 className="room-list-title-mobile">房型</h2>
            <div className="room-list-dots-mobile">
              {roomImageGroups.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goToPage(i)}
                  aria-label={`切換到第 ${i + 1} 頁`}
                  className={`room-list-dot ${i === idx ? "room-list-dot-active" : ""}`}
                />
              ))}
            </div>
          </div>

          {/* 兩欄圖片 */}
          <div
            className="room-list-grid"
            style={{ touchAction: "pan-y" }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Left image: 3:4 直式 */}
            <div className="room-list-image-left">
              {roomImageGroups.map((g, i) => (
                <img
                  key={`left-${i}`}
                  src={g.left}
                  alt={`房型圖片 ${i + 1} - 左`}
                  loading={i === idx ? "eager" : "lazy"}
                  decoding="async"
                  className={`room-list-image ${i === idx ? "room-list-image-active" : ""}`}
                />
              ))}
            </div>

            {/* Right image: 5:3 橫式 */}
            <div className="room-list-image-right">
              {roomImageGroups.map((g, i) => (
                <img
                  key={`right-${i}`}
                  src={g.right}
                  alt={`房型圖片 ${i + 1} - 右`}
                  loading={i === idx ? "eager" : "lazy"}
                  decoding="async"
                  className={`room-list-image ${i === idx ? "room-list-image-active" : ""}`}
                />
              ))}
            </div>
          </div>

          {/* 移動端：更多+連結在第二張圖下方，置中 */}
          <div className="room-list-more-mobile">
            <Link href="/rooms" className="room-list-more-link-mobile">
              更多 ＋
            </Link>
          </div>
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
          background-color: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .room-list-dot:hover {
          background-color: rgba(255, 255, 255, 0.6);
        }

        .room-list-dot-active {
          background-color: white;
          transform: scale(1.25);
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
          color: white;
          text-decoration: none;
          font-size: 1rem;
          transition: opacity 0.3s ease;
        }

        .room-list-more-link:hover {
          opacity: 0.8;
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

        .room-list-dots-mobile {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.375rem;
          margin-top: 0.625rem;
        }

        /* 圖片網格 */
        .room-list-grid {
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: 3fr 4fr;
          gap: 0.75rem;
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
          aspect-ratio: 5 / 3;
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.1);
          background-color: rgba(0, 0, 0, 0.1);
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
          transition: opacity 0.3s ease;
        }

        .room-list-image-active {
          opacity: 1;
        }

        .room-list-image:not(.room-list-image-active) {
          opacity: 0;
        }

        /* 桌面端左圖移除 aspect ratio */
        @media (min-width: 768px) {
          .room-list-image-left {
            aspect-ratio: unset !important;
            height: 100% !important;
          }
        }

        /* 移動端更多連結 */
        .room-list-more-mobile {
          display: flex;
          justify-content: center;
          margin-top: 0.625rem;
        }

        @media (min-width: 768px) {
          .room-list-more-mobile {
            display: none;
          }
        }

        .room-list-more-link-mobile {
          color: white;
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

