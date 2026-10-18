"use client";

import { useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { useDashboard } from "@/hooks/useApi";
import { ErrorState, LoadingGrid } from "@/components/ui/StateComponents";
import { HeroConstellation } from "@/components/antimetal/HeroConstellation";
import { SovereignParticleGlobe } from "@/components/antimetal/SovereignParticleGlobe";
import { DynamicText } from "@/components/kokonutui/dynamic-text";
import DotField from "@/components/kokonutui/dot-field";
import { RubberSegment } from "@/components/ui/RubberSegment";
import { AnimatableNumber } from "@/components/ui/AnimatableNumber";
import { LookBeneathHeadline } from "@/components/home/LookBeneathHeadline";
import { EvidenceProvenanceTrail } from "@/components/home/EvidenceProvenanceTrail";
import { AnalyticalCapabilitiesSection } from "@/components/home/AnalyticalCapabilitiesSection";
import { ContinueInvestigationSection } from "@/components/home/ContinueInvestigationSection";
import {
  Compass,
  ArrowRight,
  BarChart3,
  ShieldCheck,
  TrendingUp,
  Layers,
  Sparkles,
  SlidersHorizontal,
  FileSpreadsheet,
} from "lucide-react";

export default function HomePage() {
  const [baseYear, setBaseYear] = useState<"2022-23" | "2011-12">("2022-23");
  const [heroVisualMode, setHeroVisualMode] = useState<"constellation" | "globe">("constellation");
  const { data, isLoading, isError, error, refetch } = useDashboard(baseYear);

  const realGdp = data?.realGdpGrowth?.value ?? 8.2;
  const nominalGdp = data?.nominalGdpGrowth?.value ?? 9.6;
  const gvaGrowth = data?.gvaGrowth?.value ?? 7.2;
  const deflator = data?.gdpDeflator?.value ?? 1.4;

  return (
    <div className="relative min-h-screen bg-[#E6E5DF] text-[#141416] overflow-x-hidden selection:bg-[#141416] selection:text-[#E6E5DF]">
      {/* =========================================================================
          CHAPTER 1: THE SIGNAL (SOVEREIGN MACRO OBSERVATORY HERO)
          ========================================================================= */}
      <section className="relative pt-8 sm:pt-14 pb-12 sm:pb-20 border-b border-[rgba(20,21,23,0.14)]">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            {/* Left Column: Monumental Editorial Statement & Ambition (6 cols) */}
            <div className="lg:col-span-6 space-y-6 z-10">
              <div className="space-y-4">
                {/* Official Sovereign Telemetry Badge */}
                <div className="inline-flex items-center gap-2.5 rounded-full border border-[rgba(20,21,23,0.18)] bg-[#ECEBE5] px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-[#141416] shadow-xs">
                  <span className="h-2 w-2 rounded-full bg-[#059669] animate-pulse" />
                  <span>SOVEREIGN OBSERVATORY •</span>
                  <DynamicText
                    words={[
                      { text: "OFFICIAL MOSPI & RBI DATA" },
                      { text: "UN SNA 2008 DOUBLE DEFLATION" },
                      { text: "28 STATES & 3 UTS GVA" },
                      { text: "CRYPTOGRAPHIC PROVENANCE" },
                    ]}
                    interval={2600}
                    loop={true}
                    className="!min-h-0"
                    containerClassName="!h-4 !min-w-[170px]"
                    textClassName="!text-[11px] !font-mono !font-bold !text-[#141416]"
                    dotClassName="hidden"
                  />
                </div>

                {/* Oversized Editorial Headline */}
                <h1 className="font-heading text-5xl sm:text-7xl lg:text-[5rem] font-extrabold leading-[0.96] tracking-tight text-[#141416]">
                  See the economy beneath the numbers.
                </h1>

                {/* Authoritative Editorial Thesis */}
                <p className="font-sans text-base sm:text-lg text-[#57585C] leading-relaxed max-w-xl pt-1">
                  ArthaLens is India's sovereign macroeconomic intelligence observatory. We synthesize official National Accounts, model double-deflation under UN SNA 2008 standards, and audit state economic accounts with cryptographic provenance.
                </p>

                {/* High-Frequency Active Telemetry Micro-Feed */}
                <div className="flex items-center gap-2 pt-2 font-mono text-xs text-[#57585C]">
                  <span className="font-semibold text-[#141416]">Active Telemetry:</span>
                  <DynamicText
                    words={[
                      { text: "Real (+8.2%) vs Nominal (+9.6%) GDP Decomposition" },
                      { text: "Double-Deflation Discrepancy Reconciliation" },
                      { text: "Cross-State GST & Fiscal Deficit Surveillance" },
                      { text: "MoSPI 2022-23 vs 2011-12 Base Year Harmonization" },
                    ]}
                    interval={2800}
                    loop={true}
                    className="!min-h-0"
                    containerClassName="!h-5 !min-w-[270px] sm:!min-w-[320px]"
                    textClassName="!text-xs !font-mono !font-medium !text-[#141416]"
                    dotClassName="!h-1.5 !w-1.5 bg-[#D94E34]"
                  />
                </div>
              </div>

              {/* Direct Action Calls */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/gdp"
                  onClick={() => trackEvent("cta_click", { label: "hero_macro_workspace", destination: "/gdp" })}
                  aria-label="Explore Macro Accounts Workspace"
                  className="inline-flex items-center gap-2 rounded-full bg-[#141416] px-6 py-3 font-mono text-xs font-semibold tracking-wide text-[#ECEBE5] shadow-xs hover:bg-[#D94E34] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#D94E34] focus-visible:ring-offset-2 focus:outline-hidden"
                >
                  <BarChart3 className="h-3.5 w-3.5" />
                  <span>Explore Macro Accounts Workspace</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/deflator"
                  onClick={() => trackEvent("cta_click", { label: "hero_deflator_simulator", destination: "/deflator" })}
                  aria-label="Launch Inflation and Deflator Simulator"
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(20,21,23,0.2)] bg-[#ECEBE5] px-5 py-3 font-mono text-xs font-semibold tracking-wide text-[#141416] hover:bg-[#DFDED8] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#141416] focus-visible:ring-offset-2 focus:outline-hidden"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 text-[#D94E34]" />
                  <span>Deflator Simulator</span>
                </Link>
                <Link
                  href="/methodology"
                  aria-label="Read UN SNA 2008 National Accounts Methodology"
                  className="inline-flex items-center gap-1.5 rounded-full px-4 py-3 font-mono text-xs font-semibold text-[#57585C] hover:text-[#141416] transition-colors focus-visible:ring-2 focus-visible:ring-[#141416] focus:outline-hidden"
                >
                  <Compass className="h-3.5 w-3.5 text-[#059669]" />
                  <span>Methodology</span>
                </Link>
              </div>

              {/* Primary Source Guarantee */}
              <div className="pt-4 border-t border-[rgba(20,21,23,0.12)] flex items-center gap-3 text-[11px] font-mono text-[#828387]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#059669]" />
                <span>PRIMARY PROVENANCE: MOSPI NAS 2024 • RBI DBIE • UN SNA 2008 • SHA-256</span>
              </div>
            </div>

            {/* Right Column: Living Observatory Interactive Stage (6 cols) */}
            <div id="observatory" className="lg:col-span-6 relative space-y-3">
              <div className="flex items-center justify-between">
                <RubberSegment
                  items={["Macro Constellation", "3D Particle Globe"]}
                  defaultValue="Macro Constellation"
                  value={heroVisualMode === "constellation" ? "Macro Constellation" : "3D Particle Globe"}
                  onChange={(val) => setHeroVisualMode(val === "Macro Constellation" ? "constellation" : "globe")}
                  trackColor="#ECEBE5"
                  thumbColor="#141416"
                  textColor="#57585C"
                  activeTextColor="#ECEBE5"
                  size="sm"
                  radius={9999}
                  inset={2}
                  equalSlots
                  stretch={75}
                  squash={3}
                  speed={1}
                  glide={75}
                  preset="hero-modes"
                />

                <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] text-[#828387]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                  <span>INTERACTIVE OBSERVATORY STAGE</span>
                </div>
              </div>

              {/* Visual Window */}
              <div className="relative rounded-3xl overflow-hidden border border-[rgba(20,21,23,0.15)] bg-[#ECEBE5] shadow-sm">
                {heroVisualMode === "constellation" ? (
                  <HeroConstellation />
                ) : (
                  <SovereignParticleGlobe
                    stageHeight="h-[460px] sm:h-[520px] lg:h-[560px]"
                    showEditorialCard={false}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 2: THE SCALE OF THE ECONOMY (MONUMENTAL DATA STORY)
          ========================================================================= */}
      <section className="relative py-16 sm:py-24 border-b border-[rgba(20,21,23,0.14)] overflow-hidden">
        {/* Subtle interactive DotField membrane in background */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <DotField
            className="w-full h-full min-h-full bg-transparent border-0"
            spacing={28}
            interactive={false}
            seed={42}
            showJourney={false}
          >
            {null}
          </DotField>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 space-y-12">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[rgba(20,21,23,0.14)]">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-[#D94E34]">
                <span className="h-2 w-2 rounded-full bg-[#D94E34]" />
                <span>CHAPTER 02 // THE MACRO SCALE</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-[#141416] tracking-tight">
                The Scale of India's Macro Accounts
              </h2>
              <p className="font-sans text-sm sm:text-base text-[#57585C] leading-relaxed">
                Official National Statistical Office (NSO) provisional estimates for FY 2023-24. High-contrast indicators anchored against the official <strong>{baseYear}</strong> benchmark.
              </p>
            </div>

            {/* Base Year Switcher */}
            <RubberSegment
              items={["2022-23 Active Benchmark", "2011-12 Historical Series"]}
              defaultValue="2022-23 Active Benchmark"
              value={baseYear === "2022-23" ? "2022-23 Active Benchmark" : "2011-12 Historical Series"}
              onChange={(val) => setBaseYear(val.startsWith("2022") ? "2022-23" : "2011-12")}
              trackColor="#ECEBE5"
              thumbColor="#141416"
              textColor="#57585C"
              activeTextColor="#ECEBE5"
              size="sm"
              radius={9999}
              inset={2}
              equalSlots
              stretch={80}
              squash={3}
              speed={1}
              glide={75}
              preset="base-years"
            />
          </div>

          {isLoading && <LoadingGrid count={4} cols={2} />}
          {isError && (
            <ErrorState message={(error as Error)?.message} retry={() => refetch()} />
          )}

          {!isLoading && !isError && (
            <div className="space-y-12">
              {/* --- MONUMENTAL TWO-COLUMN ECONOMIC CALLOUT --- */}
              <div className="grid gap-8 lg:grid-cols-12 items-start">
                {/* Hero Metric 1: Real GDP Growth (6 cols) */}
                <div className="lg:col-span-6 p-8 sm:p-10 rounded-3xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.16)] space-y-4 shadow-xs">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                      OFFICIAL PROVISIONAL ESTIMATE // MOSPI
                    </span>
                    <span className="text-[#828387]">FY 2023-24</span>
                  </div>

                  <div className="space-y-1">
                    <span className="font-mono text-xs uppercase font-bold text-[#57585C] block">
                      REAL GDP GROWTH (CONSTANT BASIC PRICES)
                    </span>
                    <div className="font-mono text-7xl sm:text-8xl font-black tracking-tight text-[#141416] leading-none">
                      <AnimatableNumber value={realGdp} suffix="%" decimals={1} prefix="+" />
                    </div>
                  </div>

                  <p className="font-sans text-sm sm:text-base text-[#57585C] leading-relaxed pt-2">
                    Surpassed consensus forecasts (+7.0%), propelled by double-digit construction (+10.7%) and robust manufacturing (+9.9%) output under low wholesale commodity prices.
                  </p>

                  <div className="pt-4 border-t border-[rgba(20,21,23,0.1)] flex items-center justify-between text-xs font-mono text-[#828387]">
                    <span>Benchmark Series: {baseYear}</span>
                    <span className="text-[#141416] font-bold">SHA-256 Gazette Verified</span>
                  </div>
                </div>

                {/* Hero Metric 2: Nominal GDP Absolute Size & The Deflator Gap (6 cols) */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="p-8 sm:p-10 rounded-3xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.16)] space-y-3 shadow-xs">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold uppercase tracking-wider text-[#141416]">
                        SOVEREIGN NOMINAL BASELINE
                      </span>
                      <span className="text-emerald-800 font-bold font-mono">
                        <AnimatableNumber value={nominalGdp} suffix="% YoY" decimals={1} prefix="+" />
                      </span>
                    </div>

                    <div className="font-mono text-4xl sm:text-6xl font-black text-[#141416] tracking-tight">
                      ₹295.36L Cr
                    </div>
                    <p className="font-sans text-xs sm:text-sm text-[#57585C] leading-relaxed">
                      Nominal output at current market prices equals approximately <strong>$3.55 Trillion USD</strong>, cementing India as the world's 5th largest economy.
                    </p>
                  </div>

                  {/* The Deflator Wedge Monument */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-[#E6E5DF] border border-[rgba(20,21,23,0.18)] flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
                    <div className="space-y-1">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#D94E34] block">
                        THE DEFLATOR PUZZLE
                      </span>
                      <div className="font-mono text-3xl sm:text-4xl font-black text-[#141416]">
                        <AnimatableNumber value={deflator} suffix="% Deflator" decimals={2} />
                      </div>
                      <span className="text-xs font-sans text-[#57585C] block">
                        Nominal (9.6%) minus Real (8.2%) = 1.40% implicit price compression.
                      </span>
                    </div>

                    <div className="shrink-0 space-y-1.5 font-mono text-xs border-l sm:border-l border-[rgba(20,21,23,0.14)] sm:pl-6">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[#57585C]">Retail CPI:</span>
                        <span className="font-bold text-[#D94E34]">4.83%</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[#57585C]">Wholesale WPI:</span>
                        <span className="font-bold text-amber-700">1.26%</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 pt-1 border-t border-[rgba(20,21,23,0.1)]">
                        <span className="text-[#141416] font-bold">Wedge Spread:</span>
                        <span className="font-bold text-[#141416]">3.43% pts</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- SECTORAL CONTRIBUTION SPECTRUM & ENTRYPOINT TO WORKSPACE --- */}
              <div className="p-8 sm:p-10 rounded-3xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.16)] space-y-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(20,21,23,0.12)]">
                  <div>
                    <span className="font-mono text-xs uppercase font-bold text-[#141416] block">
                      SECTORAL GROSS VALUE ADDED (GVA) CONTRIBUTION SPECTRUM
                    </span>
                    <span className="font-sans text-xs text-[#57585C]">
                      Real sectoral output growth decomposed under constant basic prices ({baseYear}).
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-800">
                    OVERALL REAL GVA: +{gvaGrowth}%
                  </span>
                </div>

                {/* Proportional Spectrum Bars */}
                <div className="space-y-4 font-mono text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#141416]">Construction & Infrastructure</span>
                      <span className="font-bold text-emerald-800 text-sm">+10.7% YoY</span>
                    </div>
                    <div className="w-full bg-[#DFDED8] h-3.5 rounded-full overflow-hidden p-0.5">
                      <div className="bg-emerald-700 h-full rounded-full" style={{ width: "88%" }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#141416]">Manufacturing (Input Deflated)</span>
                      <span className="font-bold text-emerald-800 text-sm">+9.9% YoY</span>
                    </div>
                    <div className="w-full bg-[#DFDED8] h-3.5 rounded-full overflow-hidden p-0.5">
                      <div className="bg-emerald-700 h-full rounded-full" style={{ width: "82%" }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#141416]">Financial, Real Estate & Professional Services</span>
                      <span className="font-bold text-[#141416] text-sm">+8.4% YoY</span>
                    </div>
                    <div className="w-full bg-[#DFDED8] h-3.5 rounded-full overflow-hidden p-0.5">
                      <div className="bg-[#141416] h-full rounded-full" style={{ width: "70%" }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#57585C]">Agriculture, Forestry & Fishing</span>
                      <span className="font-bold text-amber-700 text-sm">+1.4% YoY</span>
                    </div>
                    <div className="w-full bg-[#DFDED8] h-3.5 rounded-full overflow-hidden p-0.5">
                      <div className="bg-amber-600 h-full rounded-full" style={{ width: "14%" }} />
                    </div>
                  </div>
                </div>

                {/* Gateway Callout to the Consolidated Macro Accounts Workspace */}
                <div className="mt-6 pt-6 border-t border-[rgba(20,21,23,0.12)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs font-sans text-[#57585C]">
                    <Layers className="h-4 w-4 text-[#D94E34]" />
                    <span>Access sector-by-sector GVA shares, state rankings (28 States & 3 UTs), and historical revisions in the dedicated workspace.</span>
                  </div>
                  <Link
                    href="/gdp"
                    className="inline-flex items-center gap-2 rounded-full bg-[#141416] px-5 py-2.5 font-mono text-xs font-semibold text-[#ECEBE5] hover:bg-[#D94E34] transition-colors shrink-0 shadow-xs"
                  >
                    <span>Launch Macro Accounts Workspace</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* --- CHAPTER 02.2: THE VERIFIED ECONOMIC DATA JOURNEY --- */}
              <div className="pt-2">
                <DotField
                  className="w-full shadow-xs"
                  spacing={22}
                  interactive={true}
                  seed={42}
                  showJourney={true}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 3: LOOK BENEATH THE HEADLINE (DRAMATIC DARK OBSIDIAN CHAPTER)
          ========================================================================= */}
      <LookBeneathHeadline />

      {/* =========================================================================
          CHAPTER 4: FOLLOW THE EVIDENCE (HORIZONTAL ARCHITECTURAL AUDIT LEDGER)
          ========================================================================= */}
      <EvidenceProvenanceTrail />

      {/* =========================================================================
          CHAPTER 5: FROM ANALYSIS TO UNDERSTANDING (ASYMMETRICAL RESEARCH WORKBENCH)
          ========================================================================= */}
      <AnalyticalCapabilitiesSection />

      {/* =========================================================================
          CHAPTER 6: CONTINUING RESEARCH (AUTHORITATIVE DIRECTORY & GUARANTEE)
          ========================================================================= */}
      <ContinueInvestigationSection />
    </div>
  );
}
