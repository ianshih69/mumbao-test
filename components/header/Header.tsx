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
  // 初始化時就判斷是否為手機端，避免首次渲染時使用錯誤的邏輯
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });

  const [headerMode, _setHeaderMode] = useState<HeaderMode>("top");
  const headerModeRef = useRef<HeaderMode>("top");
  const hideTimeoutRef = useRef<number | null>(null);
  const lastAtTopRef = useRef<boolean>(true); // 上一刻是不是在頂部區域

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
    const HIDE_DURATION = 300; // 收上去動畫時間 (ms) 要跟 CSS duration 一致
    const PAUSE_DURATION = 100; // 往下時收完停 0.1 秒
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
      }, HIDE_DURATION);
    };

    const handleScroll = () => {
      // 統一使用 window.scrollY 作為滾動位置（所有設備都使用 window 滾動）
      const currentY = window.scrollY || window.pageYOffset || 0;
      setScrollY(currentY);

      // 簡單明確的判斷：scrollY === 0 時在頂部，scrollY > 0 時不在頂部
      const atTop = currentY === 0;
      const wasAtTop = lastAtTopRef.current;
      lastAtTopRef.current = atTop;

      // ✦ 情況 1：從頂部「離開」→ top → hidingToSolid → solid
      if (!atTop && wasAtTop) {
        if (headerModeRef.current === "top") {
          startHideToSolid();
        }
        return;
      }

      // ✦ 情況 2：從下面「回到頂部」→ solid → hidingToTop → top
      if (atTop && !wasAtTop) {
        if (headerModeRef.current === "solid") {
          startHideToTop();
        } else if (
          headerModeRef.current === "hidingToSolid" ||
          headerModeRef.current === "hidingToTop"
        ) {
          // 動畫中被拉回頂部，直接歸零
          cleanupTimers();
          setHeaderMode("top");
        } else {
          // 已經是 top 就維持
          setHeaderMode("top");
        }
        return;
      }

      // ✦ 情況 3：如果已經不在頂部，但 headerMode 還是 top，應該設置為 solid
      // 這可能發生在窗口大小改變或其他情況下，狀態不同步
      if (!atTop && headerModeRef.current === "top") {
        cleanupTimers();
        setHeaderMode("solid");
        return;
      }
      
      // ✦ 情況 4：如果在頂部，但 headerMode 不是 top，應該設置為 top
      if (atTop && headerModeRef.current !== "top" && headerModeRef.current !== "hidingToTop") {
        cleanupTimers();
        setHeaderMode("top");
        return;
      }
    };

    // 只監聽 window 的滾動事件（所有設備統一使用 window 滾動）
    window.addEventListener("scroll", handleScroll, { passive: true });

    // 初始化：決定一開始是不是在頂端
    const initY = window.scrollY || window.pageYOffset || 0;
    setScrollY(initY);
    lastAtTopRef.current = initY === 0;
    if (lastAtTopRef.current) {
      setHeaderMode("top");
    } else {
      // 如果初始化時不在頂部，應該立即顯示背景
      setHeaderMode("solid");
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cleanupTimers();
    };
  }, []);

  // 檢測是否為手機端
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
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

  const isHiding =
    headerMode === "hidingToSolid" || headerMode === "hidingToTop";

  // 有背景樣式：solid、往下滑過渡(hidingToSolid) & 往上收回頂部(hidingToTop) 的時候都保持有背景
  const useSolidBackground =
    headerMode === "solid" || headerMode === "hidingToSolid" || headerMode === "hidingToTop";

  // 所有尺寸共用：top 狀態透明，solid 狀態不透明
  const getBackgroundColor = () => {
    // 根據 headerMode 切換，不區分手機/桌機
    if (!useSolidBackground) return "transparent"; // top 狀態：透明
    return "rgba(244,210,168,0.96)"; // solid 狀態：不透明背景
  };

  // 手機端不使用背景圖片，桌機端在 solid 狀態使用背景圖片
  const getBackgroundImage = () => {
    if (isMobile) return "none"; // 手機端不使用背景圖片
    if (!useSolidBackground) return "none"; // 桌機端 top 狀態不使用背景圖片
    return `url(${headerImages.background})`; // 桌機端 solid 狀態使用背景圖片
  };

  return (
    <>
      {/* Header */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transform-gpu transition-transform duration-300 ease-out ${
          isHiding ? "-translate-y-[130%]" : "translate-y-0"
        }`}
        style={{
          backgroundColor: getBackgroundColor(),
          backgroundImage: getBackgroundImage(),
          backgroundSize: useSolidBackground && !isMobile ? "cover" : "auto",
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
              className="flex-1 text中心 select-none translate-y-[2px]"
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
