"use client";

import { useEffect, useRef } from "react";

type CounterProps = {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
};

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Counts up when scrolled into view.
 *
 * Two deliberate choices:
 *  - the final value is server-rendered, so it is correct before hydration,
 *    with JS disabled, and to crawlers;
 *  - the animation writes straight to `textContent` each frame instead of
 *    calling setState sixty times a second, so React never re-renders and the
 *    number never triggers layout (the parent reserves the width, and the
 *    figures are `tabular-nums`).
 */
export function Counter({ to, decimals = 0, prefix = "", suffix = "", duration = 1700 }: CounterProps) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    const format = (value: number) =>
      `${prefix}${value.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`;

    let raf = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          node.textContent = format(to * easeOutExpo(progress));
          if (progress < 1) raf = requestAnimationFrame(tick);
        };

        node.textContent = format(0);
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, decimals, prefix, suffix, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {to.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
