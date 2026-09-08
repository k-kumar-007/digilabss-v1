import type { ReactNode } from "react";

type Tag = "div" | "section" | "li" | "figure" | "header" | "article";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Milliseconds to hold before this element starts revealing. */
  delay?: number;
  as?: Tag;
};

/**
 * The page's scroll-reveal primitive — and a *server* component.
 *
 * It renders nothing but a `data-reveal` attribute. The transition lives in
 * CSS and a single shared IntersectionObserver (see `RevealObserver`) flips one
 * class. That matters more than it looks: the earlier Motion-based version put
 * a client component around roughly thirty elements, and each one carried
 * hydration and per-frame JS. This version ships zero JavaScript per reveal and
 * animates on the compositor.
 *
 * Framer Motion is still used — but for the scroll moments that genuinely need
 * it (hero parallax, the pinned story, presence transitions), not for fading a
 * heading in.
 */
export function Reveal({ children, className = "", delay = 0, as = "div" }: RevealProps) {
  const Tag = as;
  return (
    <Tag
      data-reveal=""
      className={className}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}

/**
 * Staggers its children. The delay ramp is pure CSS (`nth-child`), so adding a
 * card never means threading an index through props.
 */
export function RevealGroup({
  children,
  className = "",
  as = "div",
}: Omit<RevealProps, "delay">) {
  const Tag = as;
  return (
    <Tag data-reveal-group="" className={className}>
      {children}
    </Tag>
  );
}

/** A single item inside a `RevealGroup`. */
export function RevealItem({ children, className = "", as = "div" }: Omit<RevealProps, "delay">) {
  const Tag = as;
  return (
    <Tag data-reveal="" className={className}>
      {children}
    </Tag>
  );
}
