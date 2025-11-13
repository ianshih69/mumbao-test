"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import MobileMenu from "./MobileMenu";
import { getAllLanguages, headerImages } from "@/lib/header";

export default function Header() {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("TW");
  const langMenuRef = useRef<HTMLDivElement>(null);
  const languages = getAllLanguages();

  // 點擊外部關閉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };

    if (isLangOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLangOpen]);

  const handleLanguageSelect = (code: string) => {
    setCurrentLang(code);
    setIsLangOpen(false);
    // 這裡可以添加語言切換邏輯
    console.log("Selected language:", code);
  };

  return (
    <>
      <header
        className="sticky top-0 z-50 border-b border-[#7C4420]/30 bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: `url('${headerImages.background}')`,
          borderBottomColor: "var(--border-main, #7C4420)",
        }}
      >
        {/* 淡淡遮罩，讓字可讀，但不蓋掉背景圖 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: "rgba(250, 232, 208, 0.1)" }}
        />

        {/* 導覽列內容 */}
        <div className="relative mx-auto h-16 flex items-center header-container">
          {/* 桌面版：三欄 */}
          <div className="hidden md:grid md:grid-cols-3 w-full items-center">
            {/* 左：選單 */}
            <div className="flex items-center">
              <MobileMenu />
            </div>

            {/* 中：Logo */}
            <div className="text-center leading-tight select-none">
              <Link href="/" className="inline-block translate-y-[2px]">
                <Image
                  src={headerImages.logo}
                  alt="MUMBAO STAY 慢慢蒔光"
                  width={200}
                  height={85}
                  className="h-[64px] md:h-[85px] w-auto object-contain"
                  priority
                />
              </Link>
            </div>

            {/* 右：語言 */}
            <div className="relative flex items-center justify-end gap-2" ref={langMenuRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="text-[#2B1A10] hover:opacity-70 transition-opacity"
                style={{ color: "var(--text-main, #2B1A10)" }}
                aria-label="語言"
              >
                <Image
                  src={headerImages.globe}
                  alt="語言"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              </button>

              <span
                className="text-sm whitespace-nowrap"
                style={{ color: "var(--text-main, #2B1A10)" }}
              >
                {currentLang}
              </span>

              {/* 語言下拉選單 */}
              {isLangOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-36 bg-white border shadow-lg rounded-sm overflow-hidden z-50"
                  style={{ borderColor: "var(--border-main, #7C4420)" }}
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageSelect(lang.code)}
                      className="w-full text-left px-4 py-3 text-sm text-[#2B1A10] hover:bg-[#EED3B2] transition-colors border-b border-[#7C4420]/10 last:border-b-0"
                      style={{
                        color: "var(--text-main, #2B1A10)",
                        borderBottomColor: "var(--border-main, #7C4420)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--bg-card, #EED3B2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 手機版：壓成一列 */}
          <div className="md:hidden flex justify-between items-center w-full">
            <MobileMenu />

            <Link href="/" className="flex-1 text-center select-none translate-y-[2px]">
              <Image
                src={headerImages.logo}
                alt="MUMBAO STAY 慢慢蒔光"
                width={200}
                height={85}
                className="h-[64px] md:h-[85px] mx-auto object-contain"
                priority
              />
            </Link>

            <div className="relative flex items-center gap-2">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="text-[#2B1A10] hover:opacity-70 transition-opacity"
                style={{ color: "var(--text-main, #2B1A10)" }}
                aria-label="語言"
              >
                <Image
                  src={headerImages.globe}
                  alt="語言"
                  width={16}
                  height={16}
                  className="w-4 h-4"
                />
              </button>

              <span
                className="text-xs whitespace-nowrap"
                style={{ color: "var(--text-main, #2B1A10)" }}
              >
                {currentLang}
              </span>

              {/* 手機版語言下拉選單 */}
              {isLangOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-36 bg-white border shadow-lg rounded-sm overflow-hidden z-50"
                  style={{ borderColor: "var(--border-main, #7C4420)" }}
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageSelect(lang.code)}
                      className="w-full text-left px-4 py-3 text-sm text-[#2B1A10] hover:bg-[#EED3B2] transition-colors border-b border-[#7C4420]/10 last:border-b-0"
                      style={{
                        color: "var(--text-main, #2B1A10)",
                        borderBottomColor: "var(--border-main, #7C4420)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--bg-card, #EED3B2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <style jsx>{`
        .header-container {
          max-width: 1120px;
          width: 100%;
          margin: 0 auto;
          padding: 0 10px;
        }

        @media screen and (max-width: 768px) {
          .header-container {
            padding: 0 20px;
          }
        }
      `}</style>
    </>
  );
}

