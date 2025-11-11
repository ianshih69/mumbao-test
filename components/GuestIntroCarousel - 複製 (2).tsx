"use client";

import React, { useEffect, useMemo, useRef } from "react";
import Image from "next/image";

export default function GuestIntroCarousel() {
  const images = useMemo(
    () => [1, 2, 3, 4, 5].map((n) => `/images/page3/page3-${n}.webp`),
    []
  );

  const trackRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  // Drag / momentum state
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const lastX = useRef(0);
  const lastT = useRef(0);
  const vX = useRef(0);
  const raf = useRef<number | null>(null);
  const momentumTickT = useRef(0);
  const totalMoveDistance = useRef(0);
  const snapEnabled = useRef(true);

  // overscroll tracking
  const overLeft = useRef(0);
  const overRight = useRef(0);

  const stopMomentum = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = null;
    momentumTickT.current = 0;
  };

  // 量測卡片寬與間距，得到一格距離（snapStep）
  const getSnapGeom = () => {
    const el = trackRef.current!;
    const cards = el.querySelectorAll("article") as NodeListOf<HTMLElement>;
    if (!cards || cards.length < 2) return null;

    const w0 = cards[0].getBoundingClientRect().width;
    const left0 = cards[0].offsetLeft;
    const left1 = cards[1].offsetLeft;
    const gap = Math.max(0, left1 - left0 - w0);
    const snapStep = w0 + gap;

    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    // 同時最多顯示 3 張 → 右端正常位置的左索引 = images.length - 3
    const maxIndex = Math.max(0, images.length - 3);

    return { snapStep, maxScrollLeft, maxIndex };
  };

  // 內層 translate 橡皮筋彈回 0
  const resetInnerTransform = (duration = 280) => {
    const inner = innerRef.current;
    if (!inner) return;

    const from = overRight.current ? -overRight.current : overLeft.current;
    const dir = overRight.current ? -1 : 1; // 右邊界為負方向

    const startT = performance.now();
    const animate = (t: number) => {
      const p = Math.min((t - startT) / duration, 1);
      const current = (1 - p) * Math.abs(from);
      inner.style.transform =
        current > 0 ? `translate3d(${dir * current}px,0,0)` : "translate3d(0,0,0)";

      if (p < 1) requestAnimationFrame(animate);
      else {
        inner.style.transform = "translate3d(0,0,0)";
        overLeft.current = 0;
        overRight.current = 0;
      }
    };
    requestAnimationFrame(animate);
  };

  const snapToNearest = () => {
    const el = trackRef.current;
    if (!el || !snapEnabled.current) return;

    const g = getSnapGeom();
    if (!g) return;
    const { snapStep, maxIndex } = g;

    const current = el.scrollLeft;
    let targetIndex = Math.round(current / snapStep);
    targetIndex = Math.max(0, Math.min(targetIndex, maxIndex));
    const targetScroll = targetIndex * snapStep;

    if (Math.abs(current - targetScroll) < 1) return;

    const distance = Math.abs(targetScroll - current);
    const duration = Math.max(300, Math.min(600, distance * 0.6));
    const startTime = performance.now();
    const startScroll = current;

    const animate = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      el.scrollLeft = startScroll + (targetScroll - startScroll) * p;
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  };

  const momentum = () => {
    const el = trackRef.current;
    if (!el) return;

    const now = performance.now();
    if (momentumTickT.current === 0) momentumTickT.current = now;
    const dt = now - momentumTickT.current;
    momentumTickT.current = now;

    vX.current *= 0.94;
    if (Math.abs(vX.current) < 0.08) {
      stopMomentum();

      // 慣性結束：若有超界 → 先彈回；否則吸附到最近
      if (overRight.current || overLeft.current) {
        resetInnerTransform();
      } else {
        snapToNearest();
      }
      return;
    }

    const g = getSnapGeom();
    if (!g) return;
    const { maxScrollLeft, snapStep } = g;

    const delta = vX.current * Math.min(dt, 20);
    let intended = el.scrollLeft - delta;

    if (intended < 0) {
      el.scrollLeft = 0;
      overLeft.current = Math.min(Math.abs(intended), snapStep); // 左邊最多 1 格
      overRight.current = 0;
      innerRef.current!.style.transform = `translate3d(${overLeft.current}px,0,0)`;
    } else if (intended > maxScrollLeft) {
      el.scrollLeft = maxScrollLeft;
      overRight.current = Math.min(intended - maxScrollLeft, snapStep); // 右邊最多 1 格
      overLeft.current = 0;
      innerRef.current!.style.transform = `translate3d(${-overRight.current}px,0,0)`;
    } else {
      el.scrollLeft = intended;
      if (overLeft.current || overRight.current) {
        innerRef.current!.style.transform = "translate3d(0,0,0)";
        overLeft.current = 0;
        overRight.current = 0;
      }
    }

    raf.current = requestAnimationFrame(momentum);
  };

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const el = trackRef.current;
    if (!el) return;
    isDown.current = true;
    el.setPointerCapture(e.pointerId);
    startX.current = e.clientX;
    scrollStart.current = el.scrollLeft;
    lastX.current = e.clientX;
    lastT.current = performance.now();
    vX.current = 0;
    totalMoveDistance.current = 0;
    stopMomentum();
    el.style.scrollBehavior = "auto";
    snapEnabled.current = false;

    // 暫停 snap，避免拖曳時強制貼齊
    innerRef.current?.classList.remove("snap-x", "snap-mandatory");
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const el = trackRef.current;
    if (!el || !isDown.current) return;
    e.preventDefault();

    const g = getSnapGeom();
    if (!g) return;
    const { maxScrollLeft, snapStep } = g;

    const dx = e.clientX - startX.current;
    const intended = scrollStart.current - dx;
    totalMoveDistance.current = Math.abs(dx);

    // 平滑估計滑速
    const now = performance.now();
    const dt = now - lastT.current;
    if (dt > 0) {
      const dist = e.clientX - lastX.current;
      const instantV = dist / dt;
      vX.current = vX.current * 0.7 + instantV * 0.3;
    }
    lastX.current = e.clientX;
    lastT.current = now;

    // 邊界 → 橡皮筋
    if (intended < 0) {
      el.scrollLeft = 0;
      overLeft.current = Math.min(Math.abs(intended), snapStep);
      overRight.current = 0;
      innerRef.current!.style.transform = `translate3d(${overLeft.current}px,0,0)`;
    } else if (intended > maxScrollLeft) {
      el.scrollLeft = maxScrollLeft;
      overRight.current = Math.min(intended - maxScrollLeft, snapStep);
      overLeft.current = 0;
      innerRef.current!.style.transform = `translate3d(${-overRight.current}px,0,0)`;
    } else {
      el.scrollLeft = intended;
      if (overLeft.current || overRight.current) {
        innerRef.current!.style.transform = "translate3d(0,0,0)";
        overLeft.current = 0;
        overRight.current = 0;
      }
    }
  };

  const onPointerUpOrLeave: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const el = trackRef.current;
    if (!el) return;

    if (isDown.current) {
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {}
    }
    isDown.current = false;

    innerRef.current?.classList.add("snap-x", "snap-mandatory");
    stopMomentum();
    snapEnabled.current = true;

    const g = getSnapGeom();

    // 若在右端超界（把第 5 張拉到中間），放手 → 滑回右端正常位置（顯示 3~5）
    if (g && overRight.current > 0) {
      const targetScroll = g.maxIndex * g.snapStep;
      const from = el.scrollLeft;
      const dist = Math.abs(targetScroll - from);
      const duration = Math.max(300, Math.min(600, dist * 0.6));

      const start = performance.now();
      const animate = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        el.scrollLeft = from + (targetScroll - from) * p;
        if (p < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);

      resetInnerTransform(duration);
      return;
    }

    // 左端若有超界，也彈回左端（保險處理）
    if (g && overLeft.current > 0) {
      resetInnerTransform();
      el.scrollLeft = 0;
      return;
    }

    // 沒超界 → 慣性 or 吸附
    if (Math.abs(vX.current) > 0.05 && totalMoveDistance.current > 0.5) {
      momentum();
    } else {
      snapToNearest();
    }
  };

  // 讓直向滾輪轉成水平滾動（滑鼠也順）
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      el.scrollLeft += e.deltaY;
      e.preventDefault();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel as any);
  }, []);

  // 鍵盤左右鍵
  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    const el = trackRef.current;
    if (!el) return;
    const step = el.clientWidth * 0.9;
    if (e.key === "ArrowRight") el.scrollBy({ left: step, behavior: "smooth" });
    else if (e.key === "ArrowLeft") el.scrollBy({ left: -step, behavior: "smooth" });
  };

  useEffect(() => () => stopMomentum(), []);

  return (
    <section className="w-full py-6 md:py-8 lg:py-10">
      <style jsx>{`
        /* 隱藏原生 scrollbar（Chrome/Edge） */
        .track::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="mx-auto max-w-[1400px] px-4">
        <header className="mb-4 md:mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">房客介紹</h2>
          <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 mt-1">
            按住圖片拖曳即可左右滑動
          </p>
        </header>

        <div
          ref={trackRef}
          className="track relative overflow-x-auto overscroll-x-contain focus:outline-none"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
            willChange: "scroll-position",
            scrollBehavior: "auto",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUpOrLeave}
          onPointerCancel={onPointerUpOrLeave}
          onPointerLeave={onPointerUpOrLeave}
          onKeyDown={onKeyDown}
          role="region"
          aria-label="房客介紹圖片滑動區"
          tabIndex={0}
        >
          {/* 內層滑軌 */}
          <div
            ref={innerRef}
            className="flex gap-[30px] snap-x snap-mandatory touch-pan-x select-none cursor-grab active:cursor-grabbing px-4"
            style={{ willChange: "transform" }}
          >
            {images.map((src, i) => (
              <article
                key={src}
                className="snap-start shadow-sm ring-1 ring-black/5 bg-white/70 backdrop-blur-sm overflow-hidden flex-shrink-0 basis-full sm:basis-[calc((100%-30px)/2)] lg:basis-[calc((100%-60px)/3)]"
                style={{ pointerEvents: "auto", userSelect: "none" }}
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
