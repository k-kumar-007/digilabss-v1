import { Counter } from "@/components/fx/Counter";
import { Reveal, RevealGroup, RevealItem } from "@/components/fx/Reveal";

/**
 * "Why it matters", told entirely in numbers.
 *
 * Each stat carries a colour chosen for what it measures — budget blue,
 * returns green, cost-efficiency rose, speed amber — matching the snapshot
 * panel above so the page reads as one system.
 *
 * Every card also carries a small visualisation that draws itself as the card
 * scrolls in: bars grow, the gauge sweeps, the cost line falls, the timeline
 * fills. All of it runs on the shared reveal observer and the existing
 * `data-reveal-*` CSS hooks, so the whole section still ships zero JavaScript
 * beyond the counters.
 */

const STATS = [
  {
    to: 184,
    prefix: "$",
    suffix: "M",
    label: "Managed ad spend",
    note: "Across 40+ Tier 1 brands",
    color: "#1c6ef2",
    viz: "bars",
  },
  {
    to: 4.8,
    decimals: 1,
    suffix: "×",
    label: "Median blended ROAS",
    note: "Trailing twelve months",
    color: "#0a7f61",
    viz: "gauge",
  },
  {
    to: 38,
    prefix: "−",
    suffix: "%",
    label: "Cost per acquisition",
    note: "First 90 days, average",
    color: "#c2185b",
    viz: "decline",
  },
  {
    to: 11,
    suffix: " days",
    label: "To first winning ad",
    note: "From kickoff call",
    color: "#a35f00",
    viz: "timeline",
  },
] as const;

const BARS = [26, 38, 33, 52, 61, 57, 74, 88];

/** Ascending spend, as a small column chart. */
function BarsViz() {
  return (
    <div className="flex h-12 items-end gap-1.5" aria-hidden="true">
      {BARS.map((value, index) => (
        <span
          key={index}
          data-reveal-bar=""
          style={{
            height: `${value}%`,
            ["--reveal-delay" as string]: `${260 + index * 55}ms`,
          }}
          className="flex-1 rounded-t-[2px] bg-[color:var(--stat)]"
        />
      ))}
    </div>
  );
}

/**
 * A gauge sweeping to 4.8 of a possible 6.
 *
 * Uses its own `data-stat-gauge` hook rather than the shared
 * `data-reveal-draw`: that one animates a path to *fully* drawn, and this arc
 * has to stop at 80%. Setting the dash inline instead would lose, because an
 * inline style beats the stylesheet rule that animates the offset.
 */
function GaugeViz() {
  return (
    <div className="h-12" aria-hidden="true">
      <svg viewBox="0 0 120 62" className="h-full w-auto" fill="none">
        <path
          d="M8 56a52 52 0 0 1 104 0"
          stroke="currentColor"
          className="text-line"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M8 56a52 52 0 0 1 104 0"
          data-stat-gauge=""
          pathLength={1}
          stroke="var(--stat)"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/** Cost falling away over the first ninety days. */
function DeclineViz() {
  const line = "M2 8c18 0 26 6 42 14s28 16 74 18";
  return (
    <div className="h-12" aria-hidden="true">
      <svg viewBox="0 0 120 48" className="h-full w-full" fill="none" preserveAspectRatio="none">
        {/*
          Area under the curve, so this card carries the same visual weight as
          the bars and the timeline rather than reading as a stray line.

          `fillOpacity`, not `opacity`: the reveal animates the CSS `opacity`
          property, and that overrides an SVG `opacity` attribute — which
          painted this area at full strength instead of as a tint.
        */}
        <path
          d={`${line} L120 48 L2 48 Z`}
          fill="var(--stat)"
          fillOpacity={0.16}
          data-reveal-fade=""
          style={{ ["--reveal-delay" as string]: "700ms" }}
        />
        <path
          d={line}
          data-reveal-draw=""
          pathLength={1}
          stroke="var(--stat)"
          strokeWidth="3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ ["--reveal-delay" as string]: "240ms" }}
        />
      </svg>
    </div>
  );
}

/** Eleven days, the winner landing partway through. */
function TimelineViz() {
  return (
    <div className="flex h-12 items-center gap-1" aria-hidden="true">
      {Array.from({ length: 11 }).map((_, index) => (
        <span
          key={index}
          data-reveal-tile=""
          style={{ ["--reveal-delay" as string]: `${240 + index * 45}ms` }}
          className={`h-2.5 flex-1 rounded-full ${
            index < 8 ? "bg-[color:var(--stat)]" : "bg-[color:var(--stat)]/25"
          }`}
        />
      ))}
    </div>
  );
}

const VIZ = {
  bars: BarsViz,
  gauge: GaugeViz,
  decline: DeclineViz,
  timeline: TimelineViz,
} as const;

export function Stats() {
  return (
    <section id="results" data-nav-theme="light" className="relative bg-white py-24 sm:py-32">
      <div className="u-shell">
        <Reveal>
          <p className="u-eyebrow">The numbers</p>
          <h2 className="u-balance mt-4 max-w-[13ch] text-headline text-ink">
            Proof, before promises.
          </h2>
        </Reveal>

        <RevealGroup className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => {
            const Viz = VIZ[stat.viz];
            return (
              <RevealItem key={stat.label}>
                <div
                  data-stat-card=""
                  style={{ ["--stat" as string]: stat.color }}
                  className="relative h-full overflow-hidden rounded-2xl border border-line bg-white p-6"
                >
                  {/* A wash of the stat's own colour, kept faint. */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-28"
                    style={{
                      background:
                        "radial-gradient(120% 100% at 50% 0%, color-mix(in oklab, var(--stat) 12%, transparent) 0%, transparent 70%)",
                    }}
                  />

                  {/* Rule that draws across as the card arrives. */}
                  <span
                    aria-hidden="true"
                    data-stat-rule=""
                    className="absolute inset-x-0 top-0 h-[3px] bg-[color:var(--stat)]"
                  />

                  <div className="relative">
                    <p className="text-[clamp(2.5rem,4.6vw,3.25rem)] font-semibold leading-none tracking-[-0.04em] text-ink u-tabular">
                      <Counter
                        to={stat.to}
                        decimals={"decimals" in stat ? stat.decimals : undefined}
                        prefix={"prefix" in stat ? stat.prefix : undefined}
                        suffix={stat.suffix}
                      />
                    </p>

                    <p className="mt-4 text-[15px] font-semibold tracking-tight text-ink">
                      {stat.label}
                    </p>
                    <p className="mt-1 text-[14px] text-muted">{stat.note}</p>

                    <div className="mt-6 text-[color:var(--stat)]">
                      <Viz />
                    </div>
                  </div>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>

        <Reveal delay={150}>
          <p className="mt-14 max-w-[56ch] text-[13px] leading-relaxed text-muted">
            Figures are illustrative placeholders for this demo build. In a live
            engagement every number on this page is pulled from the client&rsquo;s
            own reporting and dated.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
