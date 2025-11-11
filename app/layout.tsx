// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

// 這兩行是 OwlCarousel 的全域樣式（從 node_modules 直接匯入）
import "owl.carousel/dist/assets/owl.carousel.css";

export const metadata: Metadata = { title: "My app", description: "" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
