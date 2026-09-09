"use client";

import { useRef, type ReactNode } from "react";
import { m, useScroll, useTransform } from "motion/react";

/**
 * Gentle scroll-linked parallax on the snapshot panel: it drifts up a little
 * as the page moves under it.
 *
 * `useScroll` reads scroll position off the compositor rather than a `scroll`
 * event listener, and only `transform` is animated, so this never triggers
 * layout or paint. Framer Motion respects the OS reduced-motion setting through
 * `MotionConfig` in the root layout, so this flattens automatically.
 */
export function ParallaxPanel({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [36, -36]);

  return (
    <m.div ref={ref} style={{ y }} className="will-change-transform">
      {children}
    </m.div>
  );
}
