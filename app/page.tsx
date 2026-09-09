import { Nav } from "@/components/site/Nav";
import { HeroVideo } from "@/components/site/HeroVideo";
import { TrustBar } from "@/components/site/TrustBar";
import { MetaAdsConsole } from "@/components/site/MetaAdsConsole";
import { DashboardCanvas } from "@/components/visuals/dashboard/DashboardCanvas";
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
 * The order is the argument: the brand film (the opening frame, and nothing
 * else) → how we actually work, shown rather than told (the command centre) →
 * the numbers → what you get → proof → how to start → the ask.
 *
 * Note: the film carries the headline, so the page currently has no `<h1>` and
 * the words "Ad spend that pays for itself" exist only as pixels inside a
 * video. `Banner` (which held the h1) and `KpiSnapshot` are still in
 * `components/site/` and can be dropped back into `<main>` to restore both.
 */
export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <HeroVideo />
        <TrustBar />

        {/*
          The dashboard is rendered here, on the server, and handed to the
          client animation shell as children — so twelve animated panels cost
          nothing in the JS bundle.
        */}
        <MetaAdsConsole>
          <DashboardCanvas />
        </MetaAdsConsole>

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
