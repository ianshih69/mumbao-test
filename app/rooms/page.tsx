"use client";

import RoomCard from "@/components/room/RoomCard";
import { getAllRooms } from "@/lib/room";

export default function RoomsPage() {
  const rooms = getAllRooms();

  return (
    <>
      <main className="rooms-page">
        <div className="rooms-page-container">
          <h1 className="rooms-page-title">房型介紹</h1>
          <p className="rooms-page-subtitle">挑選最適合你的雲朵小窩。</p>
          <div className="rooms-page-grid">
            {rooms.map((r) => (
              <RoomCard
                key={r.slug}
                slug={r.slug}
                title={r.title}
                desc={r.desc}
                image={r.image}
                features={r.features}
              />
            ))}
          </div>
        </div>
      </main>
      <style jsx>{`
        .rooms-page {
          background-color: #ffffff;
          min-height: 100vh;
          padding: 4rem 0;
        }

        @media (min-width: 768px) {
          .rooms-page {
            padding: 6rem 0;
          }
        }

        .rooms-page-container {
          max-width: 72rem;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .rooms-page-title {
          font-size: 2.25rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 1rem 0;
        }

        @media (min-width: 768px) {
          .rooms-page-title {
            font-size: 3rem;
          }
        }

        .rooms-page-subtitle {
          color: #4a4a4a;
          margin: 0 0 2rem 0;
        }

        .rooms-page-grid {
          display: grid;
          gap: 1.5rem;
        }

        @media (min-width: 640px) {
          .rooms-page-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .rooms-page-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </>
  );
}

