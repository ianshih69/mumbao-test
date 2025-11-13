import { useEffect, useState, RefObject } from "react";

interface UseLazyImageOptions {
  /** 是否立即載入（用於首屏圖片） */
  immediate?: boolean;
  /** IntersectionObserver 的 threshold */
  threshold?: number;
  /** IntersectionObserver 的 rootMargin */
  rootMargin?: string;
  /** 元素的 ref */
  elementRef?: RefObject<HTMLElement | null>;
}

/**
 * 延遲載入圖片的 Hook
 * 當圖片進入視窗時才開始載入並顯示
 */
export function useLazyImage(options: UseLazyImageOptions = {}) {
  const { immediate = false, threshold = 0.1, rootMargin = "0px", elementRef } = options;
  const [isVisible, setIsVisible] = useState(immediate);
  const [shouldLoad, setShouldLoad] = useState(immediate);

  useEffect(() => {
    // 如果立即載入，不需要觀察
    if (immediate) {
      setIsVisible(true);
      setShouldLoad(true);
      return;
    }

    if (!elementRef?.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            // 延遲一點點再顯示，確保圖片開始載入
            setTimeout(() => {
              setIsVisible(true);
            }, 50);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(elementRef.current);

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [immediate, threshold, rootMargin, elementRef]);

  return {
    isVisible,
    shouldLoad,
  };
}

