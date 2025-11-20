// ===== About 資料邏輯集中 =====

export type AboutData = {
  id: number;
  image: string;
  title: string;
  content: string;
  moreLink: string;
};

// About 配置
const ABOUT_CONFIG = {
  basePath: "/images/About",
  format: "webp",
} as const;

// About 資料
export const aboutData: AboutData = {
  id: 1,
  image: `${ABOUT_CONFIG.basePath}/page2.${ABOUT_CONFIG.format}`,
  title: "關於慢寶",
  content: `有些建築，像一封未署名的情書，靜靜地佇立在那裡，讓風穿過身體，讓光在表面跳舞。

風成為弧線，光是語氣，水是呼吸。我們尋找一方淨土，遠離喧囂但不孤立，在自然與人文之間找到平衡。

像是遇見了知己，它不多言卻懂得讓你，在光與牆之間，靜靜安放自己。這裡不只是居住的空間，更是心靈的歸屬，讓每一刻都成為生活的詩篇。`,
  moreLink: "/about",
};

// 獲取 About 資料
export function getAboutData(): AboutData {
  return aboutData;
}

