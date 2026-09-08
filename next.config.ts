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
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
