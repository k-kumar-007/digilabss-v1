"use client";

import { useRef, type ReactNode } from "react";
import { m, useScroll, useTransform } from "motion/react";

/**
 * Soft parallax on the hero product shot: it settles back and lifts slightly as
 * the page moves under it. Driven by `useScroll`, which reads scroll position
 * off the compositor rather than a `scroll` event listener, and only animates
 * `transform` + `opacity` so it never triggers layout or paint.
 */
export function HeroConsoleParallax({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.93]);
  const opacity = useTransform(scrollYProgress, [0, 0.75, 1], [1, 1, 0.35]);

  return (
    <m.div
      ref={ref}
      style={{ y, scale, opacity, transformOrigin: "center top" }}
      className="will-change-transform"
    >
      {children}
    </m.div>
  );
}
