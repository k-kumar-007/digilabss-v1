import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { TrustBar } from "@/components/site/TrustBar";
import { Story } from "@/components/site/Story";
import {
  CompoundingVisual,
  CreativeVolumeVisual,
  SignalVisual,
} from "@/components/visuals/StoryVisuals";
import { Stats } from "@/components/site/Stats";
import { Capabilities } from "@/components/site/Capabilities";
import { Proof } from "@/components/site/Proof";
import { Process } from "@/components/site/Process";
import { BookACall } from "@/components/site/BookACall";
import { Footer } from "@/components/site/Footer";
import { StickyCTA } from "@/components/site/StickyCTA";

/**
 * One page, one scroll.
 *
 * The order is the argument: what it is (hero, approach) → why it matters
 * (numbers) → what you get (capabilities) → proof (work) → how to start
 * (process) → the ask (form). Surfaces alternate dark/light so the story reads
 * as chapters rather than a stack of unrelated blocks.
 */
export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <TrustBar />
        {/* The panels are rendered here, on the server, and handed to the
            client scroll shell as slots. */}
        <Story
          visuals={[
            <CreativeVolumeVisual key="creative" />,
            <SignalVisual key="signal" />,
            <CompoundingVisual key="compounding" />,
          ]}
        />
        <Stats />
        <Capabilities />
        <Proof />
        <Process />
        <BookACall />
      </main>
      <Footer />
      <StickyCTA />
    </>
  );
}
