import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { KpiSnapshot } from "@/components/site/KpiSnapshot";
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
 * The order is the argument: the claim (hero, alone in the opening frame) →
 * the proof it works, one metric at a time (the snapshot) → how we actually
 * work, shown rather than told (the command centre) → the numbers → what you
 * get → proof → how to start → the ask.
 */
export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <KpiSnapshot />
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
