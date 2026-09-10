"use client";
import { useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useGdpSeries, useGdpSectors } from "@/hooks/useApi";
import { GdpLineChart } from "@/components/charts/GdpLineChart";
import { SectorDonutChart } from "@/components/charts/SectorDonutChart";
import { ErrorState, LoadingGrid, EmptyState } from "@/components/ui/StateComponents";

function GdpExplorerInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const baseYear  = (searchParams.get("base_year")   ?? "2022-23") as "2022-23" | "2011-12";
  const priceType = (searchParams.get("price_type")  ?? "constant") as "constant" | "current";
  const periodType = (searchParams.get("period_type") ?? "FY") as "FY" | "Q";

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(key, value);
      router.push(`/gdp?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  const seriesQuery = useGdpSeries({ base_year: baseYear, price_type: priceType, period_type: periodType, size: "30" });
  const sectorQuery = useGdpSectors(baseYear, priceType);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Official Header */}
      <div className="mb-6 rounded-md border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="rounded bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 text-[11px] font-mono font-bold uppercase">
            National Accounts Statistics Time Series
          </span>
          <span className="text-xs text-slate-500">• Authority: MoSPI NSO</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          GDP Time Series & Sectoral Decomposition Explorer
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Historical Gross Domestic Product observations and growth rates reproduced under the official Government of India Open Data Framework.
        </p>
      </div>

      {/* Series Filters & Controls */}
      <div className="mb-6 flex flex-wrap items-center gap-3 bg-white p-4 rounded-md border border-slate-200 shadow-2xs" role="group" aria-label="Series filters">
        <div className="flex flex-col gap-1">
          <label htmlFor="gdp-base-year" className="text-[11px] font-bold text-slate-700 uppercase font-mono">
            Base Year Series
          </label>
          <select
            id="gdp-base-year"
            value={baseYear}
            onChange={(e) => setParam("base_year", e.target.value)}
            className="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-2xs focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer"
          >
            <option value="2022-23">2022-23 Base Year (Current Active)</option>
            <option value="2011-12">2011-12 Base Year (Historical Legacy)</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="gdp-price-type" className="text-[11px] font-bold text-slate-700 uppercase font-mono">
            Valuation Basis
          </label>
          <select
            id="gdp-price-type"
            value={priceType}
            onChange={(e) => setParam("price_type", e.target.value)}
            className="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-2xs focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer"
          >
            <option value="constant">Constant Prices (Real GDP)</option>
            <option value="current">Current Prices (Nominal GDP)</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="gdp-period-type" className="text-[11px] font-bold text-slate-700 uppercase font-mono">
            Frequency Interval
          </label>
          <select
            id="gdp-period-type"
            value={periodType}
            onChange={(e) => setParam("period_type", e.target.value)}
            className="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-2xs focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer"
          >
            <option value="FY">Annual (Financial Year)</option>
            <option value="Q">Quarterly (Q1–Q4)</option>
          </select>
        </div>

        <div className="flex items-end ml-auto pt-4 sm:pt-0">
          <Link
            href="/gdp/why"
            className="rounded border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-blue-900 hover:bg-blue-100 transition-colors shadow-2xs"
          >
            View Growth Drivers & Breakdown ➔
          </Link>
        </div>
      </div>

      {/* Cross-series warning */}
      {baseYear === "2011-12" && (
        <div
          className="mb-6 rounded-md border border-amber-200 bg-amber-50/80 p-4 text-xs sm:text-sm text-amber-900 shadow-2xs"
          role="alert"
        >
          <strong>Historical Series Notice:</strong> You are viewing historical statistics based on the 2011-12 methodology. Values are kept isolated to prevent improper concatenation with the active 2022-23 base series.
        </div>
      )}

      {/* GDP time series chart */}
      <section className="card mb-6" aria-label="GDP time series chart">
        {seriesQuery.isLoading && <div className="skeleton h-72 w-full" aria-label="Loading chart" />}
        {seriesQuery.isError && (
          <ErrorState message={(seriesQuery.error as Error)?.message} retry={() => seriesQuery.refetch()} />
        )}
        {!seriesQuery.isLoading && !seriesQuery.isError && (
          seriesQuery.data?.data?.length ? (
            <GdpLineChart
              data={seriesQuery.data.data}
              title={`India GDP - ${baseYear} Base Series (${priceType === "constant" ? "Real Constant Prices" : "Nominal Current Prices"})`}
              showGrowth
            />
          ) : (
            <EmptyState message="No GDP series records available." />
          )
        )}
      </section>

      {/* Sector donut */}
      <section className="card mb-6" aria-label="Sector breakdown chart">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 border-b border-slate-200 pb-2">
          Sectoral Gross Value Added (GVA) Distribution
        </h2>
        {sectorQuery.isLoading && <div className="skeleton h-52 w-full" />}
        {sectorQuery.isError && <ErrorState retry={() => sectorQuery.refetch()} />}
        {!sectorQuery.isLoading && !sectorQuery.isError && (
          sectorQuery.data?.sectors?.length ? (
            <SectorDonutChart
              sectors={sectorQuery.data.sectors}
              period={sectorQuery.data.period}
              baseYear={sectorQuery.data.baseYear}
            />
          ) : <EmptyState />
        )}
      </section>

      <div className="rounded border border-slate-200 bg-white p-3.5 text-xs text-slate-500 font-mono">
        Primary Source: MoSPI National Accounts Statistics (NAS). Figures denominated in INR Crore.
      </div>
    </div>
  );
}

export default function GDPPage() {
  return (
    <Suspense fallback={<LoadingGrid count={4} cols={4} />}>
      <GdpExplorerInner />
    </Suspense>
  );
}
