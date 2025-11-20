"use client";

import { useState, useEffect } from "react";
import type { CSSProperties } from "react";
import { createPortal } from "react-dom";
import { getAllMenuItems, headerImages } from "@/lib/header";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuItems = getAllMenuItems();

  // 只在 client 端渲染 Portal
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Esc 關閉選單
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // 開啟時鎖住背景捲動
  useEffect(() => {
    if (!mounted) return;

    const originalOverflow = document.body.style.overflow;

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalOverflow;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, mounted]);

  // Drawer & 背景遮罩
  const drawerContent = (
    <>
      {/* Offcanvas 側邊選單 */}
      <div
        id="mobile-menu-drawer"
        className={`mobile-menu-drawer fixed inset-y-0 left-0 w-72 max-w-[80vw] border-r border-[#7C4420]/15 shadow-2xl transform transition-transform duration-300 ease-out z-[60] flex flex-col rounded-tr-3xl rounded-br-3xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={
          {
            backgroundColor: "#FAE8D0",
            backgroundImage: "none",
          } as CSSProperties
        }
      >
        {/* 上方右側關閉按鈕 */}
        <div className="flex justify-end px-6 pt-6 pb-4">
          <button
            onClick={closeMenu}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#2B1A10] hover:bg-[#F6D9B5] transition-colors text-xl"
            aria-label="關閉選單"
          >
            ×
          </button>
        </div>

        {/* 選單項目：文字縮進 + 上下空隙 + 條目之間留更多距離 */}
        <nav className="flex-1 overflow-y-auto pt-4 pb-10">
          <ul className="space-y-3"> {/* ① 每一條 menu 之間改成 12px 間距 */}
            {menuItems.map((item) => (
              <li key={item.href}>
                <button
                  onClick={() => {
                    window.location.href = item.href;
                    closeMenu();
                  }}
                  className="w-full text-left"
                >
                  {/* ② 這個 div 控制文字位置與線的距離 */}
                  <div
                    className="border-b border-[#7C4420]/25 text-[18px] leading-relaxed text-[#2B1A10] hover:bg-[#F6D9B5]/70 active:bg-[#F1C993] transition-colors"
                    style={{ padding: "14px 32px 14px 32px" }} // 左 64px、上下 14px
                  >
                    {item.label}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </nav>

      </div>

      {/* 背景遮罩 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-[1px] z-[55] transition-opacity"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* 保底 background 設定 */}
      <style jsx global>{`
        #mobile-menu-drawer,
        .mobile-menu-drawer {
          background-color: #fae8d0 !important;
          background: #fae8d0 !important;
          opacity: 1 !important;
        }
      `}</style>
    </>
  );

  return (
    <>
      {/* Header 裡的漢堡按鈕 */}
      <button
        onClick={toggleMenu}
        className="flex items-center gap-2 text-[var(--text-main)] hover:opacity-80 active:opacity-100 transition-opacity"
        aria-label="開啟選單"
      >
        {/* 漢堡圖示 */}
        <svg
          className="w-8 h-[27px] md:w-12 md:h-10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          viewBox="0 0 24 24"
        >
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
        <img
          src={headerImages.menu}
          alt="選單"
          className="h-[35px] md:h-[53px] w-auto object-contain"
        />
      </button>

      {/* Portal 渲染 Drawer */}
      {mounted &&
        typeof window !== "undefined" &&
        createPortal(drawerContent, document.body)}
    </>
  );
}
