"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

// 導入 Swiper 樣式
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// ===== 圖片配置 =====
const IMAGE_CONFIG = {
  basePath: "/images/page3",
  format: "webp",
  count: 5,
} as const;

// ===== 卡片數據配置 =====
const cardData = [
  {
    id: 1,
    name: "慢寶灣臥・世界百大建築",
    title: "慢寶灣臥・世界百大建築",
    date: "2022.11.08",
    image: `${IMAGE_CONFIG.basePath}/page3-1.${IMAGE_CONFIG.format}`,
  },
  {
    id: 2,
    name: "慢寶生日獻禮",
    title: "慢寶生日獻禮",
    date: "2025.08.13",
    image: `${IMAGE_CONFIG.basePath}/page3-2.${IMAGE_CONFIG.format}`,
  },
  {
    id: 3,
    name: "慢寶・晚餐",
    title: "慢寶・晚餐",
    date: "2025.08.01",
    image: `${IMAGE_CONFIG.basePath}/page3-3.${IMAGE_CONFIG.format}`,
  },
  {
    id: 4,
    name: "慢寶，最新消息1",
    title: "慢寶，最新消息1",
    date: "2025.03.15",
    image: `${IMAGE_CONFIG.basePath}/page3-4.${IMAGE_CONFIG.format}`,
  },
  {
    id: 5,
    name: "慢寶，最新消息2",
    title: "慢寶，最新消息2",
    date: "2025.03.10",
    image: `${IMAGE_CONFIG.basePath}/page3-5.${IMAGE_CONFIG.format}`,
  },
];

// ===== 組件 =====
export default function Slider3() {
  return (
    <>
      <div className="slide-container swiper">
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
            {cardData.map((card) => (
              <SwiperSlide key={card.id}>
                <div
                  className="card group relative overflow-visible cursor-pointer outline-none focus:outline-none focus-visible:ring-0"
                  tabIndex={0}
                  aria-label={card.name}
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  {/* 圖片本體 */}
                  <div className="card-image relative w-full transition-transform duration-300 will-change-transform group-hover:scale-[1.02] group-focus:scale-[1.02] group-focus-within:scale-[1.02] overflow-hidden">
                    <Image
                      src={card.image}
                      alt={card.name}
                      className="card-img"
                      priority={card.id <= 2}
                      fill
                    />

                    {/* 反黑遮罩（只在 hover / focus / focus-within 顯示） */}
                    <div className="pointer-events-none absolute inset-0 bg-black/45 transition-opacity duration-200 ease-out opacity-0 group-hover:opacity-100 group-focus:opacity-100 group-focus-within:opacity-100" />

                    {/* 中央白框 + 文字（覆蓋層內放可點擊的 <a>） */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-200 ease-out opacity-0 group-hover:opacity-100 group-focus:opacity-100 group-focus-within:opacity-100">
                      <a
                        href="#"
                        aria-label={card.name}
                        className="pointer-events-auto border border-white text-white px-5 py-2 md:px-6 md:py-2.5 text-sm md:text-base tracking-widest select-none"
                      >
                        詳細內容 ＋
                      </a>
                    </div>
                  </div>

                  {/* 圖片外部左下角文字（標題和日期） */}
                  <div style={{ marginTop: "6px" }}>
                    <div className="text-base md:text-lg font-medium mb-1 text-gray-800">
                      {card.title}
                    </div>
                    <div className="text-sm md:text-base text-gray-600">
                      {card.date}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="swiper-button-next swiper-navBtn"></div>
        <div className="swiper-button-prev swiper-navBtn"></div>
        <div className="swiper-pagination"></div>
      </div>

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
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #EFEFEF;
        }

        .slide-container {
          position: relative;
          max-width: 1120px;
          width: 100%;
          padding: 40px 0;
        }

        .slide-content { 
          margin: 0 40px;
          overflow: hidden;
          border-radius: 0;
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

        .slide-container .swiper-pagination {
          position: absolute !important;
          top: 20px !important;
          bottom: auto !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          z-index: 10 !important;
          width: auto !important;
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

