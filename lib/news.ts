// ===== 圖片配置 =====
const IMAGE_CONFIG = {
  basePath: "/images/News",
  format: "webp",
  count: 5,
} as const;

// ===== 新聞資料類型 =====
export type NewsItem = {
  id: number;
  name: string;
  title: string;
  date: string;
  image: string;
};

// ===== 新聞資料 =====
const newsData: NewsItem[] = [
  {
    id: 1,
    name: "慢寶灣臥・世界百大建築",
    title: "慢寶灣臥・世界百大建築",
    date: "2022.11.08",
    image: `${IMAGE_CONFIG.basePath}/page3-1.${IMAGE_CONFIG.format}`,
  },
  {
    id: 2,
    name: "慢寶生日獻禮",
    title: "慢寶生日獻禮",
    date: "2025.08.13",
    image: `${IMAGE_CONFIG.basePath}/page3-2.${IMAGE_CONFIG.format}`,
  },
  {
    id: 3,
    name: "慢寶・晚餐",
    title: "慢寶・晚餐",
    date: "2025.08.01",
    image: `${IMAGE_CONFIG.basePath}/page3-3.${IMAGE_CONFIG.format}`,
  },
  {
    id: 4,
    name: "慢寶，最新消息1",
    title: "慢寶，最新消息1",
    date: "2025.03.15",
    image: `${IMAGE_CONFIG.basePath}/page3-4.${IMAGE_CONFIG.format}`,
  },
  {
    id: 5,
    name: "慢寶，最新消息2",
    title: "慢寶，最新消息2",
    date: "2025.03.10",
    image: `${IMAGE_CONFIG.basePath}/page3-5.${IMAGE_CONFIG.format}`,
  },
];

// ===== 資料邏輯函數 =====
export function getAllNews(): NewsItem[] {
  return newsData;
}

export function getNewsById(id: number): NewsItem | undefined {
  return newsData.find((item) => item.id === id);
}

