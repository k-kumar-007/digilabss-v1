"use client";

import { useRef, useState } from "react";
import { m, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import type { ReactNode } from "react";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { trackSectionView } from "@/lib/analytics";

const BEATS = [
  {
    kicker: "01 — Creative",
    title: "Volume beats opinion.",
    body: "We ship creative in batches, not one-offs. The account learns faster, and the winner is chosen by spend, not by taste.",
  },
  {
    kicker: "02 — Signal",
    title: "Clean data, or none of it works.",
    body: "Server-side tracking, deduplicated events, and revenue fed back from your CRM. Meta optimises toward money, not clicks.",
  },
  {
    kicker: "03 — Compounding",
    title: "Built to hold at scale.",
    body: "Budgets step up only when the unit economics survive the last increase. Growth that stays put once you stop looking at it.",
  },
];

/**
 * The centrepiece scroll moment.
 *
 * One tall section pins its viewport and advances through three beats as you
 * scroll — the whole "what it is" story told in a single continuous gesture
 * rather than three stacked blocks. Pinning is `position: sticky` (compositor
 * driven, no scroll handler); only opacity and transform ever change.
 */
export function Story({ visuals }: { visuals: ReactNode[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(BEATS.length - 1, Math.floor(value * BEATS.length));
    setActive((current) => {
      if (current !== next) trackSectionView(`story_beat_${next + 1}`);
      return next;
    });
  });

  // The section fades its own edges so it joins the page rather than starting it.
  const glow = useTransform(scrollYProgress, [0, 0.5, 1], [0.35, 1, 0.35]);

  return (
    <section id="approach" ref={ref} data-nav-theme="dark" className="relative h-[320vh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <m.div
          aria-hidden="true"
          style={{ opacity: glow }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(41,151,255,0.16),transparent_68%)] blur-2xl"
        />

        <div className="u-shell relative grid w-full items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          {/* Text column */}
          <div className="relative">
            <p className="text-eyebrow uppercase text-white/55">The approach</p>

            {/* Height is reserved by the tallest beat, so swapping copy shifts nothing. */}
            <div className="relative mt-6 grid">
              {BEATS.map((beat, index) => (
                <m.div
                  key={beat.title}
                  className="col-start-1 row-start-1"
                  animate={{
                    opacity: active === index ? 1 : 0,
                    y: active === index ? 0 : 18,
                    filter: active === index ? "blur(0px)" : "blur(6px)",
                  }}
                  transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
                  style={{ pointerEvents: active === index ? "auto" : "none" }}
                  aria-hidden={active !== index}
                >
                  <p className="text-[12px] font-semibold tracking-[0.16em] text-[#2997ff]">
                    {beat.kicker}
                  </p>
                  <h2 className="u-balance mt-3 max-w-[14ch] text-headline text-white">
                    {beat.title}
                  </h2>
                  <p className="u-pretty mt-5 max-w-[42ch] text-lede text-white/55">
                    {beat.body}
                  </p>
                </m.div>
              ))}
            </div>

            {/* Progress rail */}
            <div className="mt-10 flex gap-2" role="presentation">
              {BEATS.map((beat, index) => (
                <span
                  key={beat.title}
                  className={`h-[3px] flex-1 max-w-16 rounded-full transition-colors duration-500 ${
                    active >= index ? "bg-[#2997ff]" : "bg-white/12"
                  }`}
                />
              ))}
            </div>
          </div>

          {/*
            Visual column. The three panels are stacked in a single grid cell
            rather than absolutely positioned: the column then sizes itself to
            the tallest panel, which means no clipping on narrow screens and no
            dead space on wide ones — both of which a fixed aspect ratio caused.
            Since the height is settled at layout time, swapping panels still
            reflows nothing.
          */}
          <div className="grid w-full max-w-[540px] items-center justify-self-center lg:justify-self-end">
            {BEATS.map((beat, index) => (
              <m.div
                key={beat.title}
                className="col-start-1 row-start-1"
                animate={{
                  opacity: active === index ? 1 : 0,
                  scale: active === index ? 1 : 0.96,
                }}
                transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
                aria-hidden={active !== index}
              >
                {visuals[index]}
              </m.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
