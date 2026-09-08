const BRANDS = ["NORTHBOUND", "Lumen & Co", "ATLAS HOME", "Verda", "HALCYON", "Ridgeway", "OKAPI", "Sundial"];

/**
 * Trust strip.
 *
 * Pure CSS marquee: the track is duplicated once and translated -50%, which
 * loops seamlessly on a single composited transform — no JS, no scroll
 * listener, and it costs nothing while off-screen. The second copy is
 * aria-hidden so the names are announced once.
 */
export function TrustBar() {
  return (
    <section
      data-nav-theme="light"
      className="relative border-y border-line bg-white py-9"
      aria-label="Selected clients"
    >
      <p className="u-shell mb-6 text-center text-[12px] font-medium uppercase tracking-[0.12em] text-muted">
        Trusted by teams across the US, UK &amp; AU
      </p>

      <div
        className="relative flex overflow-hidden"
        style={{
          maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
        }}
      >
        <div className="a-marquee flex shrink-0 items-center gap-14 pr-14 sm:gap-20 sm:pr-20">
          {BRANDS.map((brand) => (
            <span
              key={brand}
              className="whitespace-nowrap text-[15px] font-semibold tracking-[0.14em] text-ink/65 sm:text-[17px]"
            >
              {brand}
            </span>
          ))}
          {BRANDS.map((brand) => (
            <span
              key={`${brand}-dup`}
              aria-hidden="true"
              className="whitespace-nowrap text-[15px] font-semibold tracking-[0.14em] text-ink/65 sm:text-[17px]"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
