"use client";

import { useState } from "react";
import Link from "next/link";
import { useDashboard } from "@/hooks/useApi";
import { MetricCardDisplay } from "@/components/ui/MetricCard";
import { ErrorState, LoadingGrid, EmptyState } from "@/components/ui/StateComponents";
import { HeroConstellation } from "@/components/antimetal/HeroConstellation";
import { SovereignParticleGlobe } from "@/components/antimetal/SovereignParticleGlobe";
import { EditorialVideoSection } from "@/components/antimetal/EditorialVideoSection";
import { DynamicText } from "@/components/kokonutui/dynamic-text";
import { RubberSegment } from "@/components/ui/RubberSegment";
import {
  TrendingUp,
  SlidersHorizontal,
  Compass,
  Award,
  CheckCircle2,
  Globe2,
  Bot,
  Database,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Network,
  Layers,
  Scale,
  Users,
  Building2,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import type { MetricCard } from "@/lib/api";

export default function HomePage() {
  const [baseYear, setBaseYear] = useState<"2022-23" | "2011-12">("2022-23");
  const [heroVisualMode, setHeroVisualMode] = useState<"globe" | "constellation">("globe");
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
    <div className="relative min-h-screen bg-[#E6E5DF] text-[#141416] overflow-x-hidden">
      {/* 1. HERO SECTION: INTRODUCING ARTHALENS */}
      <section className="relative pt-4 sm:pt-8 pb-6 sm:pb-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 lg:grid-cols-12 items-center">
            {/* Left Column: Headline & Purpose (5 cols) */}
            <div className="lg:col-span-5 space-y-6 z-10">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(20,21,23,0.15)] bg-[#ECEBE5] px-3.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-[#141416]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D94E34] animate-ping" />
                  <span>SOVEREIGN MACRO INTELLIGENCE •</span>
                  <DynamicText
                    words={[
                      { text: "OFFICIAL MOSPI & RBI DATA" },
                      { text: "28 STATES & 3 UTS GVA" },
                      { text: "UN SNA 2008 DOUBLE DEFLATION" },
                      { text: "TSL 26,000 WEBGPU PARTICLES" },
                    ]}
                    interval={2400}
                    loop={true}
                    className="!min-h-0"
                    containerClassName="!h-4 !min-w-[170px]"
                    textClassName="!text-[11px] !font-mono !font-bold !text-[#141416]"
                    dotClassName="hidden"
                  />
                </div>

                <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight text-[#141416]">
                  Economic intelligence that runs itself.
                </h1>

                <p className="font-sans text-sm sm:text-base text-[#57585C] leading-relaxed max-w-lg">
                  ArthaLens is India's sovereign macroeconomic intelligence platform.
                  We synthesize official national accounts, model double-deflation under UN SNA 2008 standards, and reconcile state economic accounts in real time.
                </p>

                <div className="flex items-center gap-2 pt-1 font-mono text-xs text-[#57585C]">
                  <span className="font-semibold text-[#141416]">Active Telemetry:</span>
                  <DynamicText
                    words={[
                      { text: "Real vs Nominal GDP & Sectoral Decomposition" },
                      { text: "Double-Deflation Discrepancy Reconciliation" },
                      { text: "Cross-State GST & Fiscal Deficit Surveillance" },
                      { text: "MoSPI 2022-23 vs 2011-12 Base Year Harmonization" },
                    ]}
                    interval={2600}
                    loop={true}
                    className="!min-h-0"
                    containerClassName="!h-5 !min-w-[270px] sm:!min-w-[320px]"
                    textClassName="!text-xs !font-mono !font-medium !text-[#141416]"
                    dotClassName="!h-1.5 !w-1.5 bg-[#D94E34]"
                  />
                </div>
              </div>

              {/* Direct Action CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/gdp"
                  className="btn-realistic btn-solid-black px-5 py-2 text-xs font-semibold tracking-wide"
                >
                  Explore GDP Accounts ➔
                </Link>
                <Link
                  href="/how-it-works"
                  className="btn-realistic btn-outline-pill px-5 py-2 text-xs font-semibold tracking-wide flex items-center gap-1.5"
                >
                  <Compass className="h-3.5 w-3.5 text-[#D94E34]" />
                  <span>How It Works</span>
                </Link>
              </div>

              {/* Verified Source Micro Ticker */}
              <div className="pt-4 border-t border-[rgba(20,21,23,0.1)] flex items-center gap-3 text-[11px] font-mono text-[#828387]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                <span>PRIMARY SOURCES: MOSPI NAS 2024 • RBI DBIE • UN SNA 2008</span>
              </div>
            </div>

            {/* Right Column: 3D Living Observatory / Living Particle Stage (7 cols) */}
            <div id="observatory" className="lg:col-span-7 relative space-y-2">
              <div className="flex items-center justify-between">
                <RubberSegment
                  items={["3D Particle Globe", "Macro Constellation"]}
                  defaultValue="3D Particle Globe"
                  value={heroVisualMode === "globe" ? "3D Particle Globe" : "Macro Constellation"}
                  onChange={(val) => setHeroVisualMode(val === "3D Particle Globe" ? "globe" : "constellation")}
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
                  <span>HOLD CANVAS TO COALESCE 26,000 PARTICLES</span>
                </div>
              </div>

              {heroVisualMode === "globe" ? (
                <SovereignParticleGlobe
                  stageHeight="h-[440px] sm:h-[500px] lg:h-[540px]"
                  showEditorialCard={false}
                />
              ) : (
                <HeroConstellation />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT THE WEBSITE & WHAT IT ACCOMPLISHES */}
      <section className="relative py-8 sm:py-12 border-t border-[rgba(20,21,23,0.12)]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 max-w-3xl">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#D94E34] flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D94E34]" />
              01 // ABOUT ARTHALENS
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-[#141416] mt-1.5 tracking-tight">
              What ArthaLens Accomplishes
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#57585C] mt-2 leading-relaxed">
              In a $3.75+ Trillion economy, macroeconomic decision-makers face acute statistical latency, single-deflation distortions during global commodity shocks, and fragmentation across 36 regional directorates. ArthaLens solves this with four core capabilities:
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Accomplishment 1 */}
            <div className="rounded-2xl border border-[rgba(20,21,23,0.15)] bg-[#ECEBE5] p-5 shadow-xs space-y-2.5">
              <div className="h-9 w-9 rounded-xl bg-black/5 flex items-center justify-center text-[#141416]">
                <TrendingUp className="h-4.5 w-4.5 text-[#D94E34]" />
              </div>
              <h3 className="font-heading text-sm sm:text-base font-bold text-[#141416]">
                Double-Deflation Accuracy
              </h3>
              <p className="font-sans text-xs text-[#57585C] leading-relaxed">
                Separates gross output price indices from intermediate input deflators according to UN SNA 2008 Chapter 15, removing artificial growth distortions during import cost swings.
              </p>
            </div>

            {/* Accomplishment 2 */}
            <div className="rounded-2xl border border-[rgba(20,21,23,0.15)] bg-[#ECEBE5] p-5 shadow-xs space-y-2.5">
              <div className="h-9 w-9 rounded-xl bg-black/5 flex items-center justify-center text-[#141416]">
                <Layers className="h-4.5 w-4.5 text-[#141416]" />
              </div>
              <h3 className="font-heading text-sm sm:text-base font-bold text-[#141416]">
                28 States & 3 UTs GVA
              </h3>
              <p className="font-sans text-xs text-[#57585C] leading-relaxed">
                Synthesizes sub-national Gross State Domestic Product (GSDP) across 31 state economies against Central accounts, monitoring inter-state deflator spreads and tax buoyancy.
              </p>
            </div>

            {/* Accomplishment 3 */}
            <div className="rounded-2xl border border-[rgba(20,21,23,0.15)] bg-[#ECEBE5] p-5 shadow-xs space-y-2.5">
              <div className="h-9 w-9 rounded-xl bg-black/5 flex items-center justify-center text-[#141416]">
                <Scale className="h-4.5 w-4.5 text-[#141416]" />
              </div>
              <h3 className="font-heading text-sm sm:text-base font-bold text-[#141416]">
                Base Year Harmonization
              </h3>
              <p className="font-sans text-xs text-[#57585C] leading-relaxed">
                Isolates the active 2022-23 benchmark from the legacy 2011-12 series to prevent misleading splicing, while providing mathematical link factors and backcast tables.
              </p>
            </div>

            {/* Accomplishment 4 */}
            <div className="rounded-2xl border border-[rgba(20,21,23,0.15)] bg-[#ECEBE5] p-5 shadow-xs space-y-2.5">
              <div className="h-9 w-9 rounded-xl bg-black/5 flex items-center justify-center text-[#141416]">
                <ShieldCheck className="h-4.5 w-4.5 text-[#059669]" />
              </div>
              <h3 className="font-heading text-sm sm:text-base font-bold text-[#141416]">
                Zero Synthetic Data
              </h3>
              <p className="font-sans text-xs text-[#57585C] leading-relaxed">
                Guaranteed provenance. Every metric links to official MoSPI gazettes, RBI DBIE series, and CAG financial accounts with immutable cryptographic SHA-256 validation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT IS HELPFUL (WHO USES IT & WHY) */}
      <section className="relative py-8 sm:py-12 border-t border-[rgba(20,21,23,0.12)] bg-[#E3E2DC]/40">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 max-w-3xl">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#828387] flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#141416]" />
              02 // BENEFIT & IMPACT
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-[#141416] mt-1.5 tracking-tight">
              How ArthaLens Is Helpful
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#57585C] mt-2 leading-relaxed">
              Designed specifically for institutional researchers, policymakers, economists, and state analysts who need bulletproof macroeconomic data without manual spreadsheet friction:
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Persona 1: Policy Economists */}
            <div className="rounded-2xl border border-[rgba(20,21,23,0.15)] bg-[#ECEBE5] p-5 shadow-xs space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-mono text-[#D94E34] font-bold">
                <Building2 className="h-4 w-4" />
                <span>CENTRAL MINISTRIES & RBI</span>
              </div>
              <h3 className="font-heading text-sm sm:text-base font-bold text-[#141416]">
                Policy Economists & Advisors
              </h3>
              <p className="font-sans text-xs text-[#57585C] leading-relaxed">
                Test economic policy scenarios and understand true sector growth without being blindsided by single-deflation commodity distortion or tax timing lags.
              </p>
            </div>

            {/* Persona 2: State Finance Departments */}
            <div className="rounded-2xl border border-[rgba(20,21,23,0.15)] bg-[#ECEBE5] p-5 shadow-xs space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-mono text-[#141416] font-bold">
                <Users className="h-4 w-4" />
                <span>STATE GOVERNMENTS</span>
              </div>
              <h3 className="font-heading text-sm sm:text-base font-bold text-[#141416]">
                State Finance Departments
              </h3>
              <p className="font-sans text-xs text-[#57585C] leading-relaxed">
                Benchmark state GSDP against peer states, monitor GST buoyancy discrepancies, and align Directorate of Economics & Statistics (DES) accounts with Central totals.
              </p>
            </div>

            {/* Persona 3: Sovereign Analysts */}
            <div className="rounded-2xl border border-[rgba(20,21,23,0.15)] bg-[#ECEBE5] p-5 shadow-xs space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-mono text-[#141416] font-bold">
                <Briefcase className="h-4 w-4" />
                <span>RATING AGENCIES & FUNDS</span>
              </div>
              <h3 className="font-heading text-sm sm:text-base font-bold text-[#141416]">
                Sovereign Credit Analysts
              </h3>
              <p className="font-sans text-xs text-[#57585C] leading-relaxed">
                Track fiscal deficit ratios, general government debt-to-GDP trajectories, and multi-source consistency audits (MoSPI vs RBI vs World Bank) in one unified interface.
              </p>
            </div>

            {/* Persona 4: Researchers & Academia */}
            <div className="rounded-2xl border border-[rgba(20,21,23,0.15)] bg-[#ECEBE5] p-5 shadow-xs space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-mono text-[#059669] font-bold">
                <GraduationCap className="h-4 w-4" />
                <span>RESEARCH INSTITUTIONS</span>
              </div>
              <h3 className="font-heading text-sm sm:text-base font-bold text-[#141416]">
                Econometric Researchers
              </h3>
              <p className="font-sans text-xs text-[#57585C] leading-relaxed">
                Access machine-readable REST APIs, download reproducible mathematical formulas, and interact with the MoSPI-grounded AI copilot for immediate econometric queries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE WEBSITE FLOW: STEP-BY-STEP USER JOURNEY */}
      <section className="relative py-8 sm:py-12 border-t border-[rgba(20,21,23,0.12)]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 max-w-3xl">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#D94E34] flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D94E34]" />
              03 // PLATFORM ARCHITECTURE & FLOW
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-[#141416] mt-1.5 tracking-tight">
              The ArthaLens Platform Flow
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#57585C] mt-2 leading-relaxed">
              How a researcher or policy analyst moves through ArthaLens to discover, simulate, verify, and query India's macroeconomic accounts:
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {/* Step 1 */}
            <Link
              href="/gdp"
              className="group block rounded-2xl border border-[rgba(20,21,23,0.15)] bg-[#ECEBE5] p-5 shadow-xs hover:border-[rgba(20,21,23,0.35)] hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between text-xs font-mono mb-2.5">
                <span className="rounded-full bg-[#141416] text-[#ECEBE5] px-2.5 py-0.5 font-bold">
                  STAGE 01
                </span>
                <span className="text-[#828387]">/gdp</span>
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <TrendingUp className="h-4 w-4 text-[#D94E34]" />
                <h3 className="font-heading text-sm sm:text-base font-bold text-[#141416] group-hover:text-[#D94E34] transition-colors">
                  Explore National Accounts
                </h3>
              </div>
              <p className="font-sans text-xs text-[#57585C] leading-relaxed">
                Drill down into Real vs Nominal GDP time series, 8 primary sectoral GVA shares, quarterly growth rates, and 28 state domestic product tables.
              </p>
              <div className="mt-3.5 flex items-center gap-1 text-xs font-mono font-semibold text-[#141416]">
                <span>Launch GDP Explorer</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Step 2 */}
            <Link
              href="/deflator"
              className="group block rounded-2xl border border-[rgba(20,21,23,0.15)] bg-[#ECEBE5] p-5 shadow-xs hover:border-[rgba(20,21,23,0.35)] hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between text-xs font-mono mb-2.5">
                <span className="rounded-full bg-[#141416] text-[#ECEBE5] px-2.5 py-0.5 font-bold">
                  STAGE 02
                </span>
                <span className="text-[#828387]">/deflator</span>
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <SlidersHorizontal className="h-4 w-4 text-[#D94E34]" />
                <h3 className="font-heading text-sm sm:text-base font-bold text-[#141416] group-hover:text-[#D94E34] transition-colors">
                  Simulate Deflator & Inflation
                </h3>
              </div>
              <p className="font-sans text-xs text-[#57585C] leading-relaxed">
                Test how shifts in Consumer Price Index (CPI), Wholesale Price Index (WPI), and imported commodity costs distort implicit GDP deflators.
              </p>
              <div className="mt-3.5 flex items-center gap-1 text-xs font-mono font-semibold text-[#141416]">
                <span>Open Simulator</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Step 3 */}
            <Link
              href="/gdp/why"
              className="group block rounded-2xl border border-[rgba(20,21,23,0.15)] bg-[#ECEBE5] p-5 shadow-xs hover:border-[rgba(20,21,23,0.35)] hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between text-xs font-mono mb-2.5">
                <span className="rounded-full bg-[#141416] text-[#ECEBE5] px-2.5 py-0.5 font-bold">
                  STAGE 03
                </span>
                <span className="text-[#828387]">/gdp/why</span>
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <Compass className="h-4 w-4 text-[#D94E34]" />
                <h3 className="font-heading text-sm sm:text-base font-bold text-[#141416] group-hover:text-[#D94E34] transition-colors">
                  Deconstruct Growth Drivers
                </h3>
              </div>
              <p className="font-sans text-xs text-[#57585C] leading-relaxed">
                Deconstruct Private Consumption (PFCE), Government Consumption (GFCE), Investment (GFCF), and uncover statistical discrepancies in official releases.
              </p>
              <div className="mt-3.5 flex items-center gap-1 text-xs font-mono font-semibold text-[#141416]">
                <span>Analyze Drivers</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Step 4 */}
            <Link
              href="/ratings"
              className="group block rounded-2xl border border-[rgba(20,21,23,0.15)] bg-[#ECEBE5] p-5 shadow-xs hover:border-[rgba(20,21,23,0.35)] hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between text-xs font-mono mb-2.5">
                <span className="rounded-full bg-[#141416] text-[#ECEBE5] px-2.5 py-0.5 font-bold">
                  STAGE 04
                </span>
                <span className="text-[#828387]">/ratings & /consistency</span>
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <Award className="h-4 w-4 text-[#D94E34]" />
                <h3 className="font-heading text-sm sm:text-base font-bold text-[#141416] group-hover:text-[#D94E34] transition-colors">
                  Audit Sovereign Credit & Consistency
                </h3>
              </div>
              <p className="font-sans text-xs text-[#57585C] leading-relaxed">
                Examine Fitch, Moody's, and S&P ratings against fiscal deficit data and audit multi-agency reconciliation across MoSPI, RBI, and CAG reports.
              </p>
              <div className="mt-3.5 flex items-center gap-1 text-xs font-mono font-semibold text-[#141416]">
                <span>Inspect Ratings</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Step 5 */}
            <Link
              href="/ai"
              className="group block rounded-2xl border border-[rgba(20,21,23,0.15)] bg-[#ECEBE5] p-5 shadow-xs hover:border-[rgba(20,21,23,0.35)] hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between text-xs font-mono mb-2.5">
                <span className="rounded-full bg-[#141416] text-[#ECEBE5] px-2.5 py-0.5 font-bold">
                  STAGE 05
                </span>
                <span className="text-[#828387]">/ai & /global</span>
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <Bot className="h-4 w-4 text-[#D94E34]" />
                <h3 className="font-heading text-sm sm:text-base font-bold text-[#141416] group-hover:text-[#D94E34] transition-colors">
                  Sovereign Copilot & World Bank
                </h3>
              </div>
              <p className="font-sans text-xs text-[#57585C] leading-relaxed">
                Query complex national accounts via natural language and benchmark India's indicators in real time against World Bank live datasets.
              </p>
              <div className="mt-3.5 flex items-center gap-1 text-xs font-mono font-semibold text-[#141416]">
                <span>Query Copilot</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Step 6 */}
            <Link
              href="/how-it-works"
              className="group block rounded-2xl border border-[rgba(20,21,23,0.15)] bg-[#ECEBE5] p-5 shadow-xs hover:border-[rgba(20,21,23,0.35)] hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between text-xs font-mono mb-2.5">
                <span className="rounded-full bg-[#141416] text-[#ECEBE5] px-2.5 py-0.5 font-bold">
                  STAGE 06
                </span>
                <span className="text-[#828387]">/how-it-works</span>
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <Database className="h-4 w-4 text-[#059669]" />
                <h3 className="font-heading text-sm sm:text-base font-bold text-[#141416] group-hover:text-[#D94E34] transition-colors">
                  Methodology & Validated Sources
                </h3>
              </div>
              <p className="font-sans text-xs text-[#57585C] leading-relaxed">
                Review mathematical proofs, UN SNA 2008 citations, MoSPI Sources & Methods, and cryptographic gazette verification hashes.
              </p>
              <div className="mt-3.5 flex items-center gap-1 text-xs font-mono font-semibold text-[#141416]">
                <span>View Methodology</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE PLAYABLE ENGINE DEMONSTRATION */}
      <EditorialVideoSection />

      {/* 6. LIVE NATIONAL STATISTICAL AGGREGATES & BENCHMARK EXPLORER */}
      <section className="relative py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-[rgba(20,21,23,0.12)]">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#828387]">
                04 // LIVE TELEMETRY
              </span>
              <h2 className="font-heading text-2xl sm:text-4xl font-bold text-[#141416] mt-1.5 tracking-tight">
                India National Accounts & Indicators
              </h2>
            </div>

            {/* Elastic RubberSegment Benchmark Selector */}
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

          {/* Indicators Grid */}
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

          {/* Sector Output Breakdown */}
          {data?.topSectors && data.topSectors.length > 0 && (
            <div className="mt-8 pt-6 border-t border-[rgba(20,21,23,0.12)]">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs uppercase font-bold text-[#57585C]">
                  SECTORAL GROSS VALUE ADDED (GVA) SHARE
                </span>
                <span className="font-mono text-[11px] text-[#828387]">
                  CONSTANT BASIC PRICES ({baseYear})
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {data.topSectors.map((card) => (
                  <MetricCardDisplay key={card.label} card={card} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
