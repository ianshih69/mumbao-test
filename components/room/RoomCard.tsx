"use client";

import Image from "next/image";
import Link from "next/link";

type RoomCardProps = {
  slug: string;
  title: string;
  desc: string;
  image: string;
  features?: string[];
};

export default function RoomCard({ slug, title, desc, image, features = [] }: RoomCardProps) {
  return (
    <>
      <div className="room-card">
        <div className="room-card-image-wrapper">
          <Image src={image} alt={title} fill className="room-card-image" />
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
          background-color: #f5f5f5;
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

