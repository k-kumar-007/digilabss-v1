import { BRANDS } from "@/components/visuals/BrandLogos";
import { Reveal } from "@/components/fx/Reveal";

/**
 * Client logo strip.
 *
 * Pure CSS marquee: the track is duplicated once and translated -50%, which
 * loops seamlessly on a single composited transform — no JS, no scroll
 * listener, and it costs nothing while off-screen. The second copy is
 * `aria-hidden` so each name is announced once.
 *
 * Because the track is rendered twice, nothing inside a logo may carry an
 * `id` — see the note in `BrandLogos.tsx`.
 */
function LogoChip({ brand, duplicate = false }: { brand: (typeof BRANDS)[number]; duplicate?: boolean }) {
  return (
    <div
      data-brand-chip=""
      style={{ ["--brand" as string]: brand.color }}
      className="flex shrink-0 items-center gap-2.5 rounded-2xl border border-line bg-white px-5 py-3.5"
      aria-hidden={duplicate || undefined}
    >
      <span data-brand-mark="" className="text-[color:var(--brand)]">
        <brand.Mark />
      </span>
      <span className={`whitespace-nowrap text-ink ${brand.type}`}>{brand.name}</span>
    </div>
  );
}

export function TrustBar() {
  return (
    <section
      data-nav-theme="light"
      className="relative overflow-hidden border-y border-line bg-surface-2 py-12 sm:py-14"
      aria-label="Selected clients"
    >
      <Reveal className="u-shell mb-9 text-center">
        <p className="u-eyebrow justify-center">
          <span className="size-1.5 rounded-full bg-accent" />
          Trusted by teams across the US, UK &amp; AU
        </p>
      </Reveal>

      <div
        data-marquee=""
        className="relative flex overflow-hidden"
        style={{
          maskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
        }}
      >
        <div
          className="a-marquee flex shrink-0 items-center gap-3 pr-3 sm:gap-4 sm:pr-4"
          style={{ ["--marquee-duration" as string]: "34s" }}
        >
          {BRANDS.map((brand) => (
            <LogoChip key={brand.name} brand={brand} />
          ))}
          {BRANDS.map((brand) => (
            <LogoChip key={`${brand.name}-dup`} brand={brand} duplicate />
          ))}
        </div>
      </div>

      <p className="u-shell mt-8 text-center text-[12px] text-muted">
        Placeholder brands · demo build
      </p>
    </section>
  );
}
