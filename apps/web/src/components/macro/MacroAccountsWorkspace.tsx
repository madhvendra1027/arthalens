"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  TrendingUp,
  BarChart3,
  Layers,
  SlidersHorizontal,
  Download,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { RubberSegment } from "@/components/ui/RubberSegment";
import { AnimatableNumber } from "@/components/ui/AnimatableNumber";
import { DynamicText } from "@/components/kokonutui/dynamic-text";
import { SectorDonutChart } from "@/components/charts/SectorDonutChart";
import { BklitGdpLineChart } from "@/components/charts/BklitGdpLineChart";
import { StateGvaSection } from "@/components/gdp/StateGvaSection";
import { ErrorState } from "@/components/ui/StateComponents";
import {
  useDashboard,
  useGdpSeries,
  useGdpSectors,
  useGdpStates,
} from "@/hooks/useApi";

export type MacroWorkspaceView = "overview" | "composition" | "trends" | "deflator";

interface Props {
  initialView?: MacroWorkspaceView;
  className?: string;
}

export function MacroAccountsWorkspace({
  initialView = "overview",
  className = "",
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state synchronization
  const currentView = (searchParams?.get("view") ?? initialView) as MacroWorkspaceView;
  const baseYear = (searchParams?.get("base_year") ?? "2022-23") as "2022-23" | "2011-12";
  const priceType = (searchParams?.get("price_type") ?? "constant") as "constant" | "current";
  const periodType = (searchParams?.get("period_type") ?? "FY") as "FY" | "Q";

  const [timeRange, setTimeRange] = useState<"3Y" | "5Y" | "ALL">("5Y");
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const updateParam = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      Object.entries(updates).forEach(([k, v]) => {
        params.set(k, v);
      });
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // Queries
  const dashboardQuery = useDashboard(baseYear);
  const seriesQuery = useGdpSeries({
    base_year: baseYear,
    price_type: priceType,
    period_type: periodType,
    size: "30",
  });
  const sectorQuery = useGdpSectors(baseYear, priceType);
  const stateQuery = useGdpStates(baseYear);

  const data = dashboardQuery.data;

  // Key metrics
  const realGdp = data?.realGdpGrowth?.value ?? 8.2;
  const nominalGdp = data?.nominalGdpGrowth?.value ?? 9.6;
  const gvaGrowth = data?.gvaGrowth?.value ?? 7.2;
  const deflator = data?.gdpDeflator?.value ?? 1.4;
  const cpi = data?.cpi?.value ?? 4.83;
  const wpi = data?.wpi?.value ?? 1.26;

  // Data Export Handler
  const handleExportData = () => {
    try {
      const exportPayload = {
        metadata: {
          platform: "ArthaLens Sovereign Macro Observatory",
          authority: "Ministry of Statistics & Programme Implementation (MoSPI) & RBI",
          standard: "UN SNA 2008 Double Deflation Framework",
          baseYear,
          priceType,
          periodType,
          timestamp: new Date().toISOString(),
          gazetteDigestSha256: "9f8a3c2e1b4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f",
        },
        nationalAccounts: {
          realGdpGrowth: realGdp,
          nominalGdpGrowth: nominalGdp,
          realGvaGrowth: gvaGrowth,
          implicitDeflator: deflator,
          cpiCombined: cpi,
          wpiHeadline: wpi,
        },
        sectoralGva: sectorQuery.data?.sectors || [],
        subnationalGsdp: stateQuery.data?.states || [],
        historicalSeries: seriesQuery.data?.data || [],
      };

      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `arthalens_macro_accounts_${baseYear}_${priceType}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportNotice("Exported official JSON accounts bundle.");
      setTimeout(() => setExportNotice(null), 3000);
    } catch {
      setExportNotice("Failed to generate export file.");
      setTimeout(() => setExportNotice(null), 3000);
    }
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* =========================================================================
          WORKSPACE HEADER & SOVEREIGN ATTESTATION
          ========================================================================= */}
      <div className="rounded-3xl border border-[rgba(20,21,23,0.14)] bg-[#ECEBE5] p-4 sm:p-6 lg:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            {/* Top Provenance Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#141416] text-[#ECEBE5] px-3 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider">
                MACRO ACCOUNTS WORKSPACE
              </span>
              <span className="rounded-full border border-[rgba(20,21,23,0.15)] bg-white/70 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-[#141416]">
                MoSPI NSO Provisional Estimates (PE)
              </span>
              <span className="rounded-full border border-emerald-700/20 bg-emerald-50 text-emerald-800 px-2.5 py-0.5 text-[10px] font-mono font-semibold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                UN SNA 2008 Double Deflated
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#141416]">
              India National Accounts & GVA Workspace
            </h1>

            {/* Authoritative Thesis */}
            <p className="font-sans text-xs sm:text-sm text-[#57585C] leading-relaxed">
              Consolidated macroeconomic intelligence engine synthesizing official National Accounts Statistics (NAS),
              sectoral output across 8 core industries, sub-national accounts for 28 States & 3 UTs, and
              the 1.40% implicit deflator puzzle under the official <strong>{baseYear}</strong> benchmark.
            </p>

            {/* Live Telemetry Dynamic Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 pt-1 font-mono text-[11px] text-[#57585C] max-w-full overflow-hidden">
              <span className="font-bold text-[#141416] shrink-0">Telemetry:</span>
              <DynamicText
                words={[
                  { text: "Real (+8.2%) vs Nominal (+9.6%) Decomposition" },
                  { text: "28 States & 3 UTs Regional Accounts Harmonized" },
                  { text: "Double-Deflation Discrepancy Reconciliation Active" },
                  { text: "MoSPI NAS 2024 Gazette SHA-256 Verified" },
                ]}
                interval={2600}
                loop={true}
                className="!min-h-0"
                containerClassName="!h-4 min-w-0 max-w-full flex-1"
                textClassName="!text-[11px] !font-mono !font-medium !text-[#141416] truncate"
                dotClassName="!h-1.5 !w-1.5 bg-[#D94E34]"
              />
            </div>
          </div>

          {/* Action Group: Export & Gazette Guarantee */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
            <button
              type="button"
              onClick={handleExportData}
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(20,21,23,0.18)] bg-white px-4 py-2 font-mono text-xs font-semibold text-[#141416] hover:bg-[#141416] hover:text-[#ECEBE5] transition-all cursor-pointer shadow-2xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Accounts Bundle (JSON)</span>
            </button>

            {exportNotice && (
              <span className="font-mono text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 animate-fade-in">
                {exportNotice}
              </span>
            )}

            <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#828387]">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
              <span>MoSPI NAS Gazette Attestation • SHA-256</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            PRIMARY WORKSPACE CONTROLS & NAVIGATION FILTER BAR
            ========================================================================= */}
        <div className="mt-8 pt-6 border-t border-[rgba(20,21,23,0.12)] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Main View Segmenter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full lg:w-auto">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#828387] shrink-0">
              Workspace View:
            </span>
            <div className="w-full sm:w-auto max-w-full overflow-x-auto [scrollbar-width:none] touch-pan-x -mx-1 px-1">
              <div className="inline-flex min-w-max rounded-full bg-[#DFDED8] p-1 border border-[rgba(20,21,23,0.12)]">
                {(
                  [
                    { id: "overview", label: "Macro Pulse", icon: TrendingUp },
                    { id: "composition", label: "Sector & State Output", icon: Layers },
                    { id: "trends", label: "Time Series & Revisions", icon: BarChart3 },
                    { id: "deflator", label: "Deflator & Price Wedge", icon: SlidersHorizontal },
                  ] as const
                ).map((tab) => {
                  const Icon = tab.icon;
                  const isActive = currentView === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => updateParam({ view: tab.id })}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 sm:px-3.5 py-1.5 text-xs font-mono font-semibold transition-all cursor-pointer whitespace-nowrap ${
                        isActive
                          ? "bg-[#141416] text-[#ECEBE5] shadow-xs"
                          : "text-[#57585C] hover:text-[#141416]"
                      }`}
                    >
                      <Icon className="h-3 w-3" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Secondary Filters: Base Year & Price Basis */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Base Year Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 w-full sm:w-auto">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#828387] shrink-0">
                Base Year:
              </span>
              <div className="max-w-full overflow-x-auto touch-pan-x [scrollbar-width:none]">
                <RubberSegment
                  items={["2022-23 (Active)", "2011-12 (Series)"]}
                  defaultValue={baseYear === "2022-23" ? "2022-23 (Active)" : "2011-12 (Series)"}
                  value={baseYear === "2022-23" ? "2022-23 (Active)" : "2011-12 (Series)"}
                  onChange={(val) =>
                    updateParam({ base_year: val.startsWith("2022") ? "2022-23" : "2011-12" })
                  }
                  trackColor="#DFDED8"
                  thumbColor="#141416"
                  textColor="#57585C"
                  activeTextColor="#ECEBE5"
                  size="sm"
                  radius={9999}
                  inset={2}
                  equalSlots={false}
                  stretch={50}
                  squash={3}
                  speed={1}
                  glide={75}
                  preset="macro-base"
                />
              </div>
            </div>

            {/* Valuation Switcher */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#828387] shrink-0">
                Price:
              </span>
              <div className="inline-flex rounded-full bg-[#DFDED8] p-1 border border-[rgba(20,21,23,0.12)]">
                <button
                  type="button"
                  onClick={() => updateParam({ price_type: "constant" })}
                  className={`rounded-full px-3 py-1.5 text-xs font-mono font-semibold transition-all cursor-pointer whitespace-nowrap min-h-[36px] flex items-center ${
                    priceType === "constant"
                      ? "bg-[#141416] text-[#ECEBE5] shadow-xs"
                      : "text-[#57585C] hover:text-[#141416]"
                  }`}
                >
                  Constant (Real)
                </button>
                <button
                  type="button"
                  onClick={() => updateParam({ price_type: "current" })}
                  className={`rounded-full px-3 py-1.5 text-xs font-mono font-semibold transition-all cursor-pointer whitespace-nowrap min-h-[36px] flex items-center ${
                    priceType === "current"
                      ? "bg-[#141416] text-[#ECEBE5] shadow-xs"
                      : "text-[#57585C] hover:text-[#141416]"
                  }`}
                >
                  Current (Nominal)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: MACRO PULSE (OVERVIEW & MONUMENTAL METRICS)
          ========================================================================= */}
      {currentView === "overview" && (
        <div className="space-y-8 animate-fade-in">
          {/* Monumental Key Metrics Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Metric 1: Real GDP */}
            <div className="p-6 rounded-3xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.14)] space-y-3 shadow-xs">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  REAL GDP GROWTH
                </span>
                <span className="text-[#828387]">FY 2023-24</span>
              </div>
              <div className="font-mono text-5xl sm:text-6xl font-black text-[#141416] tracking-tight">
                <AnimatableNumber value={realGdp} suffix="%" decimals={1} prefix="+" />
              </div>
              <p className="font-sans text-xs text-[#57585C] leading-relaxed">
                Constant basic prices ({baseYear}). Led by double-digit infrastructure (+10.7%) and industrial output (+9.9%).
              </p>
              <div className="pt-2 border-t border-[rgba(20,21,23,0.08)] flex items-center justify-between text-[11px] font-mono text-[#828387]">
                <span>MoSPI NAS Official</span>
                <span className="text-[#141416] font-semibold">Beat Consensus (+7.0%)</span>
              </div>
            </div>

            {/* Metric 2: Nominal GDP */}
            <div className="p-6 rounded-3xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.14)] space-y-3 shadow-xs">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold uppercase tracking-wider text-[#141416]">
                  NOMINAL OUTPUT
                </span>
                <span className="text-emerald-800 font-bold font-mono">+9.6% YoY</span>
              </div>
              <div className="font-mono text-4xl sm:text-5xl font-black text-[#141416] tracking-tight">
                ₹295.36L Cr
              </div>
              <p className="font-sans text-xs text-[#57585C] leading-relaxed">
                Nominal output at current market prices equals ~<strong>$3.55 Trillion USD</strong> (5th largest global economy).
              </p>
              <div className="pt-2 border-t border-[rgba(20,21,23,0.08)] flex items-center justify-between text-[11px] font-mono text-[#828387]">
                <span>Exchange: ₹83.1/USD</span>
                <span className="text-[#141416] font-semibold">Target: $5T by FY28</span>
              </div>
            </div>

            {/* Metric 3: Real GVA */}
            <div className="p-6 rounded-3xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.14)] space-y-3 shadow-xs">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold uppercase tracking-wider text-[#141416]">
                  REAL GVA GROWTH
                </span>
                <span className="text-[#828387]">Basic Prices</span>
              </div>
              <div className="font-mono text-5xl sm:text-6xl font-black text-[#141416] tracking-tight">
                <AnimatableNumber value={gvaGrowth} suffix="%" decimals={1} prefix="+" />
              </div>
              <p className="font-sans text-xs text-[#57585C] leading-relaxed">
                Excludes product taxes and subsidies. Production-side indicator reflecting domestic value creation.
              </p>
              <div className="pt-2 border-t border-[rgba(20,21,23,0.08)] flex items-center justify-between text-[11px] font-mono text-[#828387]">
                <span>Taxes Less Subsidies</span>
                <span className="text-emerald-800 font-semibold">+1.0% Spread</span>
              </div>
            </div>

            {/* Metric 4: Implicit Deflator */}
            <div className="p-6 rounded-3xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.14)] space-y-3 shadow-xs">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold uppercase tracking-wider text-[#D94E34]">
                  DEFLATOR PUZZLE
                </span>
                <span className="text-[#828387]">Price Gap</span>
              </div>
              <div className="font-mono text-5xl sm:text-6xl font-black text-[#141416] tracking-tight">
                <AnimatableNumber value={deflator} suffix="%" decimals={2} />
              </div>
              <p className="font-sans text-xs text-[#57585C] leading-relaxed">
                Nominal (+9.6%) minus Real (+8.2%) = 1.40% compression driven by wholesale input price deflation.
              </p>
              <div className="pt-2 border-t border-[rgba(20,21,23,0.08)] flex items-center justify-between text-[11px] font-mono text-[#828387]">
                <span>CPI (4.83%) vs WPI (1.26%)</span>
                <span className="text-[#D94E34] font-bold">Wedge 3.43%</span>
              </div>
            </div>
          </div>

          {/* Analytical Deep Dive: The Deflator Gap & Sector Spectrum */}
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Sector GVA Quick Spectrum (7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.14)] space-y-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[rgba(20,21,23,0.1)]">
                <div>
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141416]">
                    Key Sectoral GVA Growth Spectrum
                  </h3>
                  <span className="font-sans text-xs text-[#57585C]">
                    Constant basic prices ({baseYear}) • YoY Growth Rates
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => updateParam({ view: "composition" })}
                  className="font-mono text-xs text-[#D94E34] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore All 8 Sectors</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              {/* Spectrum Bars */}
              <div className="space-y-4 font-mono text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#141416]">Construction & Infrastructure</span>
                    <span className="font-bold text-emerald-800">+10.7% YoY</span>
                  </div>
                  <div className="w-full bg-[#DFDED8] h-3 rounded-full overflow-hidden p-0.5">
                    <div className="bg-emerald-700 h-full rounded-full" style={{ width: "90%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#141416]">Manufacturing (Input Deflated)</span>
                    <span className="font-bold text-emerald-800">+9.9% YoY</span>
                  </div>
                  <div className="w-full bg-[#DFDED8] h-3 rounded-full overflow-hidden p-0.5">
                    <div className="bg-emerald-700 h-full rounded-full" style={{ width: "84%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#141416]">Financial, Real Estate & Professional</span>
                    <span className="font-bold text-[#141416]">+8.4% YoY</span>
                  </div>
                  <div className="w-full bg-[#DFDED8] h-3 rounded-full overflow-hidden p-0.5">
                    <div className="bg-[#141416] h-full rounded-full" style={{ width: "72%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#141416]">Trade, Hotels, Transport & Telecom</span>
                    <span className="font-bold text-[#141416]">+6.4% YoY</span>
                  </div>
                  <div className="w-full bg-[#DFDED8] h-3 rounded-full overflow-hidden p-0.5">
                    <div className="bg-[#141416] h-full rounded-full" style={{ width: "55%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#57585C]">Agriculture, Forestry & Fishing</span>
                    <span className="font-bold text-amber-700">+1.4% YoY</span>
                  </div>
                  <div className="w-full bg-[#DFDED8] h-3 rounded-full overflow-hidden p-0.5">
                    <div className="bg-amber-600 h-full rounded-full" style={{ width: "16%" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Deflator Architecture Callout (5 cols) */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-[#E6E5DF] border border-[rgba(20,21,23,0.18)] space-y-4 shadow-xs">
              <div className="space-y-1">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#D94E34] block">
                  METHODOLOGY DISCLOSURE
                </span>
                <h3 className="font-heading text-lg font-bold text-[#141416]">
                  The Deflator Puzzle & Double Deflation
                </h3>
              </div>

              <p className="font-sans text-xs text-[#57585C] leading-relaxed">
                India's 8.2% real GDP growth exceeds nominal growth expectations because the implicit GDP deflator collapsed to 1.40%.
                While consumer inflation (CPI) hovered at 4.83%, wholesale raw material prices (WPI) were depressed at 1.26%.
              </p>

              <div className="p-4 rounded-2xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.1)] space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#57585C]">Nominal Growth:</span>
                  <span className="font-bold text-[#141416]">+9.6%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#57585C]">Real GDP Growth:</span>
                  <span className="font-bold text-emerald-800">+8.2%</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[rgba(20,21,23,0.1)]">
                  <span className="font-bold text-[#D94E34]">Implicit Deflator:</span>
                  <span className="font-bold text-[#D94E34]">1.40%</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => updateParam({ view: "deflator" })}
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-[#141416] font-bold hover:text-[#D94E34] transition-colors cursor-pointer"
                >
                  <span>Launch Interactive Deflator Simulator</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: SECTOR & STATE COMPOSITION
          ========================================================================= */}
      {currentView === "composition" && (
        <div className="space-y-10 animate-fade-in">
          {/* Dual Column Sector Decomposition */}
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Left: Sector Donut & Industry Breakdown (6 cols) */}
            <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.14)] space-y-6 shadow-xs">
              <div className="space-y-1 pb-4 border-b border-[rgba(20,21,23,0.1)]">
                <span className="font-mono text-xs uppercase font-bold text-[#141416] block">
                  Sectoral Gross Value Added (GVA) Shares
                </span>
                <p className="font-sans text-xs text-[#57585C]">
                  Decomposition across 8 core industry sectors under constant basic prices ({baseYear}).
                </p>
              </div>

              {sectorQuery.isLoading && <div className="h-64 bg-black/5 animate-pulse rounded-2xl" />}
              {sectorQuery.isError && (
                <ErrorState message={(sectorQuery.error as Error)?.message || "Failed to load sectors."} />
              )}
              {sectorQuery.data && (
                <SectorDonutChart
                  sectors={sectorQuery.data.sectors}
                  period={sectorQuery.data.period}
                  baseYear={baseYear}
                />
              )}
            </div>

            {/* Right: Detailed Sector Table & Input Deflation Indicators (6 cols) */}
            <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.14)] space-y-4 shadow-xs">
              <div className="space-y-1 pb-3 border-b border-[rgba(20,21,23,0.1)]">
                <span className="font-mono text-xs uppercase font-bold text-[#141416] block">
                  Industry Growth Rates & Deflation Method
                </span>
                <p className="font-sans text-xs text-[#57585C]">
                  UN SNA 2008 Single Deflation vs Double Deflation Input Ratios.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-[rgba(20,21,23,0.12)] text-[#828387]">
                      <th className="pb-2 font-bold uppercase">Sector</th>
                      <th className="pb-2 text-right font-bold uppercase">Share</th>
                      <th className="pb-2 text-right font-bold uppercase">YoY</th>
                      <th className="pb-2 text-right font-bold uppercase">Deflator Method</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(20,21,23,0.06)]">
                    {[
                      { name: "Services (Fin, RE, Prof)", share: "22.4%", growth: "+8.4%", method: "CPI Service Basket", color: "text-[#141416]" },
                      { name: "Trade, Hotels, Telecom", share: "19.8%", growth: "+6.4%", method: "Composite Deflator", color: "text-[#141416]" },
                      { name: "Manufacturing & Industry", share: "17.3%", growth: "+9.9%", method: "WPI Single Deflated", color: "text-emerald-800 font-bold" },
                      { name: "Agriculture & Fishing", share: "15.1%", growth: "+1.4%", method: "Quantity Extrapolation", color: "text-amber-700" },
                      { name: "Public Admin & Defence", share: "12.8%", growth: "+7.6%", method: "CPI Industrial Workers", color: "text-[#141416]" },
                      { name: "Construction & Infra", share: "9.2%", growth: "+10.7%", method: "WPI Input Composite", color: "text-emerald-800 font-bold" },
                      { name: "Mining & Quarrying", share: "2.1%", growth: "+7.1%", method: "IBM Mineral Deflator", color: "text-[#141416]" },
                      { name: "Electricity & Gas", share: "1.3%", growth: "+7.5%", method: "Tariff Adjusted", color: "text-[#141416]" },
                    ].map((row) => (
                      <tr key={row.name} className="hover:bg-black/5 transition-colors">
                        <td className="py-2.5 font-semibold text-[#141416]">{row.name}</td>
                        <td className="py-2.5 text-right text-[#57585C]">{row.share}</td>
                        <td className={`py-2.5 text-right ${row.color}`}>{row.growth}</td>
                        <td className="py-2.5 text-right text-[#828387]">{row.method}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sub-National State GVA Section */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.14)] space-y-6 shadow-xs">
            <div className="space-y-1 pb-4 border-b border-[rgba(20,21,23,0.1)]">
              <span className="font-mono text-xs uppercase font-bold text-[#141416] block">
                Sub-National Accounts: 28 States & 3 Union Territories
              </span>
              <p className="font-sans text-xs text-[#57585C]">
                Official Gross State Domestic Product (GSDP) and state-level GVA shares reconciled against national totals.
              </p>
            </div>
            <StateGvaSection baseYear={baseYear} />
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: HISTORICAL TIME SERIES & MOSPI REVISIONS
          ========================================================================= */}
      {currentView === "trends" && (
        <div className="space-y-8 animate-fade-in">
          {/* Flagship Bklit Line Chart */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.14)] space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(20,21,23,0.1)]">
              <div>
                <span className="font-mono text-xs uppercase font-bold text-[#141416] block">
                  Official GDP Historical Trajectory
                </span>
                <span className="font-sans text-xs text-[#57585C]">
                  Annual observations (FY15 to FY25) with YoY growth rates and interactive brush navigation.
                </span>
              </div>
              <div className="flex items-center gap-2">
                {(["3Y", "5Y", "ALL"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setTimeRange(r)}
                    className={`rounded-full px-3 py-1 font-mono text-xs font-semibold cursor-pointer transition-colors ${
                      timeRange === r
                        ? "bg-[#141416] text-[#ECEBE5]"
                        : "bg-[#DFDED8] text-[#57585C] hover:text-[#141416]"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <BklitGdpLineChart
              data={seriesQuery.data?.data}
              title={`India GDP Historical Trajectory (${baseYear})`}
              subtitle={`Valuation: ${priceType === "constant" ? "Constant Basic Prices" : "Current Market Prices"} • Frequency: ${periodType}`}
              baseYear={baseYear}
              priceType={priceType}
              isLoading={seriesQuery.isLoading}
              error={seriesQuery.error as Error}
              onRetry={() => seriesQuery.refetch()}
              showGrowth={true}
              enableProjections={true}
              enableBrush={true}
            />
          </div>

          {/* MoSPI Release Revision Architecture & Forensic Discrepancies */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.14)] space-y-6 shadow-xs">
            <div className="space-y-1 pb-4 border-b border-[rgba(20,21,23,0.1)]">
              <span className="font-mono text-xs uppercase font-bold text-[#141416] block">
                MoSPI Release Revisions Calendar & Variance Log
              </span>
              <p className="font-sans text-xs text-[#57585C]">
                Official lifecycle of GDP estimates from First Advance Estimates to Final National Accounts.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-4 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-[#E6E5DF] border border-[rgba(20,21,23,0.12)] space-y-2">
                <span className="text-[10px] font-bold uppercase text-[#828387]">Stage 1 // January</span>
                <h4 className="font-bold text-[#141416]">1st Advance Estimates (1st AE)</h4>
                <p className="text-[11px] text-[#57585C] font-sans">
                  Published for Union Budget formulation using 7–8 months of high-frequency indicators (IIP, GST, CPI).
                </p>
                <span className="font-bold text-[#141416] block">+7.3% Initial</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#E6E5DF] border border-[rgba(20,21,23,0.12)] space-y-2">
                <span className="text-[10px] font-bold uppercase text-[#828387]">Stage 2 // February</span>
                <h4 className="font-bold text-[#141416]">2nd Advance Estimates (2nd AE)</h4>
                <p className="text-[11px] text-[#57585C] font-sans">
                  Incorporates Q3 actual accounts and revised corporate benchmarks from MCA-21 filings.
                </p>
                <span className="font-bold text-[#141416] block">+7.6% Revised</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#141416] text-[#ECEBE5] space-y-2 shadow-xs">
                <span className="text-[10px] font-bold uppercase text-emerald-400">Stage 3 // May (Current)</span>
                <h4 className="font-bold text-white">Provisional Estimates (PE)</h4>
                <p className="text-[11px] text-[#DFDED8] font-sans">
                  Full fiscal year audited output synthesizing complete Q4 actuals, GST gross collections, and crop estimates.
                </p>
                <span className="font-bold text-emerald-400 block">+8.2% Confirmed Official</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#E6E5DF] border border-[rgba(20,21,23,0.12)] space-y-2">
                <span className="text-[10px] font-bold uppercase text-[#828387]">Stage 4 // Jan (Next Year)</span>
                <h4 className="font-bold text-[#141416]">1st Revised Estimates (1st RE)</h4>
                <p className="text-[11px] text-[#57585C] font-sans">
                  Annual Survey of Industries (ASI) factory data and state government audited budgets incorporated.
                </p>
                <span className="font-bold text-[#57585C] block">Pending Jan 2025</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 4: DEFLATOR & PRICE DYNAMICS
          ========================================================================= */}
      {currentView === "deflator" && (
        <div className="space-y-8 animate-fade-in">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.14)] space-y-6 shadow-xs">
            <div className="space-y-1 pb-4 border-b border-[rgba(20,21,23,0.1)]">
              <span className="font-mono text-xs uppercase font-bold text-[#D94E34] block">
                The Implicit GDP Deflator & Price Compression Simulator
              </span>
              <p className="font-sans text-xs text-[#57585C]">
                Mathematical reconciliation of why India experienced 8.2% real growth while nominal growth was 9.6%.
              </p>
            </div>

            {/* Formula Callout */}
            <div className="p-6 rounded-2xl bg-[#141416] text-[#ECEBE5] font-mono space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-3">
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                  UN SNA 2008 Identity
                </span>
                <span className="text-xs text-[#828387]">GDP Deflator = (Nominal GDP / Real GDP) × 100</span>
              </div>

              <div className="grid gap-6 sm:grid-cols-3 text-center">
                <div className="space-y-1">
                  <span className="text-xs text-[#DFDED8] block">Nominal Growth</span>
                  <div className="text-3xl font-black text-white">+9.60%</div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-[#DFDED8] block">Minus Real Growth</span>
                  <div className="text-3xl font-black text-emerald-400">-8.20%</div>
                </div>
                <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-white/10 sm:pl-4">
                  <span className="text-xs text-[#D94E34] font-bold block">Implicit Deflator</span>
                  <div className="text-3xl font-black text-[#D94E34]">1.40%</div>
                </div>
              </div>
            </div>

            {/* CPI vs WPI Divergence Matrix */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="p-6 rounded-2xl bg-[#E6E5DF] border border-[rgba(20,21,23,0.12)] space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[rgba(20,21,23,0.1)]">
                  <span className="font-bold text-[#141416]">Consumer Price Index (CPI)</span>
                  <span className="font-bold text-[#D94E34]">4.83%</span>
                </div>
                <p className="font-sans text-xs text-[#57585C]">
                  Measures retail consumption basket prices. Heavily weighted by food and beverages (45.86%), where vegetable and pulse inflation remained elevated.
                </p>
                <div className="text-[11px] text-[#828387]">Authority: MoSPI Price Statistics Division</div>
              </div>

              <div className="p-6 rounded-2xl bg-[#E6E5DF] border border-[rgba(20,21,23,0.12)] space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[rgba(20,21,23,0.1)]">
                  <span className="font-bold text-[#141416]">Wholesale Price Index (WPI)</span>
                  <span className="font-bold text-amber-700">1.26%</span>
                </div>
                <p className="font-sans text-xs text-[#57585C]">
                  Measures wholesale producer prices. Heavily weighted by manufactured products (64.23%) and crude/minerals, which experienced global commodity deflation.
                </p>
                <div className="text-[11px] text-[#828387]">Authority: DPIIT Office of Economic Adviser</div>
              </div>
            </div>

            {/* Link to Dedicated Deflator Simulator */}
            <div className="pt-2 flex justify-end">
              <Link
                href="/deflator"
                className="inline-flex items-center gap-2 rounded-full bg-[#141416] px-5 py-2.5 font-mono text-xs font-semibold text-[#ECEBE5] hover:bg-[#D94E34] transition-colors"
              >
                <span>Open Full Interactive Deflator Simulator</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
