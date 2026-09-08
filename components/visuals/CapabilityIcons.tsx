import type { ReactNode } from "react";

/**
 * Icons for the six capability cards.
 *
 * Drawn for these specific ideas rather than pulled from a generic set, and
 * built to one spec so they read as a family: a 24px grid, 1.7px rounded
 * strokes in `currentColor`, and one soft `currentColor` fill per icon that
 * gives the shape a second plane without resorting to gradients or shadows.
 *
 * Read left to right they trace the funnel the section describes:
 * creative → structure → data → conversion → measurement → cadence.
 */

const SOFT = 0.16;

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/** Creative studio — artboards stacked in a batch, the front one holding a visual. */
export const CreativeStudioIcon = () => (
  <Icon>
    {/* The batch behind: work already shipped. */}
    <rect
      x="8"
      y="2.6"
      width="13.4"
      height="13.4"
      rx="2.4"
      fill="currentColor"
      opacity={SOFT}
      stroke="none"
    />
    {/* The artboard in front. */}
    <rect x="2.6" y="8" width="13.4" height="13.4" rx="2.4" />
    <circle cx="6.5" cy="12" r="1.15" />
    <path d="M3.1 19.5 6.3 16.4l2 1.9 2.7-2.8 4.6 4.4" />
  </Icon>
);

/** Full-funnel structure — a literal funnel: wide intake, narrow qualified out. */
export const FullFunnelIcon = () => (
  <Icon>
    <path d="M4.6 6.8h14.8l-2.9 3.5H7.5z" fill="currentColor" opacity={SOFT} stroke="none" />
    <path d="M3.2 5.2h17.6a.8.8 0 0 1 .62 1.31L14.6 14v5.6a.8.8 0 0 1-1.16.72l-2.8-1.4a.8.8 0 0 1-.44-.72V14L2.58 6.51A.8.8 0 0 1 3.2 5.2Z" />
  </Icon>
);

/** Server-side tracking — racks sending a signal, rather than the browser doing it. */
export const ServerTrackingIcon = () => (
  <Icon>
    <rect
      x="2.6"
      y="13.4"
      width="12.8"
      height="6.6"
      rx="1.9"
      fill="currentColor"
      opacity={SOFT}
      stroke="none"
    />
    <rect x="2.6" y="4" width="12.8" height="6.6" rx="1.9" />
    <rect x="2.6" y="13.4" width="12.8" height="6.6" rx="1.9" />
    <circle cx="5.9" cy="7.3" r=".85" fill="currentColor" stroke="none" />
    <circle cx="5.9" cy="16.7" r=".85" fill="currentColor" stroke="none" />
    {/* Signal leaving the server, not the page. */}
    <path d="M18 9.7a3.6 3.6 0 0 1 0 4.6" />
    <path d="M20.5 7.6a6.6 6.6 0 0 1 0 8.8" />
  </Icon>
);

/** Offer & landing tests — a page split A/B, with the winning variant marked. */
export const LandingTestIcon = () => (
  <Icon>
    <path
      d="M2.6 8.4H12V20H5a2.4 2.4 0 0 1-2.4-2.4Z"
      fill="currentColor"
      opacity={SOFT}
      stroke="none"
    />
    <rect x="2.6" y="4" width="18.8" height="16" rx="2.4" />
    <path d="M2.6 8.4h18.8" />
    <circle cx="5.3" cy="6.2" r=".7" fill="currentColor" stroke="none" />
    <circle cx="7.7" cy="6.2" r=".7" fill="currentColor" stroke="none" />
    <path d="M12 8.4V20" strokeDasharray="2 2.2" />
    <path d="m5.6 14.2 1.6 1.6 2.7-3.1" />
  </Icon>
);

/** Incrementality — the counterfactual, the actual, and the gap between them. */
export const IncrementalityIcon = () => (
  <Icon>
    {/*
      The shaded wedge between the dashed line and the curve *is* the
      incremental lift — what the ads caused, as opposed to what would have
      happened anyway. Two bars read as "a chart"; this reads as the idea.
    */}
    <path
      d="M3 15.2C7 15.2 9 13 12 10.9S17.6 6.6 21 5.6V15.2Z"
      fill="currentColor"
      opacity={0.2}
      stroke="none"
    />
    <path d="M3 15.2h18" strokeDasharray="2.2 2.4" />
    <path d="M3 15.2c4 0 6-2.2 9-4.3s5.6-4.3 9-5.3" />
    <path d="M16.6 5.1 21 5.6l-.9 4.3" />
  </Icon>
);

/** Weekly operating rhythm — a calendar with the same slot booked every week. */
export const WeeklyRhythmIcon = () => (
  <Icon>
    <path
      d="M5 4.6h14a2.4 2.4 0 0 1 2.4 2.4v2.5H2.6V7A2.4 2.4 0 0 1 5 4.6Z"
      fill="currentColor"
      opacity={SOFT}
      stroke="none"
    />
    <rect x="2.6" y="4.6" width="18.8" height="16.8" rx="2.4" />
    <path d="M2.6 9.5h18.8M8 2.6v4M16 2.6v4" />
    {/* A recurring slot, not a one-off date. */}
    <path d="M15.3 15.4A3.3 3.3 0 1 1 14.33 13.07" />
    <path d="M15.3 12.1v2.2h-2.2" />
  </Icon>
);
