import { Counter } from "@/components/fx/Counter";
import { Reveal, RevealGroup, RevealItem } from "@/components/fx/Reveal";

const STATS = [
  { to: 184, prefix: "$", suffix: "M", label: "Managed ad spend", note: "Across 40+ Tier 1 brands" },
  { to: 4.8, decimals: 1, suffix: "×", label: "Median blended ROAS", note: "Trailing twelve months" },
  { to: 38, prefix: "−", suffix: "%", label: "Cost per acquisition", note: "First 90 days, average" },
  { to: 11, suffix: " days", label: "To first winning ad", note: "From kickoff call" },
];

/** "Why it matters", told entirely in numbers. */
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

        <RevealGroup className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <RevealItem key={stat.label}>
              <div className="border-t-2 border-line pt-6">
                <p className="text-[clamp(2.75rem,5.4vw,3.75rem)] font-semibold leading-none tracking-[-0.04em] text-ink u-tabular">
                  <Counter
                    to={stat.to}
                    decimals={stat.decimals}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </p>
                <p className="mt-4 text-[15px] font-semibold tracking-tight text-ink">{stat.label}</p>
                <p className="mt-1 text-[14px] text-muted">{stat.note}</p>
              </div>
            </RevealItem>
          ))}
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
