"use client";

import { useEffect, useRef, useState } from "react";
import { usePerfProfile } from "@/lib/usePerfProfile";

const DESKTOP_SRC = "/vids/hero-cut-16x9.mp4";
const MOBILE_SRC = "/vids/hero-cut-9x16.mp4";
const MOBILE_QUERY = "(max-width: 767px)";

/** How often the top of the frame is sampled to decide the nav's colour. */
const SAMPLE_MS = 250;
/** Hysteresis, so a frame hovering near the threshold can't make the nav flicker. */
const TO_LIGHT = 150;
const TO_DARK = 105;

/**
 * Full-viewport brand film.
 *
 * Two problems this solves.
 *
 * **Weight.** The films are a few megabytes, so nothing about them blocks first
 * paint: the `<video>` ships with no `src` at all and `preload="none"`, and a
 * source is attached only once the browser goes idle. LCP is therefore decided
 * by a ~9 KB WebP poster, delivered through a `<picture>` so phones fetch only
 * the 9:16 crop. The film fades in over the poster when it can play, pauses
 * off-screen and on tab hide, and is never requested at all under reduced
 * motion, Save-Data or on low-power devices.
 *
 * **Contrast.** This cut opens on black and then resolves to a near-white
 * frame about halfway through, so a fixed white nav would be invisible for half
 * the loop. Rather than hard-code a timestamp — which silently breaks the next
 * time the edit changes — it samples the luminance of the top of the frame a
 * few times a second and flips `data-nav-theme` on this section. The nav
 * already watches that attribute, so it just follows along. The read is a
 * 32x6 pixel canvas, which is small enough not to register.
 */
export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [bright, setBright] = useState(false);

  const { ready, reducedMotion, lowPower } = usePerfProfile();
  const wantsVideo = ready && !reducedMotion && !lowPower;

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section || !wantsVideo) return;

    let cancelled = false;
    let onScreen = false;
    let sampler: ReturnType<typeof setInterval> | null = null;
    let isBright = false;

    /* ---- Deferred source ------------------------------------------------ */

    const attachSource = () => {
      if (cancelled || video.src) return;
      video.src = window.matchMedia(MOBILE_QUERY).matches ? MOBILE_SRC : DESKTOP_SRC;
      video.load();
      void video.play().catch(() => {
        // Autoplay can still be refused (battery saver, strict settings).
        // The poster stays, which is a perfectly good hero.
      });
    };

    const supportsIdle = typeof window.requestIdleCallback === "function";
    const idleHandle = supportsIdle
      ? window.requestIdleCallback(attachSource, { timeout: 2500 })
      : window.setTimeout(attachSource, 900);

    /* ---- Luminance sampling -> nav theme -------------------------------- */

    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 6;
    // `willReadFrequently` keeps the readback on the CPU path; without it the
    // browser round-trips the GPU on every getImageData.
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    const sample = () => {
      if (!ctx || video.readyState < 2 || video.videoWidth === 0) return;

      // Only the strip the nav actually sits on.
      const stripHeight = Math.max(1, Math.round(video.videoHeight * 0.14));
      ctx.drawImage(video, 0, 0, video.videoWidth, stripHeight, 0, 0, 32, 6);

      let total = 0;
      const { data } = ctx.getImageData(0, 0, 32, 6);
      for (let i = 0; i < data.length; i += 4) {
        total += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      }
      const lum = total / (data.length / 4);

      const next = isBright ? lum > TO_DARK : lum > TO_LIGHT;
      if (next === isBright) return;

      isBright = next;
      section.dataset.navTheme = next ? "light" : "dark";
      setBright(next);
    };

    const startSampling = () => {
      if (sampler) return;
      sampler = setInterval(sample, SAMPLE_MS);
    };

    const stopSampling = () => {
      if (!sampler) return;
      clearInterval(sampler);
      sampler = null;
    };

    /* ---- Play only while on screen -------------------------------------- */

    const sync = () => {
      if (!video.src) return;
      if (onScreen && !document.hidden) {
        void video.play().catch(() => {});
        startSampling();
      } else {
        video.pause();
        stopSampling();
      }
    };

    const onCanPlay = () => {
      setPlaying(true);
      sync();
    };
    video.addEventListener("canplay", onCanPlay);

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0.05 },
    );
    observer.observe(section);

    document.addEventListener("visibilitychange", sync);

    return () => {
      cancelled = true;
      if (supportsIdle) window.cancelIdleCallback(idleHandle);
      else clearTimeout(idleHandle);
      video.removeEventListener("canplay", onCanPlay);
      document.removeEventListener("visibilitychange", sync);
      observer.disconnect();
      stopSampling();
      // Leave the nav in a sane state if the hero unmounts mid-bright-frame.
      section.dataset.navTheme = "dark";
    };
  }, [wantsVideo]);

  return (
    <section
      id="top"
      ref={sectionRef}
      data-nav-theme="dark"
      className="relative isolate h-[100svh] w-full overflow-hidden bg-black"
      aria-label="Digilabss brand film"
    >
      {/*
        Poster. Decorative — the film's message is written out in the section
        below, so nothing is lost to a screen reader here.

        The filename carries a content hash. `/vids/*.webp` is served
        `immutable`, and `immutable` is a promise that the bytes at this URL
        will never change — so the URL has to change when they do. Replacing a
        poster in place under a stable name meant returning visitors kept the
        old frame for a year. Regenerate the poster, re-hash, update here.
      */}
      <picture>
        <source media={MOBILE_QUERY} srcSet="/vids/hero-cut-9x16-poster.84ee2625.webp" />
        <img
          src="/vids/hero-cut-16x9-poster.0fbedc74.webp"
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

      {/* Scrim under the nav, tinted to whichever way the frame has gone. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-36 transition-opacity duration-500 ${
          bright
            ? "bg-gradient-to-b from-white/85 via-white/40 to-transparent"
            : "bg-gradient-to-b from-black/75 via-black/35 to-transparent"
        }`}
      />

      {/*
        `difference` blending means the arrow is the inverse of whatever is
        behind it — white over the black opening, dark over the white finish —
        so it stays legible through the whole loop without being told about it.
      */}
      <div
        aria-hidden="true"
        className="a-fade pointer-events-none absolute inset-x-0 bottom-7 flex justify-center mix-blend-difference"
        style={{ animationDelay: "1.4s" }}
      >
        <svg viewBox="0 0 24 24" className="a-scroll-hint size-5 text-white" fill="none">
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
