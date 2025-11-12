"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import NewsCard from "./NewsCard";
import { getAllNews } from "@/lib/news";

// 導入 Swiper 樣式
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function NewsList() {
  const [showAllImages, setShowAllImages] = useState(false);
  const newsList = getAllNews();

  return (
    <>
      <div className="slide-container swiper">
        {/* 「最新消息」文字（在分頁原點正上方） */}
        <div className="latest-news-title">
          <div className="text-xl md:text-3xl text-gray-800">最新消息</div>
        </div>

        {/* 分頁原點（在圖片上方） */}
        <div className="swiper-pagination"></div>

        <div className="slide-content">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={25}
            slidesPerView={3}
            loop={true}
            grabCursor={true}
            centeredSlides={false}
            centeredSlidesBounds={false}
            pagination={{
              el: ".swiper-pagination",
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            breakpoints={{
              0: {
                slidesPerView: 1,
                centeredSlides: false,
                centeredSlidesBounds: false,
              },
              640: {
                slidesPerView: 2,
                centeredSlides: false,
                centeredSlidesBounds: false,
              },
              1024: {
                slidesPerView: 3,
                centeredSlides: false,
                centeredSlidesBounds: false,
              },
            }}
          >
            {newsList.map((news) => (
              <SwiperSlide key={news.id}>
                <NewsCard news={news} priority={news.id <= 2} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="swiper-button-next swiper-navBtn"></div>
        <div className="swiper-button-prev swiper-navBtn"></div>

        {/* 中央下方「更多 +」按鈕（只有一個） */}
        <div className="flex justify-center" style={{ marginTop: "calc(1rem + 20px)" }}>
          <button
            onClick={() => setShowAllImages(true)}
            className="text-gray-700 hover:text-gray-900 text-base md:text-lg transition-colors"
            aria-label="查看更多圖片"
          >
            更多 +
          </button>
        </div>
      </div>

      {/* 顯示所有圖片的模態框 */}
      {showAllImages && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowAllImages(false)}
        >
          <div
            className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">所有圖片</h2>
              <button
                onClick={() => setShowAllImages(false)}
                className="text-gray-600 hover:text-gray-800 text-2xl"
                aria-label="關閉"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsList.map((news) => (
                <div key={news.id} className="group relative overflow-hidden">
                  <div
                    className="relative w-full aspect-ratio: 314 / 367 overflow-hidden"
                    style={{ aspectRatio: "314 / 367" }}
                  >
                    <Image
                      src={news.image}
                      alt={news.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div style={{ marginTop: "6px" }}>
                    <div className="text-base font-medium mb-1 text-gray-800">
                      {news.title}
                    </div>
                    <div className="text-sm text-gray-600">{news.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== 所有樣式都在這裡 ===== */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
        }

        body {
          background-color: #EFEFEF;
        }

        .slide-container {
          position: relative;
          max-width: 1120px;
          width: 100%;
          padding: 120px 0 40px 0;
        }

        .slide-content { 
          margin: 0 40px;
          overflow: hidden;
          border-radius: 0;
          position: relative;
          margin-top: 20px;
        }

        .card {
          border-radius: 0;
          background-color: transparent;
          width: 100%;
          display: flex;
          flex-direction: column;
        }

        .card:focus {
          outline: none;
        }

        .card-image {
          position: relative;
          width: 100%;
          aspect-ratio: 314 / 367;
          overflow: hidden;
        }

        /* 單張顯示時限制最大寬度 */
        @media screen and (max-width: 639px) {
          .swiper-slide {
            width: 100% !important;
          }
          .card {
            max-width: 80vw;
            margin: 0 auto;
          }
        }

        .card-image .card-img {
          object-fit: cover;
          border-radius: 0;
        }

        .swiper-navBtn {
          color: #6E93F7 !important;
          transition: all .3s ease;
        }

        .swiper-navBtn:hover { 
          color: #4070F4 !important; 
        }

        .swiper-navBtn::before, .swiper-navBtn::after { 
          font-size: 40px !important; 
        }

        .swiper-button-next { 
          right: 0 !important; 
        }

        .swiper-button-prev { 
          left: 0 !important; 
        }

        .slide-container .latest-news-title {
          position: absolute !important;
          top: 20px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          z-index: 20 !important;
        }

        .slide-container .latest-news-title > div {
          letter-spacing: 5px !important;
        }

        .slide-container .swiper-pagination {
          position: absolute !important;
          top: 100px !important;
          bottom: auto !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          z-index: 20 !important;
          width: auto !important;
          margin-top: 0 !important;
          pointer-events: auto !important;
        }

        .swiper-pagination-bullet { 
          background-color: #6E93F7 !important; 
          opacity: 1 !important; 
        }

        .swiper-pagination-bullet-active { 
          background-color: #4070F4 !important; 
        }

        @media screen and (max-width: 768px) {
          .slide-content { 
            margin: 0 10px; 
          }
          .swiper-navBtn { 
            display: none !important; 
          }
        }
      `}</style>
    </>
  );
}

