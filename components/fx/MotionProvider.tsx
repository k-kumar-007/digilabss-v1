"use client";

import { LazyMotion, domAnimation, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Animation runtime.
 *
 * `LazyMotion` + the `m` components load the DOM animation feature set only,
 * rather than the full library that `motion.*` would pull in — roughly a third
 * of the bytes. (An async `features` loader was measurably *worse* here: the
 * bundler ended up duplicating the core across two chunks.)
 *
 * `strict` throws if anyone imports the heavyweight `motion.*` components by
 * accident, which is what keeps that saving from quietly regressing.
 *
 * `reducedMotion="user"` makes every Motion animation respect the OS setting
 * without a check at each call site.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
