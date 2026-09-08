import { Reveal, RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { SpotlightCard } from "@/components/fx/SpotlightCard";
import {
  CreativeStudioIcon,
  FullFunnelIcon,
  IncrementalityIcon,
  LandingTestIcon,
  ServerTrackingIcon,
  WeeklyRhythmIcon,
} from "@/components/visuals/CapabilityIcons";

const CAPABILITIES = [
  {
    title: "Creative studio",
    body: "Static, motion, and UGC produced in weekly batches against a live testing roadmap.",
    Icon: CreativeStudioIcon,
  },
  {
    title: "Full-funnel structure",
    body: "Prospecting, retargeting, and retention split so budget never competes with itself.",
    Icon: FullFunnelIcon,
  },
  {
    title: "Server-side tracking",
    body: "Conversions API, deduplicated events, and CRM revenue fed back into the algorithm.",
    Icon: ServerTrackingIcon,
  },
  {
    title: "Offer & landing tests",
    body: "The page is part of the campaign. We test the promise, not just the placement.",
    Icon: LandingTestIcon,
  },
  {
    title: "Incrementality",
    body: "Geo holdouts and lift studies, so you know what the ads actually caused.",
    Icon: IncrementalityIcon,
  },
  {
    title: "Weekly operating rhythm",
    body: "One call, one dashboard, one owner. No reporting theatre, no account drift.",
    Icon: WeeklyRhythmIcon,
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
            One team. The whole growth engine.
          </h2>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((capability) => (
            <RevealItem key={capability.title}>
              <SpotlightCard className="h-full">
                <div className="flex h-full flex-col p-7">
                  <span className="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent-ink ring-1 ring-inset ring-accent-line">
                    <capability.Icon />
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
