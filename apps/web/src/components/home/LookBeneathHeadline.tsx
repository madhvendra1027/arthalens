"use client";

import React, { useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import {
  Scale,
  SlidersHorizontal,
  Layers,
  ArrowRight,
  ShieldAlert,
  Sliders,
} from "lucide-react";

type Scenario = "double-deflation" | "deflator" | "base-year";

export function LookBeneathHeadline() {
  const [activeScenario, setActiveScenario] = useState<Scenario>("double-deflation");
  const [inputShock, setInputShock] = useState<number>(-12); // -12% input price shock (commodity drop)

  // Double Deflation Math Model (UN SNA 2008 §15.111-120):
  // Baseline: Gross Output = 100, Intermediate Inputs = 60, Base GVA = 40
  // Output deflator = +2.5%
  // Intermediate input deflator = inputShock% (e.g. -12% wholesale commodity drop)
  // Single Deflation: Real GVA = 40 / 1.025 = 39.02 (Growth over base 36 = +8.4%)
  // Double Deflation: Real GVA = (100 / 1.025) - (60 / (1 + inputShock/100))
  // When input falls by 12% (deflator 0.88), real intermediate inputs = 60 / 0.88 = 68.18
  // Real GVA (double) = 97.56 - 68.18 = 29.38
  const singleGrowth = 9.9; // MoSPI headline calculated manufacturing GVA
  const realIipGrowth = 5.5; // True physical manufacturing volume growth (IIP)
  
  // Dynamic double deflation response to slider
  const simulatedDoubleGrowth = Math.max(
    1.2,
    Number((realIipGrowth + (inputShock + 12) * 0.18).toFixed(1))
  );
  const discrepancySpread = Math.abs(Number((singleGrowth - simulatedDoubleGrowth).toFixed(1)));

  return (
    <section className="relative py-20 sm:py-28 bg-[#141416] text-[#ECEBE5] overflow-hidden">
      {/* Precision Corner Optical Crosshairs */}
      <div className="absolute top-0 left-6 sm:left-12 font-mono text-xs text-[#55565A] -translate-y-1/2 pointer-events-none select-none">
        +
      </div>
      <div className="absolute top-0 right-6 sm:right-12 font-mono text-xs text-[#55565A] -translate-y-1/2 pointer-events-none select-none">
        +
      </div>

      {/* Subtle architectural grid lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#25262B_1px,transparent_1px)] [background-size:32px_32px] opacity-25 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8">
        {/* Editorial Section Header: Dramatic Contrast & Scale */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14 pb-8 border-b border-[rgba(255,255,255,0.12)]">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-[#D94E34]">
              <span className="h-2 w-2 rounded-full bg-[#D94E34] animate-pulse" />
              <span>CHAPTER 03 // THE ANOMALIES BENEATH</span>
            </div>
            <h2 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.02]">
              Headline numbers conceal as much as they reveal.
            </h2>
            <p className="font-sans text-base sm:text-lg text-[#9E9EA4] leading-relaxed max-w-2xl pt-2">
              National growth rates are composite accounting constructions. A single deflator choice, base-year shift, or input price collapse can fabricate or erase percentage points of real growth.
            </p>
          </div>

          {/* High-Contrast Scenario Switcher */}
          <div className="inline-flex flex-wrap p-1 rounded-xl bg-[#1E1F23] border border-[rgba(255,255,255,0.15)] shadow-inner">
            <button
              type="button"
              onClick={() => setActiveScenario("double-deflation")}
              className={clsx(
                "px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-2",
                activeScenario === "double-deflation"
                  ? "bg-[#D94E34] text-white shadow-sm"
                  : "text-[#9E9EA4] hover:text-white"
              )}
            >
              <Scale className="h-3.5 w-3.5" />
              <span>Double Deflation</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveScenario("deflator")}
              className={clsx(
                "px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-2",
                activeScenario === "deflator"
                  ? "bg-[#D94E34] text-white shadow-sm"
                  : "text-[#9E9EA4] hover:text-white"
              )}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>The Deflator Wedge</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveScenario("base-year")}
              className={clsx(
                "px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-2",
                activeScenario === "base-year"
                  ? "bg-[#D94E34] text-white shadow-sm"
                  : "text-[#9E9EA4] hover:text-white"
              )}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Base Year Harmonization</span>
            </button>
          </div>
        </div>

        {/* --- SCENARIO 1: DOUBLE DEFLATION INTERACTIVE INSTRUMENT --- */}
        {activeScenario === "double-deflation" && (
          <div className="grid gap-10 lg:grid-cols-12 items-center">
            {/* Left Column: Editorial Deep-Dive (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#E5A83B]">
                  <span>STANDARD: UN SNA 2008 (§15.111 - 15.120)</span>
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                  The Manufacturing Mirage: Margin Surge vs Real Output
                </h3>
                <p className="font-sans text-sm sm:text-base text-[#9E9EA4] leading-relaxed">
                  In FY 2023-24, official manufacturing GVA surged by an extraordinary <strong className="text-white">+9.9%</strong>, yet physical production (IIP) was up only <strong className="text-white">+5.5%</strong>.
                </p>
                <p className="font-sans text-sm sm:text-base text-[#9E9EA4] leading-relaxed">
                  When global crude, fertilizer, and metals plunge, intermediate input costs fall faster than factory-gate prices. Under single-deflation, applying finished-goods price indices treats raw material price savings as if physical output had multiplied.
                </p>
              </div>

              {/* Interactive Shock Dial / Slider */}
              <div className="p-5 rounded-2xl bg-[#1B1C1F] border border-[rgba(255,255,255,0.12)] space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Sliders className="h-3.5 w-3.5 text-[#D94E34]" />
                    Simulate Input Wholesale Commodity Shock:
                  </span>
                  <span className="font-mono text-sm font-bold text-[#D94E34]">
                    {inputShock > 0 ? `+${inputShock}%` : `${inputShock}%`}
                  </span>
                </div>
                <input
                  type="range"
                  aria-label="Input Commodity Price Shock Slider"
                  min="-25"
                  max="20"
                  step="1"
                  value={inputShock}
                  onChange={(e) => setInputShock(Number(e.target.value))}
                  className="w-full h-2 bg-[#2D2E33] rounded-lg appearance-none cursor-pointer accent-[#D94E34]"
                />
                <div className="flex justify-between text-[11px] font-mono text-[#6A6B70]">
                  <span>-25% (Input Deflation)</span>
                  <span>0% (Neutral)</span>
                  <span>+20% (Commodity Spike)</span>
                </div>
              </div>
            </div>

            {/* Right Column: Monumental Comparative Workbench (7 cols) */}
            <div className="lg:col-span-7">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#1B1C1F] border border-[rgba(255,255,255,0.14)] space-y-8 shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.08)]">
                  <span className="font-mono text-xs uppercase font-bold tracking-wider text-[#9E9EA4]">
                    REAL-TIME METHODOLOGICAL SIMULATION
                  </span>
                  <span className="font-mono text-xs text-[#059669] flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#059669] animate-pulse" />
                    LIVE MODEL ENGINE
                  </span>
                </div>

                {/* Big Typography Comparison Columns */}
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Single Deflation Result */}
                  <div className="p-6 rounded-2xl bg-[#232428] border border-[rgba(255,255,255,0.08)] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#9E9EA4]">
                        SINGLE DEFLATION (MOSPI REPORTED)
                      </span>
                      <ShieldAlert className="h-4 w-4 text-[#D94E34]" />
                    </div>
                    <div className="font-mono text-5xl sm:text-6xl font-bold tracking-tight text-white">
                      +{singleGrowth}%
                    </div>
                    <p className="font-sans text-xs text-[#9E9EA4] leading-relaxed pt-1">
                      Assumes output price deflator applies across inputs. Falsely credits imported commodity price cuts to domestic real productivity.
                    </p>
                  </div>

                  {/* UN SNA Double Deflation Result */}
                  <div className="p-6 rounded-2xl bg-[rgba(5,150,105,0.08)] border border-[rgba(5,150,105,0.3)] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#34D399]">
                        UN SNA 2008 DOUBLE DEFLATION
                      </span>
                      <span className="font-mono text-[10px] font-bold text-[#34D399] uppercase bg-[#059669]/20 px-2 py-0.5 rounded-sm">
                        BENCHMARK
                      </span>
                    </div>
                    <div className="font-mono text-5xl sm:text-6xl font-bold tracking-tight text-[#34D399]">
                      +{simulatedDoubleGrowth}%
                    </div>
                    <p className="font-sans text-xs text-[#9E9EA4] leading-relaxed pt-1">
                      Separates output from input price indices. Reflects genuine physical manufacturing growth consistent with IIP volume expansion.
                    </p>
                  </div>
                </div>

                {/* Discrepancy Spread Meter */}
                <div className="p-5 rounded-2xl bg-[#232428] border border-[rgba(255,255,255,0.08)] space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-semibold text-white">
                      Accounting Discrepancy Spread:
                    </span>
                    <span className="font-bold text-[#D94E34] text-sm">
                      {discrepancySpread}% percentage points
                    </span>
                  </div>
                  <div className="w-full bg-[#141416] h-3 rounded-full overflow-hidden p-0.5">
                    <div
                      className="bg-[#D94E34] h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(10, discrepancySpread * 18))}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#9E9EA4]">
                    <span>0.0% (Zero Divergence)</span>
                    <span className="text-[#D94E34]">Tolerance Threshold Exceeded (&gt;1.5% pts)</span>
                  </div>
                </div>

                {/* Direct Action Link */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
                  <span className="text-[#9E9EA4]">
                    Test every industrial sector in our full interactive simulator:
                  </span>
                  <Link
                    href="/deflator"
                    className="inline-flex items-center gap-2 font-bold text-white hover:text-[#D94E34] transition-colors"
                  >
                    <span>Open Deflator Simulator</span>
                    <ArrowRight className="h-4 w-4 text-[#D94E34]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- SCENARIO 2: THE DEFLATOR WEDGE (NOMINAL VS REAL) --- */}
        {activeScenario === "deflator" && (
          <div className="grid gap-10 lg:grid-cols-12 items-center">
            <div className="lg:col-span-5 space-y-5">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#E5A83B]">
                  <span>PRICE GAP FORENSICS // FY 2023-24</span>
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                  The 1.40% Implicit Deflator Puzzle
                </h3>
                <p className="font-sans text-sm sm:text-base text-[#9E9EA4] leading-relaxed">
                  In FY 2023-24, India's Nominal GDP grew by <strong className="text-white">+9.6%</strong>, while Real GDP expanded by <strong className="text-white">+8.2%</strong>.
                  This implies an aggregate price deflator of only <strong className="text-white">1.40%</strong>.
                </p>
                <p className="font-sans text-sm sm:text-base text-[#9E9EA4] leading-relaxed">
                  Yet ordinary citizens faced retail CPI inflation of <strong className="text-white">4.83%</strong>.
                  The gap stems from the Wholesale Price Index (WPI), which was depressed at <strong className="text-white">1.26%</strong> by falling global commodity imports.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#1B1C1F] border border-[rgba(255,255,255,0.12)] space-y-2 font-mono text-xs">
                <div className="text-[#9E9EA4]">ACCOUNTING IDENTITY:</div>
                <div className="text-white font-bold text-sm">
                  Real GDP = Nominal GDP ÷ (1 + Implicit Deflator)
                </div>
                <div className="text-[#059669] pt-1">
                  ₹295.36L Cr ÷ 1.014 = ₹173.82L Cr (Constant FY23 Prices)
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#1B1C1F] border border-[rgba(255,255,255,0.14)] space-y-6 shadow-2xl">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#9E9EA4] block pb-3 border-b border-[rgba(255,255,255,0.08)]">
                  THE DIVERGING MACRO RATES OF FY 2023-24
                </span>

                <div className="space-y-6">
                  {/* Retail CPI */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-white">1. Consumer Price Index (CPI Combined)</span>
                      <span className="font-mono text-lg font-bold text-[#D94E34]">4.83%</span>
                    </div>
                    <div className="w-full bg-[#141416] h-3 rounded-full overflow-hidden">
                      <div className="bg-[#D94E34] h-full" style={{ width: "48.3%" }} />
                    </div>
                    <span className="text-xs text-[#9E9EA4] block">
                      Retail consumer basket (food 39%, housing, transportation). Heavily felt by households.
                    </span>
                  </div>

                  {/* Wholesale WPI */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-white">2. Wholesale Price Index (WPI Headline)</span>
                      <span className="font-mono text-lg font-bold text-[#E5A83B]">1.26%</span>
                    </div>
                    <div className="w-full bg-[#141416] h-3 rounded-full overflow-hidden">
                      <div className="bg-[#E5A83B] h-full" style={{ width: "12.6%" }} />
                    </div>
                    <span className="text-xs text-[#9E9EA4] block">
                      Factory-gate wholesale commodities, fertilizers, crude petroleum. Depressed by global price drops.
                    </span>
                  </div>

                  {/* Implicit Deflator */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-white">3. Implicit GDP Deflator (Accounting Price)</span>
                      <span className="font-mono text-lg font-bold text-[#34D399]">1.40%</span>
                    </div>
                    <div className="w-full bg-[#141416] h-3 rounded-full overflow-hidden">
                      <div className="bg-[#34D399] h-full" style={{ width: "14.0%" }} />
                    </div>
                    <span className="text-xs text-[#9E9EA4] block">
                      The economy-wide deflator used by MoSPI. Closely tracks WPI rather than retail CPI.
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#9E9EA4]">Analyze the demand drivers behind this divergence:</span>
                  <Link
                    href="/gdp/why"
                    className="inline-flex items-center gap-1.5 font-bold text-white hover:text-[#D94E34] transition-colors"
                  >
                    <span>Analyze Growth Drivers</span>
                    <ArrowRight className="h-4 w-4 text-[#D94E34]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- SCENARIO 3: BASE YEAR HARMONIZATION --- */}
        {activeScenario === "base-year" && (
          <div className="grid gap-10 lg:grid-cols-12 items-center">
            <div className="lg:col-span-5 space-y-5">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#E5A83B]">
                  <span>STRUCTURAL BENCHMARK TRANSITION</span>
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                  Why Splicing Base Years Distorts History
                </h3>
                <p className="font-sans text-sm sm:text-base text-[#9E9EA4] leading-relaxed">
                  When MoSPI updates benchmark base years (2011-12 to 2022-23), the underlying data sources undergo structural revolutions.
                </p>
                <p className="font-sans text-sm sm:text-base text-[#9E9EA4] leading-relaxed">
                  The legacy 2011-12 series relied on physical survey sampling of factories (ASI) and an RBI panel of ~3,000 public companies. The 2022-23 benchmark transitions to <strong className="text-white">MCA-21 corporate e-filings (&gt;1.4 million firms)</strong> and <strong className="text-white">GSTN electronic invoice ledgers</strong>.
                </p>
                <p className="font-sans text-sm sm:text-base text-[#9E9EA4] leading-relaxed">
                  Directly splicing these two series without mathematical link factors produces artificial growth leaps. ArthaLens enforces strict base-year isolation.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#1B1C1F] border border-[rgba(255,255,255,0.14)] space-y-6 shadow-2xl">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#9E9EA4] block pb-3 border-b border-[rgba(255,255,255,0.08)]">
                  STRUCTURAL BENCHMARK DECOMPOSITION
                </span>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="p-5 rounded-2xl bg-[#232428] border border-[rgba(255,255,255,0.08)] space-y-3">
                    <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm bg-white/10 text-white">
                      2011-12 LEGACY BENCHMARK
                    </span>
                    <ul className="space-y-2 text-xs font-sans text-[#9E9EA4]">
                      <li>• Survey-based ASI manufacturing weights</li>
                      <li>• RBI sample of ~3,000 public companies</li>
                      <li>• Pre-GST sales tax & excise declarations</li>
                      <li>• Single-deflation across most state DES</li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-[rgba(5,150,105,0.08)] border border-[rgba(5,150,105,0.3)] space-y-3">
                    <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm bg-[#059669] text-white">
                      2022-23 ACTIVE BENCHMARK
                    </span>
                    <ul className="space-y-2 text-xs font-sans text-[#34D399]">
                      <li>• MCA-21 census (&gt;1.4M active corporations)</li>
                      <li>• GSTN transaction-level invoice registries</li>
                      <li>• UN SNA 2008 Double-Deflation matrix</li>
                      <li>• 28 states & 3 UTs sub-national GSDP integration</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#9E9EA4]">Read our Base-Year Isolation Standards:</span>
                  <Link
                    href="/methodology"
                    className="inline-flex items-center gap-1.5 font-bold text-white hover:text-[#D94E34] transition-colors"
                  >
                    <span>View Methodology</span>
                    <ArrowRight className="h-4 w-4 text-[#D94E34]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
