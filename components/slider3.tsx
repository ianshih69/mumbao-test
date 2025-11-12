"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

// 導入 Swiper 樣式
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// ===== 卡片數據配置 =====
const cardData = [
  {
    id: 1,
    name: "Alanna Dell",
    description: "She likes pancakes served with maple syrup, fresh fruit, or whipped cream",
    image: "https://i.postimg.cc/KYPG5YD5/profile1.jpg",
  },
  {
    id: 2,
    name: "Alan Doe",
    description: "She likes layers of yogurt, granola, and fresh berries",
    image: "https://i.postimg.cc/mg0qgNMd/profile2.jpg",
  },
  {
    id: 3,
    name: "Jordan Lee",
    description: "He likes a thick smoothie topped with granola, seeds, and fresh fruit",
    image: "https://i.postimg.cc/rsnZXSMN/profile3.jpg",
  },
  {
    id: 4,
    name: "Adam Murphy",
    description: "He likes scrambled eggs, crispy bacon, and toast",
    image: "https://i.postimg.cc/wv9w1WBk/profile4.jpg",
  },
  {
    id: 5,
    name: "Billy Henry",
    description: "He likes tortilla filled with scrambled eggs, cheese, beans, and salsa",
    image: "https://i.postimg.cc/bYtT9DGn/profile5.jpg",
  },
  {
    id: 6,
    name: "Jessica Miller",
    description: "She likes oatmeal topped with fruits, nuts, or honey for added flavor",
    image: "https://i.postimg.cc/7Zxn4KK1/profile6.jpg",
  },
  {
    id: 7,
    name: "Daniel Lewis",
    description: "He likes poached eggs in an English muffin with ham and hollandaise sauce",
    image: "https://i.postimg.cc/5tQYWvWq/profile7.jpg",
  },
  {
    id: 8,
    name: "Emily Rock",
    description: "She likes chia seeds soaked in milk and topped with fruits",
    image: "https://i.postimg.cc/Hkydptjx/profile8.jpg",
  },
  {
    id: 9,
    name: "John Doe",
    description: "He likes bread with eggs and milk, fried with syrup and powdered sugar",
    image: "https://i.postimg.cc/4xVRCNFH/profile9.jpg",
  },
] as const;

// ===== 組件 =====
export default function Slider3() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <>
      <div className="slide-container swiper">
        <div className="slide-content">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={25}
            slidesPerView={3}
            loop={true}
            centeredSlides={true}
            grabCursor={true}
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
              },
              520: {
                slidesPerView: 2,
              },
              950: {
                slidesPerView: 3,
              },
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
          >
            {cardData.map((card) => (
              <SwiperSlide key={card.id}>
                <div className="card">
                  <div className="image-content">
                    <span className="overlay"></span>
                    <div className="card-image">
                      <Image
                        src={card.image}
                        alt={card.name}
                        width={150}
                        height={150}
                        className="card-img"
                        priority={card.id <= 3}
                      />
                    </div>
                  </div>

                  <div className="card-content">
                    <h2 className="name">{card.name}</h2>
                    <p className="description">{card.description}</p>
                    <button className="button">View More</button>
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
          max-width: 1120px;
          width: 100%;
          padding: 40px 0;
        }

        .slide-content { 
          margin: 0 40px;
          overflow: hidden;
          border-radius: 25px;
        }

        .card {
          border-radius: 25px;
          background-color: #FFFFFF;
        }

        .image-content, .card-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px 14px;
        }

        .image-content { 
          row-gap: 5px; 
          position: relative;
          padding: 25px 0;
        }

        .overlay {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 100%;
          background-color: #4070F4;
          border-radius: 25px 25px 0 25px;
        }

        .overlay::before, .overlay::after {
          content: '';
          position: absolute;
          right: 0;
          bottom: -40px;
          height: 40px;
          width: 40px;
          background-color: #4070F4;
        }

        .overlay::after {
          border-radius: 0 25px 0 0;
          background-color: #FFFFFF;
        }

        .card-image {
          position: relative;
          height: 150px;
          width: 150px;
          border-radius: 50%;
          background: #FFFFFF;
          padding: 3px;
        }

        .card-image .card-img {
          height: 100%;
          width: 100%;
          object-fit: cover;
          border-radius: 50%;
          border: 4px solid #4070F4;
        }

        .name {
          font-size: 18px;
          font-weight: 500;
          color: #333333;
        }

        .description {
          font-size: 14px;
          color: #707070;
          text-align: center;
        }

        .button {
          border: none;
          font-size: 16px;
          color: #FFFFFF;
          padding: 8px 16px;
          background-color: #4070F4;
          border-radius: 6px;
          margin: 14px;
          cursor: pointer;
          transition: all .3s ease;
        }

        .button:hover { 
          background: #265DF2; 
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

