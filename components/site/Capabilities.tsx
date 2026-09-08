import { Reveal, RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { SpotlightCard } from "@/components/fx/SpotlightCard";

const CAPABILITIES = [
  {
    title: "Creative studio",
    body: "Static, motion, and UGC produced in weekly batches against a live testing roadmap.",
    icon: (
      <path d="M4 16.5 9 11l3.5 3.5L16 11l4 4.5M4 5h16v14H4z" />
    ),
  },
  {
    title: "Full-funnel structure",
    body: "Prospecting, retargeting, and retention split so budget never competes with itself.",
    icon: <path d="M3 5h18M6 12h12M10 19h4" />,
  },
  {
    title: "Server-side tracking",
    body: "Conversions API, deduplicated events, and CRM revenue fed back into the algorithm.",
    icon: <path d="M4 7h16M4 12h16M4 17h10M18 15l3 3-3 3" />,
  },
  {
    title: "Offer & landing tests",
    body: "The page is part of the campaign. We test the promise, not just the placement.",
    icon: <path d="M12 3v18M5 8l7-5 7 5v8l-7 5-7-5z" />,
  },
  {
    title: "Incrementality",
    body: "Geo holdouts and lift studies, so you know what the ads actually caused.",
    icon: <path d="M3 17l6-6 4 4 8-8M21 7v6h-6" />,
  },
  {
    title: "Weekly operating rhythm",
    body: "One call, one dashboard, one owner. No reporting theatre, no account drift.",
    icon: <path d="M12 7v5l3.5 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />,
  },
];

/** "What you get" — six tiles, one line each. The hover spotlight is the motion. */
export function Capabilities() {
  return (
    <section id="capabilities" data-nav-theme="light" className="relative bg-surface py-24 sm:py-32">
      <div className="u-shell">
        <Reveal>
          <p className="u-eyebrow">What you get</p>
          <h2 className="u-balance mt-4 max-w-[15ch] text-headline text-ink">
            One team. The whole <span className="u-mark">growth engine</span>.
          </h2>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((capability) => (
            <RevealItem key={capability.title}>
              <SpotlightCard className="h-full">
                <div className="flex h-full flex-col p-7">
                  <span className="grid size-10 place-items-center rounded-xl bg-accent-soft text-accent-ink ring-1 ring-inset ring-accent-line">
                    <svg
                      viewBox="0 0 24 24"
                      className="size-[18px]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {capability.icon}
                    </svg>
                  </span>
                  <h3 className="mt-6 text-title text-ink">{capability.title}</h3>
                  <p className="u-pretty mt-3 text-[15px] leading-relaxed text-body">
                    {capability.body}
                  </p>
                </div>
              </SpotlightCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
