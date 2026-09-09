"use client";

import { useEffect, useRef, useState } from "react";
import { usePerfProfile } from "@/lib/usePerfProfile";

const DESKTOP_SRC = "/vids/BrandFilm-16x9.mp4";
const MOBILE_SRC = "/vids/BrandFilm-9x16.mp4";
const MOBILE_QUERY = "(max-width: 767px)";

/**
 * Full-viewport brand film.
 *
 * The films are ~8 MB each, which would wreck the opening if they sat in the
 * critical path, so nothing about them is allowed to block first paint:
 *
 *  - The `<video>` ships with **no `src` at all** and `preload="none"`. A
 *    source is assigned only after the browser goes idle, so LCP is decided by
 *    the poster — a 21 KB WebP — not by the film.
 *  - The poster is a `<picture>`, so the 9:16 crop is what phones download and
 *    the 16:9 crop never touches them.
 *  - The film fades in once it can actually play, over the poster, so there is
 *    no flash of an empty black box while it buffers.
 *  - It pauses off-screen and when the tab is hidden — a looping 30s film
 *    decoding behind six other sections is pure battery drain.
 *  - Reduced motion, Save-Data and low-power devices never load it at all and
 *    keep the poster, which is a complete image in its own right.
 */
export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const { ready, reducedMotion, lowPower } = usePerfProfile();
  const wantsVideo = ready && !reducedMotion && !lowPower;

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section || !wantsVideo) return;

    let cancelled = false;

    const attachSource = () => {
      if (cancelled || video.src) return;
      video.src = window.matchMedia(MOBILE_QUERY).matches ? MOBILE_SRC : DESKTOP_SRC;
      video.load();
      void video.play().catch(() => {
        // Autoplay can still be refused (battery saver, strict settings).
        // The poster stays, which is a perfectly good hero.
      });
    };

    // Wait for idle so the film never competes with the rest of the page.
    // Safari has no requestIdleCallback, hence the timeout fallback.
    const supportsIdle = typeof window.requestIdleCallback === "function";
    const idleHandle = supportsIdle
      ? window.requestIdleCallback(attachSource, { timeout: 2500 })
      : window.setTimeout(attachSource, 900);

    const onCanPlay = () => setPlaying(true);
    video.addEventListener("canplay", onCanPlay);

    // Only run while actually on screen.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!video.src) return;
        if (entry.isIntersecting && !document.hidden) void video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.05 },
    );
    observer.observe(section);

    const onVisibility = () => {
      if (!video.src) return;
      if (document.hidden) video.pause();
      else void video.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      if (supportsIdle) window.cancelIdleCallback(idleHandle);
      else clearTimeout(idleHandle);
      video.removeEventListener("canplay", onCanPlay);
      document.removeEventListener("visibilitychange", onVisibility);
      observer.disconnect();
    };
  }, [wantsVideo]);

  return (
    <section
      id="top"
      ref={sectionRef}
      data-nav-theme="dark"
      className="relative h-[100svh] w-full overflow-hidden bg-black"
      aria-label="Digilabss brand film"
    >
      {/* Poster. Decorative — the film's message is written out in the section
          below, so nothing is lost to a screen reader here. */}
      <picture>
        <source media={MOBILE_QUERY} srcSet="/vids/BrandFilm-9x16-poster.webp" />
        <img
          src="/vids/BrandFilm-16x9-poster.webp"
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </picture>

      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          playing ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Keeps the transparent nav legible over a bright frame. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/75 via-black/35 to-transparent"
      />

      <div
        aria-hidden="true"
        className="a-fade pointer-events-none absolute inset-x-0 bottom-7 flex justify-center"
        style={{ animationDelay: "1.4s" }}
      >
        <svg viewBox="0 0 24 24" className="a-scroll-hint size-5 text-white/70" fill="none">
          <path
            d="M12 4v15m0 0 6-6m-6 6-6-6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}
