// ===== Hero 資料邏輯集中 =====

export type HeroImage = {
  id: number;
  src: string;
  alt: string;
};

// Hero 圖片配置
const HERO_CONFIG = {
  basePath: "/images/Hero",
  format: "webp",
  count: 3,
  altPrefix: "Hero Image",
} as const;

// 生成 Hero 圖片數據
export const heroImages: HeroImage[] = Array.from(
  { length: HERO_CONFIG.count },
  (_, index) => {
    const num = index + 1;
    return {
      id: num,
      src: `${HERO_CONFIG.basePath}/page1-${num}.${HERO_CONFIG.format}`,
      alt: `${HERO_CONFIG.altPrefix} ${num}`,
    };
  }
);

// 獲取所有 Hero 圖片
export function getAllHeroImages(): HeroImage[] {
  return heroImages;
}

// 根據 ID 獲取 Hero 圖片
export function getHeroImageById(id: number): HeroImage | undefined {
  return heroImages.find((img) => img.id === id);
}

// 獲取當前顯示的 Hero 圖片（預設第一張）
export function getCurrentHeroImage(): HeroImage {
  return heroImages[0];
}

