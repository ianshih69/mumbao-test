"use client";

import React, { useMemo, useRef } from "react";
import Image from "next/image";

/**
 * 超精簡版：
 * - 不用 scroll-snap、不用慣性
 * - 只有：拖曳捲動 + 左右邊界「橡皮筋超界(translateX)」+ 放手彈回
 * - 保證：第 5 張在最右端可被拉到中間（第二欄）
 */
export default function GuestIntroCarousel() {
  const images = useMemo(
    () => [1, 2, 3, 4, 5].map((n) => `/images/page3/page3-${n}.webp`),
    []
  );

  const trackRef = useRef<HTMLDivElement | null>(null); // scroll 容器
  const innerRef = useRef<HTMLDivElement | null>(null); // 內容列（做 translateX 橡皮筋）

  // 拖曳狀態
  const isDown = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);
  const overLeft = useRef(0);
  const overRight = useRef(0);

  // 幾何量測（每次用到時即時量）：回傳必要值
  const measure = () => {
    const track = trackRef.current;
    const inner = innerRef.current;
    if (!track || !inner) return null;

    const cards = inner.querySelectorAll("article") as NodeListOf<HTMLElement>;
    if (!cards || cards.length < 2) return null;

    const w0 = cards[0].getBoundingClientRect().width;
    const l0 = cards[0].offsetLeft;
    const l1 = cards[1].offsetLeft;
    const gap = Math.max(0, l1 - l0 - w0);
    const step = w0 + gap; // 一格距離

    const maxScroll = track.scrollWidth - track.clientWidth;

    // —— 右邊把最後一張拉到「第二欄」所需的精確位移 —— //
    const last = cards[cards.length - 1];
    const lastLeft = last.offsetLeft;
    const desiredSecondColLeft = l0 + step; // 第二欄左邊界
    const lastLeftAtRightEdge = lastLeft - maxScroll;
    // 需要額外向左推（負向 translateX）的量：
    let needRight = lastLeftAtRightEdge - desiredSecondColLeft;

    // 保底：至少 0.9 格，好拉得動；最多 1.6 格，避免過頭
    const fallback = step * 0.9;
    if (!isFinite(needRight) || needRight < fallback * 0.2) needRight = fallback;
    needRight = Math.max(fallback, Math.min(needRight, step * 1.6));

    // —— 左邊把第一張拉到「中間（第二欄）」所需位移（向右推，正值）—— //
    // 在 scrollLeft=0 時，第 1 張距第二欄差距就是 step
    const needLeft = step; // 夠了

    return {
      step,
      maxScroll,
      overscrollMaxLeft: needLeft,
      overscrollMaxRight: needRight,
    };
  };

  // 橡皮筋彈回（把 inner 的 transform 從 ±overscroll 動畫回到 0）
  const bounceBack = (duration = 260) => {
    const inner = innerRef.current;
    if (!inner) return;
    const from = overRight.current ? -overRight.current : overLeft.current;
    const dir = overRight.current ? -1 : 1; // 右邊界用負方向位移
    const start = performance.now();

    const frame = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      const cur = (1 - p) * Math.abs(from);
      inner.style.transform =
        cur > 0 ? `translate3d(${dir * cur}px,0,0)` : "translate3d(0,0,0)";
      if (p < 1) requestAnimationFrame(frame);
      else {
        inner.style.transform = "translate3d(0,0,0)";
        overLeft.current = 0;
        overRight.current = 0;
      }
    };
    requestAnimationFrame(frame);
  };

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const track = trackRef.current;
    if (!track) return;
    isDown.current = true;
    try {
      track.setPointerCapture(e.pointerId);
    } catch {}
    startX.current = e.clientX;
    startScroll.current = track.scrollLeft;
    overLeft.current = 0;
    overRight.current = 0;
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const track = trackRef.current;
    const inner = innerRef.current;
    if (!track || !inner || !isDown.current) return;
    e.preventDefault();

    const g = measure();
    if (!g) return;

    const dx = e.clientX - startX.current;
    const intended = startScroll.current - dx; // 正常的 scrollLeft 目標

    // 左邊界：scrollLeft < 0 → 用內層向右推（正值）
    if (intended < 0) {
      track.scrollLeft = 0;
      const extra = Math.min(Math.abs(intended), g.overscrollMaxLeft);
      overLeft.current = extra;
      overRight.current = 0;
      inner.style.transform = `translate3d(${extra}px,0,0)`;
      return;
    }

    // 右邊界：scrollLeft > maxScroll → 用內層向左推（負值）
    if (intended > g.maxScroll) {
      track.scrollLeft = g.maxScroll;
      const extra = Math.min(intended - g.maxScroll, g.overscrollMaxRight);
      overRight.current = extra;
      overLeft.current = 0;
      inner.style.transform = `translate3d(${-extra}px,0,0)`;
      return;
    }

    // 中間區域：正常捲動，清除超界 transform
    track.scrollLeft = intended;
    if (overLeft.current || overRight.current) {
      inner.style.transform = "translate3d(0,0,0)";
      overLeft.current = 0;
      overRight.current = 0;
    }
  };

  const onPointerUpOrLeave: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const track = trackRef.current;
    if (!track) return;

    if (isDown.current) {
      try {
        track.releasePointerCapture(e.pointerId);
      } catch {}
    }
    isDown.current = false;

    // 如果有超界，內層彈回；同時把 scrollLeft 對回合法的端點
    const g = measure();
    if (!g) return;

    if (overRight.current > 0) {
      // 回到右端正常位置（顯示 3～5）
      track.scrollLeft = g.maxScroll;
      bounceBack(260);
      return;
    }
    if (overLeft.current > 0) {
      // 回到左端 0
      track.scrollLeft = 0;
      bounceBack(260);
      return;
    }
  };

  return (
    <section className="w-full py-6 md:py-8 lg:py-10">
      <div className="mx-auto max-w-[1400px] px-4">
        <header className="mb-4 md:mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">房客介紹</h2>
          <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 mt-1">
            按住圖片拖曳即可左右滑動
          </p>
        </header>

        {/* 不使用 snap，避免與橡皮筋互相牽制 */}
        <div
          ref={trackRef}
          className="relative overflow-x-auto overscroll-x-contain focus:outline-none"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUpOrLeave}
          onPointerCancel={onPointerUpOrLeave}
          onPointerLeave={onPointerUpOrLeave}
          role="region"
          aria-label="房客介紹圖片滑動區"
          tabIndex={0}
        >
          <div
            ref={innerRef}
            className="flex gap-[30px] touch-pan-x select-none cursor-grab active:cursor-grabbing px-4"
            style={{ willChange: "transform" }}
          >
            {images.map((src, i) => (
              <article
                key={src}
                className="shadow-sm ring-1 ring-black/5 bg-white/70 backdrop-blur-sm overflow-hidden flex-shrink-0 basis-full sm:basis-[calc((100%-30px)/2)] lg:basis-[calc((100%-60px)/3)]"
                style={{ userSelect: "none" }}
              >
                <div className="relative w-full" style={{ aspectRatio: "6 / 7" }}>
                  <Image
                    src={src}
                    alt={`房客照片 ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                    priority={i < 3}
                    draggable={false}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
