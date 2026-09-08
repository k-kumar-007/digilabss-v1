import { Counter } from "@/components/fx/Counter";
import { Reveal, RevealGroup, RevealItem } from "@/components/fx/Reveal";

const STATS = [
  { to: 184, prefix: "$", suffix: "M", label: "Managed ad spend", note: "Across 40+ Tier 1 brands" },
  { to: 4.8, decimals: 1, suffix: "×", label: "Median blended ROAS", note: "Trailing twelve months" },
  { to: 38, prefix: "−", suffix: "%", label: "Cost per acquisition", note: "First 90 days, average" },
  { to: 11, suffix: " days", label: "To first winning ad", note: "From kickoff call" },
];

/**
 * "Why it matters", told entirely in numbers.
 *
 * The light surface here is doing real work: after two full dark screens it
 * resets the eye and signals a new chapter, which is how apple.com keeps a long
 * page from reading as one undifferentiated scroll.
 */
export function Stats() {
  return (
    <section id="results" data-nav-theme="light" className="relative bg-paper py-24 text-black sm:py-32">
      <div className="u-shell">
        <Reveal className="max-w-[20ch]">
          <p className="text-eyebrow uppercase text-black/60">The numbers</p>
          <h2 className="u-balance mt-4 text-headline text-black">
            Proof, before promises.
          </h2>
        </Reveal>

        <RevealGroup
          className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
          as="div"
        >
          {STATS.map((stat) => (
            <RevealItem key={stat.label}>
              <div className="border-t border-black/12 pt-6">
                <p className="text-[clamp(2.75rem,5.6vw,4rem)] font-semibold leading-none tracking-[-0.04em] text-black tabular-nums">
                  <Counter
                    to={stat.to}
                    decimals={stat.decimals}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </p>
                <p className="mt-4 text-[15px] font-semibold tracking-tight text-black">
                  {stat.label}
                </p>
                <p className="mt-1 text-[14px] text-black/60">{stat.note}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.15}>
          <p className="mt-14 max-w-[54ch] text-[13px] leading-relaxed text-black/60">
            Figures are illustrative placeholders for this demo build. In a live
            engagement every number on this page is pulled from the client&rsquo;s
            own reporting and dated.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
