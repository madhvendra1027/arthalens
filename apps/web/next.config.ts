import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  ...(process.env.DOCKER_BUILD === "1" ? { output: "standalone" } : {}),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1",
    NEXT_PUBLIC_AI_BASE_URL: process.env.NEXT_PUBLIC_AI_BASE_URL ?? "http://localhost:8001/ai/v1",
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV ?? "development",
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "",
    NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "governance@arthalens.org",
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://images.unsplash.com https://www.google-analytics.com https://www.googletagmanager.com",
              "connect-src 'self' https://arthalens-production.up.railway.app http://localhost:8080 http://localhost:8001 http://localhost:8002 https://www.google-analytics.com https://region1.google-analytics.com",
              "frame-ancestors 'none'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/demo",
        destination: "/",
        permanent: false,
      },
      {
        source: "/demo/:path*",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
