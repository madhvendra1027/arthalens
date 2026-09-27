"use client";
import { useState } from "react";
import { useDashboard } from "@/hooks/useApi";
import { MetricCardDisplay } from "@/components/ui/MetricCard";
import { ErrorState, LoadingGrid, EmptyState } from "@/components/ui/StateComponents";
import type { MetricCard } from "@/lib/api";

export default function HomePage() {
  const [baseYear, setBaseYear] = useState<"2022-23" | "2011-12">("2022-23");
  const { data, isLoading, isError, error, refetch } = useDashboard(baseYear);

  const topCards: MetricCard[] = data
    ? [
        data.realGdpGrowth,
        data.nominalGdpGrowth,
        data.gdpAbsolute,
        data.gvaGrowth,
        data.gdpDeflator,
        data.cpi,
        data.wpi,
      ]
    : [];

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Official Portal Header Banner */}
      <section aria-labelledby="dashboard-heading" className="mb-6 rounded-lg border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-blue-50 text-blue-900 border border-blue-200 px-2.5 py-0.5 text-xs font-mono font-bold uppercase tracking-wide">
              National Statistical Office (NSO)
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Ministry of Statistics & Programme Implementation (MoSPI)
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="text-xs text-slate-500">
              Release: Provisional Estimates of National Income (May 2024)
            </span>
          </div>

          <div>
            <h1 id="dashboard-heading" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              India Macroeconomic Accounts & National Indicators
            </h1>
            <p className="mt-1 max-w-3xl text-xs sm:text-sm text-slate-600 leading-relaxed">
              Official macroeconomic data repository published under the Government of India Open Data Framework. All statistics reflect authoritative MoSPI and Reserve Bank of India (RBI) National Accounts Statistics.
            </p>
          </div>
        </div>

        {/* Dedicated Base Year Benchmark Selector Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/80 -mx-6 -mb-6 p-5 rounded-b-lg border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-900 text-white font-bold text-sm shadow-2xs">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Statistical Benchmark Series:
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {baseYear === "2022-23" ? "2022-23 CURRENT" : "2011-12 HISTORICAL"}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {baseYear === "2022-23"
                  ? "Active official benchmark incorporating MCA-21 company registry & GSTN formalization."
                  : "Legacy benchmark series maintained for historical comparisons (2011-12 through 2021-22)."}
              </p>
            </div>
          </div>

          {/* High-Contrast Official Base Year Buttons */}
          <div className="flex items-center gap-2.5 bg-slate-100 p-1.5 rounded-xl border border-slate-300 shadow-inner self-start md:self-auto">
            <button
              onClick={() => setBaseYear("2022-23")}
              className={`btn-realistic gap-2 rounded-lg px-4 py-2 text-xs transition-all ${
                baseYear === "2022-23"
                  ? "btn-solid-blue font-extrabold"
                  : "btn-solid-slate font-bold text-slate-700"
              }`}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${baseYear === "2022-23" ? "bg-emerald-300 shadow-sm shadow-emerald-400 animate-pulse" : "bg-slate-400"}`} />
              <span>2022-23 Base Year</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-black ${baseYear === "2022-23" ? "bg-blue-950 text-emerald-300 border border-blue-800" : "bg-slate-200 text-slate-600 border border-slate-300"}`}>
                ACTIVE
              </span>
            </button>

            <button
              onClick={() => setBaseYear("2011-12")}
              className={`btn-realistic gap-2 rounded-lg px-4 py-2 text-xs transition-all ${
                baseYear === "2011-12"
                  ? "btn-solid-navy font-extrabold"
                  : "btn-solid-slate font-bold text-slate-700"
              }`}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${baseYear === "2011-12" ? "bg-amber-400 shadow-sm shadow-amber-500" : "bg-slate-400"}`} />
              <span>2011-12 Base Year</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-black ${baseYear === "2011-12" ? "bg-slate-950 text-amber-300 border border-slate-700" : "bg-slate-200 text-slate-600 border border-slate-300"}`}>
                HISTORICAL
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Indicators Grid */}
      <section aria-label="Economic indicators" className="mb-8">
        <div className="flex items-center justify-between mb-3.5 border-b border-slate-200 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-700 inline-block"></span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Headline Macroeconomic Aggregates & Rates (FY 2023-24)
            </h2>
          </div>
          <span className="text-[11px] font-mono font-medium text-slate-500">
            PROVENANCE: MOSPI NATIONAL ACCOUNTS
          </span>
        </div>

        {isLoading && <LoadingGrid count={7} cols={4} />}

        {isError && (
          <ErrorState
            message={(error as Error)?.message}
            retry={() => refetch()}
          />
        )}

        {!isLoading && !isError && topCards.length === 0 && (
          <EmptyState message="No indicators returned by API." />
        )}

        {!isLoading && !isError && topCards.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topCards.map((card) => (
              <MetricCardDisplay key={card.label} card={card} />
            ))}
          </div>
        )}
      </section>

      {/* Sector Breakdown & Composition */}
      {data?.topSectors && data.topSectors.length > 0 && (
        <section aria-label="Top sectors" className="mt-8">
          <div className="flex items-center justify-between mb-3.5 border-b border-slate-200 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 inline-block"></span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Sectoral Gross Value Added (GVA) Growth & Output Share
              </h2>
            </div>
            <span className="text-[11px] font-mono font-medium text-slate-500">
              CONSTANT BASIC PRICES ({baseYear})
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.topSectors.map((card) => (
              <MetricCardDisplay key={card.label} card={card} />
            ))}
          </div>
        </section>
      )}

      {/* Official Government Data Provenance Footer */}
      <div className="mt-10 rounded-lg border border-slate-200 bg-white p-5 text-xs text-slate-600 shadow-2xs space-y-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-blue-600"></span>
          <span className="font-bold text-slate-800 uppercase text-[11px] tracking-wider font-mono">
            Data Integrity, Provenance & Splicing Standards
          </span>
        </div>
        <p className="leading-relaxed">
          National accounts statistics are released by the National Statistical Office (NSO), MoSPI. 
          In accordance with international United Nations System of National Accounts (SNA 2008) protocols, 
          data from different base years (2011-12 vs 2022-23) must NOT be spliced without explicit methodological chain-linking.
        </p>
      </div>
    </div>
  );
}
