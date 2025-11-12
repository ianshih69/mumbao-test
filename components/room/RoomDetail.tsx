"use client";

import Image from "next/image";
import Link from "next/link";
import type { Room } from "@/lib/room";

type RoomDetailProps = {
  room: Room;
};

export default function RoomDetail({ room }: RoomDetailProps) {
  return (
    <>
      <div className="room-detail">
        <div className="room-detail-container">
          <div className="room-detail-image-wrapper">
            <Image
              src={room.image}
              alt={room.title}
              fill
              className="room-detail-image"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="room-detail-content">
            <h1 className="room-detail-title">{room.title}</h1>
            <p className="room-detail-desc">{room.desc}</p>

            {room.features?.length ? (
              <div className="room-detail-features">
                {room.features.map((f) => (
                  <span key={f} className="room-detail-feature-tag">
                    {f}
                  </span>
                ))}
              </div>
            ) : null}

            <Link href="#booking" className="room-detail-booking-btn">
              預約此房型
            </Link>
          </div>
        </div>
      </div>
      <style jsx>{`
        .room-detail {
          max-width: 72rem;
          margin: 0 auto;
          padding: 2.5rem 1rem;
        }

        .room-detail-container {
          display: grid;
          gap: 2rem;
          align-items: start;
        }

        @media (min-width: 768px) {
          .room-detail-container {
            grid-template-columns: 1fr 1fr;
          }
        }

        .room-detail-image-wrapper {
          position: relative;
          aspect-ratio: 4 / 3;
          border-radius: 2rem;
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.1);
          background-color: #f5f5f5;
        }

        .room-detail-image {
          object-fit: cover;
        }

        .room-detail-content {
          display: flex;
          flex-direction: column;
        }

        .room-detail-title {
          font-size: 1.875rem;
          font-weight: 600;
          letter-spacing: 0.025em;
          color: #1a1a1a;
          margin: 0;
        }

        .room-detail-desc {
          margin-top: 0.75rem;
          color: #4a4a4a;
        }

        .room-detail-features {
          margin-top: 1.5rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .room-detail-feature-tag {
          border-radius: 9999px;
          padding: 0.25rem 0.75rem;
          font-size: 0.75rem;
          background-color: #f5f5f5;
          color: #4a4a4a;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .room-detail-booking-btn {
          margin-top: 2rem;
          display: inline-block;
          border-radius: 9999px;
          padding: 0.5rem 1.25rem;
          background-color: #4070f4;
          color: white;
          text-decoration: none;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(0, 0, 0, 0.1);
          transition: background-color 0.3s ease;
        }

        .room-detail-booking-btn:hover {
          background-color: #6e93f7;
        }
      `}</style>
    </>
  );
}

