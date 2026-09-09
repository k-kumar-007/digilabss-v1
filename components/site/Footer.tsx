import { FooterCta, FooterEmail } from "@/components/site/FooterCta";

const NAVIGATE = [
  { href: "#promise", label: "Overview" },
  { href: "#approach", label: "Approach" },
  { href: "#results", label: "Results" },
  { href: "#work", label: "Work" },
];

/**
 * Every "service" link points at the section that actually describes it. A
 * footer full of hrefs that go nowhere is the fastest way to make a site feel
 * unfinished, so there are no placeholder destinations here.
 */
const SERVICES = [
  { href: "#capabilities", label: "Creative studio" },
  { href: "#capabilities", label: "Full-funnel structure" },
  { href: "#capabilities", label: "Server-side tracking" },
  { href: "#capabilities", label: "Incrementality" },
];

const linkClass =
  "inline-block text-[14px] text-white/60 transition-colors duration-300 hover:text-white";

function Column({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-white/40">
        {title}
      </p>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.href} className={linkClass}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer
      data-nav-theme="dark"
      className="relative overflow-hidden bg-ink pt-16 pb-10 text-white sm:pt-20"
    >
      {/* A single soft wash so the panel has depth rather than reading as a
          flat black slab under a white page. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(60% 60% at 12% 0%, rgba(28,110,242,0.16) 0%, rgba(28,110,242,0) 62%)," +
            "radial-gradient(50% 50% at 88% 10%, rgba(124,92,245,0.12) 0%, rgba(124,92,245,0) 60%)",
        }}
      />

      <div className="u-shell relative">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr] lg:gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <svg viewBox="0 0 24 24" className="size-[22px]" aria-hidden="true">
                <path
                  d="M12 1.6c5.74 0 10.4 4.66 10.4 10.4S17.74 22.4 12 22.4 1.6 17.74 1.6 12 6.26 1.6 12 1.6Zm0 4.2a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4Z"
                  fill="#4f9bff"
                />
                <circle cx="12" cy="12" r="2.6" fill="#a0e9ff" />
              </svg>
              <p className="text-[17px] font-semibold tracking-tight text-white">Digilabss</p>
            </div>

            <p className="mt-4 max-w-[38ch] text-[14px] leading-relaxed text-white/60">
              Meta Ads for Tier&nbsp;1 brands. Creative volume, clean signal, and
              a weekly operating rhythm.
            </p>

            <FooterCta />
          </div>

          {/*
            The two link columns pair up on a phone instead of stacking, which
            takes roughly 200px out of the mobile footer. `sm:contents` drops
            the wrapper at wider sizes so both columns rejoin the parent grid.
          */}
          <div className="grid grid-cols-2 gap-8 sm:contents">
            <Column title="Navigate" links={NAVIGATE} />
            <Column title="What we do" links={SERVICES} />
          </div>

          {/* Contact */}
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-white/40">
              Get in touch
            </p>
            <ul className="mt-4 space-y-3">
              <li>
                <FooterEmail className={linkClass} />
              </li>
              <li className="text-[14px] leading-relaxed text-white/60">
                Mon–Fri · replies in one business day
              </li>
              <li className="flex flex-wrap gap-1.5 pt-1">
                {["US", "UK", "CA", "AU"].map((region) => (
                  <span
                    key={region}
                    className="rounded-md border border-white/12 bg-white/[0.06] px-2 py-1 text-[11px] font-medium text-white/70"
                  >
                    {region}
                  </span>
                ))}
              </li>
            </ul>
          </div>
        </div>

        <div className="my-10 h-px bg-white/10" />

        <div className="flex flex-col gap-4 text-[12px] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Digilabss. Demo build, not a real service.</p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p>Screening exercise · brand, copy and figures are placeholders.</p>
            <a
              href="#top"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/12 px-3 py-1.5 text-white/70 transition-colors duration-300 hover:border-white/30 hover:text-white"
            >
              Back to top
              <span aria-hidden="true">↑</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
