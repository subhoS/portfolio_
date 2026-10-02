import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/:file(.*\\.(?:png|jpg|jpeg|svg|webp|avif|ico|pdf))",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=2592000" }],
      },
    ];
  },
  async redirects() {
    return [
      // Old/alternate paths people might guess or that existed before.
      { source: "/posts/:slug", destination: "/blog/:slug", permanent: true },
      { source: "/articles/:slug", destination: "/blog/:slug", permanent: true },
      { source: "/writing", destination: "/blog", permanent: true },
      { source: "/work", destination: "/projects", permanent: true },
      { source: "/resume", destination: "/resume.pdf", permanent: false },
      { source: "/cv", destination: "/resume.pdf", permanent: false },
      { source: "/feed", destination: "/rss.xml", permanent: true },
      { source: "/feed.xml", destination: "/rss.xml", permanent: true },
      { source: "/blog/hello-world", destination: "/blog/building-an-seo-first-developer-portfolio", permanent: true },
    ];
  },
};

export default nextConfig;
