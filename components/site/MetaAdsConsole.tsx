"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { trackCtaClick, trackSectionView } from "@/lib/analytics";
import { usePerfProfile } from "@/lib/usePerfProfile";

/**
 * The twelve beats of the sequence.
 *
 * `id` matches a `data-panel` in the dashboard markup. `stage` maps the metric
 * onto the part of our process it belongs to, so the animation reads as an
 * argument — analyse, design, launch, measure, optimise, scale — rather than a
 * tour of a UI.
 */
const STEPS = [
  { id: "spend", stage: "Analyse", label: "Total Ad Spend", caption: "Track exactly where the budget goes — down to the ad set." },
  { id: "revenue", stage: "Measure", label: "Total Revenue", caption: "Tie revenue back to the campaigns that actually produced it." },
  { id: "results", stage: "Measure", label: "Purchases / Leads", caption: "Count customers, not clicks. Results are the only scoreboard." },
  { id: "reach", stage: "Launch", label: "Reach", caption: "Know how many of the right people ever saw the brand." },
  { id: "clicks", stage: "Analyse", label: "Link Clicks", caption: "Read genuine interest, and where attention turns into traffic." },
  { id: "cpr", stage: "Optimise", label: "Cost per Result", caption: "Drive the same outcome for less, week after week." },
  { id: "trend", stage: "Scale", label: "Performance Trend", caption: "Spot the growth pattern early enough to put money behind it." },
  { id: "campaigns", stage: "Optimise", label: "Top Campaigns", caption: "Find the campaigns carrying the account, and feed them." },
  { id: "ads", stage: "Design", label: "Top Performing Ads", caption: "Learn which creative and which message actually convert." },
  { id: "keymetrics", stage: "Measure", label: "Key Metrics", caption: "Watch the full funnel, from impression to add-to-cart to revenue." },
  { id: "audience", stage: "Analyse", label: "Audience Breakdown", caption: "Discover the segments that respond — then build for them." },
  { id: "objective", stage: "Scale", label: "Objective Performance", caption: "Match every objective to a measurable business outcome." },
] as const;

const STAGES = ["Analyse", "Design", "Launch", "Measure", "Optimise", "Scale"] as const;

const STEP_MS = 2600;

/**
 * The animated Meta Ads command centre.
 *
 * A sequential focus animation: the console lights one panel at a time, dims
 * the rest, and pans itself so the active panel sits in the middle of the
 * frame — the way an analyst actually reads a dashboard.
 *
 * How it stays cheap:
 *  - the dashboard arrives as `children`, so it stays a *server* component and
 *    none of its markup enters the client bundle;
 *  - focus is one class moved between elements, and every visual change is
 *    `opacity` / `transform` / `box-shadow` (see globals.css);
 *  - the pan is a single `translate3d` on the canvas wrapper;
 *  - the timer only runs while the section is on screen and the tab is visible;
 *  - the depth-of-field blur is gated behind the device profile, so phones and
 *    low-power machines never pay for it;
 *  - reduced motion disables the whole sequence and shows the console fully lit.
 */
