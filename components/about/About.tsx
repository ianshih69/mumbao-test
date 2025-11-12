"use client";

import Image from "next/image";
import Link from "next/link";
import { getAboutData } from "@/lib/about";

export default function About() {
  const about = getAboutData();

  return (
    <>
      <section className="about-section">
        <div className="about-container">
          <div className="about-image-wrapper">
            <Image
              src={about.image}
              alt={about.title}
              fill
              className="about-image"
              priority
            />
          </div>
          <div className="about-content">
            <h2 className="about-title">{about.title}</h2>
            <div className="about-text">
              {about.content.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            <Link href={about.moreLink} className="about-more">
              更多
            </Link>
          </div>
        </div>
      </section>
      <style jsx>{`
        .about-section {
          width: 100%;
          padding: 80px 0;
          background-color: #ffffff;
        }

        .about-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
          display: flex;
          gap: 60px;
          align-items: flex-start;
        }

        .about-image-wrapper {
          position: relative;
          width: 50%;
          aspect-ratio: 4 / 3;
          flex-shrink: 0;
          overflow: hidden;
        }

        .about-image {
          object-fit: cover;
          width: 100%;
          height: 100%;
        }

        .about-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .about-title {
          font-size: 2rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
        }

        .about-text {
          font-size: 1rem;
          line-height: 1.8;
          color: #4a4a4a;
        }

        .about-text p {
          margin: 0 0 1.5em 0;
        }

        .about-text p:last-child {
          margin-bottom: 0;
        }

        .about-more {
          display: inline-block;
          font-size: 1rem;
          color: #4070f4;
          text-decoration: none;
          transition: color 0.3s ease;
          margin-top: 8px;
        }

        .about-more:hover {
          color: #6e93f7;
          text-decoration: underline;
        }

        /* 平板電腦 */
        @media screen and (max-width: 1024px) {
          .about-container {
            gap: 40px;
            padding: 0 30px;
          }

          .about-image-wrapper {
            width: 45%;
          }

          .about-title {
            font-size: 1.75rem;
          }
        }

        /* 手機端 */
        @media screen and (max-width: 768px) {
          .about-section {
            padding: 60px 0;
          }

          .about-container {
            flex-direction: column;
            gap: 30px;
            padding: 0 20px;
          }

          .about-image-wrapper {
            width: 100%;
            aspect-ratio: 16 / 9;
          }

          .about-title {
            font-size: 1.5rem;
          }

          .about-text {
            font-size: 0.95rem;
            line-height: 1.7;
          }
        }
      `}</style>
    </>
  );
}

