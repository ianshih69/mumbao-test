"use client";

import { useState } from "react";
import Link from "next/link";
import { getAllMenuItems, headerImages } from "@/lib/header";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuItems = getAllMenuItems();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* 選單按鈕 */}
      <button
        onClick={toggleMenu}
        className="flex items-center gap-2 text-[#2B1A10] hover:opacity-70 transition-opacity"
        style={{ color: "var(--text-main, #2B1A10)" }}
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

      {/* Offcanvas 側邊選單 */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-[#FAE8D0] border-r border-[#7C4420]/30 shadow-xl transform transition-transform duration-300 ease-in-out z-[60] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          backgroundColor: "var(--bg-header, #FAE8D0)",
          borderRightColor: "var(--border-main, #7C4420)",
        }}
      >
        <div className="p-4">
          {/* 關閉按鈕 */}
          <div className="flex justify-end mb-6">
            <button
              onClick={closeMenu}
              className="text-[#2B1A10] hover:opacity-70 text-2xl transition-opacity"
              style={{ color: "var(--text-main, #2B1A10)" }}
              aria-label="關閉選單"
            >
              ×
            </button>
          </div>

          {/* 選單項目 */}
          <nav className="flex flex-col gap-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="text-[#2B1A10] hover:text-[#F0A245] transition-colors py-2 border-b border-[#7C4420]/20"
                style={{
                  color: "var(--text-main, #2B1A10)",
                  borderBottomColor: "var(--border-main, #7C4420)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--accent-main, #F0A245)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--text-main, #2B1A10)";
                }}
              >
                {item.label}
              </Link>
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
    </>
  );
}

