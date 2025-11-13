"use client";

import Link from "next/link";
import { getFooterData, getSocialImagePath } from "@/lib/footer";

export default function Footer() {
  const footer = getFooterData();

  return (
    <>
      <footer className="footer-section">
        <div className="footer-container">
          {/* 桌面端：原本的排版 */}
          <div className="footer-desktop">
            {/* 第一行：聯絡資訊 */}
            <div className="footer-contact">
              <span>TEL: {footer.phone}</span>
              <span className="footer-separator">|</span>
              <span>ADD. : {footer.address}</span>
              <span className="footer-separator">|</span>
              <span>統編: {footer.taxId}</span>
            </div>

            {/* 第二行：社群媒體 */}
            <div className="footer-social">
              <span className="footer-social-label">Follow us on:</span>
              <Link
                href={footer.socialLinks.threads}
                className="footer-social-link"
                aria-label="Threads"
                style={{ marginLeft: "5px", marginRight: "5px" }}
              >
                <img
                  src={getSocialImagePath("threads")}
                  alt="Threads"
                  className="footer-social-icon"
                  loading="lazy"
                  decoding="async"
                />
              </Link>
              <Link
                href={footer.socialLinks.facebook}
                className="footer-social-link"
                aria-label="Facebook"
                style={{ marginLeft: "5px", marginRight: "5px" }}
              >
                <img
                  src={getSocialImagePath("facebook")}
                  alt="Facebook"
                  className="footer-social-icon"
                  loading="lazy"
                  decoding="async"
                />
              </Link>
              <Link
                href={footer.socialLinks.instagram}
                className="footer-social-link"
                aria-label="Instagram"
                style={{ marginLeft: "5px", marginRight: "5px" }}
              >
                <img
                  src={getSocialImagePath("instagram")}
                  alt="Instagram"
                  className="footer-social-icon"
                  loading="lazy"
                  decoding="async"
                />
              </Link>
              <Link
                href={footer.socialLinks.line}
                className="footer-social-link"
                aria-label="LINE"
                style={{ marginLeft: "5px", marginRight: "5px" }}
              >
                <img
                  src={getSocialImagePath("line")}
                  alt="LINE"
                  className="footer-social-icon"
                  loading="lazy"
                  decoding="async"
                />
              </Link>
              <Link
                href={`mailto:${footer.email}`}
                className="footer-social-link"
                aria-label="Email"
                style={{ marginLeft: "5px", marginRight: "5px" }}
              >
                <svg className="footer-social-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </Link>
            </div>

            {/* 第三行：版權資訊 */}
            <div className="footer-copyright">
              <span>{footer.copyright}</span>
              <span className="footer-separator">|</span>
              <Link href={footer.sitemapUrl} className="footer-link">
                Sitemap
              </Link>
              <span className="footer-separator">|</span>
              <span>{footer.designer}</span>
            </div>
          </div>

          {/* 手機端：垂直排列的排版 */}
          <div className="footer-mobile">
            {/* 聯絡資訊：每行一個項目 */}
            <div className="footer-contact-mobile">
              <div>TEL : {footer.phone}</div>
              <div>ADD. : {footer.address}</div>
              <div>統編 : {footer.taxId}</div>
            </div>

            {/* 社群媒體 */}
            <div className="footer-social-mobile">
              <span className="footer-social-label">Follow us on :</span>
              <Link
                href={footer.socialLinks.threads}
                className="footer-social-link"
                aria-label="Threads"
                style={{ marginLeft: "5px", marginRight: "5px" }}
              >
                <img
                  src={getSocialImagePath("threads")}
                  alt="Threads"
                  className="footer-social-icon"
                  loading="lazy"
                  decoding="async"
                />
              </Link>
              <Link
                href={footer.socialLinks.facebook}
                className="footer-social-link"
                aria-label="Facebook"
                style={{ marginLeft: "5px", marginRight: "5px" }}
              >
                <img
                  src={getSocialImagePath("facebook")}
                  alt="Facebook"
                  className="footer-social-icon"
                  loading="lazy"
                  decoding="async"
                />
              </Link>
              <Link
                href={footer.socialLinks.instagram}
                className="footer-social-link"
                aria-label="Instagram"
                style={{ marginLeft: "5px", marginRight: "5px" }}
              >
                <img
                  src={getSocialImagePath("instagram")}
                  alt="Instagram"
                  className="footer-social-icon"
                  loading="lazy"
                  decoding="async"
                />
              </Link>
              <Link
                href={footer.socialLinks.line}
                className="footer-social-link"
                aria-label="LINE"
                style={{ marginLeft: "5px", marginRight: "5px" }}
              >
                <img
                  src={getSocialImagePath("line")}
                  alt="LINE"
                  className="footer-social-icon"
                  loading="lazy"
                  decoding="async"
                />
              </Link>
              <Link
                href={`mailto:${footer.email}`}
                className="footer-social-link"
                aria-label="Email"
                style={{ marginLeft: "5px", marginRight: "5px" }}
              >
                <svg className="footer-social-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </Link>
            </div>

            {/* 版權資訊：分成兩行 */}
            <div className="footer-copyright-mobile">
              <div>{footer.copyright}</div>
              <div>
                <span className="footer-separator">|</span>
                <Link href={footer.sitemapUrl} className="footer-link">
                  Sitemap
                </Link>
                <span className="footer-separator">|</span>
                <span>{footer.designer}</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <style jsx>{`
        .footer-section {
          background-color: #eed3b2;
          color: #2b1a10;
          padding: 2rem 0;
        }

        /* 手機端：只移動內容往上 30px，背景保持原位置 */
        @media (max-width: 767px) {
          .footer-section {
            padding-top: calc(2rem + 0px);
          }
          .footer-container {
            margin-top: -30px;
          }
        }

        .footer-container {
          max-width: 72rem;
          margin: 0 auto;
          padding: 0 1rem;
        }

        /* 桌面端樣式 */
        .footer-desktop {
          display: none;
        }

        @media (min-width: 768px) {
          .footer-desktop {
            display: block;
          }
        }

        .footer-contact {
          text-align: center;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .footer-separator {
          margin: 0 0.5rem;
        }

        .footer-social {
          text-align: center;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .footer-social-label {
          margin-right: 0.5rem;
        }

        .footer-social-link {
          display: inline-block;
          margin: 0 5px;
          transition: opacity 0.3s ease;
        }

        .footer-social-link:hover {
          opacity: 0.7;
        }

        .footer-social-icon {
          width: 1.25rem;
          height: 1.25rem;
          display: inline-block;
          object-fit: contain;
        }

        .footer-copyright {
          text-align: center;
          font-size: 0.75rem;
          color: rgba(43, 26, 16, 0.7);
        }

        .footer-link {
          transition: text-decoration 0.3s ease;
        }

        .footer-link:hover {
          text-decoration: underline;
        }

        /* 手機端樣式 */
        .footer-mobile {
          display: block;
          text-align: center;
        }

        @media (min-width: 768px) {
          .footer-mobile {
            display: none;
          }
        }

        .footer-contact-mobile {
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .footer-contact-mobile > div {
          margin-bottom: 0.5rem;
        }

        .footer-contact-mobile > div:last-child {
          margin-bottom: 0;
        }

        .footer-social-mobile {
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .footer-copyright-mobile {
          font-size: 0.75rem;
          color: rgba(43, 26, 16, 0.7);
        }

        .footer-copyright-mobile > div {
          margin-bottom: 0.25rem;
        }

        .footer-copyright-mobile > div:last-child {
          margin-bottom: 0;
        }
      `}</style>
    </>
  );
}

