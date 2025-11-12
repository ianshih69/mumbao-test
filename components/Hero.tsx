"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// ===== 圖片配置 =====
const HERO_IMAGES = [
  {
    id: 1,
    src: "/images/Hero/page1-1.webp",
    alt: "Hero Image 1",
  },
  {
    id: 2,
    src: "/images/Hero/page1-2.webp",
    alt: "Hero Image 2",
  },
  {
    id: 3,
    src: "/images/Hero/page1-3.webp",
    alt: "Hero Image 3",
  },
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // 每 5 秒切換下一張圖片
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % HERO_IMAGES.length;
        return nextIndex;
      });
    }, 5000);

    // 清理定時器
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-container relative w-full h-screen overflow-hidden">
      {HERO_IMAGES.map((image, index) => (
        <Image
          key={image.id}
          src={image.src}
          alt={image.alt}
          fill
          priority={index === 0}
          className={`object-cover transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0 absolute"
          }`}
        />
      ))}
    </div>
  );
}
