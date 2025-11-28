"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

type RoomCardProps = {
  slug: string;
  title: string;
  desc: string;
  image: string;
  features?: string[];
  priority?: boolean;
};

export default function RoomCard({ slug, title, desc, image, features = [], priority = false }: RoomCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  // 檢查圖片是否已在快取中
  useEffect(() => {
    const img = document.createElement('img');
    img.onload = () => {
      setImageLoaded(true);
    };
    img.onerror = () => {
      // 即使載入失敗也標記為已載入，避免永遠不顯示
      setImageLoaded(true);
    };
    
    // 如果圖片已經在快取中，立即標記為已載入
    if (img.complete && img.naturalWidth > 0) {
      setImageLoaded(true);
    } else {
      img.src = image;
    }
  }, [image]);

  return (
    <>
      <div className="room-card">
        <div 
          className="room-card-image-wrapper"
          style={{
            backgroundColor: imageLoaded ? "transparent" : "#f5f5f5",
            transition: "background-color 0.2s ease-in-out",
          }}
        >
          <Image 
            src={image} 
            alt={title} 
            fill 
            className="room-card-image"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            onLoadingComplete={() => setImageLoaded(true)}
            style={{
              opacity: imageLoaded ? 1 : 0,
              transition: "opacity 0.2s ease-in-out",
            }}
          />
          <div className="room-card-gradient" />
        </div>
        <div className="room-card-content">
          <h3 className="room-card-title">{title}</h3>
          <p className="room-card-desc">{desc}</p>
          {features.length > 0 && (
            <div className="room-card-features">
              {features.map((f) => (
                <span key={f} className="room-card-feature-tag">
                  {f}
                </span>
              ))}
            </div>
          )}
          <Link href={`/rooms/${slug}`} className="room-card-link">
            查看房型 →
          </Link>
        </div>
      </div>
      <style jsx>{`
        .room-card {
          border-radius: 1.5rem;
          border: 1px solid rgba(0, 0, 0, 0.1);
          background-color: #ffffff;
          overflow: hidden;
          box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03);
          transition: box-shadow 0.3s ease;
        }

        .room-card:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .room-card-image-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
        }

        .room-card-image {
          object-fit: cover;
        }

        .room-card-gradient {
          pointer-events: none;
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(255, 255, 255, 0.4), transparent);
        }

        .room-card-content {
          padding: 1rem;
        }

        .room-card-title {
          font-weight: 500;
          letter-spacing: 0.025em;
          color: #1a1a1a;
          margin: 0;
        }

        .room-card-desc {
          font-size: 0.875rem;
          margin-top: 0.25rem;
          color: #4a4a4a;
        }

        .room-card-features {
          margin-top: 0.75rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .room-card-feature-tag {
          border-radius: 9999px;
          padding: 0.25rem 0.625rem;
          font-size: 0.75rem;
          background-color: #f5f5f5;
          color: #4a4a4a;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .room-card-link {
          display: inline-block;
          margin-top: 1rem;
          font-size: 0.875rem;
          color: #4070f4;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .room-card:hover .room-card-link {
          text-decoration: underline;
        }
      `}</style>
    </>
  );
}

