"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePerfProfile } from "@/lib/usePerfProfile";

/** How long each metric holds focus before the spotlight moves on. */
const DWELL_MS = 1700;

/**
 * Walks the snapshot panel through its six metrics, one at a time.
 *
 * The panel itself arrives as `children` and stays a server component — this
 * shell only moves one class between `[data-kpi]` elements and lets CSS do the
 * lifting, so six animated cards cost nothing in the bundle.
 *
 * It starts only once the panel is actually on screen (the whole point is that
 * you scroll down and it comes alive), pauses when the tab is hidden, and does
 * nothing at all under reduced motion, where the panel simply renders fully lit.
 */
export function KpiSpotlight({ children }: { children: ReactNode }) {
  const deckRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [active, setActive] = useState(0);
  const [armed, setArmed] = useState(false);

  const { ready, reducedMotion } = usePerfProfile();
  const enabled = ready && !reducedMotion;

  useEffect(() => {
    const deck = deckRef.current;
    if (!deck || !enabled) return;

    const count = deck.querySelectorAll("[data-kpi]").length;
    if (count === 0) return;

    const stop = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    const start = () => {
      if (timerRef.current) return;
      timerRef.current = setInterval(() => {
        setActive((current) => (current + 1) % count);
      }, DWELL_MS);
    };

    let onScreen = false;

    const sync = () => {
      if (onScreen && !document.hidden) {
        setArmed(true);
        start();
      } else {
        stop();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      // Wait until a good part of the panel is in view, so the first metric
      // is not already half-finished by the time the visitor sees it.
      { threshold: 0.45 },
    );

    observer.observe(deck);
    document.addEventListener("visibilitychange", sync);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      stop();
    };
  }, [enabled]);

  // Move the focus class. Cheaper than re-rendering the cards, and it keeps
  // them server-rendered.
  useEffect(() => {
    const deck = deckRef.current;
    if (!deck || !armed || !enabled) return;

    const cards = deck.querySelectorAll<HTMLElement>("[data-kpi]");
    cards.forEach((card, index) => card.classList.toggle("is-kpi-focus", index === active));
  }, [active, armed, enabled]);

  return (
    <div
      ref={deckRef}
      data-kpi-deck=""
      data-armed={armed && enabled ? "true" : "false"}
      style={{ ["--kpi-dwell" as string]: `${DWELL_MS}ms` }}
    >
      {children}
    </div>
  );
}
