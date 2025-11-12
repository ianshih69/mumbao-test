"use client";

import { getAboutData } from "@/lib/about";
import Image from "next/image";

export default function AboutPage() {
  const about = getAboutData();

  return (
    <>
      <div className="about-page">
        <div className="about-page-container">
          <div className="about-page-image-wrapper">
            <Image
              src={about.image}
              alt={about.title}
              fill
              className="about-page-image"
              priority
              sizes="100vw"
            />
          </div>
          <div className="about-page-content">
            <h1 className="about-page-title">{about.title}</h1>
            <div className="about-page-text">
              {about.content.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .about-page {
          width: 100%;
          min-height: 100vh;
          padding: 80px 0;
          background-color: #ffffff;
        }

        .about-page-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
        }

        .about-page-image-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          margin-bottom: 60px;
          overflow: hidden;
        }

        .about-page-image {
          object-fit: cover;
          width: 100%;
          height: 100%;
        }

        .about-page-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .about-page-title {
          font-size: 2.5rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 40px 0;
        }

        .about-page-text {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #4a4a4a;
        }

        .about-page-text p {
          margin: 0 0 1.5em 0;
        }

        .about-page-text p:last-child {
          margin-bottom: 0;
        }

        @media screen and (max-width: 768px) {
          .about-page {
            padding: 60px 0;
          }

          .about-page-container {
            padding: 0 20px;
          }

          .about-page-image-wrapper {
            margin-bottom: 40px;
          }

          .about-page-title {
            font-size: 2rem;
            margin-bottom: 30px;
          }

          .about-page-text {
            font-size: 1rem;
          }
        }
      `}</style>
    </>
  );
}

