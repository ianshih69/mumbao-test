// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import FixedViewport from "@/components/FixedViewport";

export const metadata: Metadata = { title: "My app", description: "" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant" style={{ backgroundColor: "#eed3b2", height: "100%" }}>
      <body>
        <FixedViewport />
        {children}
      </body>
    </html>
  );
}
