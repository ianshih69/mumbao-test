"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <div className="hero-container relative w-full h-screen overflow-hidden">
      <Image
        src="/images/Hero/page1-1.webp"
        alt="Hero Image"
        fill
        priority
        className="object-cover"
      />
    </div>
  );
}
