"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { trackCtaClick } from "@/lib/analytics";

/**
 * Persistent, unobtrusive call to action.
 *
 * Appears once the hero is behind you, and stands down over any section that
 * carries its own prominent CTA, so it never floats on top of the thing it is
 * pointing at.
 *
 * Presentation is deliberately plain: a white card, a hairline border, one
 * shadow, a modest 14px radius, and a single dark button. No pill, no pulsing
 * status dot, no second button competing with the first — the offer is the
 * quiet half and the action is the loud half.
 */
export function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const form = document.getElementById("book");
    if (!hero || !form) return;

    // Sections that carry their own prominent call to action opt out by
    // marking themselves.
    const quietZones = [
      form,
      ...Array.from(
        document.querySelectorAll<HTMLElement>("[data-cta-suppress]"),
      ),
    ];

    let pastHero = false;
    const inQuietZone = new Set<Element>();

    const sync = () => setVisible(pastHero && inQuietZone.size === 0);

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        pastHero = !entry.isIntersecting;
        sync();
      },
      { threshold: 0, rootMargin: "-45% 0px 0px 0px" },
    );

    const quietObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inQuietZone.add(entry.target);
          else inQuietZone.delete(entry.target);
        }
        sync();
      },
      { threshold: 0.12 },
    );

    heroObserver.observe(hero);
    quietZones.forEach((zone) => quietObserver.observe(zone));

    return () => {
      heroObserver.disconnect();
      quietObserver.disconnect();
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
          className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(0.875rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-6"
        >
          {/*
            Full width on a phone, a compact card in the bottom-right on
            desktop. The flex wrapper is what does it: a block-level card with
            `width: auto` would simply fill the viewport, so the card shrinks to
            its content as a flex item instead.
          */}
          <div className="flex justify-center sm:justify-end">
            <div className="pointer-events-auto flex w-full max-w-[30rem] items-center gap-4 rounded-2xl border border-line bg-white/92 py-2.5 pl-4 pr-2.5 shadow-[0_1px_2px_rgba(11,13,18,0.05),0_16px_36px_-16px_rgba(11,13,18,0.22)] backdrop-blur-xl sm:w-auto sm:max-w-none">
              <div className="min-w-0">
                <p className="text-[13px] font-semibold leading-snug tracking-tight text-ink">
                  Free account audit
                </p>
                <p className="truncate text-[12px] leading-snug text-muted">
                  30 minutes · no deck, no obligation
                </p>
              </div>

              <a
                href="#book"
                onClick={() => trackCtaClick("sticky", "Book a call")}
                className="shrink-0 rounded-xl bg-ink px-4 py-2.5 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-[#242833]"
              >
                Book a call
              </a>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
