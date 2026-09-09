/**
 * A preview of the thing the call actually produces.
 *
 * This replaced a list of blue ticks ("No deck, no discovery loop", "A written
 * teardown within 72 hours"). Those claims are invisible — every agency site
 * makes them, so they read as filler. Showing a page of the teardown makes the
 * same points concretely: it is written, it is specific, it names numbers, and
 * it arrives whether or not you hire us.
 *
 * Server component. The stacked sheets behind it are two divs, and the entrance
 * runs on the shared reveal observer, so this costs no JavaScript.
 */

const FINDINGS = [
  {
    n: "01",
    title: "Creative fatigue",
    severity: "High",
    color: "#c2185b",
    detail: "42% of last month's spend sat on three ads past their best frequency.",
  },
  {
    n: "02",
    title: "Tracking gap",
    severity: "High",
    color: "#c2185b",
    detail: "The Conversions API is missing roughly 31% of purchase events.",
  },
  {
    n: "03",
    title: "Account structure",
    severity: "Medium",
    color: "#a35f00",
    detail: "Five ad sets are bidding against each other for the same audience.",
  },
];

export function TeardownPreview() {
  return (
    <div className="relative">
      {/* Two sheets behind, so it reads as a document rather than a card. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-7 -top-[11px] h-12 rounded-t-2xl border border-line bg-surface-2"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-3.5 -top-[5px] h-12 rounded-t-2xl border border-line bg-white"
      />

      <div className="relative overflow-hidden rounded-2xl border border-line bg-white shadow-[0_2px_4px_rgba(11,13,18,0.04),0_28px_60px_-30px_rgba(11,13,18,0.28)]">
        <div className="flex items-center gap-2.5 border-b border-line-soft px-5 py-3.5">
          <svg
            viewBox="0 0 24 24"
            className="size-4 shrink-0 text-muted"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M14 2.6H6.6A1.6 1.6 0 0 0 5 4.2v15.6a1.6 1.6 0 0 0 1.6 1.6h10.8a1.6 1.6 0 0 0 1.6-1.6V7.6Z" />
            <path d="M14 2.6v5h5M8.6 13h6.8M8.6 16.6h4.4" />
          </svg>
          <p className="text-[12px] font-semibold tracking-tight text-ink">
            Account teardown
          </p>
          <span className="ml-auto text-[11px] text-muted">72h after the call</span>
        </div>

        <ul className="divide-y divide-line-soft">
          {FINDINGS.map((finding, index) => (
            <li
              key={finding.n}
              data-reveal-tile=""
              style={{
                ["--reveal-delay" as string]: `${200 + index * 130}ms`,
                ["--sev" as string]: finding.color,
              }}
              className="flex gap-3.5 px-5 py-4"
            >
              <span className="mt-0.5 text-[11px] font-semibold tabular-nums text-muted">
                {finding.n}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <p className="text-[14px] font-semibold tracking-tight text-ink">
                    {finding.title}
                  </p>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[color:var(--sev)]"
                    style={{
                      backgroundColor: "color-mix(in oklab, var(--sev) 10%, white)",
                    }}
                  >
                    {finding.severity}
                  </span>
                </div>
                <p className="u-pretty mt-1 text-[13px] leading-relaxed text-body">
                  {finding.detail}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex items-start gap-2 border-t border-line-soft bg-surface-2 px-5 py-3">
          <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-accent" />
          <p className="text-[12px] text-body">
            Written, specific, and yours — whether or not we work together.
          </p>
        </div>
      </div>

      <p className="mt-4 text-[12px] text-muted">
        Illustrative findings. Yours are pulled from your own account.
      </p>
    </div>
  );
}
