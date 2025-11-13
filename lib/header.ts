// ===== Header 資料邏輯集中 =====

export type Language = {
  code: string;
  label: string;
};

export type MenuItem = {
  href: string;
  label: string;
};

// Header 配置
const HEADER_CONFIG = {
  basePath: "/images/header",
  format: "webp",
} as const;

// 語言選項
export const languages: Language[] = [
  { code: "TW", label: "繁體中文" },
  { code: "JP", label: "日本語" },
  { code: "KR", label: "한국어" },
  { code: "US", label: "English" },
];

// 選單項目
export const menuItems: MenuItem[] = [
  { href: "/about", label: "關於我們" },
  { href: "/news", label: "最新消息" },
  { href: "/rooms", label: "房間" },
  { href: "#booking", label: "線上訂房" },
  { href: "/privacy", label: "隱私政策" },
];

// 圖片路徑
export const headerImages = {
  background: `${HEADER_CONFIG.basePath}/background.${HEADER_CONFIG.format}`,
  logo: `${HEADER_CONFIG.basePath}/logo.${HEADER_CONFIG.format}`,
  globe: `${HEADER_CONFIG.basePath}/globe.${HEADER_CONFIG.format}`,
  menu: `${HEADER_CONFIG.basePath}/menu.${HEADER_CONFIG.format}`,
} as const;

// 獲取所有語言
export function getAllLanguages(): Language[] {
  return languages;
}

// 獲取所有選單項目
export function getAllMenuItems(): MenuItem[] {
  return menuItems;
}

// 根據代碼獲取語言
export function getLanguageByCode(code: string): Language | undefined {
  return languages.find((lang) => lang.code === code);
}

