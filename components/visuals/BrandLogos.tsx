/**
 * Placeholder client logos.
 *
 * Each is a mark plus a wordmark with its own typographic treatment — case,
 * weight, tracking and size all differ, which is what stops eight fictional
 * brands from looking like eight instances of one template.
 *
 * Two constraints worth knowing about:
 *  - No `<defs>`, gradients or `id` attributes anywhere. The marquee renders
 *    the whole set twice, and duplicated SVG ids are invalid HTML and can make
 *    `url(#…)` references resolve to the wrong node.
 *  - Every colour clears WCAG AA on white, because the marks sit on a white
 *    chip and carry the brand's identity rather than just decorating it.
 */

type MarkProps = { className?: string };

const box = (className?: string) => ({
  viewBox: "0 0 24 24",
  className: `size-[26px] ${className ?? ""}`,
  "aria-hidden": true as const,
});

/** Northbound — a compass needle. */
export const NorthboundMark = ({ className }: MarkProps) => (
  <svg {...box(className)} fill="currentColor">
    <path d="M12 2.4 4.4 21.6 12 17.5Z" opacity={0.45} />
    <path d="M12 2.4l7.6 19.2L12 17.5Z" />
  </svg>
);

/** Lumen & Co — a light source. */
export const LumenMark = ({ className }: MarkProps) => (
  <svg {...box(className)} fill="none" stroke="currentColor" strokeLinecap="round">
    <circle cx="12" cy="12" r="4.4" fill="currentColor" stroke="none" />
    <g strokeWidth="2">
      <path d="M12 1.9v2.5M12 19.6v2.5M1.9 12h2.5M19.6 12h2.5" />
    </g>
    <g strokeWidth="1.8" opacity={0.55}>
      <path d="M4.9 4.9 6.7 6.7M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
    </g>
  </svg>
);

/** Atlas Home — a roofline over a structure. */
export const AtlasMark = ({ className }: MarkProps) => (
  <svg {...box(className)} fill="currentColor">
    <path d="M12 2.6 22.4 11.4h-3.6L12 5.8 5.2 11.4H1.6Z" />
    <path d="M5.8 12.8h12.4v8.6H5.8z" opacity={0.4} />
    <path d="M10.4 16.2h3.2v5.2h-3.2z" />
  </svg>
);

/** Verda — a leaf. */
export const VerdaMark = ({ className }: MarkProps) => (
  <svg {...box(className)} fill="none">
    <path
      d="M21.2 2.8C10.4 2.8 3.6 9 3.6 19.6c0 .7.1 1.4.2 2.1 9.5-.4 17.4-7.2 17.4-18.9Z"
      fill="currentColor"
    />
    <path
      d="M5.4 21.2C8.2 15.4 13 10.4 18.8 7.2"
      stroke="#fff"
      strokeWidth="1.7"
      strokeLinecap="round"
      opacity={0.9}
    />
  </svg>
);

/** Halcyon — a bird in flight. */
export const HalcyonMark = ({ className }: MarkProps) => (
  <svg {...box(className)} fill="none" stroke="currentColor" strokeLinecap="round">
    <path d="M2.2 15.2c3.3-5.4 6.6-5.4 9.8 0" strokeWidth="2.4" />
    <path d="M12 15.2c3.2-5.4 6.5-5.4 9.8 0" strokeWidth="2.4" opacity={0.5} />
  </svg>
);

/** Ridgeway — two ridges. */
export const RidgewayMark = ({ className }: MarkProps) => (
  <svg {...box(className)} fill="currentColor">
    <path d="M8.6 20.9 15.4 7.6l7.2 13.3Z" opacity={0.42} />
    <path d="M1.4 20.9 8 8.8l6.6 12.1Z" />
  </svg>
);

/** Okapi — a striped ring. */
export const OkapiMark = ({ className }: MarkProps) => (
  <svg {...box(className)} fill="none" stroke="currentColor" strokeLinecap="round">
    <circle cx="12" cy="12" r="8.7" strokeWidth="2.3" />
    <path d="M6.6 9.4h10.8" strokeWidth="2.1" opacity={0.55} />
    <path d="M6.6 14.6h10.8" strokeWidth="2.1" opacity={0.55} />
  </svg>
);

/** Sundial — a gnomon and its dial. */
export const SundialMark = ({ className }: MarkProps) => (
  <svg {...box(className)} fill="none" stroke="currentColor" strokeLinecap="round">
    <circle cx="12" cy="12" r="8.7" strokeWidth="1.8" opacity={0.4} />
    <path d="M12 3.6v1.9M20.4 12h-1.9M12 20.4v-1.9M3.6 12h1.9" strokeWidth="1.7" opacity={0.6} />
    <path d="M12 12 17.6 6.4" strokeWidth="2.5" />
    <circle cx="12" cy="12" r="2.1" fill="currentColor" stroke="none" />
  </svg>
);

export type Brand = {
  name: string;
  color: string;
  /** Per-brand wordmark styling — the thing that makes them feel unrelated. */
  type: string;
  Mark: (props: MarkProps) => React.JSX.Element;
};

export const BRANDS: Brand[] = [
  { name: "NORTHBOUND", color: "#4338ca", type: "text-[13px] font-semibold uppercase tracking-[0.16em]", Mark: NorthboundMark },
  { name: "Lumen & Co", color: "#b45309", type: "text-[17px] font-semibold tracking-[-0.02em]", Mark: LumenMark },
  { name: "ATLAS HOME", color: "#be123c", type: "text-[13px] font-bold uppercase tracking-[0.09em]", Mark: AtlasMark },
  { name: "Verda", color: "#15803d", type: "text-[18px] font-semibold tracking-[-0.03em]", Mark: VerdaMark },
  { name: "HALCYON", color: "#0e7490", type: "text-[13px] font-normal uppercase tracking-[0.24em]", Mark: HalcyonMark },
  { name: "Ridgeway", color: "#475569", type: "text-[16px] font-medium tracking-[0.01em]", Mark: RidgewayMark },
  { name: "OKAPI", color: "#a21caf", type: "text-[15px] font-extrabold uppercase tracking-[-0.01em]", Mark: OkapiMark },
  { name: "Sundial", color: "#c2410c", type: "text-[16px] font-medium tracking-[0.04em]", Mark: SundialMark },
];
