const shell =
  "relative w-full overflow-hidden rounded-[26px] border border-white/12 bg-[#0c0d10]/85 p-6 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:p-7";

/*
 * All three story visuals are server components. Their internal motion is CSS
 * driven by the shared reveal observer, so a panel full of animating tiles
 * costs nothing in the JS bundle.
 */

/* -------------------------------------------------------------------------- */
/*  1 — Creative volume                                                       */
/* -------------------------------------------------------------------------- */

const TILES = [
  { h: 52, tone: "from-[#2997ff]/45 to-[#0071e3]/10", live: true },
  { h: 72, tone: "from-white/16 to-white/[0.03]" },
  { h: 44, tone: "from-[#ff7a45]/35 to-[#ff7a45]/5" },
  { h: 64, tone: "from-white/14 to-white/[0.03]" },
  { h: 58, tone: "from-[#a0e9ff]/35 to-[#2997ff]/8", live: true },
  { h: 40, tone: "from-white/12 to-white/[0.02]" },
  { h: 68, tone: "from-[#5856d6]/40 to-[#5856d6]/5" },
  { h: 48, tone: "from-white/16 to-white/[0.03]" },
  { h: 60, tone: "from-[#2997ff]/40 to-[#0071e3]/8", live: true },
];

export function CreativeVolumeVisual() {
  return (
    <div data-reveal-trigger="" className={shell}>
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/55">
          Creative pipeline
        </p>
        <p className="text-[11px] font-semibold text-[#2997ff]">142 / week</p>
      </div>

      <div className="mt-5 columns-3 gap-2.5">
        {TILES.map((tile, index) => (
          <div
            key={index}
            data-reveal-tile=""
            style={{
              height: tile.h,
              ["--reveal-delay" as string]: `${index * 45}ms`,
            }}
            className={`mb-2.5 break-inside-avoid rounded-lg bg-gradient-to-br ${tile.tone} ring-1 ring-inset ring-white/8`}
          >
            {tile.live && (
              <span className="m-2 inline-block rounded bg-black/45 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-emerald-300">
                Winner
              </span>
            )}
          </div>
        ))}
      </div>

      <p className="mt-1 text-[11px] text-white/55">
        Every asset tagged, tested, and retired on evidence.
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  2 — Clean signal                                                          */
/* -------------------------------------------------------------------------- */

const NODES = [
  { label: "Pixel", detail: "Browser events" },
  { label: "Conversions API", detail: "Server-side, deduped" },
  { label: "CRM", detail: "Qualified revenue" },
];

export function SignalVisual() {
  return (
    <div data-reveal-trigger="" className={shell}>
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/55">
        Measurement stack
      </p>

      <div className="mt-6 space-y-3">
        {NODES.map((node, index) => (
          <div
            key={node.label}
            data-reveal-tile=""
            style={{ ["--reveal-delay" as string]: `${index * 140}ms` }}
          >
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#2997ff]/15 text-[#2997ff]">
                <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
                  <path
                    d="m5 13 4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">{node.label}</p>
                <p className="truncate text-[11px] text-white/55">{node.detail}</p>
              </div>
            </div>
            {index < NODES.length - 1 && (
              <span
                aria-hidden="true"
                className="ml-8 block h-3 w-px bg-gradient-to-b from-[#2997ff]/60 to-transparent"
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-3">
        <p className="text-[11px] uppercase tracking-[0.12em] text-emerald-300/70">
          Event match quality
        </p>
        <p className="text-2xl font-semibold tracking-tight text-emerald-300 tabular-nums">
          9.1 / 10
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  3 — Compounding                                                           */
/* -------------------------------------------------------------------------- */

const BARS = [26, 34, 30, 45, 52, 49, 63, 71, 68, 82, 91, 100];

export function CompoundingVisual() {
  return (
    <div data-reveal-trigger="" className={shell}>
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/55">
          Monthly revenue
        </p>
        <p className="text-[11px] font-semibold text-emerald-300">12 months</p>
      </div>

      <div className="mt-6 flex h-[190px] items-end gap-1.5 sm:gap-2">
        {BARS.map((value, index) => (
          <div
            key={index}
            data-reveal-bar=""
            style={{
              height: `${value * 1.9}px`,
              ["--reveal-delay" as string]: `${index * 55}ms`,
            }}
            className="flex-1 rounded-t-[3px] bg-gradient-to-t from-[#0071e3]/25 to-[#2997ff]"
          />
        ))}
      </div>

      <div className="mt-5 flex items-baseline justify-between border-t border-white/8 pt-4">
        <p className="text-[11px] text-white/55">Same team. Same budget cadence.</p>
        <p className="text-lg font-semibold tracking-tight text-white">3.8× revenue</p>
      </div>
    </div>
  );
}
