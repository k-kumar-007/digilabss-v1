import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { MotionProvider } from "@/components/fx/MotionProvider";
import { Analytics } from "@/components/site/Analytics";
import { RevealObserver } from "@/components/fx/RevealObserver";
import { GTM_ID } from "@/lib/analytics";

/**
 * Guard as a boolean, never as the string itself: `{"" && <x/>}` evaluates to
 * `""`, and React renders that as an empty text node. Inside <head> that is
 * invalid HTML and triggers a hydration mismatch.
 */
const hasGtm = GTM_ID.length > 0;

/**
 * Self-hosted by next/font at build time: no request to fonts.googleapis.com,
 * no render-blocking stylesheet, and the file is preloaded automatically.
 * `display: swap` means text is never invisible while it loads.
 */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  // Variable font, so weights 400–700 cost one file rather than four.
  axes: [],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://digilabss-landing.vercel.app";
const TITLE = "Digilabss — Meta Ads that scale profitably";
const DESCRIPTION =
  "Meta Ads for Tier 1 brands. Creative volume, server-side signal, and a weekly operating rhythm. Book a free account audit.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "Digilabss",
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Digilabss",
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
      <head>
        {/* Warm up the GTM origin during head parse rather than on script execution. */}
        {hasGtm && (
          <>
            <link rel="preconnect" href="https://www.googletagmanager.com" />
            <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
          </>
        )}
      </head>
      <body className="antialiased">
        {hasGtm && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        )}

        <a
          href="#top"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-black"
        >
          Skip to content
        </a>

        <MotionProvider>{children}</MotionProvider>

        <RevealObserver />
        <Analytics />

        {/*
          Google Tag Manager.

          `afterInteractive` keeps the container out of the critical path — it
          loads once the page is usable, so it cannot delay LCP or block the
          main thread during hydration. The dataLayer is created before this
          runs, so any event fired earlier is replayed by GTM on load.
        */}
        {hasGtm && (
          <Script id="gtm-loader" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        )}
      </body>
    </html>
  );
}
