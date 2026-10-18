import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://arthalens-production.up.railway.app";
  const lastModDate = new Date("2026-10-18T00:00:00.000Z");

  const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1.0, changeFrequency: "daily" },
    { path: "/gdp", priority: 0.95, changeFrequency: "daily" },
    { path: "/gdp/why", priority: 0.9, changeFrequency: "weekly" },
    { path: "/deflator", priority: 0.85, changeFrequency: "weekly" },
    { path: "/methodology", priority: 0.85, changeFrequency: "monthly" },
    { path: "/how-it-works", priority: 0.85, changeFrequency: "monthly" },
    { path: "/consistency", priority: 0.8, changeFrequency: "weekly" },
    { path: "/revisions", priority: 0.8, changeFrequency: "weekly" },
    { path: "/ratings", priority: 0.8, changeFrequency: "monthly" },
    { path: "/global", priority: 0.8, changeFrequency: "weekly" },
    { path: "/sources", priority: 0.8, changeFrequency: "weekly" },
    { path: "/sources/mospi-nas", priority: 0.75, changeFrequency: "monthly" },
    { path: "/sources/rbi-dbie", priority: 0.75, changeFrequency: "monthly" },
    { path: "/sources/mof-dea", priority: 0.75, changeFrequency: "monthly" },
    { path: "/sources/state-des", priority: 0.75, changeFrequency: "monthly" },
    { path: "/sources/cag-audit", priority: 0.75, changeFrequency: "monthly" },
    { path: "/sources/world-bank", priority: 0.75, changeFrequency: "monthly" },
    { path: "/ai", priority: 0.75, changeFrequency: "daily" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
    { path: "/privacy", priority: 0.6, changeFrequency: "monthly" },
    { path: "/terms", priority: 0.6, changeFrequency: "monthly" },
  ];

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: lastModDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
