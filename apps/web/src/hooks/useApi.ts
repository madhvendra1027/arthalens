/**
 * ArthaLens data hooks — TanStack Query wrappers for all API domains.
 * All values come from the backend; nothing is hardcoded.
 */
"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

// ─── Query Keys ────────────────────────────────────────────────────────────
export const queryKeys = {
  dashboard: (baseYear: string) => ["dashboard", "india", baseYear] as const,
  gdpLatest: (baseYear: string, priceType: string) =>
    ["gdp", "latest", baseYear, priceType] as const,
  gdpSeries: (params: Record<string, string>) =>
    ["gdp", "series", params] as const,
  gdpSectors: (baseYear: string, priceType: string, period?: string) =>
    ["gdp", "sectors", baseYear, priceType, period] as const,
  gdpRevisions: (baseYear: string) => ["gdp", "revisions", baseYear] as const,
  methodology: () => ["methodology", "series-comparison"] as const,
  deflators: (baseYear: string) => ["deflators", baseYear] as const,
  indicators: () => ["indicators"] as const,
  ratings: (agency: string) => ["ratings", agency] as const,
  source: (id: string) => ["source", id] as const,
};

// ─── Dashboard ──────────────────────────────────────────────────────────────
export function useDashboard(baseYear = "2022-23") {
  return useQuery({
    queryKey: queryKeys.dashboard(baseYear),
    queryFn: () => api.dashboard.india(baseYear),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

// ─── GDP ─────────────────────────────────────────────────────────────────────
export function useGdpLatest(baseYear = "2022-23", priceType = "constant") {
  return useQuery({
    queryKey: queryKeys.gdpLatest(baseYear, priceType),
    queryFn: () => api.gdp.latest(baseYear, priceType),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

export function useGdpSeries(params: {
  base_year?: string;
  price_type?: string;
  period_type?: string;
  page?: string;
  size?: string;
}) {
  return useQuery({
    queryKey: queryKeys.gdpSeries(params as Record<string, string>),
    queryFn: () => api.gdp.series(params),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

export function useGdpSectors(
  baseYear = "2022-23",
  priceType = "constant",
  period?: string
) {
  return useQuery({
    queryKey: queryKeys.gdpSectors(baseYear, priceType, period),
    queryFn: () => api.gdp.sectors({ base_year: baseYear, price_type: priceType, period }),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

export function useGdpRevisions(baseYear = "2022-23") {
  return useQuery({
    queryKey: queryKeys.gdpRevisions(baseYear),
    queryFn: () => api.gdp.revisions(baseYear),
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Methodology ─────────────────────────────────────────────────────────────
export function useSeriesComparison() {
  return useQuery({
    queryKey: queryKeys.methodology(),
    queryFn: () => api.methodology.seriesComparison(),
    staleTime: 60 * 60 * 1000, // 1 hour — methodology rarely changes
  });
}

// ─── Deflators ───────────────────────────────────────────────────────────────
export function useDeflators(baseYear = "2022-23") {
  return useQuery({
    queryKey: queryKeys.deflators(baseYear),
    queryFn: () => api.deflators(baseYear),
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Indicators ──────────────────────────────────────────────────────────────
export function useIndicators() {
  return useQuery({
    queryKey: queryKeys.indicators(),
    queryFn: () => api.indicators(),
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Ratings ─────────────────────────────────────────────────────────────────
export function useRatings(agency = "all") {
  return useQuery({
    queryKey: queryKeys.ratings(agency),
    queryFn: () => api.ratings(agency),
    staleTime: 60 * 60 * 1000,
  });
}

// ─── Source ──────────────────────────────────────────────────────────────────
export function useSource(id: string) {
  return useQuery({
    queryKey: queryKeys.source(id),
    queryFn: () => api.sources.get(id),
    staleTime: 60 * 60 * 1000,
    enabled: !!id,
  });
}
