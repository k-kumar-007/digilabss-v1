import { Reveal, RevealGroup, RevealItem } from "@/components/fx/Reveal";

const STEPS = [
  {
    step: "01",
    title: "Audit",
    time: "Day 0–3",
    body: "We open your account, read the last 12 months, and tell you where the money is leaking. Free, and yours either way.",
  },
  {
    step: "02",
    title: "Build",
    time: "Week 1–2",
    body: "Tracking rebuilt server-side, account restructured, and the first creative batch into testing.",
  },
  {
    step: "03",
    title: "Scale",
    time: "Week 3 onward",
    body: "Budget steps up only where the economics hold. One weekly call, one live dashboard.",
  },
];

/** "How to start" — the last thing before the form, kept to three beats. */
export function Process() {
  return (
    <section data-nav-theme="dark" className="relative bg-ink py-24 sm:py-32">
      <div className="u-shell">
        <Reveal className="max-w-[22ch]">
          <p className="text-eyebrow uppercase text-white/55">How to start</p>
          <h2 className="u-balance mt-4 text-headline text-white">
            Three weeks to a decision.
          </h2>
        </Reveal>

        <RevealGroup className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-3">
          {STEPS.map((item) => (
            <RevealItem key={item.step} className="bg-ink">
              <div className="flex h-full flex-col p-8 sm:p-10">
                <div className="flex items-baseline justify-between">
                  <span className="text-[13px] font-semibold tracking-[0.12em] text-[#2997ff]">
                    {item.step}
                  </span>
                  <span className="text-[12px] text-white/55">{item.time}</span>
                </div>
                <h3 className="mt-8 text-title text-white">{item.title}</h3>
                <p className="u-pretty mt-3 text-[15px] leading-relaxed text-white/50">
                  {item.body}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
