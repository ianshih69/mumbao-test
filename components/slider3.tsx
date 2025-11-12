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
const cardData = Array.from({ length: IMAGE_CONFIG.count }, (_, index) => {
  const num = index + 1;
  return {
    id: num,
    name: `房客 ${num}`,
    description: `這是第 ${num} 張房客介紹卡片`,
    image: `${IMAGE_CONFIG.basePath}/page3-${num}.${IMAGE_CONFIG.format}`,
  };
});

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
                <div className="card">
                  <div className="card-image">
                    <Image
                      src={card.image}
                      alt={card.name}
                      className="card-img"
                      priority={card.id <= 2}
                      fill
                    />
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
          height: 100%;
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

