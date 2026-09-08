"use client";

import { useRef, type ReactNode } from "react";

/**
 * Hover effect: a soft light follows the cursor across the card.
 *
 * The pointer handler only writes two CSS custom properties — no React state,
 * so moving the mouse never re-renders anything. Reads are batched into a rAF
 * so a fast pointer can't thrash layout. Touch devices simply never fire it.
 */
export function SpotlightCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const frame = useRef(0);

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const node = ref.current;
    if (!node) return;

    const { clientX, clientY } = event;

    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const rect = node.getBoundingClientRect();
      node.style.setProperty("--spot-x", `${clientX - rect.left}px`);
      node.style.setProperty("--spot-y", `${clientY - rect.top}px`);
      node.style.setProperty("--spot-opacity", "1");
    });
  };

  const handleLeave = () => {
    cancelAnimationFrame(frame.current);
    ref.current?.style.setProperty("--spot-opacity", "0");
  };

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] transition-colors duration-500 hover:border-white/20 ${className}`}
      style={{ ["--spot-opacity" as string]: "0" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[var(--spot-opacity)] transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(260px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(41,151,255,0.16), transparent 68%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
