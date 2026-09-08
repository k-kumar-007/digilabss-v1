import { donutSegments, smoothPath } from "@/lib/chart";
import {
  ADS,
  AUDIENCE,
  CAMPAIGNS,
  KEY_METRICS,
  KPIS,
  OBJECTIVES,
  TREND,
} from "./data";

/**
 * The console's rendered surface.
 *
 * This is a **server component**: every panel below is plain markup that ships
 * as HTML, not JavaScript. The focus sequence is driven from outside by moving
 * one class between `[data-panel]` elements, so twelve animated panels cost
 * zero bytes of per-panel client code.
 *
 * Built from HTML and SVG rather than a screenshot, which is what makes it
 * responsive, readable at any size, and animatable a panel at a time.
 */

const PANEL = "u-card overflow-hidden bg-white";
const LABEL = "text-[11px] font-semibold uppercase tracking-[0.1em] text-muted";

const TONE: Record<string, { fg: string; bg: string }> = {
  blue: { fg: "text-[#1c6ef2]", bg: "bg-[#eaf1fe]" },
  teal: { fg: "text-[#0a7f61]", bg: "bg-[#e4f7f1]" },
  violet: { fg: "text-[#6a49e8]", bg: "bg-[#f0ecfe]" },
  amber: { fg: "text-[#b96f00]", bg: "bg-[#fdf1de]" },
};

