import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://arthalens-production.up.railway.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/analytics", "/login"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/analytics", "/login"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/api/", "/analytics", "/login"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
