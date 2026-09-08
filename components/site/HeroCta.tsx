"use client";

import { trackCtaClick } from "@/lib/analytics";

export function HeroCta() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
      <a
        href="#book"
        onClick={() => trackCtaClick("hero", "Let's grow your business")}
        className="group relative w-full max-w-[300px] overflow-hidden rounded-full bg-ink px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_12px_30px_-12px_rgba(11,13,18,0.5)] transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] sm:w-auto"
      >
        <span className="relative z-10">Let&rsquo;s grow your business</span>
        {/* One sweep of light on hover, then gone. */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent group-hover:animate-[sheen_0.9s_ease-out]"
        />
      </a>

      <a
        href="#approach"
        onClick={() => trackCtaClick("hero", "See how we work")}
        className="inline-flex w-full max-w-[300px] items-center justify-center gap-1.5 rounded-full border border-line-strong bg-white px-7 py-3.5 text-[15px] font-medium text-ink transition-colors duration-300 hover:border-ink hover:bg-surface sm:w-auto"
      >
        See how we work
        <span aria-hidden="true">↓</span>
      </a>
    </div>
  );
}
