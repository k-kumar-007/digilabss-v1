import dynamic from "next/dynamic";
import { CampaignConsole } from "@/components/visuals/CampaignConsole";
import { HeroConsoleParallax } from "@/components/site/HeroConsoleParallax";
import { HeroCta } from "@/components/site/HeroCta";

// The animated background is the only thing on this screen that needs JS to
// look right, so it is the only thing code-split out of the first payload.
const Aurora = dynamic(() => import("@/components/fx/Aurora").then((m) => m.Aurora));

/**
 * Opening frame.
 *
 * The headline is plain server-rendered HTML animated with a CSS keyframe, not
 * a Motion component. That is deliberate: it is the LCP element, and a JS-driven
 * `opacity: 0 -> 1` would hold LCP hostage until React hydrates. This paints on
 * the browser's first frame.
 */
export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden pb-16 pt-28 sm:pb-24 sm:pt-32"
    >
      <Aurora />

      {/* Vignette: pulls focus to the centre and guarantees text contrast. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,transparent_10%,rgba(0,0,0,0.55)_70%,#000_100%)]"
      />

      <div className="u-shell relative z-10 text-center">
        <p
          className="a-rise text-eyebrow uppercase text-white/60"
          style={{ animationDelay: "80ms" }}
        >
          Digilabss · Paid social
        </p>

        <h1
          className="a-rise u-balance mx-auto mt-5 max-w-[16ch] text-display text-white"
          style={{ animationDelay: "160ms" }}
        >
          Scale that pays <span className="u-accent-text">for itself.</span>
        </h1>

        <p
          className="a-rise u-balance mx-auto mt-6 max-w-[46ch] text-lede text-white/60"
          style={{ animationDelay: "300ms" }}
        >
          Meta Ads for Tier&nbsp;1 brands. Built on creative volume, clean signal,
          and daily discipline.
        </p>

        <div className="a-rise mt-9" style={{ animationDelay: "420ms" }}>
          <HeroCta />
        </div>

        {/* Product shot. Aspect ratio is reserved before paint, so it cannot shift. */}
        <div
          className="a-rise mx-auto mt-14 max-w-[840px] sm:mt-20"
          style={{ animationDelay: "540ms" }}
        >
          <HeroConsoleParallax>
            <CampaignConsole />
          </HeroConsoleParallax>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="a-fade pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center"
        style={{ animationDelay: "1.2s" }}
      >
        <svg viewBox="0 0 24 24" className="a-scroll-hint size-5 text-white/50" fill="none">
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
