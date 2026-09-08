import type { Transition } from "motion/react";

/**
 * Shared motion constants.
 *
 * Most of the page's reveals are CSS transitions (see `globals.css`); Framer
 * Motion is reserved for the scroll-linked and presence work. These two values
 * keep both systems on the same curve so the motion reads as one language.
 * `--ease-out-expo` in the stylesheet is the same cubic-bezier as below.
 */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/** Used for the floating CTA, where a spring reads better than a duration. */
export const springSoft: Transition = {
  type: "spring",
  stiffness: 140,
  damping: 24,
  mass: 0.9,
};
