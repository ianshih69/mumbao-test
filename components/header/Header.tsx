"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import MobileMenu from "./MobileMenu";
import { getAllLanguages, headerImages } from "@/lib/header";

type HeaderMode = "top" | "hidingToSolid" | "solid" | "hidingToTop";

export default function Header() {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("TW");
  const [scrollY, setScrollY] = useState(0);

  const [headerMode, _setHeaderMode] = useState<HeaderMode>("top");
  const headerModeRef = useRef<HeaderMode>("top");
  const hideTimeoutRef = useRef<number | null>(null);

  const setHeaderMode = (mode: HeaderMode) => {
    headerModeRef.current = mode;
    _setHeaderMode(mode);
  };

  const langMenuRef = useRef<HTMLDivElement>(null);
  const languages = getAllLanguages();

  const cleanupTimers = () => {
    if (hideTimeoutRef.current !== null) {
      window.clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    const TOP_THRESHOLD = 10; // 小於這個視為在頂部
    const HIDE_DURATION = 300; // 收上去動畫時間 (ms) 要跟 CSS duration 一致
    const PAUSE_DURATION = 0; // 往下時收完停 0 秒
    const TOTAL_DOWN_DELAY = HIDE_DURATION + PAUSE_DURATION;

    const startHideToSolid = () => {
      cleanupTimers();
      setHeaderMode("hidingToSolid");
      hideTimeoutRef.current = window.setTimeout(() => {
        setHeaderMode("solid");
        hideTimeoutRef.current = null;
      }, TOTAL_DOWN_DELAY);
    };

    const startHideToTop = () => {
      cleanupTimers();
      setHeaderMode("hidingToTop");
      hideTimeoutRef.current = window.setTimeout(() => {
        setHeaderMode("top");
        hideTimeoutRef.current = null;
      }, HIDE_DURATION); // 往上回頂端不多加停留
    };

    const handleScroll = () => {
      const currentY = window.scrollY || 0;
      setScrollY(currentY);

      // 在頂部區域
      if (currentY <= TOP_THRESHOLD) {
        if (headerModeRef.current === "solid") {
          // 有背景 header → 收上去 → 回到透明 top
          if (headerModeRef.current !== "hidingToTop") {
            startHideToTop();
          }
        } else if (headerModeRef.current === "hidingToSolid") {
          // 尚未完成往下動畫就被拉回頂部：直接重置成 top
          cleanupTimers();
          setHeaderMode("top");
        }
        // 其他情況 (top / hidingToTop) 就維持現狀
        return;
      }

      // 離開頂部（往下滑）
      if (headerModeRef.current === "top") {
        // 透明版本第一次往下：top → hidingToSolid → (停) → solid
        startHideToSolid();
      }

      // 若已經是 hidingToSolid / solid / hidingToTop，就不要重複啟動
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // 初始化

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cleanupTimers();
    };
  }, []);

  // 點 header 外面關閉語系選單
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
    console.log("Selected language:", code);
  };

  const isTop = headerMode === "top";
  const isHiding =
    headerMode === "hidingToSolid" || headerMode === "hidingToTop";
  const isSolid = headerMode === "solid";

  // 有背景樣式：solid & 往上收回頂部(hidingToTop) 的時候都保持有背景
  const useSolidBackground =
    headerMode === "solid" || headerMode === "hidingToTop";

  return (
    <>
      {/* Header */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transform-gpu transition-transform duration-300 ease-out ${
          isHiding ? "-translate-y-[130%]" : "translate-y-0"
        }`}
        style={{
          backgroundColor: useSolidBackground
            ? "rgba(244,210,168,0.96)"
            : "transparent",
          backgroundImage: useSolidBackground
            ? `url(${headerImages.background})`
            : "none",
          backgroundSize: useSolidBackground ? "cover" : "auto",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          boxShadow: useSolidBackground
            ? "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
            : "none",
          border: "none",
          margin: 0,
          padding: 0,
        }}
      >
        {/* 內容容器 */}
        <div className="relative mx-auto h-16 flex items-center header-container">
          {/* 桌機版 3 欄 */}
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

            {/* 右：語系切換 */}
            <div
              className="relative flex items-center justify-end gap-2"
              ref={langMenuRef}
            >
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="text-[#2B1A10] hover:opacity-70 transition-opacity"
                style={{ color: "var(--text-main, #2B1A10)" }}
                aria-label="切換語言"
              >
                <Image
                  src={headerImages.globe}
                  alt="切換語言"
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

              {/* 語系選單 */}
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
                        e.currentTarget.style.backgroundColor =
                          "var(--bg-card, #EED3B2)";
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

          {/* 手機版 */}
          <div className="md:hidden flex justify-between items-center w-full">
            <MobileMenu />

            <Link
              href="/"
              className="flex-1 text-center select-none translate-y-[2px]"
            >
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
                aria-label="切換語言"
              >
                <Image
                  src={headerImages.globe}
                  alt="切換語言"
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

              {/* 手機版語系選單 */}
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
                        e.currentTarget.style.backgroundColor =
                          "var(--bg-card, #EED3B2)";
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

      <style jsx global>{`
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