export function MetaAdsConsole({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(0);
  const [armed, setArmed] = useState(false);

  const frameRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { ready, reducedMotion, allowHeavyEffects } = usePerfProfile();
  const sequenceEnabled = ready && !reducedMotion;

  /* ---- Focus class + pan --------------------------------------------- */

  const applyFocus = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const frame = frameRef.current;
    if (!canvas || !frame) return;

    const panels = canvas.querySelectorAll<HTMLElement>("[data-panel]");
    const targetId = STEPS[index].id;
    let target: HTMLElement | null = null;

    panels.forEach((panel) => {
      const isTarget = panel.dataset.panel === targetId;
      panel.classList.toggle("is-focus", isTarget);
      if (isTarget) target = panel;
    });

    if (!target) return;

    // Pan the canvas so the focused panel lands in the middle of the frame.
    // `offsetTop` is relative to the canvas because the canvas is positioned.
    const node = target as HTMLElement;
    const frameHeight = frame.clientHeight;
    const canvasHeight = canvas.scrollHeight;
    const centre = node.offsetTop + node.offsetHeight / 2 - frameHeight / 2;
    const maxPan = Math.max(0, canvasHeight - frameHeight);
    const pan = Math.min(Math.max(centre, 0), maxPan);

    canvas.style.transform = `translate3d(0, ${-pan}px, 0)`;
  }, []);

  /* ---- Autoplay, only while visible ---------------------------------- */

  useEffect(() => {
    if (!sequenceEnabled) return;

    const section = sectionRef.current;
    if (!section) return;

    const stop = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    const start = () => {
      if (timerRef.current) return;
      timerRef.current = setInterval(() => {
        setActive((current) => (current + 1) % STEPS.length);
      }, STEP_MS);
    };

    let onScreen = false;

    const sync = () => {
      if (onScreen && !document.hidden) {
        setArmed(true);
        start();
      } else {
        stop();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) trackSectionView("meta_ads_console");
        sync();
      },
      { threshold: 0.25 },
    );

    observer.observe(section);
    document.addEventListener("visibilitychange", sync);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      stop();
    };
  }, [sequenceEnabled]);

  /* ---- Re-apply focus on step change and on resize -------------------- */

  useEffect(() => {
    if (!armed || !sequenceEnabled) return;
    applyFocus(active);
  }, [active, armed, sequenceEnabled, applyFocus]);

  useEffect(() => {
    if (!armed || !sequenceEnabled) return;

    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => applyFocus(active), 180);
    };

    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
    };
  }, [active, armed, sequenceEnabled, applyFocus]);

  /* ---- Manual selection restarts the timer from that step ------------- */

  const selectStep = (index: number) => {
    setActive(index);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setActive((current) => (current + 1) % STEPS.length);
      }, STEP_MS);
    }
  };

  const step = STEPS[active];

  return (
    <section
      id="approach"
      ref={sectionRef}
      data-nav-theme="light"
      data-cta-suppress=""
      className="relative overflow-hidden bg-surface py-20 sm:py-28"
    >
      {/* Soft accent wash — static CSS, no canvas needed at this size. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(70% 50% at 12% 0%, rgba(28,110,242,0.07) 0%, rgba(28,110,242,0) 60%)," +
            "radial-gradient(60% 45% at 92% 20%, rgba(124,92,245,0.06) 0%, rgba(124,92,245,0) 60%)",
        }}
      />

      <div className="u-shell-wide relative">
        {/* ---- Heading ------------------------------------------------- */}
        <div data-reveal="" className="mx-auto max-w-[52rem] text-center">
          <p className="u-eyebrow justify-center">
            <span className="size-1.5 rounded-full bg-accent" />
            The command centre
          </p>

          <h2 className="u-balance mt-5 text-headline text-ink">
            We design <span className="u-accent-text">Meta Ads</span> that turn
            attention into business growth.
          </h2>

          <p className="u-pretty mx-auto mt-6 max-w-[46ch] text-lede text-body">
            Anyone can launch a campaign. We read the data, find what converts,
            and rebuild the creative around it — every week.
          </p>
        </div>

        {/* ---- Console + narrative ------------------------------------- */}
        <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.85fr)] lg:items-start lg:gap-10">
          {/* Narrative rail */}
          <div data-reveal="" className="lg:sticky lg:top-24">
            <div className="u-card p-6">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.09em] text-accent-ink">
                  {step.stage}
                </span>
                <span className="text-[11px] font-medium text-muted u-tabular">
                  {String(active + 1).padStart(2, "0")} / {STEPS.length}
                </span>
              </div>

              {/* Fixed min-height: swapping copy must not resize the card. */}
              <div className="mt-4 min-h-[6.5rem] sm:min-h-[6rem]">
                <h3 className="text-title text-ink">{step.label}</h3>
                <p className="u-pretty mt-2 text-[15px] leading-relaxed text-body">
                  {step.caption}
                </p>
              </div>

              {/* Progress across the twelve beats. */}
              <div className="mt-5 grid grid-cols-12 gap-1" role="tablist" aria-label="Dashboard walkthrough">
                {STEPS.map((s, index) => (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={index === active}
                    aria-label={s.label}
                    onClick={() => selectStep(index)}
                    className="group h-6 cursor-pointer"
                  >
                    <span
                      className={`block h-[3px] w-full rounded-full transition-colors duration-500 ${
                        index === active
                          ? "bg-accent"
                          : index < active
                            ? "bg-accent-line"
                            : "bg-line-strong group-hover:bg-muted"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/*
              The pipeline this all serves, as a stepper rather than a row of
              chips joined by arrows — six chips and five arrows cannot share a
              line at this column width, and a wrapped arrow left dangling at the
              end of a row looked like a bug.
            */}
            <ol className="mt-7 grid grid-cols-3 gap-x-3 gap-y-4 sm:grid-cols-6">
              {STAGES.map((stage) => {
                const isActive = stage === step.stage;
                return (
                  <li key={stage}>
                    <span
                      className={`block h-[3px] rounded-full transition-colors duration-500 ${
                        isActive ? "bg-accent" : "bg-line-strong"
                      }`}
                    />
                    <span
                      className={`mt-2 block text-[11px] transition-colors duration-500 ${
                        isActive ? "font-semibold text-accent-ink" : "text-muted"
                      }`}
                    >
                      {stage}
                    </span>
                  </li>
                );
              })}
            </ol>

            <div className="mt-7 hidden lg:block">
              <a
                href="#book"
                onClick={() => trackCtaClick("console", "Connect with us")}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[15px] font-semibold text-white transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
              >
                Connect with us
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          {/* Console frame */}
          <div data-reveal="" style={{ ["--reveal-delay" as string]: "120ms" }}>
            <div
              data-console=""
              data-armed={armed && sequenceEnabled ? "true" : "false"}
              data-rich={allowHeavyEffects ? "true" : "false"}
              className="relative rounded-[22px] border border-line bg-white p-1.5 shadow-[0_2px_4px_rgba(11,13,18,0.04),0_30px_70px_-30px_rgba(11,13,18,0.28)]"
            >
              {/* Window chrome */}
              <div className="relative flex items-center px-3 py-2">
                <span className="flex gap-1.5" aria-hidden="true">
                  <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="size-2.5 rounded-full bg-[#febc2e]" />
                  <span className="size-2.5 rounded-full bg-[#28c840]" />
                </span>
                <span className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-surface px-3 py-1 text-[11px] font-medium text-muted">
                  digilabss · campaign intelligence
                </span>
              </div>

              {/*
                The viewport. Fixed height + overflow hidden is what makes the
                pan possible: the canvas inside is taller than the frame and
                slides under it.
              */}
              <div
                ref={frameRef}
                className="relative h-[420px] overflow-hidden rounded-[16px] bg-surface-2 sm:h-[520px] lg:h-[560px]"
              >
                <div ref={canvasRef} data-console-canvas="" className="relative">
                  {children}
                </div>

                {/* Edge fades, so panned content leaves the frame softly. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-surface-2 to-transparent"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-surface-2 to-transparent"
                />
              </div>
            </div>

            {/* Mobile CTA, below the console where the thumb is. */}
            <div className="mt-7 lg:hidden">
              <a
                href="#book"
                onClick={() => trackCtaClick("console_mobile", "Connect with us")}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[15px] font-semibold text-white active:scale-[0.98]"
              >
                Connect with us
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>

        {/* ---- Closing line -------------------------------------------- */}
        <div data-reveal="" className="mx-auto mt-16 max-w-[44rem] text-center sm:mt-20">
          <p className="u-balance text-title text-ink">
            Don&rsquo;t just run ads. Build campaigns that{" "}
            grow your business.
          </p>
        </div>
      </div>
    </section>
  );
}
