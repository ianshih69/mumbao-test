// ===== Room 資料邏輯集中 =====

export type Room = {
  slug: string;
  title: string;
  desc: string;
  image: string;
  features: string[];
};

// Room 配置
const ROOM_CONFIG = {
  basePath: "/images/Room",
  format: "webp",
} as const;

// 圖片組配置（用於主頁輪播）
export const roomImageGroups = [
  { left: `${ROOM_CONFIG.basePath}/page4-1-1.${ROOM_CONFIG.format}`, right: `${ROOM_CONFIG.basePath}/page4-1-2.${ROOM_CONFIG.format}` },
  { left: `${ROOM_CONFIG.basePath}/page4-2-1.${ROOM_CONFIG.format}`, right: `${ROOM_CONFIG.basePath}/page4-2-2.${ROOM_CONFIG.format}` },
  { left: `${ROOM_CONFIG.basePath}/page4-3-1.${ROOM_CONFIG.format}`, right: `${ROOM_CONFIG.basePath}/page4-3-2.${ROOM_CONFIG.format}` },
  { left: `${ROOM_CONFIG.basePath}/page4-4-1.${ROOM_CONFIG.format}`, right: `${ROOM_CONFIG.basePath}/page4-4-2.${ROOM_CONFIG.format}` },
];

// Room 資料
export const rooms: Room[] = [
  {
    slug: "cloud-base-double",
    title: "白雲基地・雙人房",
    desc: "含早餐／Netflix／免清潔費（含寵物）",
    image: `${ROOM_CONFIG.basePath}/page4-1-1.${ROOM_CONFIG.format}`,
    features: ["雙人", "含早餐", "Netflix", "寵物友善"],
  },
  {
    slug: "starlight-blush-quad",
    title: "星頻腮紅・四人房",
    desc: "4床位／親子友善／大片採光",
    image: `${ROOM_CONFIG.basePath}/page4-2-1.${ROOM_CONFIG.format}`,
    features: ["四人", "親子友善", "採光佳"],
  },
  {
    slug: "hug-cloud-pet",
    title: "抱抱雲・寵物友善",
    desc: "毛孩備品／陽台曬太陽／空氣清淨",
    image: `${ROOM_CONFIG.basePath}/page4-3-1.${ROOM_CONFIG.format}`,
    features: ["寵物友善", "陽台", "空氣清淨"],
  },
  {
    slug: "moonlight-suite",
    title: "月光套房・雙人加大",
    desc: "景觀浴缸／黃金時刻採光／床邊閱讀燈",
    image: `${ROOM_CONFIG.basePath}/page4-4-1.${ROOM_CONFIG.format}`,
    features: ["雙人加大", "景觀浴缸", "黃金時刻"],
  },
];

// 獲取所有房型
export function getAllRooms(): Room[] {
  return rooms;
}

// 根據 slug 獲取房型
export function getRoomBySlug(slug: string): Room | undefined {
  return rooms.find((r) => r.slug === slug);
}

