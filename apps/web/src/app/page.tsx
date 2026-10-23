"use client";

import { useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { useDashboard } from "@/hooks/useApi";
import { ErrorState, LoadingGrid } from "@/components/ui/StateComponents";
import { HeroConstellation } from "@/components/antimetal/HeroConstellation";
import { SovereignParticleGlobe } from "@/components/antimetal/SovereignParticleGlobe";
import { LivingEconomyLandscape } from "@/components/living-economy";
import { DynamicText } from "@/components/kokonutui/dynamic-text";
import { RubberSegment } from "@/components/ui/RubberSegment";
import { AnimatableNumber } from "@/components/ui/AnimatableNumber";
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
  Award,
  CheckCircle2,
  Radio,
  ExternalLink,
  ChevronRight,
  Maximize2,
  Globe2,
} from "lucide-react";

export default function HomePage() {
  const [baseYear, setBaseYear] = useState<"2022-23" | "2011-12">("2022-23");
  const [heroVisualMode, setHeroVisualMode] = useState<"constellation" | "globe">("constellation");
  const { data, isLoading, isError, error, refetch } = useDashboard(baseYear);

  const realGdp = data?.realGdpGrowth?.value ?? 8.2;
  const nominalGdp = data?.nominalGdpGrowth?.value ?? 9.6;
  const gvaGrowth = data?.gvaGrowth?.value ?? 7.2;
  const deflator = data?.gdpDeflator?.value ?? 1.4;
  const gdpAbsoluteVal = data?.gdpAbsolute?.value
    ? `₹${(data.gdpAbsolute.value / 100000).toFixed(1)}L Cr`
    : "₹295.4L Cr";
  const nominalGrowthLabel = data?.nominalGdpGrowth?.value != null
    ? `+${data.nominalGdpGrowth.value.toFixed(1)}% YoY`
    : "+9.6% YoY";


  return (
    <div className="relative min-h-screen bg-[#E6E5DF] text-[#141416] overflow-x-hidden selection:bg-[#141416] selection:text-[#E6E5DF]">
      {/* =========================================================================
          CHAPTER 1: THE SIGNAL & INTERACTIVE OBSERVATORY STAGE (EXPERIENCES A, B, C)
          ========================================================================= */}
      <section className="relative pt-6 sm:pt-14 pb-12 sm:pb-20 border-b border-[rgba(20,21,23,0.14)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:gap-12 lg:grid-cols-12 items-center">
            {/* Left Column: Monumental Editorial Statement & Action Group (6 cols) */}
            <div className="lg:col-span-6 space-y-5 sm:space-y-6 z-10">
              <div className="space-y-3 sm:space-y-4">
                {/* Official Sovereign Telemetry Badge */}
                <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-[rgba(20,21,23,0.18)] bg-[#ECEBE5] px-3 sm:px-4 py-1.5 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#141416] shadow-xs">
                  <span className="h-2 w-2 rounded-full bg-[#059669] animate-pulse shrink-0" />
                  <span className="shrink-0">SOVEREIGN OBSERVATORY •</span>
                  <DynamicText
                    words={[
                      { text: "OFFICIAL MOSPI NAS & RBI DATA" },
                      { text: "UN SNA 2008 DOUBLE-DEFLATION STANDARD" },
                      { text: "28 STATES & 3 UTS SUBNATIONAL GVA" },
                      { text: "CRYPTOGRAPHIC SHA-256 PROVENANCE" },
                    ]}
                    interval={2600}
                    loop={true}
                    className="!min-h-0"
                    containerClassName="!h-4 min-w-0 max-w-full flex-1"
                    textClassName="!text-[10px] sm:!text-[11px] !font-mono !font-bold !text-[#141416] truncate"
                    dotClassName="hidden"
                  />
                </div>

                {/* Oversized Editorial Headline */}
                <h1 className="font-heading text-4xl sm:text-6xl lg:text-[4.75rem] font-black leading-[1.02] sm:leading-[0.98] tracking-tight text-[#141416]">
                  See the economy beneath the numbers.
                </h1>

                {/* Authoritative Editorial Thesis */}
                <p className="font-sans text-sm sm:text-lg text-[#57585C] leading-relaxed max-w-xl pt-1">
                  ArthaLens is India's sovereign macroeconomic intelligence platform. We synthesize official National Accounts, model double deflation under UN SNA 2008 standards, and audit state economic accounts with cryptographic provenance.
                </p>

                {/* High-Frequency Active Telemetry Micro-Feed */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 pt-2 font-mono text-xs text-[#57585C] max-w-full overflow-hidden">
                  <span className="font-semibold text-[#141416] shrink-0">Active Telemetry:</span>
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
                    containerClassName="!h-5 min-w-0 max-w-full flex-1"
                    textClassName="!text-xs !font-mono !font-medium !text-[#141416] truncate"
                    dotClassName="!h-1.5 !w-1.5 bg-[#D94E34]"
                  />
                </div>
              </div>

              {/* Direct Action Calls */}
              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
                <Link
                  href="/gdp"
                  onClick={() => trackEvent("cta_click", { label: "hero_macro_workspace", destination: "/gdp" })}
                  aria-label="Explore Macro Accounts Workspace"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#141416] px-5 sm:px-6 py-2.5 sm:py-3 font-mono text-xs font-semibold tracking-wide text-[#ECEBE5] shadow-xs hover:bg-[#D94E34] transition-colors cursor-pointer text-center focus-visible:ring-2 focus-visible:ring-[#D94E34] focus:outline-hidden"
                >
                  <BarChart3 className="h-3.5 w-3.5 shrink-0" />
                  <span>Macro Accounts Workspace</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                </Link>

                <Link
                  href="/observatory"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(20,21,23,0.2)] bg-[#ECEBE5] px-4 sm:px-5 py-2.5 sm:py-3 font-mono text-xs font-semibold tracking-wide text-[#141416] hover:bg-[#DFDED8] transition-colors cursor-pointer text-center focus-visible:ring-2 focus-visible:ring-[#141416] focus:outline-hidden"
                >
                  <Globe2 className="h-3.5 w-3.5 text-[#2563EB] shrink-0" />
                  <span>3D Observatory Suite</span>
                </Link>

                <Link
                  href="#living-economy"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 sm:py-3 font-mono text-xs font-semibold text-[#57585C] hover:text-[#141416] transition-colors text-center focus-visible:ring-2 focus-visible:ring-[#141416] focus:outline-hidden"
                >
                  <Layers className="h-3.5 w-3.5 text-[#059669] shrink-0" />
                  <span>Living Economy &darr;</span>
                </Link>
              </div>

              {/* Primary Source Guarantee */}
              <div className="pt-3 sm:pt-4 border-t border-[rgba(20,21,23,0.12)] flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-mono text-[#828387]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#059669] shrink-0" />
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
                  preset="hero-observatory-modes"
                />

                <Link
                  href="/observatory"
                  className="inline-flex items-center gap-1 font-mono text-[10px] text-[#57585C] hover:text-[#141416] transition-colors"
                >
                  <span>Full Suite</span>
                  <Maximize2 className="h-3 w-3" />
                </Link>
              </div>

              {/* Visual Window */}
              <div className="relative rounded-3xl overflow-hidden border border-[rgba(20,21,23,0.15)] bg-[#ECEBE5] shadow-xs">
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

          {/* Verified Headline Indicators Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-6">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.15)] shadow-xs space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#57585C]">
                <span className="font-bold uppercase text-emerald-800 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  REAL GDP GROWTH
                </span>
                <span>FY24</span>
              </div>
              <div className="font-mono text-3xl sm:text-4xl font-black text-[#141416]">
                <AnimatableNumber value={realGdp} suffix="%" decimals={1} prefix="+" />
              </div>
              <div className="text-[11px] font-sans text-[#828387]">
                Constant Basic Prices ({baseYear})
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.15)] shadow-xs space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#57585C]">
                <span className="font-bold uppercase text-[#141416]">NOMINAL OUTPUT</span>
                <span className="text-emerald-800 font-bold">{nominalGrowthLabel}</span>
              </div>
              <div className="font-mono text-3xl sm:text-4xl font-black text-[#141416]">
                {gdpAbsoluteVal}
              </div>
              <div className="text-[11px] font-sans text-[#828387]">
                Approx. $3.55T USD Market Prices
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.15)] shadow-xs space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#57585C]">
                <span className="font-bold uppercase text-[#141416]">GROSS VALUE ADDED</span>
                <span>8 Sectors</span>
              </div>
              <div className="font-mono text-3xl sm:text-4xl font-black text-[#141416]">
                <AnimatableNumber value={gvaGrowth} suffix="%" decimals={1} prefix="+" />
              </div>
              <div className="text-[11px] font-sans text-[#828387]">
                Led by Mfg (+9.9%) & Constr (+10.7%)
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.15)] shadow-xs space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#57585C]">
                <span className="font-bold uppercase text-[#D94E34]">IMPLICIT DEFLATOR</span>
                <span>Wedge</span>
              </div>
              <div className="font-mono text-3xl sm:text-4xl font-black text-[#141416]">
                <AnimatableNumber value={deflator} suffix="%" decimals={2} />
              </div>
              <div className="text-[11px] font-sans text-[#828387]">
                Retail CPI (4.83%) vs WPI (1.26%) Spread
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 2: THE LIVING ECONOMY SIGNATURE ISOMETRIC EXPERIENCE (EXPERIENCE D)
          ========================================================================= */}
      <section id="living-economy" className="relative py-12 sm:py-20 border-b border-[rgba(20,21,23,0.14)] bg-[#DFDED8]/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[rgba(20,21,23,0.12)]">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-[#059669]">
                <span className="h-2 w-2 rounded-full bg-[#059669]" />
                <span>EXPERIENCE D // THE LIVING ECONOMY</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-[#141416] tracking-tight">
                India's Interconnected Economic Sectors
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#57585C] leading-relaxed">
                An interactive isometric landscape organizing India's economy across five interconnected sectors: <strong>Production</strong>, <strong>Consumption</strong>, <strong>Capital</strong>, <strong>Government</strong>, and the <strong>External Economy</strong>. Click any platform to inspect underlying official observations, trends, and transmission channels.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-[#828387] shrink-0">
              <ShieldCheck className="h-4 w-4 text-emerald-700" />
              <span>Full Keyboard & Touch Accessible</span>
            </div>
          </div>

          {/* Interactive Isometric Landscape Component */}
          <LivingEconomyLandscape />
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 3: DEDICATED ANALYTICAL WORKSPACES (CLEAR, CONSOLIDATED GATEWAYS)
          ========================================================================= */}
      <section className="relative py-12 sm:py-20 border-b border-[rgba(20,21,23,0.14)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[rgba(20,21,23,0.12)]">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-[#141416]">
                <span className="h-2 w-2 rounded-full bg-[#141416]" />
                <span>ANALYTICS SUITE // SPECIALIZED RESEARCH WORKSPACES</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#141416] tracking-tight">
                Deep Analytical Capabilities
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#57585C] leading-relaxed">
                Direct access to specialized econometric workspaces, time series databases, and forensic audit ledgers without duplication.
              </p>
            </div>

            <Link
              href="/gdp"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#141416] hover:text-[#D94E34] transition-colors"
            >
              <span>View All 6 Workspaces</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* 6 Grid Gateways */}
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/gdp"
              className="group p-6 rounded-3xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.15)] hover:border-[#141416] transition-all shadow-xs flex flex-col justify-between space-y-4 cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-[#DFDED8] text-[#141416] group-hover:bg-[#141416] group-hover:text-[#ECEBE5] transition-colors">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-[10px] font-bold uppercase text-[#059669] bg-emerald-100/60 px-2 py-0.5 rounded-full">
                    Flagship
                  </span>
                </div>
                <h3 className="font-heading text-xl font-bold text-[#141416]">
                  Macro Accounts Workspace
                </h3>
                <p className="font-sans text-xs text-[#57585C] leading-relaxed">
                  Decompose 8 national industry accounts, track historical series back to 2011-12, and compare 28 states & 3 UTs economic output.
                </p>
              </div>
              <div className="pt-3 border-t border-[rgba(20,21,23,0.1)] flex items-center justify-between font-mono text-xs text-[#141416] font-bold group-hover:text-[#D94E34]">
                <span>Launch Workspace</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/deflator"
              className="group p-6 rounded-3xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.15)] hover:border-[#141416] transition-all shadow-xs flex flex-col justify-between space-y-4 cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-[#DFDED8] text-[#141416] group-hover:bg-[#141416] group-hover:text-[#ECEBE5] transition-colors">
                    <SlidersHorizontal className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-[10px] font-bold uppercase text-[#D94E34] bg-red-100/60 px-2 py-0.5 rounded-full">
                    Simulator
                  </span>
                </div>
                <h3 className="font-heading text-xl font-bold text-[#141416]">
                  Deflator & Inflation Simulator
                </h3>
                <p className="font-sans text-xs text-[#57585C] leading-relaxed">
                  Simulate single vs double deflation discrepancies under wholesale commodity price shocks and retail CPI variations.
                </p>
              </div>
              <div className="pt-3 border-t border-[rgba(20,21,23,0.1)] flex items-center justify-between font-mono text-xs text-[#141416] font-bold group-hover:text-[#D94E34]">
                <span>Simulate Shocks</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/revisions"
              className="group p-6 rounded-3xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.15)] hover:border-[#141416] transition-all shadow-xs flex flex-col justify-between space-y-4 cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-[#DFDED8] text-[#141416] group-hover:bg-[#141416] group-hover:text-[#ECEBE5] transition-colors">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-[10px] font-bold uppercase text-[#57585C] bg-[#DFDED8] px-2 py-0.5 rounded-full">
                    MoSPI Lifecycle
                  </span>
                </div>
                <h3 className="font-heading text-xl font-bold text-[#141416]">
                  MoSPI Release Revisions
                </h3>
                <p className="font-sans text-xs text-[#57585C] leading-relaxed">
                  Track sequential revisions from First Advance Estimates (1st AE) through Second Advance and Provisional Estimates.
                </p>
              </div>
              <div className="pt-3 border-t border-[rgba(20,21,23,0.1)] flex items-center justify-between font-mono text-xs text-[#141416] font-bold group-hover:text-[#D94E34]">
                <span>Track Revisions</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/ratings"
              className="group p-6 rounded-3xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.15)] hover:border-[#141416] transition-all shadow-xs flex flex-col justify-between space-y-4 cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-[#DFDED8] text-[#141416] group-hover:bg-[#141416] group-hover:text-[#ECEBE5] transition-colors">
                    <Award className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-[10px] font-bold uppercase text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded-full">
                    Credit Stance
                  </span>
                </div>
                <h3 className="font-heading text-xl font-bold text-[#141416]">
                  Sovereign Credit Ratings
                </h3>
                <p className="font-sans text-xs text-[#57585C] leading-relaxed">
                  S&P, Moody's, and Fitch historical rating trajectories alongside general government debt ratios and primary fiscal balances.
                </p>
              </div>
              <div className="pt-3 border-t border-[rgba(20,21,23,0.1)] flex items-center justify-between font-mono text-xs text-[#141416] font-bold group-hover:text-[#D94E34]">
                <span>View Ratings History</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/consistency"
              className="group p-6 rounded-3xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.15)] hover:border-[#141416] transition-all shadow-xs flex flex-col justify-between space-y-4 cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-[#DFDED8] text-[#141416] group-hover:bg-[#141416] group-hover:text-[#ECEBE5] transition-colors">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-[10px] font-bold uppercase text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                    Forensic Audit
                  </span>
                </div>
                <h3 className="font-heading text-xl font-bold text-[#141416]">
                  Cross-Dataset Consistency Index
                </h3>
                <p className="font-sans text-xs text-[#57585C] leading-relaxed">
                  Multi-agency cross-reconciliation auditing discrepancies across MoSPI National Accounts, RBI DBIE, and CAG fiscal budgets.
                </p>
              </div>
              <div className="pt-3 border-t border-[rgba(20,21,23,0.1)] flex items-center justify-between font-mono text-xs text-[#141416] font-bold group-hover:text-[#D94E34]">
                <span>Inspect Consistency</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/intelligence"
              className="group p-6 rounded-3xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.15)] hover:border-[#141416] transition-all shadow-xs flex flex-col justify-between space-y-4 cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-[#DFDED8] text-[#141416] group-hover:bg-[#141416] group-hover:text-[#ECEBE5] transition-colors">
                    <Radio className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-[10px] font-bold uppercase text-purple-700 bg-purple-100/60 px-2 py-0.5 rounded-full">
                    Live Telemetry
                  </span>
                </div>
                <h3 className="font-heading text-xl font-bold text-[#141416]">
                  Global Market Intelligence
                </h3>
                <p className="font-sans text-xs text-[#57585C] leading-relaxed">
                  Worldwide equity indices, macroeconomic briefings, and automated notifications covering 15 key global jurisdictions.
                </p>
              </div>
              <div className="pt-3 border-t border-[rgba(20,21,23,0.1)] flex items-center justify-between font-mono text-xs text-[#141416] font-bold group-hover:text-[#D94E34]">
                <span>Monitor Global Feeds</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 4: EVIDENCE, AUDIT & AI RESEARCH ASSISTANT
          ========================================================================= */}
      <EvidenceProvenanceTrail />
      <AnalyticalCapabilitiesSection />
      <ContinueInvestigationSection />
    </div>
  );
}
