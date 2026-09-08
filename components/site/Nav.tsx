"use client";

import { useEffect, useState } from "react";
import { trackCtaClick } from "@/lib/analytics";

const LINKS = [
  { href: "#approach", label: "Approach" },
  { href: "#results", label: "Results" },
  { href: "#capabilities", label: "Capabilities" },
  { href: "#work", label: "Work" },
];

const NAV_HEIGHT = 64;

/**
 * Minimal top bar.
 *
 * Two behaviours, both driven by IntersectionObserver rather than scroll
 * handlers, so nothing of ours runs on the main thread while the page moves:
 *
 *  1. Transparent over the hero, frosted once you leave it.
 *  2. It inverts over the light sections. A translucent black bar sitting on
 *     white reads as a muddy grey stripe, so the bar tracks which section is
 *     currently under it and flips to a light treatment to match. This is the
 *     detail that keeps a two-tone page feeling like one designed surface.
 */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [onLight, setOnLight] = useState(false);

  useEffect(() => {
    const sentinel = document.createElement("div");
    sentinel.style.cssText =
      "position:absolute;top:0;left:0;height:64px;width:1px;pointer-events:none;";
    document.body.appendChild(sentinel);

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, []);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-nav-theme]"),
    );
    if (sections.length === 0) return;

    let observer: IntersectionObserver | null = null;

    // A 1px-tall detection band pinned just under the nav: whichever section
    // crosses it is the one the bar is currently sitting on.
    const attach = () => {
      observer?.disconnect();
      const bottom = Math.max(0, window.innerHeight - NAV_HEIGHT - 1);

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            setOnLight(entry.target.getAttribute("data-nav-theme") === "light");
          }
        },
        { rootMargin: `-${NAV_HEIGHT}px 0px -${bottom}px 0px`, threshold: 0 },
      );

      sections.forEach((section) => observer!.observe(section));
    };

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(attach, 200);
    };

    attach();
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      observer?.disconnect();
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const surface = !scrolled
    ? "border-transparent bg-transparent"
    : onLight
      ? "border-black/8 bg-white/70 backdrop-blur-xl backdrop-saturate-150"
      : "border-white/8 bg-black/60 backdrop-blur-xl backdrop-saturate-150";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,color] duration-500 ${surface} ${
        onLight && scrolled ? "text-black" : "text-white"
      }`}
    >
      <nav className="u-shell flex h-14 items-center justify-between sm:h-16" aria-label="Primary">
        <a href="#top" className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight">
          <svg viewBox="0 0 24 24" className="size-[22px]" aria-hidden="true">
            <defs>
              <linearGradient id="mark" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#2997ff" />
                <stop offset="100%" stopColor="#0071e3" />
              </linearGradient>
            </defs>
            <path
              d="M12 1.6c5.74 0 10.4 4.66 10.4 10.4S17.74 22.4 12 22.4 1.6 17.74 1.6 12 6.26 1.6 12 1.6Zm0 4.2a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4Z"
              fill="url(#mark)"
            />
            <circle cx="12" cy="12" r="2.6" fill="#2997ff" />
          </svg>
          Digilabss
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`text-[13px] font-medium transition-colors duration-300 ${
                  onLight && scrolled
                    ? "text-black/60 hover:text-black"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#book"
          onClick={() => trackCtaClick("nav", "Book a call")}
          className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-transform duration-300 hover:scale-[1.04] active:scale-95 sm:px-5 ${
            onLight && scrolled ? "bg-black text-white" : "bg-white text-black"
          }`}
        >
          Book a call
        </a>
      </nav>
    </header>
  );
}
