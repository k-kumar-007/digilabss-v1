import dynamic from "next/dynamic";
import { HeroCta } from "@/components/site/HeroCta";

// The animated background is the only thing here that needs JS to look right,
// so it is the only thing code-split out of the first payload.
const Aurora = dynamic(() => import("@/components/fx/Aurora").then((m) => m.Aurora));

/**
 * The written promise, directly under the brand film.
 *
 * This used to be the opening frame. With the film taking that slot, the
 * headline moved here — and it is still the page's `<h1>`, so the document
 * outline and the SEO story are unchanged; only the order on screen moved.
 *
 * The headline animates with a CSS keyframe rather than a Motion component.
 * That was originally to protect LCP, and it still matters: the film's poster
 * is now the LCP element, and nothing here should be competing for the main
 * thread while that paints.
 */
export function Banner() {
  return (
    <section
      id="promise"
      data-nav-theme="light"
      className="relative isolate overflow-hidden py-24 text-center sm:py-32"
    >
      <Aurora />

      {/* Fades the wash into the white page so the section has no hard edge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white"
      />

      <div className="u-shell relative z-10">
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
    </section>
  );
}
