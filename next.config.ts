import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // reactStrictMode: true, // ✅ helps catch bugs, improves React performance
  // swcMinify: true,       // ✅ faster build and smaller bundle
  eslint: {
    ignoreDuringBuilds: true, // ✅ disables ESLint errors during build
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // ⚠️ allows all domains (use specific in production)
      },
    ],
    formats: ["image/avif", "image/webp"], // ✅ modern formats for SEO and performance
    minimumCacheTTL: 60,                  // ✅ caching for faster loads
  },
  // experimental: {
  //   optimizeCss: true, // ✅ smaller CSS bundle, improves LCP
  // },
  // headers: async () => [
  //   {
  //     source: "/(.*)",
  //     headers: [
  //       {
  //         key: "Cache-Control",
  //         value: "public, max-age=3600, must-revalidate",
  //       },
  //       {
  //         key: "X-Robots-Tag",
  //         value: "index, follow", // ✅ SEO: allows indexing
  //       },
  //     ],
  //   },
  // ],
  // compiler: {
  //   removeConsole: process.env.NODE_ENV === "production", // ✅ removes console logs in production
  // },
};

export default nextConfig;
