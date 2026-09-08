/**
 * Shared motion constants.
 *
 * Most of the page's reveals are CSS transitions (see `globals.css`); Framer
 * Motion is reserved for the scroll-linked and presence work. This curve keeps
 * both systems on the same easing, so the motion reads as one language —
 * `--ease-out-expo` in the stylesheet is the same cubic-bezier.
 */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
