export function Footer() {
  return (
    <footer data-nav-theme="dark" className="bg-ink py-16 text-white">
      <div className="u-shell">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[17px] font-semibold tracking-tight text-white">Digilabss</p>
            <p className="mt-2 max-w-[40ch] text-[14px] leading-relaxed text-white/60">
              Meta Ads for Tier 1 brands. Creative volume, clean signal, and a
              weekly operating rhythm.
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-7 gap-y-3 text-[14px] text-white/60">
              {[
                { href: "#approach", label: "Approach" },
                { href: "#results", label: "Results" },
                { href: "#capabilities", label: "Capabilities" },
                { href: "#work", label: "Work" },
                { href: "#book", label: "Book a call" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="transition-colors duration-300 hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="my-10 h-px bg-white/10" />

        <div className="flex flex-col gap-3 text-[12px] text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Digilabss. Demo build, not a real service.</p>
          <p>
            Screening exercise · brand, copy and figures are placeholders.
          </p>
        </div>
      </div>
    </footer>
  );
}
