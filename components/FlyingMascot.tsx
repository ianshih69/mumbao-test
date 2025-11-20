"use client";
import { useEffect, useRef } from "react";

export default function FlyingMascot() {
  const ref = useRef<HTMLDivElement>(null);

  // 可調參數
  const TRAVEL_MS = 5200; // 每段飛行時間
  const EASE = "cubic-bezier(0.25, 0.1, 0.25, 1)"; // 慢進慢出但非常平順
  // 活動範圍（以視口像素 px 計算；避免貼邊）
  const PADDING_X = 24;
  const PADDING_TOP = 80;   // 避免碰到網站導覽列/按鈕
  const PADDING_BOTTOM = 120;

  // 取得穩定的視口大小（iOS 用 visualViewport，其他退回 innerWidth/innerHeight）
  const getViewport = () => {
    const vv = (typeof window !== "undefined" && (window as any).visualViewport) || null;
    const width = vv?.width ?? window.innerWidth ?? document.documentElement.clientWidth;
    const height = vv?.height ?? window.innerHeight ?? document.documentElement.clientHeight;
    return { width, height };
  };

  // 在安全區間內取亂數目標
  const pickTarget = () => {
    const { width, height } = getViewport();
    const x = PADDING_X + Math.random() * Math.max(1, width - PADDING_X * 2);
    const y =
      PADDING_TOP + Math.random() * Math.max(1, height - (PADDING_TOP + PADDING_BOTTOM));
    return { x, y };
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 基本樣式（交給合成器處理）
    el.style.willChange = "transform";
    el.style.backfaceVisibility = "hidden";
    el.style.transform = "translate3d(10px, 10px, 0)";
    el.style.transitionProperty = "transform";

    let cancel = false;
    let timer: number | null = null;

    const moveOnce = () => {
      if (cancel) return;
      const { x, y } = pickTarget();

      // 設定這一段的過渡（時間＋曲線）
      el.style.transitionDuration = `${TRAVEL_MS}ms`;
      el.style.transitionTimingFunction = EASE;

      // 只改一次 transform，交給 CSS transition 平滑補間（更省幀，手機最穩）
      el.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;

      // 到站後再挑下一個目標
      timer = window.setTimeout(moveOnce, TRAVEL_MS);
    };

    // 視口發生變化（iOS 工具列收放），下一段重新取目標即可
    const onResize = () => {
      // 不打斷當前過渡，等下一段再根據新視口移動
      // 若要立刻校正，可取消下一行註解：
      // moveOnce();
    };

    window.addEventListener("resize", onResize);
    (window as any).visualViewport?.addEventListener?.("resize", onResize);

    // 啟動
    moveOnce();

    return () => {
      cancel = true;
      if (timer) window.clearTimeout(timer);
      window.removeEventListener("resize", onResize);
      (window as any).visualViewport?.removeEventListener?.("resize", onResize);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 z-20 pointer-events-none"
      style={{ transform: "translate3d(10px, 10px, 0)" }}
    >
      <div className="relative w-32 sm:w-40 md:w-48">
        {/* 雲：輕微上下漂，視覺細膩 */}
        <img
          src="/images/cloud.webp"
          alt="cloud"
          className="block w-[65%] h-auto mx-auto animate-pulse-slow"
          loading="lazy"
          decoding="async"
        />
        {/* 角色站在雲上 */}
        <img
          src="/images/dog.webp"
          alt="dog"
          className="absolute left-1/2 bottom-[50%] w-[50%] h-auto"
          style={{ transform: "translateX(-50%)" }}
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}
