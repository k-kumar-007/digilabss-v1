import dynamic from "next/dynamic";
import { HeroCta } from "@/components/site/HeroCta";

// The animated background is the only thing on this screen that needs JS to
// look right, so it is the only thing code-split out of the first payload.
const Aurora = dynamic(() => import("@/components/fx/Aurora").then((m) => m.Aurora));

/**
 * Opening frame — the headline, the promise, the two actions, and nothing else.
 *
 * The performance panel used to sit inside this section and crept into the
 * first viewport on taller screens. It now lives in its own band below, so the
 * opening frame is one idea on every device and the panel is something you
 * scroll to find.
 *
 * The headline is plain server-rendered HTML animated with a CSS keyframe, not
 * a Motion component. That is deliberate: it is the LCP element, and a
 * JS-driven `opacity: 0 -> 1` would hold LCP hostage until React hydrates. This
 * paints on the browser's first frame.
 */
export function Hero() {
  return (
    <section
      id="top"
      data-nav-theme="light"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden pb-16 pt-28 sm:pb-24 sm:pt-32"
    >
      <Aurora />

      {/* Fades the wash into the white page so the section has no hard edge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white"
      />

      <div className="u-shell relative z-10 text-center">
        <p className="a-rise u-eyebrow justify-center" style={{ animationDelay: "60ms" }}>
          <span className="size-1.5 rounded-full bg-accent" />
          Digilabss · Meta Ads &amp; performance marketing
        </p>

        <h1
          className="a-rise u-balance mx-auto mt-5 max-w-[15ch] text-display text-ink"
          style={{ animationDelay: "120ms" }}
        >
          Ad spend that <span className="u-accent-text">pays for itself.</span>
        </h1>

        <p
          className="a-rise u-balance mx-auto mt-6 max-w-[48ch] text-lede text-body"
          style={{ animationDelay: "220ms" }}
        >
          We design <strong className="font-semibold text-ink">Meta Ads</strong> for
          Tier&nbsp;1 brands — built on creative volume, clean signal, and
          measurable <strong className="font-semibold text-ink">business growth</strong>.
        </p>

        <div className="a-rise mt-9" style={{ animationDelay: "320ms" }}>
          <HeroCta />
        </div>
      </div>

      <div
        aria-hidden="true"
        className="a-fade pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center"
        style={{ animationDelay: "1.2s" }}
      >
        <svg viewBox="0 0 24 24" className="a-scroll-hint size-5 text-muted" fill="none">
          <path
            d="M12 4v15m0 0 6-6m-6 6-6-6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}
