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

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });

  const [headerMode, _setHeaderMode] = useState<HeaderMode>("top");
  const headerModeRef = useRef<HeaderMode>("top");
  const hideTimeoutRef = useRef<number | null>(null);
  const lastAtTopRef = useRef<boolean>(true);

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
    const HIDE_DURATION = 300;
    const PAUSE_DURATION = 100;
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
      const currentY = window.scrollY || window.pageYOffset || 0;
      setScrollY(currentY);

      const atTop = currentY === 0;
      const wasAtTop = lastAtTopRef.current;
      lastAtTopRef.current = atTop;

      if (!atTop && wasAtTop) {
        if (headerModeRef.current === "top") startHideToSolid();
        return;
      }

      if (atTop && !wasAtTop) {
        if (headerModeRef.current === "solid") {
          startHideToTop();
        } else if (
          headerModeRef.current === "hidingToSolid" ||
          headerModeRef.current === "hidingToTop"
        ) {
          cleanupTimers();
          setHeaderMode("top");
        } else {
          setHeaderMode("top");
        }
        return;
      }

      if (!atTop && headerModeRef.current === "top") {
        cleanupTimers();
        setHeaderMode("solid");
        return;
      }

      if (
        atTop &&
        headerModeRef.current !== "top" &&
        headerModeRef.current !== "hidingToTop"
      ) {
        cleanupTimers();
        setHeaderMode("top");
        return;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const initY = window.scrollY || window.pageYOffset || 0;
    setScrollY(initY);
    lastAtTopRef.current = initY === 0;
    setHeaderMode(lastAtTopRef.current ? "top" : "solid");

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cleanupTimers();
    };
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
  };

  const isHiding =
    headerMode === "hidingToSolid" || headerMode === "hidingToTop";

  const useSolidBackground =
    headerMode === "solid" ||
    headerMode === "hidingToSolid" ||
    headerMode === "hidingToTop";

  const getBackgroundColor = () =>
    !useSolidBackground ? "transparent" : "rgba(244,210,168,0.96)";

  const getBackgroundImage = () => {
    if (isMobile) return "none";
    if (!useSolidBackground) return "none";
    return `url(${headerImages.background})`;
  };

  return (
    <>
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
            ? "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)"
            : "none",
        }}
      >
        <div className="relative mx-auto h-16 flex items-center header-container">
          {/* 桌機版 */}
          <div className="hidden md:grid md:grid-cols-3 w-full items-center">
            <div className="flex items-center">
              <MobileMenu />
            </div>

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

            <div
              className="relative flex items-center justify-end gap-2 justify-self-end"
              ref={langMenuRef}
            >
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="text-[#2B1A10] hover:opacity-70 transition-opacity"
                aria-label="切換語言"
              >
                <Image
                  src={headerImages.globe}
                  width={20}
                  height={20}
                  className="w-5 h-5"
                  alt="切換語言"
                />
              </button>

              <span className="text-sm">{currentLang}</span>

              {isLangOpen && (
                <div className="absolute right-0 top-full mt-2 w-36 bg-white border shadow-lg rounded-sm overflow-hidden z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageSelect(lang.code)}
                      className="w-full text-left px-4 py-3 text-sm text-[#2B1A10] hover:bg-[#EED3B2]"
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 手機版 */}
          <div className="md:hidden relative flex items-center w-full">
            {/* 左：Menu */}
            <div className="flex items-center flex-none">
              <MobileMenu />
            </div>

            {/* 中：Logo */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Link href="/" className="inline-block translate-y-[2px]">
                <Image
                  src={headerImages.logo}
                  width={200}
                  height={85}
                  alt="MUMBAO STAY 慢慢蒔光"
                  className="h-[64px] w-auto object-contain"
                  priority
                />
              </Link>
            </div>

            {/* 右：語系（已永久固定右側） */}
            <div
              ref={langMenuRef}
              className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2"
            >
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="text-[#2B1A10] hover:opacity-70 transition-opacity"
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

              <span className="text-xs">{currentLang}</span>

              {isLangOpen && (
                <div className="absolute right-0 top-full mt-2 w-36 bg-white border shadow-lg rounded-sm overflow-hidden z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageSelect(lang.code)}
                      className="w-full text-left px-4 py-3 text-sm text-[#2B1A10] hover:bg-[#EED3B2]"
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
