"use client";

import { trackCtaClick } from "@/lib/analytics";

/**
 * Split out so the footer itself stays a server component — only the click
 * handler needs to run in the browser.
 */
export function FooterCta() {
  return (
    <a
      href="#book"
      onClick={() => trackCtaClick("footer", "Book a call")}
      className="group mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[14px] font-semibold text-ink transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
    >
      Book a call
      <span
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:translate-x-0.5"
      >
        →
      </span>
    </a>
  );
}

/** The email link, split out for the same reason. */
export function FooterEmail({ className }: { className?: string }) {
  return (
    <a
      href="mailto:hello@digilabss.com"
      className={className}
      onClick={() => trackCtaClick("footer", "Email")}
    >
      hello@digilabss.com
    </a>
  );
}
