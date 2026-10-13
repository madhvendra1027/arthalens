"use client";
import { useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useGdpSeries, useGdpSectors } from "@/hooks/useApi";
import { BklitGdpLineChart } from "@/components/charts/BklitGdpLineChart";
import { SectorDonutChart } from "@/components/charts/SectorDonutChart";
import { StateGvaSection } from "@/components/gdp/StateGvaSection";
import { ErrorState, LoadingGrid, EmptyState } from "@/components/ui/StateComponents";
import { DynamicText } from "@/components/kokonutui/dynamic-text";
import { RubberSegment } from "@/components/ui/RubberSegment";

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
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Antimetal Official Header */}
      <div className="mb-8 rounded-lg border border-[rgba(20,21,23,0.12)] bg-[#ECEBE5] p-6 shadow-2xs">
        <div className="flex items-center gap-2 mb-2">
          <span className="rounded-full bg-[#141416] text-[#ECEBE5] px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider">
            01 // GDP TIME SERIES EXPLORER
          </span>
          <span className="font-mono text-xs text-[#828387]">• MoSPI NSO SNA 2008 Standard</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#141416]">
          Gross Domestic Product & Sectoral Decomposition
        </h1>
        <p className="text-xs sm:text-sm text-[#57585C] mt-2 max-w-3xl leading-relaxed">
          Historical Gross Domestic Product observations and quarterly growth rates reproduced under the official Government of India Open Data Framework with cryptographic provenance.
        </p>

        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[rgba(20,21,23,0.08)]">
          <span className="font-mono text-[11px] font-bold text-[#828387] uppercase">Active Telemetry:</span>
          <DynamicText
            words={[
              { text: "Double-Deflation IO Matrices Active" },
              { text: "Sectoral GVA Across 8 Key Industries" },
              { text: "State-Level GVA: 28 States & 3 UTs" },
              { text: "Real vs Nominal Price Deflators Live" },
            ]}
            interval={2600}
            loop={true}
            className="!min-h-0"
            containerClassName="!h-5 !min-w-[260px]"
            textClassName="!text-xs !font-mono !font-medium !text-[#141416]"
            dotClassName="!h-1.5 !w-1.5 bg-[#059669]"
          />
        </div>
      </div>

      {/* Series Filters & Controls powered by RubberSegment */}
      <div className="mb-6 flex flex-wrap items-center gap-4 bg-[#ECEBE5] p-4 sm:p-5 rounded-2xl border border-[rgba(20,21,23,0.12)] shadow-2xs" role="group" aria-label="Series filters">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-[#57585C] uppercase font-mono">
            Base Year Series
          </label>
          <RubberSegment
            items={["2022-23 Active", "2011-12 Historical"]}
            defaultValue={baseYear === "2022-23" ? "2022-23 Active" : "2011-12 Historical"}
            value={baseYear === "2022-23" ? "2022-23 Active" : "2011-12 Historical"}
            onChange={(val) => setParam("base_year", val.startsWith("2022") ? "2022-23" : "2011-12")}
            trackColor="#E3E2DC"
            thumbColor="#141416"
            textColor="#57585C"
            activeTextColor="#ECEBE5"
            size="sm"
            radius={9999}
            inset={2}
            preset="gdp-base"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-[#57585C] uppercase font-mono">
            Valuation Basis
          </label>
          <RubberSegment
            items={["Constant (Real)", "Current (Nominal)"]}
            defaultValue={priceType === "constant" ? "Constant (Real)" : "Current (Nominal)"}
            value={priceType === "constant" ? "Constant (Real)" : "Current (Nominal)"}
            onChange={(val) => setParam("price_type", val.startsWith("Constant") ? "constant" : "current")}
            trackColor="#E3E2DC"
            thumbColor="#141416"
            textColor="#57585C"
            activeTextColor="#ECEBE5"
            size="sm"
            radius={9999}
            inset={2}
            preset="gdp-price"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-[#57585C] uppercase font-mono">
            Frequency Interval
          </label>
          <RubberSegment
            items={["Annual (FY)", "Quarterly (Q)"]}
            defaultValue={periodType === "FY" ? "Annual (FY)" : "Quarterly (Q)"}
            value={periodType === "FY" ? "Annual (FY)" : "Quarterly (Q)"}
            onChange={(val) => setParam("period_type", val.startsWith("Annual") ? "FY" : "Q")}
            trackColor="#E3E2DC"
            thumbColor="#141416"
            textColor="#57585C"
            activeTextColor="#ECEBE5"
            size="sm"
            radius={9999}
            inset={2}
            preset="gdp-freq"
          />
        </div>

        <div className="flex items-end ml-auto pt-2 sm:pt-0">
          <Link
            href="/gdp/why"
            className="btn-realistic btn-solid-black px-4 py-2 text-xs font-semibold tracking-wide"
          >
            Growth Drivers ➔
          </Link>
        </div>
      </div>

      {/* Cross-series warning */}
      {baseYear === "2011-12" && (
        <div
          className="mb-8 rounded-lg border border-[#D97706]/30 bg-[#FFFBEB] p-4 text-xs sm:text-sm text-[#92400E] shadow-2xs font-mono"
          role="alert"
        >
          <strong>Historical Series Notice:</strong> You are viewing historical statistics based on the 2011-12 methodology. Values are kept isolated to prevent improper concatenation with the active 2022-23 base series.
        </div>
      )}

      {/* GDP time series chart powered by Bklit UI */}
      <section className="mb-8" aria-label="GDP time series chart">
        <BklitGdpLineChart
          data={seriesQuery.data?.data}
          title={`India GDP — ${baseYear} Base Series`}
          subtitle={priceType === "constant" ? "Real Constant Prices (INR Lakh Crore)" : "Nominal Current Prices (INR Lakh Crore)"}
          baseYear={baseYear}
          priceType={priceType}
          isLoading={seriesQuery.isLoading}
          error={seriesQuery.error as Error | null}
          onRetry={() => seriesQuery.refetch()}
          showGrowth
          enableProjections
          enableBrush
        />
      </section>

      {/* Sector donut */}
      <section className="card mb-8 bg-[#ECEBE5] border border-[rgba(20,21,23,0.12)] p-6 rounded-lg" aria-label="Sector breakdown chart">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#57585C] mb-4 border-b border-[rgba(20,21,23,0.1)] pb-2 font-mono">
          Sectoral Gross Value Added (GVA) Distribution
        </h2>
        {sectorQuery.isLoading && <div className="h-52 w-full bg-black/5 animate-pulse rounded" />}
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

      {/* State-Level Gross Value Added Section */}
      <StateGvaSection baseYear={baseYear} />

      <div className="mt-8 rounded-lg border border-[rgba(20,21,23,0.12)] bg-[#ECEBE5] p-4 text-xs text-[#828387] font-mono">
        Primary Source: MoSPI National Accounts Statistics (NAS). Figures denominated in INR Crore. UN SNA 2008 compliant.
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
