"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { springSoft } from "@/lib/motion";
import { trackCtaClick } from "@/lib/analytics";

/**
 * Persistent, unobtrusive call to action.
 *
 * It appears once the hero is behind you and — the part that keeps it
 * unobtrusive — takes itself away again when the booking form is already on
 * screen, so it never floats on top of the thing it is pointing at.
 */
export function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const form = document.getElementById("book");
    if (!hero || !form) return;

    let pastHero = false;
    let atForm = false;

    const sync = () => setVisible(pastHero && !atForm);

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        pastHero = !entry.isIntersecting;
        sync();
      },
      { threshold: 0, rootMargin: "-45% 0px 0px 0px" },
    );

    const formObserver = new IntersectionObserver(
      ([entry]) => {
        atForm = entry.isIntersecting;
        sync();
      },
      { threshold: 0.12 },
    );

    heroObserver.observe(hero);
    formObserver.observe(form);

    return () => {
      heroObserver.disconnect();
      formObserver.disconnect();
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          initial={{ opacity: 0, y: 24, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={springSoft}
          className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
        >
          <a
            href="#book"
            onClick={() => trackCtaClick("sticky", "Book a call")}
            className="pointer-events-auto group inline-flex items-center gap-3 rounded-full border border-white/12 bg-black/70 py-2 pl-5 pr-2 text-sm font-semibold text-white shadow-[0_18px_50px_-12px_rgba(0,0,0,0.85)] backdrop-blur-xl backdrop-saturate-150 transition-colors duration-300 hover:border-white/25"
          >
            <span className="flex items-center gap-2">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>
              Book a call
            </span>
            <span className="rounded-full bg-white px-3.5 py-1.5 text-[13px] font-semibold text-black transition-transform duration-300 group-hover:scale-[1.04]">
              Free audit
            </span>
          </a>
        </m.div>
      )}
    </AnimatePresence>
  );
}
