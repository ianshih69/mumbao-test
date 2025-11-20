"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { getAllMenuItems, headerImages } from "@/lib/header";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuItems = getAllMenuItems();

  // 確保只在客戶端渲染 Portal
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Drawer 和遮罩層的內容
  const drawerContent = (
    <>
      {/* Offcanvas 側邊選單 */}
      <div
        id="mobile-menu-drawer"
        className={`mobile-menu-drawer fixed inset-y-0 left-0 w-64 border-r border-[#7C4420]/30 shadow-xl transform transition-transform duration-300 ease-in-out z-[60] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          backgroundColor: "#FAE8D0",
          background: "#FAE8D0",
          opacity: "1",
        } as React.CSSProperties}
      >
        <div className="p-4">
          {/* 關閉按鈕 */}
          <div className="flex justify-end mb-6">
            <button
              onClick={closeMenu}
              className="text-[var(--text-main)] hover:opacity-70 text-2xl"
              aria-label="關閉選單"
            >
              ×
            </button>
          </div>

          {/* 選單項目 */}
          <nav className="flex flex-col gap-4">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="text-[var(--text-main)] hover:text-[var(--accent-main)] transition-colors py-2 border-b border-[var(--border-main)]/20"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* 遮罩層 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-[55]"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      <style jsx global>{`
        #mobile-menu-drawer {
          background-color: #FAE8D0 !important;
          background: #FAE8D0 !important;
          opacity: 1 !important;
        }
        
        .mobile-menu-drawer {
          background-color: #FAE8D0 !important;
          background: #FAE8D0 !important;
          opacity: 1 !important;
        }
      `}</style>
    </>
  );

  return (
    <>
      {/* 選單按鈕 - 保留在 Header 內 */}
      <button
        onClick={toggleMenu}
        className="flex items-center gap-2 text-[var(--text-main)] hover:opacity-70"
        aria-label="開啟選單"
      >
        {/* 漢堡選單圖標：三條水平線 */}
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

      {/* 使用 Portal 將 Drawer 渲染到 body */}
      {mounted && typeof window !== "undefined" && createPortal(drawerContent, document.body)}
    </>
  );
}
