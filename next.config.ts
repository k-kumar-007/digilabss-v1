import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root: without it Turbopack walks up and finds a stray
  // lockfile in the home directory.
  turbopack: { root: __dirname },
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // Ship no console noise to production clients.
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
  experimental: {
    // Tree-shake the animation library down to only the imports we touch.
    optimizePackageImports: ["motion"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      {
        // Posters carry a content hash in their filename, so the bytes behind a
        // given URL genuinely never change and `immutable` is an honest claim.
        source: "/vids/:file(.*\\.webp)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        // The films keep human-readable names so a new cut can be dropped in
        // by name — which rules out `immutable`. It promises the bytes at a URL
        // will never change, so replacing a file in place leaves returning
        // visitors on the old copy until the max-age expires. That is exactly
        // what happened to a poster here. Cached hard for a day, then
        // revalidated in the background.
        source: "/vids/:file(.*\\.mp4)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
    ];
  },
};

export default nextConfig;
