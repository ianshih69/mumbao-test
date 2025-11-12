// ===== Booking 資料邏輯集中 =====

export type BookingData = {
  id: number;
  image: string;
  title: string;
  buttonText: string;
  buttonLink: string;
};

// Booking 配置
const BOOKING_CONFIG = {
  basePath: "/images/Booking",
  format: "webp",
} as const;

// Booking 資料
export const bookingData: BookingData = {
  id: 1,
  image: `${BOOKING_CONFIG.basePath}/page5.${BOOKING_CONFIG.format}`,
  title: "預定您的假期",
  buttonText: "線上訂房",
  buttonLink: "#booking",
};

// 獲取 Booking 資料
export function getBookingData(): BookingData {
  return bookingData;
}

