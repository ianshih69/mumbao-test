"use client";

import React, { useEffect, useMemo, useRef } from "react";
import Image from "next/image";

export default function GuestIntroCarousel() {
  const images = useMemo(
    () => [1, 2, 3, 4, 5].map((n) => "/images/page3/page3-" + n + ".webp"),
    []
  );

  const trackRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  // drag/momentum 狀態
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const lastX = useRef(0);
  const lastT = useRef(0);
  const vX = useRef(0);
  const raf = useRef<number | null>(null);
  const tickT = useRef(0);
  const totalMove = useRef(0);

  // overscroll 狀態
  const overLeft = useRef(0);
  const overRight = useRef(0);

  const stopRAF = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = null;
    tickT.current = 0;
  };

  /**
   * 量測幾何（全都做防呆）：
   * snapStep: 卡寬 + gap
   * maxScrollLeft: 滾動極限
   * maxIndex: 就近吸附的最大 index
   * overscrollMaxRight: 讓最後一張到第二欄所需之精確 overscroll
   */
  const measure = () => {
    const track = trackRef.current;
    const inner = innerRef.current;
    if (!track || !inner) return null;

    const cards = inner.querySelectorAll("article") as NodeListOf<HTMLElement>;
    if (!cards || cards.length < 2) return null;

    const rect0 = cards[0].getBoundingClientRect();
    const w0 = rect0.width;
    const left0 = cards[0].offsetLeft;
    const left1 = cards[1].offsetLeft;
    if (!isFinite(w0) || !isFinite(left0) || !isFinite(left1)) return null;

    const gap = Math.max(0, left1 - left0 - w0);
    const snapStep = w0 + gap;

    const maxScrollLeft = track.scrollWidth - track.clientWidth;
    if (!isFinite(maxScrollLeft) || snapStep <= 0) return null;

    const maxIndex = Math.max(0, Math.round(maxScrollLeft / snapStep));

    // 右端需要的精確 overscroll（最後一張 -> 第二欄）
    const desiredSecondColLeft = left0 + snapStep;
    const lastIdx = cards.length - 1;
    const lastLeft = cards[lastIdx]?.offsetLeft ?? 0;
    const lastLeftAtRightEdge = lastLeft - maxScrollLeft;
    let overscrollMaxRight = lastLeftAtRightEdge - desiredSecondColLeft;
    overscrollMaxRight = Math.max(0, Math.min(overscrollMaxRight, snapStep * 1.6)); // 夾制

    return { snapStep, maxScrollLeft, maxIndex, overscrollMaxRight };
  };

  const resetInnerTransform = (duration = 260) => {
    const inner = innerRef.current;
    if (!inner) return;

    const from = overRight.current ? -overRight.current : overLeft.current;
    const dir = overRight.current ? -1 : 1;

    const start = performance.now();
    const step = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      const cur = (1 - p) * Math.abs(from);
      inner.style.transform =
        cur > 0
          ? "translate3d(" + String(dir * cur) + "px,0,0)"
          : "translate3d(0,0,0)";
      if (p < 1) requestAnimationFrame(step);
      else {
        inner.style.transform = "translate3d(0,0,0)";
        overLeft.current = 0;
        overRight.current = 0;
      }
    };
    requestAnimationFrame(step);
  };

  const snapToNearest = () => {
    const track = trackRef.current;
    if (!track) return;
    const g = measure();
    if (!g) return;

    const targetIndex = Math.max(
      0,
      Math.min(g.maxIndex, Math.round(track.scrollLeft / g.snapStep))
    );
    const targetScroll = targetIndex * g.snapStep;
    const start = performance.now();
    const from = track.scrollLeft;
    const dist = Math.abs(targetScroll - from);
    if (dist < 1) return;

    const duration = Math.max(260, Math.min(560, dist * 0.6));
    const step = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      track.scrollLeft = from + (targetScroll - from) * p;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const momentum = () => {
    const track = trackRef.current;
    const inner = innerRef.current;
    if (!track || !inner) return;

    const now = performance.now();
    if (tickT.current === 0) tickT.current = now;
    const dt = now - tickT.current;
    tickT.current = now;

    vX.current *= 0.94;
    if (Math.abs(vX.current) < 0.08) {
      stopRAF();
      if (overRight.current || overLeft.current) resetInnerTransform();
      else snapToNearest();
      return;
    }

    const g = measure();
    if (!g) return;

    const delta = vX.current * Math.min(dt, 20);
    const intended = track.scrollLeft - delta;

    if (intended < 0) {
      track.scrollLeft = 0;
      overLeft.current = Math.min(Math.abs(intended), g.snapStep);
      overRight.current = 0;
      inner.style.transform =
        "translate3d(" + String(overLeft.current) + "px,0,0)";
    } else if (intended > g.maxScrollLeft) {
      track.scrollLeft = g.maxScrollLeft;
      overRight.current = Math.min(
        intended - g.maxScrollLeft,
        g.overscrollMaxRight
      );
      overLeft.current = 0;
      inner.style.transform =
        "translate3d(" + String(-overRight.current) + "px,0,0)";
    } else {
      track.scrollLeft = intended;
      if (overLeft.current || overRight.current) {
        inner.style.transform = "translate3d(0,0,0)";
        overLeft.current = 0;
        overRight.current = 0;
      }
    }

    raf.current = requestAnimationFrame(momentum);
  };

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const track = trackRef.current;
    if (!track) return;
    isDown.current = true;
    try {
      track.setPointerCapture(e.pointerId);
    } catch {}
    startX.current = e.clientX;
    scrollStart.current = track.scrollLeft;
    lastX.current = e.clientX;
    lastT.current = performance.now();
    vX.current = 0;
    totalMove.current = 0;
    stopRAF();
    // 不動 classList，避免 snap/hydration 問題
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const track = trackRef.current;
    const inner = innerRef.current;
    if (!track || !inner || !isDown.current) return;
    e.preventDefault();

    const g = measure();
    if (!g) return;

    const dx = e.clientX - startX.current;
    const intended = scrollStart.current - dx;
    totalMove.current = Math.abs(dx);

    const now = performance.now();
    const dt = now - lastT.current;
    if (dt > 0) {
      const dist = e.clientX - lastX.current;
      const inst = dist / dt;
      vX.current = vX.current * 0.7 + inst * 0.3;
    }
    lastX.current = e.clientX;
    lastT.current = now;

    if (intended < 0) {
      track.scrollLeft = 0;
      overLeft.current = Math.min(Math.abs(intended), g.snapStep);
      overRight.current = 0;
      inner.style.transform =
        "translate3d(" + String(overLeft.current) + "px,0,0)";
    } else if (intended > g.maxScrollLeft) {
      track.scrollLeft = g.maxScrollLeft;
      overRight.current = Math.min(
        intended - g.maxScrollLeft,
        g.overscrollMaxRight
      );
      overLeft.current = 0;
      inner.style.transform =
        "translate3d(" + String(-overRight.current) + "px,0,0)";
    } else {
      track.scrollLeft = intended;
      if (overLeft.current || overRight.current) {
        inner.style.transform = "translate3d(0,0,0)";
        overLeft.current = 0;
        overRight.current = 0;
      }
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

    stopRAF();

    const g = measure();
    if (g && overRight.current > 0) {
      // 超界：平滑回到右端正常位置
      const targetScroll = g.maxIndex * g.snapStep;
      const from = track.scrollLeft;
      const dist = Math.abs(targetScroll - from);
      const duration = Math.max(260, Math.min(560, dist * 0.6));
      const start = performance.now();
      const step = (t: number) => {
        const p = Math.min((t - start) / duration, 1);
        track.scrollLeft = from + (targetScroll - from) * p;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      resetInnerTransform(duration);
      return;
    }

    if (g && overLeft.current > 0) {
      resetInnerTransform();
      track.scrollLeft = 0;
      return;
    }

    if (Math.abs(vX.current) > 0.05 && totalMove.current > 0.5) {
      momentum();
    } else {
      snapToNearest();
    }
  };

  useEffect(() => () => stopRAF(), []);

  return (
    <section className="w-full py-6 md:py-8 lg:py-10">
      <div className="mx-auto max-w-[1400px] px-4">
        <header className="mb-4 md:mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">房客介紹</h2>
          <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 mt-1">
            按住圖片拖曳即可左右滑動
          </p>
        </header>

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
            className="flex gap-[30px] snap-x snap-mandatory touch-pan-x select-none cursor-grab active:cursor-grabbing"
            style={{ willChange: "transform" }}
          >
            {images.map((src, i) => (
              <article
                key={src}
                className="snap-start shadow-sm ring-1 ring-black/5 bg-white/70 backdrop-blur-sm overflow-hidden flex-shrink-0
                           basis-full sm:basis-[calc((100%-30px)/2)] lg:basis-[calc((100%-60px)/3)]"
                style={{ pointerEvents: "auto", userSelect: "none" }}
              >
                <div className="relative w-full" style={{ aspectRatio: "6 / 7" }}>
                  <Image
                    src={src}
                    alt={"房客照片 " + (i + 1)}
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
