"use client";

import { useEffect } from "react";

/**
 * One IntersectionObserver for every reveal on the page.
 *
 * Mounted once at the root. Elements are unobserved the moment they fire, so
 * the observer empties itself as the visitor scrolls and costs nothing by the
 * bottom of the page.
 */
export function RevealObserver() {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>("[data-reveal],[data-reveal-trigger]");
    if (nodes.length === 0) return;

    // No IntersectionObserver (very old browsers): show everything immediately.
    if (typeof IntersectionObserver === "undefined") {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
    );

    nodes.forEach((node) => {
      // Anything already on screen at load reveals without waiting for a scroll.
      observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
