"use client";

import { useEffect } from "react";

/**
 * 固定視窗高度，防止手機工具欄出現/消失時造成抖動
 * 使用 JavaScript 監聽視窗高度變化並固定為最大高度（工具欄隱藏時的高度）
 */
export default function FixedViewport() {
  useEffect(() => {
    // 只在移動設備上執行
    if (typeof window === "undefined" || !("ontouchstart" in window)) {
      return;
    }

    // 記錄最大視窗高度（工具欄隱藏時的高度）
    let maxHeight = window.innerHeight;
    let isInitialized = false;
    
    // 設置視窗高度為固定值
    const setFixedHeight = () => {
      // 使用最大高度（工具欄隱藏時的高度）作為固定高度
      const vh = maxHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
      
      // 固定 html 的高度，防止工具欄出現時的高度變化
      // 但允許 body 內部滾動，保留彈性效果
      if (isInitialized) {
        document.documentElement.style.height = `${maxHeight}px`;
        document.documentElement.style.overflow = "hidden";
        document.body.style.height = `${maxHeight}px`;
        document.body.style.overflowY = "auto";
        document.body.style.overflowX = "hidden";
      }
    };

    // 初始化：記錄當前高度並設置
    const init = () => {
      maxHeight = window.innerHeight;
      setFixedHeight();
      isInitialized = true;
    };

    // 立即初始化
    init();

    // 監聽視窗大小變化
    const handleResize = () => {
      const currentHeight = window.innerHeight;
      // 如果當前高度大於記錄的最大高度，更新最大高度
      // 這樣可以確保使用工具欄隱藏時的最大高度
      if (currentHeight > maxHeight) {
        maxHeight = currentHeight;
        setFixedHeight();
      }
    };

    // 監聽 orientationchange（螢幕旋轉）
    const handleOrientationChange = () => {
      // 延遲一下，等待視窗高度穩定
      setTimeout(() => {
        maxHeight = window.innerHeight;
        setFixedHeight();
      }, 200);
    };

    // 使用 passive 監聽器提高性能
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("orientationchange", handleOrientationChange, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
      // 清理樣式
      document.documentElement.style.removeProperty("--vh");
      document.documentElement.style.removeProperty("height");
      document.documentElement.style.removeProperty("overflow");
      document.body.style.removeProperty("height");
      document.body.style.removeProperty("overflowY");
      document.body.style.removeProperty("overflowX");
    };
  }, []);

  return null;
}

