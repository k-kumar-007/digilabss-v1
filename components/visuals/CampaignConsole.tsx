const SERIES = [
  8, 14, 11, 19, 24, 21, 30, 27, 38, 44, 41, 52, 58, 55, 67, 74, 71, 83, 92, 100,
];

const W = 520;
const H = 190;

/** Catmull-Rom through the points, emitted as cubic beziers — no chart library. */
function buildPath(values: number[]) {
  const max = Math.max(...values);
  const step = W / (values.length - 1);

  const points = values.map((value, index) => ({
    x: index * step,
    y: H - (value / max) * (H - 18) - 9,
  }));

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return { line: d, area: `${d} L ${W} ${H} L 0 ${H} Z` };
}

const { line, area } = buildPath(SERIES);

const CHIPS = [
  { label: "CPA", value: "$41", delta: "−38%" },
  { label: "CTR", value: "3.9%", delta: "+72%" },
  { label: "Spend", value: "$284k", delta: "scaled" },
];

/**
 * The page's recurring product object: a "campaign console".
 *
 * Built from SVG and CSS rather than a screenshot — it stays sharp on any
 * display, weighs about two kilobytes instead of a few hundred, animates its
 * own contents, and adds nothing to the JS bundle. This is a server component:
 * the line draws itself with a CSS `stroke-dashoffset` transition that the
 * shared reveal observer triggers.
 */
export function CampaignConsole({ className = "" }: { className?: string }) {
  return (
    <div
      data-reveal-trigger=""
      className={`relative w-full overflow-hidden rounded-[26px] border border-white/12 bg-[#0c0d10]/85 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
      />

      <div className="flex items-center gap-3 border-b border-white/8 px-5 py-3.5">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-white/16" />
          <span className="size-2.5 rounded-full bg-white/16" />
          <span className="size-2.5 rounded-full bg-white/16" />
        </div>
        <p className="text-[11px] font-medium tracking-wide text-white/60">Campaign console</p>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-emerald-300">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          Live
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/55">
              Return on ad spend
            </p>
            <p className="mt-1.5 text-4xl font-semibold tracking-tight text-white tabular-nums sm:text-5xl">
              4.8<span className="text-white/55">×</span>
            </p>
          </div>
          <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1.5 text-right">
            <p className="text-[10px] uppercase tracking-[0.12em] text-emerald-300/70">90 days</p>
            <p className="text-sm font-semibold text-emerald-300">+126%</p>
          </div>
        </div>

        {/* Aspect ratio is fixed in CSS, so the chart box exists before paint. */}
        <div className="relative mt-5" style={{ aspectRatio: `${W} / ${H}` }}>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-full w-full"
            role="img"
            aria-label="Return on ad spend trending upward over ninety days"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="cc-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2997ff" stopOpacity="0.42" />
                <stop offset="100%" stopColor="#2997ff" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="cc-stroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0071e3" />
                <stop offset="55%" stopColor="#2997ff" />
                <stop offset="100%" stopColor="#a0e9ff" />
              </linearGradient>
            </defs>

            {[0.25, 0.5, 0.75].map((y) => (
              <line
                key={y}
                x1="0"
                x2={W}
                y1={H * y}
                y2={H * y}
                stroke="rgba(255,255,255,0.055)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            ))}

            <path
              d={area}
              fill="url(#cc-fill)"
              data-reveal-fade=""
              style={{ ["--reveal-delay" as string]: "550ms" }}
            />

            <path
              d={line}
              data-reveal-draw=""
              pathLength={1}
              fill="none"
              stroke="url(#cc-stroke)"
              strokeWidth="2.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <span
            aria-hidden="true"
            data-reveal-tile=""
            style={{ ["--reveal-delay" as string]: "1350ms" }}
            className="absolute right-0 top-[4%] size-2.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-[#a0e9ff] shadow-[0_0_0_5px_rgba(41,151,255,0.22)]"
          />
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2.5">
          {CHIPS.map((chip, index) => (
            <div
              key={chip.label}
              data-reveal-tile=""
              style={{ ["--reveal-delay" as string]: `${700 + index * 90}ms` }}
              className="rounded-xl border border-white/8 bg-white/[0.035] px-3 py-2.5"
            >
              <p className="text-[10px] uppercase tracking-[0.12em] text-white/55">{chip.label}</p>
              <p className="mt-0.5 text-base font-semibold tracking-tight text-white">{chip.value}</p>
              <p className="text-[11px] font-medium text-[#2997ff]">{chip.delta}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
