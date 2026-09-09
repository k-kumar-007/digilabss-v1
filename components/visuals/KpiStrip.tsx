import { KPIS } from "@/components/visuals/dashboard/data";

/**
 * The snapshot panel: the top strip of the command centre.
 *
 * A deliberate slice rather than the whole dashboard — it is the most legible
 * part at this size, and it sets up the full console further down the page
 * instead of duplicating it.
 *
 * This is a server component with no client JavaScript. Each card exposes a
 * `data-kpi` hook and its own `--kpi` colour; the spotlight sequencer wrapped
 * around it moves a single class between cards, and CSS does the rest (see
 * `globals.css`). Twelve moving parts, zero per-card JS.
 */
export function KpiStrip() {
  return (
    <div className="relative rounded-[22px] border border-line bg-white/80 p-2 shadow-[0_2px_4px_rgba(11,13,18,0.04),0_40px_80px_-40px_rgba(11,13,18,0.3)] backdrop-blur-xl">
      <div className="relative flex items-center px-3 pb-3 pt-2">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-surface px-3 py-1 text-[11px] font-medium text-muted">
          Aug 1 – Aug 31 · All campaigns
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-[16px] bg-surface-2 p-2 sm:grid-cols-3 lg:grid-cols-6">
        {KPIS.map((kpi) => (
          <div
            key={kpi.id}
            data-kpi={kpi.id}
            style={{ ["--kpi" as string]: kpi.accent }}
            className="relative overflow-hidden rounded-xl border border-line bg-white p-3 text-left"
          >
            <span
              data-kpi-icon=""
              className="grid size-7 place-items-center rounded-lg text-[color:var(--kpi)]"
              style={{ backgroundColor: "color-mix(in oklab, var(--kpi) 10%, white)" }}
            >
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
            <p
              data-kpi-value=""
              className="mt-0.5 text-[19px] font-semibold tracking-tight text-ink u-tabular transition-colors duration-500 sm:text-[21px]"
            >
              {kpi.value}
            </p>
            <span
              className={`inline-flex items-center gap-0.5 text-[12px] font-semibold u-tabular ${
                kpi.up ? "text-[#0a7f61]" : "text-[#1c6ef2]"
              }`}
            >
              <svg viewBox="0 0 12 12" className="size-3" fill="currentColor" aria-hidden="true">
                <path d={kpi.up ? "M6 2.5 10 8H2z" : "M6 9.5 2 4h8z"} />
              </svg>
              {kpi.delta}
            </span>

            {/* Fills across the card while it holds focus, then resets. */}
            <span
              data-kpi-bar=""
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-[3px] bg-[color:var(--kpi)]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