function Delta({ value, up }: { value: string; up: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[12px] font-semibold u-tabular ${
        up ? "text-[#0a7f61]" : "text-[#1c6ef2]"
      }`}
    >
      <svg viewBox="0 0 12 12" className="size-3" aria-hidden="true" fill="currentColor">
        <path d={up ? "M6 2.5 10 8H2z" : "M6 9.5 2 4h8z"} />
      </svg>
      {value}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Chart geometry (computed once, at module scope)                           */
/* -------------------------------------------------------------------------- */

const TW = 640;
const TH = 176;
const TMAX = 230;

const SERIES = [
  { key: "revenue", color: "var(--color-viz-teal)", data: TREND.revenue },
  { key: "spend", color: "var(--color-viz-blue)", data: TREND.spend },
  { key: "clicks", color: "var(--color-viz-amber)", data: TREND.clicks },
  { key: "purchases", color: "var(--color-viz-violet)", data: TREND.purchases },
].map((series) => ({ ...series, ...smoothPath(series.data, TW, TH, TMAX) }));

const R = 52;
const CIRC = 2 * Math.PI * R;
const SEGMENTS = donutSegments(OBJECTIVES.map((o) => o.pct), CIRC);

const AUD_MAX = 40;

export function DashboardCanvas() {
  return (
    <div className="w-full p-3 sm:p-4">
      {/* ---------------------------------------------------------------- */}
      {/*  Chrome                                                          */}
      {/* ---------------------------------------------------------------- */}
      <div className="mb-3 flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-lg bg-ink text-white">
            <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
              <path d="M4 19h16v2H2V3h2zM8 15l4-5 3 3 5-6v6l-5 5-3-3-4 5z" />
            </svg>
          </span>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold tracking-tight text-ink">
              Performance Overview
            </p>
            <p className="text-[11px] text-muted">Aug 1 – Aug 31, 2025 · All campaigns</p>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/*  KPI row — six focus targets                                     */}
      {/* ---------------------------------------------------------------- */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        {KPIS.map((kpi) => {
          const tone = TONE[kpi.tone];
          return (
            <div key={kpi.id} data-panel={kpi.id} className={`${PANEL} p-3`}>
              <span className={`grid size-7 place-items-center rounded-lg ${tone.bg} ${tone.fg}`}>
                <svg
                  viewBox="0 0 24 24"
                  className="size-[15px]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {kpi.id === "spend" && <path d="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />}
                  {kpi.id === "revenue" && <path d="M3 17l6-6 4 4 8-8M21 7v6h-6" />}
                  {kpi.id === "results" && <path d="M16 21v-2a4 4 0 0 0-8 0v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />}
                  {kpi.id === "reach" && <path d="M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1zM17 8a5 5 0 0 1 0 8" />}
                  {kpi.id === "clicks" && <path d="m4 4 7 16 2-7 7-2z" />}
                  {kpi.id === "cpr" && <path d="M20.6 13.4 12 22l-9-9V4h9zM7.5 7.5h.01" />}
                </svg>
              </span>
              <p className="mt-2 truncate text-[11px] font-medium text-body">{kpi.label}</p>
              <p className="mt-0.5 text-[19px] font-semibold tracking-tight text-ink u-tabular sm:text-[21px]">
                {kpi.value}
              </p>
              <Delta value={kpi.delta} up={kpi.up} />
            </div>
          );
        })}
      </div>

      {/* ---------------------------------------------------------------- */}
      {/*  Trend + objective mix                                           */}
      {/* ---------------------------------------------------------------- */}
      <div className="mt-2.5 grid gap-2.5 lg:grid-cols-[1.75fr_1fr]">
        <div data-panel="trend" className={`${PANEL} p-4`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[13px] font-semibold tracking-tight text-ink">Performance Trend</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              {[
                { label: "Revenue", color: "var(--color-viz-teal)" },
                { label: "Ad Spend", color: "var(--color-viz-blue)" },
                { label: "Link Clicks", color: "var(--color-viz-amber)" },
                { label: "Purchases", color: "var(--color-viz-violet)" },
              ].map((s) => (
                <span key={s.label} className="inline-flex items-center gap-1.5 text-[10px] text-body">
                  <span className="size-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                  {s.label}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mt-3" style={{ aspectRatio: `${TW} / ${TH}` }}>
            <svg
              viewBox={`0 0 ${TW} ${TH}`}
              className="h-full w-full"
              preserveAspectRatio="none"
              role="img"
              aria-label="Revenue, ad spend, link clicks and purchases all trending upward across August"
            >
              <defs>
                {SERIES.map((s) => (
                  <linearGradient key={s.key} id={`fill-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={s.color} stopOpacity="0.22" />
                    <stop offset="100%" stopColor={s.color} stopOpacity="0" />
                  </linearGradient>
                ))}
              </defs>

              {[0.25, 0.5, 0.75, 1].map((y) => (
                <line
                  key={y}
                  x1="0"
                  x2={TW}
                  y1={TH * y}
                  y2={TH * y}
                  stroke="var(--color-line-soft)"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              ))}

              {SERIES.map((s, index) => (
                <g key={s.key}>
                  <path
                    d={s.area}
                    fill={`url(#fill-${s.key})`}
                    data-reveal-fade=""
                    style={{ ["--reveal-delay" as string]: `${500 + index * 90}ms` }}
                  />
                  <path
                    d={s.line}
                    data-reveal-draw=""
                    pathLength={1}
                    fill="none"
                    stroke={s.color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    style={{ ["--reveal-delay" as string]: `${index * 110}ms` }}
                  />
                </g>
              ))}
            </svg>
          </div>

          <div className="mt-2 flex justify-between text-[10px] text-muted u-tabular">
            {["Aug 1", "Aug 8", "Aug 15", "Aug 22", "Aug 31"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
        </div>

        <div data-panel="objective" className={`${PANEL} p-4`}>
          <p className="text-[13px] font-semibold tracking-tight text-ink">
            Campaign Objective Performance
          </p>

          <div className="mt-3 flex items-center gap-4">
            <div className="relative shrink-0">
              <svg viewBox="0 0 128 128" className="size-[104px] -rotate-90" role="img" aria-label="Results by campaign objective">
                {OBJECTIVES.map((objective, index) => (
                  <circle
                    key={objective.label}
                    cx="64"
                    cy="64"
                    r={R}
                    fill="none"
                    stroke={objective.tone}
                    strokeWidth="15"
                    strokeDasharray={`${SEGMENTS[index].dash} ${SEGMENTS[index].gap}`}
                    strokeDashoffset={SEGMENTS[index].offset}
                    data-reveal-fade=""
                    style={{ ["--reveal-delay" as string]: `${300 + index * 120}ms` }}
                  />
                ))}
              </svg>
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <p className="text-[17px] font-semibold leading-none tracking-tight text-ink u-tabular">
                    1,482
                  </p>
                  <p className="mt-0.5 text-[9px] text-muted">Total results</p>
                </div>
              </div>
            </div>

            <ul className="min-w-0 flex-1 space-y-1.5">
              {OBJECTIVES.map((objective) => (
                <li key={objective.label} className="flex items-center gap-2 text-[11px]">
                  <span className="size-2 shrink-0 rounded-sm" style={{ backgroundColor: objective.tone }} />
                  <span className="min-w-0 flex-1 truncate text-body">{objective.label}</span>
                  <span className="font-semibold text-ink u-tabular">{objective.pct}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/*  Campaigns + audience                                            */}
      {/* ---------------------------------------------------------------- */}
      <div className="mt-2.5 grid gap-2.5 lg:grid-cols-[1.75fr_1fr]">
        <div data-panel="campaigns" className={`${PANEL} p-4`}>
          <p className="text-[13px] font-semibold tracking-tight text-ink">Top Campaigns</p>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-left">
              <thead>
                <tr className={LABEL}>
                  <th className="pb-2 font-semibold">Campaign</th>
                  <th className="pb-2 font-semibold">Spend</th>
                  <th className="pb-2 font-semibold">Results</th>
                  <th className="pb-2 text-right font-semibold">ROAS</th>
                </tr>
              </thead>
              <tbody>
                {CAMPAIGNS.map((campaign) => (
                  <tr key={campaign.name} className="border-t border-line-soft">
                    <td className="py-2 pr-3">
                      <span className="flex items-center gap-2">
                        <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: campaign.tone }} />
                        <span className="truncate text-[12px] font-medium text-ink">{campaign.name}</span>
                      </span>
                    </td>
                    <td className="py-2 pr-3 text-[12px] text-body u-tabular">{campaign.spend}</td>
                    <td className="py-2 pr-3 text-[12px] text-body u-tabular">{campaign.results}</td>
                    <td className="py-2 text-right text-[12px] font-semibold text-ink u-tabular">
                      {campaign.roas}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div data-panel="audience" className={`${PANEL} p-4`}>
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold tracking-tight text-ink">Audience Breakdown</p>
            <div className="flex gap-2.5 text-[10px] text-body">
              <span className="inline-flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-[#1c6ef2]" />Men
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-[#7c5cf5]" />Women
              </span>
            </div>
          </div>

          <div className="mt-4 flex h-[120px] items-end gap-2">
            {AUDIENCE.map((row, index) => (
              <div key={row.bucket} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="flex h-[100px] w-full items-end justify-center gap-1">
                  <div
                    data-reveal-bar=""
                    style={{
                      height: `${(row.men / AUD_MAX) * 100}%`,
                      ["--reveal-delay" as string]: `${index * 70}ms`,
                    }}
                    className="w-full max-w-[13px] rounded-t-[2px] bg-[#1c6ef2]"
                  />
                  <div
                    data-reveal-bar=""
                    style={{
                      height: `${(row.women / AUD_MAX) * 100}%`,
                      ["--reveal-delay" as string]: `${index * 70 + 35}ms`,
                    }}
                    className="w-full max-w-[13px] rounded-t-[2px] bg-[#7c5cf5]"
                  />
                </div>
                <span className="text-[9px] text-muted u-tabular">{row.bucket}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/*  Creative + key metrics                                          */}
      {/* ---------------------------------------------------------------- */}
      <div className="mt-2.5 grid gap-2.5 lg:grid-cols-[1.75fr_1fr]">
        <div data-panel="ads" className={`${PANEL} p-4`}>
          <p className="text-[13px] font-semibold tracking-tight text-ink">Top Performing Ads</p>

          <ul className="mt-3 space-y-2">
            {ADS.map((ad) => (
              <li
                key={ad.title}
                className="flex items-center gap-3 rounded-xl border border-line-soft bg-surface-2 p-2"
              >
                {/* Creative stand-ins: gradient blocks, so there is no image
                    request and nothing to go blurry at any size. */}
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${ad.art} text-white`}
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M4 16.5 9 11l3.5 3.5L16 11l4 4.5M4 5h16v14H4z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-semibold text-ink">{ad.title}</p>
                  <p className="truncate text-[11px] text-muted">{ad.campaign}</p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-[12px] font-semibold text-ink u-tabular">{ad.ctr}</p>
                  <p className="text-[10px] text-muted">CTR</p>
                </div>
                <div className="hidden shrink-0 text-right sm:block">
                  <p className="text-[12px] font-semibold text-ink u-tabular">{ad.results}</p>
                  <p className="text-[10px] text-muted">Results</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div data-panel="keymetrics" className={`${PANEL} p-4`}>
          <p className="text-[13px] font-semibold tracking-tight text-ink">
            Key Metrics <span className="font-normal text-muted">(vs previous)</span>
          </p>

          <ul className="mt-3 space-y-0">
            {KEY_METRICS.map((metric) => (
              <li
                key={metric.label}
                className="flex items-center justify-between gap-2 border-t border-line-soft py-[7px] first:border-t-0 first:pt-0"
              >
                <span className="truncate text-[11px] text-body">{metric.label}</span>
                <span className="flex shrink-0 items-center gap-2">
                  <span className="text-[12px] font-semibold text-ink u-tabular">{metric.value}</span>
                  <Delta value={metric.delta} up />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
