import { Reveal, RevealGroup, RevealItem } from "@/components/fx/Reveal";

const CASES = [
  {
    sector: "DTC skincare",
    market: "United States",
    metric: "5.1×",
    metricLabel: "blended ROAS",
    line: "Rebuilt creative testing around a single hero claim. Scaled spend 4× without CPA drift.",
    accent: "from-[#2997ff]/22 to-[#5856d6]/10",
  },
  {
    sector: "B2B SaaS",
    market: "United Kingdom",
    metric: "−44%",
    metricLabel: "cost per qualified demo",
    line: "Sent CRM-qualified revenue back to Meta. The algorithm stopped buying tyre-kickers.",
    accent: "from-[#a0e9ff]/22 to-[#2997ff]/8",
  },
  {
    sector: "Premium home goods",
    market: "Canada & Australia",
    metric: "$4.2M",
    metricLabel: "incremental revenue",
    line: "Geo holdout proved lift was real, which unlocked a permanent budget increase.",
    accent: "from-[#ff7a45]/20 to-[#ff7a45]/5",
  },
];

const QUOTE = {
  text: "They cut our reporting in half and doubled the output. The first month felt like we had finally hired an operator instead of an agency.",
  name: "Operations lead",
  role: "Placeholder testimonial · demo build",
};

/** Social proof: three outcomes and one quote. No logo soup, no filler. */
export function Proof() {
  return (
    <section id="work" data-nav-theme="light" className="relative bg-paper py-24 text-black sm:py-32">
      <div className="u-shell">
        <Reveal className="max-w-[22ch]">
          <p className="text-eyebrow uppercase text-black/60">Selected work</p>
          <h2 className="u-balance mt-4 text-headline text-black">
            What it looks like in practice.
          </h2>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-4 md:grid-cols-3">
          {CASES.map((item) => (
            <RevealItem key={item.sector}>
              <article className="group relative h-full overflow-hidden rounded-3xl border border-black/8 bg-white p-7 transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.28)]">
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${item.accent} opacity-70`}
                />
                <div className="relative">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-black/60">
                    {item.sector}
                  </p>
                  <p className="mt-1 text-[12px] text-black/60">{item.market}</p>

                  <p className="mt-10 text-[clamp(2.5rem,4.5vw,3.25rem)] font-semibold leading-none tracking-[-0.045em] text-black">
                    {item.metric}
                  </p>
                  <p className="mt-2 text-[14px] font-medium text-black/60">
                    {item.metricLabel}
                  </p>

                  <p className="u-pretty mt-6 border-t border-black/8 pt-6 text-[15px] leading-relaxed text-black/65">
                    {item.line}
                  </p>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.12} className="mt-16">
          <figure className="mx-auto max-w-[62ch] text-center">
            <blockquote className="u-balance text-title font-medium text-black">
              &ldquo;{QUOTE.text}&rdquo;
            </blockquote>
            <figcaption className="mt-6 text-[14px] text-black/60">
              <span className="font-semibold text-black/70">{QUOTE.name}</span>
              <span className="mx-2 text-black/60">·</span>
              {QUOTE.role}
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
