import { KpiStrip } from "@/components/visuals/KpiStrip";
import { KpiSpotlight } from "@/components/site/KpiSpotlight";
import { ParallaxPanel } from "@/components/fx/ParallaxPanel";
import { Reveal } from "@/components/fx/Reveal";

/**
 * The snapshot band, directly below the hero.
 *
 * Deliberately its own section rather than part of the hero: the opening frame
 * is the headline and nothing else, on every screen size. This is the reward
 * for the first scroll — the panel rises in, then walks itself through the six
 * metrics, each one lifting in its own colour.
 *
 * The panel is server-rendered and handed down through both client wrappers as
 * children, so none of its markup enters the JavaScript bundle.
 */
export function KpiSnapshot() {
  return (
    <section
      data-nav-theme="light"
      className="relative overflow-hidden bg-white pb-20 pt-12 sm:pb-28 sm:pt-16"
      aria-label="Campaign performance snapshot"
    >
      <div className="u-shell">
        <Reveal className="mx-auto max-w-[1000px]">
          <ParallaxPanel>
            <KpiSpotlight>
              <KpiStrip />
            </KpiSpotlight>
          </ParallaxPanel>
        </Reveal>
      </div>
    </section>
  );
}
