// ===== Footer 資料邏輯集中 =====

export type FooterData = {
  phone: string;
  address: string;
  taxId: string;
  email: string;
  copyright: string;
  designer: string;
  sitemapUrl: string;
  socialLinks: {
    threads: string;
    facebook: string;
    instagram: string;
    line: string;
  };
};

// Footer 配置
const FOOTER_CONFIG = {
  imagePath: "/images/footer",
} as const;

// Footer 資料
export const footerData: FooterData = {
  phone: "+886 9876543210",
  address: "264宜蘭縣員山鄉深洲二路158號",
  taxId: "12345678",
  email: "hello@thewanderingwalls.com",
  copyright: "Copyright © 2025 MUMBAO Studio all rights reserved.",
  designer: "Design by Ian",
  sitemapUrl: "/sitemap",
  socialLinks: {
    threads: "#",
    facebook: "#",
    instagram: "#",
    line: "#",
  },
};

// 獲取 Footer 資料
export function getFooterData(): FooterData {
  return footerData;
}

// 獲取社群媒體圖片路徑
export function getSocialImagePath(name: "threads" | "facebook" | "instagram" | "line"): string {
  const imageMap = {
    threads: `${FOOTER_CONFIG.imagePath}/threads.webp`,
    facebook: `${FOOTER_CONFIG.imagePath}/Facebook.webp`,
    instagram: `${FOOTER_CONFIG.imagePath}/IG.webp`,
    line: `${FOOTER_CONFIG.imagePath}/LINE.webp`,
  };
  return imageMap[name];
}

