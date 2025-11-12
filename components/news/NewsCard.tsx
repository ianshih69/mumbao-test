"use client";

import Image from "next/image";
import Link from "next/link";
import type { NewsItem } from "@/lib/news";

type NewsCardProps = {
  news: NewsItem;
  priority?: boolean;
};

export default function NewsCard({ news, priority = false }: NewsCardProps) {
  return (
    <div
      className="card group relative overflow-visible cursor-pointer outline-none focus:outline-none focus-visible:ring-0"
      tabIndex={0}
      aria-label={news.name}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {/* 圖片本體 */}
      <div className="card-image relative w-full transition-transform duration-300 will-change-transform group-hover:scale-[1.02] group-focus:scale-[1.02] group-focus-within:scale-[1.02] overflow-hidden">
        <Image
          src={news.image}
          alt={news.name}
          className="card-img"
          priority={priority}
          fill
        />

        {/* 反黑遮罩（只在 hover / focus / focus-within 顯示） */}
        <div className="pointer-events-none absolute inset-0 bg-black/45 transition-opacity duration-200 ease-out opacity-0 group-hover:opacity-100 group-focus:opacity-100 group-focus-within:opacity-100" />

        {/* 中央白框 + 文字（覆蓋層內放可點擊的 <a>） */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-200 ease-out opacity-0 group-hover:opacity-100 group-focus:opacity-100 group-focus-within:opacity-100">
          <Link
            href={`/news/${news.id}`}
            aria-label={news.name}
            className="pointer-events-auto border border-white text-white px-5 py-2 md:px-6 md:py-2.5 text-sm md:text-base tracking-widest select-none"
          >
            詳細內容 ＋
          </Link>
        </div>
      </div>

      {/* 圖片外部左下角文字（標題和日期） */}
      <div style={{ marginTop: "6px" }}>
        <div className="text-base md:text-lg font-medium mb-1 text-gray-800">
          {news.title}
        </div>
        <div className="text-sm md:text-base text-gray-600">{news.date}</div>
      </div>
    </div>
  );
}

