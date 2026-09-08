"use client";

import { trackCtaClick } from "@/lib/analytics";

export function HeroCta() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
      <a
        href="#book"
        onClick={() => trackCtaClick("hero", "Book a call")}
        className="group relative w-full max-w-[280px] overflow-hidden rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-black transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] sm:w-auto"
      >
        <span className="relative z-10">Book a call</span>
        {/* Light sweeps across on hover — one moment of shine, then gone. */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-black/10 to-transparent transition-none group-hover:animate-[sheen_0.9s_ease-out]"
        />
      </a>

      <a
        href="#results"
        onClick={() => trackCtaClick("hero", "See the numbers")}
        className="inline-flex w-full max-w-[280px] items-center justify-center gap-1.5 rounded-full border border-white/15 px-7 py-3.5 text-[15px] font-medium text-white/85 transition-colors duration-300 hover:border-white/30 hover:text-white sm:w-auto"
      >
        See the numbers
        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-y-0.5">
          ↓
        </span>
      </a>
    </div>
  );
}
