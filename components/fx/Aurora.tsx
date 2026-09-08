"use client";

import { useEffect, useRef } from "react";
import { usePerfProfile } from "@/lib/usePerfProfile";

type Blob = {
  hue: number;
  radius: number;
  /** Lissajous coefficients — cheap, non-repeating-looking drift. */
  ax: number;
  ay: number;
  fx: number;
  fy: number;
  phase: number;
  alpha: number;
};

// Tuned for a white page: low-alpha tints rather than glows. Overlaps blend
// normally (source-over) — additive blending on white just washes to white.
const BLOBS: Blob[] = [
  { hue: 217, radius: 0.60, ax: 0.22, ay: 0.16, fx: 0.049, fy: 0.037, phase: 0.0, alpha: 0.10 },
  { hue: 195, radius: 0.50, ax: 0.28, ay: 0.20, fx: 0.031, fy: 0.055, phase: 1.9, alpha: 0.07 },
  { hue: 255, radius: 0.54, ax: 0.19, ay: 0.24, fx: 0.041, fy: 0.027, phase: 3.4, alpha: 0.07 },
  { hue: 28, radius: 0.34, ax: 0.24, ay: 0.14, fx: 0.023, fy: 0.045, phase: 5.1, alpha: 0.04 },
];

/** Internal buffer width. The canvas is tiny and CSS-blurred up to full size. */
const BUFFER_W = 300;
const TARGET_FPS = 30;
const FRAME_MS = 1000 / TARGET_FPS;

/**
 * Animated gradient background.
 *
 * The expensive-looking part is deliberately cheap:
 *  - it renders into a ~300px canvas (≈55k pixels) regardless of viewport size,
 *    then CSS-scales and blurs it, so cost is constant on a 4K monitor;
 *  - it is capped at 30fps, which is imperceptible for a slow drift but halves
 *    the work;
 *  - it pauses entirely when scrolled out of view or the tab is hidden;
 *  - it never starts on reduced-motion, Save-Data, or low-core devices.
 *
 * A static CSS gradient sits underneath and is what everyone else sees, so the
 * section is never empty and there is no pop-in.
 */
export function Aurora({
  className = "",
  intensity = 1,
}: {
  className?: string;
  intensity?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { ready, allowHeavyEffects } = usePerfProfile();

  useEffect(() => {
    if (!ready || !allowHeavyEffects) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let visible = false;
    let lastFrame = 0;
    let width = BUFFER_W;
    let height = BUFFER_W;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const ratio = rect.height / rect.width;
      width = BUFFER_W;
      height = Math.max(1, Math.round(BUFFER_W * ratio));
      canvas.width = width;
      canvas.height = height;
    };

    const draw = (time: number) => {
      raf = requestAnimationFrame(draw);

      if (!visible) return;
      if (time - lastFrame < FRAME_MS) return;
      lastFrame = time;

      const t = time / 1000;
      ctx.clearRect(0, 0, width, height);

      for (const blob of BLOBS) {
        const cx = width * (0.5 + blob.ax * Math.sin(t * blob.fx * Math.PI * 2 + blob.phase));
        const cy = height * (0.5 + blob.ay * Math.cos(t * blob.fy * Math.PI * 2 + blob.phase));
        const r = Math.max(width, height) * blob.radius;

        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        const alpha = blob.alpha * intensity;
        gradient.addColorStop(0, `hsla(${blob.hue}, 95%, 62%, ${alpha})`);
        gradient.addColorStop(0.45, `hsla(${blob.hue}, 92%, 66%, ${alpha * 0.45})`);
        gradient.addColorStop(1, `hsla(${blob.hue}, 90%, 70%, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }

    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: "120px" },
    );
    observer.observe(canvas);

    const onVisibilityChange = () => {
      if (document.hidden) visible = false;
    };

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    };

    resize();
    canvas.style.opacity = "1";
    raf = requestAnimationFrame(draw);

    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [ready, allowHeavyEffects, intensity]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Static base. Server-rendered, so there is colour on the very first paint. */}
      <div
        className="absolute inset-0 opacity-90"
        style={{
          backgroundImage:
            "radial-gradient(58% 44% at 20% 22%, rgba(28,110,242,0.07) 0%, rgba(28,110,242,0) 62%)," +
            "radial-gradient(52% 40% at 82% 30%, rgba(15,177,133,0.05) 0%, rgba(15,177,133,0) 60%)," +
            "radial-gradient(64% 52% at 50% 92%, rgba(124,92,245,0.06) 0%, rgba(124,92,245,0) 66%)",
        }}
      />

      {/* Animated layer, faded in only once it actually starts drawing. */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-1000 will-change-[opacity]"
        style={{ filter: "blur(46px) saturate(135%)", transform: "scale(1.18)" }}
      />

      {/*
        A very faint dot grid. On a dark page film grain reads as texture; on
        white it just reads as dirt, so this is the light-surface equivalent —
        it gives the gradient something to sit on without adding noise.
      */}
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(11,13,18,0.055) 1px, transparent 0)",
          backgroundSize: "26px 26px",
          maskImage: "radial-gradient(70% 60% at 50% 40%, #000 0%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(70% 60% at 50% 40%, #000 0%, transparent 78%)",
        }}
      />
    </div>
  );
}
