"use client";

import React, { useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import {
  BarChart3,
  SlidersHorizontal,
  Compass,
  Award,
  Bot,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface CopilotQuery {
  id: string;
  question: string;
  category: string;
  verifiedCitation: string;
  officialDataPoints: { label: string; value: string; source: string }[];
  analyticalSynthesis: string;
  conclusion: string;
}

const COPILOT_DEMOS: CopilotQuery[] = [
  {
    id: "manufacturing-gap",
    question: "Why did Manufacturing GVA surge +9.9% in FY 2023-24 while Private Final Consumption (PFCE) grew only +4.0%?",
    category: "Deflator & Sectoral Decomposition",
    verifiedCitation: "MoSPI NAS Provisional Estimates 2024 (Statement 1.1) • UN SNA 2008 §15.115",
    officialDataPoints: [
      { label: "Manufacturing GVA", value: "+9.9% YoY", source: "MoSPI Statement 1.1" },
      { label: "Physical IIP Growth", value: "+5.5% YoY", source: "DPIIT Industrial Index" },
      { label: "PFCE Consumption", value: "+4.0% YoY", source: "MoSPI Statement 2.1" },
      { label: "WPI Input Commodity Deflation", value: "-1.2% YoY", source: "DPIIT Wholesale Index" },
    ],
    analyticalSynthesis:
      "The divergence is explained by single-deflation commodity dynamics. In FY 2023-24, wholesale input costs for crude petroleum, base metals, and industrial chemicals dropped significantly (-1.2% WPI manufactured goods deflator). Because MoSPI currently utilizes output deflators rather than full double-deflation, falling raw material costs widened corporate operating margins without requiring proportional volume growth. Physical manufacturing output (IIP) was +5.5%, while real value added calculated under single deflation registered +9.9%.",
    conclusion:
      "Growth was driven primarily by corporate margin expansion from input cost relief rather than an accelerating domestic consumer demand cycle.",
  },
  {
    id: "base-year-mca",
    question: "How does the active 2022-23 benchmark incorporate MCA-21 e-filings compared to the 2011-12 survey method?",
    category: "Base Year Methodology",
    verifiedCitation: "Advisory Committee on National Accounts Statistics (ACNAS) Guidelines 2024",
    officialDataPoints: [
      { label: "Corporate Coverage", value: ">1,400,000 firms", source: "MCA-21 Electronic Portal" },
      { label: "Legacy Survey Sample", value: "~3,000 public cos", source: "RBI Company Finance" },
      { label: "Tax Ledger Integration", value: "GSTN API Feeds", source: "Dept of Revenue" },
    ],
    analyticalSynthesis:
      "The legacy 2011-12 series relied heavily on establishment-level sampling via the Annual Survey of Industries (ASI) and an RBI panel of roughly 3,000 public companies. The 2022-23 benchmark transitions to enterprise-level census reporting via the MCA-21 electronic registry, capturing financial statements of over 1.4 million private and public corporations. Furthermore, GST invoice transactions provide high-frequency verification of inter-state trade, reducing reliance on indirect physical indicators.",
    conclusion:
      "Base 2022-23 captures India's formalized corporate services and logistics economy with significantly higher granularity, requiring statistical link factors to avoid historical splicing errors.",
  },
  {
    id: "deflator-cpi-wedge",
    question: "What explains the 343 basis point wedge between retail CPI (4.83%) and the GDP Deflator (1.40%)?",
    category: "Inflation Dynamics",
    verifiedCitation: "MoSPI Consumer Price Statistics & DPIIT Office of Economic Adviser",
    officialDataPoints: [
      { label: "CPI Combined (Retail)", value: "4.83%", source: "MoSPI Price Index" },
      { label: "GDP Implicit Deflator", value: "1.40%", source: "NAS Statement 1.1/1.2" },
      { label: "WPI Headline (Wholesale)", value: "1.26%", source: "DPIIT OEA Release" },
      { label: "Price Wedge Spread", value: "3.43% pts", source: "ArthaLens Calculator" },
    ],
    analyticalSynthesis:
      "Retail CPI is heavily weighted toward consumer food (39.06%) and essential household services, which faced localized supply-chain and climate pressures. In contrast, the GDP deflator measures price changes across all domestically produced goods and services, aligning much closer to the Wholesale Price Index (WPI). WPI inflation was subdued at 1.26% due to falling global energy and commodity import costs, driving the deflator down to 1.40%.",
    conclusion:
      "The low deflator inflated calculated real GDP (+8.2%) relative to nominal expansion (+9.6%), even while household consumer budgets experienced persistent food price inflation.",
  },
];

export function AnalyticalCapabilitiesSection() {
  const [selectedDemoId, setSelectedDemoId] = useState<string>("manufacturing-gap");

  const currentDemo =
    COPILOT_DEMOS.find((d) => d.id === selectedDemoId) || COPILOT_DEMOS[0];

  return (
    <section className="relative py-20 sm:py-28 bg-[#E6E5DF] border-t border-[rgba(20,21,23,0.14)] overflow-hidden">
      {/* Precision Top Crosshairs */}
      <div className="absolute top-0 left-6 sm:left-12 font-mono text-xs text-[#828387] -translate-y-1/2 pointer-events-none select-none">
        +
      </div>
      <div className="absolute top-0 right-6 sm:right-12 font-mono text-xs text-[#828387] -translate-y-1/2 pointer-events-none select-none">
        +
      </div>

      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-[#D94E34]">
            <span className="h-2 w-2 rounded-full bg-[#D94E34]" />
            <span>CHAPTER 05 // ANALYTICAL WORKFLOW</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-6xl font-extrabold tracking-tight text-[#141416] leading-[1.05]">
            From analysis to understanding.
          </h2>
          <p className="font-sans text-base sm:text-lg text-[#57585C] leading-relaxed pt-2">
            Institutional research requires moving seamlessly from observing a macroeconomic puzzle to interrogating primary evidence and deriving an audit-grade interpretation.
          </p>
        </div>

        {/* Asymmetrical Split: Engine Directory (5 cols) vs Research Copilot Console (7 cols) */}
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          {/* Left: The Four Analytical Engines as a clean editorial index (No repetitive card boxes) */}
          <div className="lg:col-span-5 space-y-6">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#828387] block pb-2 border-b border-[rgba(20,21,23,0.12)]">
              AVAILABLE ANALYTICAL ENGINES
            </span>

            <div className="divide-y divide-[rgba(20,21,23,0.1)]">
              {/* Engine 1 */}
              <Link
                href="/analytics"
                className="group py-5 block hover:translate-x-1 transition-transform"
              >
                <div className="flex items-center justify-between font-mono text-xs mb-1.5">
                  <span className="font-bold text-[#141416]">ENGINE 01</span>
                  <span className="text-[#059669] font-bold">/analytics</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 className="h-4 w-4 text-[#D94E34]" />
                  <h3 className="font-heading text-xl font-bold text-[#141416] group-hover:text-[#D94E34] transition-colors">
                    Macro Analytics Terminal
                  </h3>
                </div>
                <p className="font-sans text-xs text-[#57585C] leading-relaxed">
                  Full-viewport workspace: quarterly GDP time series, 8 sectoral GVA shares, state rankings, and discrepancy telemetry.
                </p>
              </Link>

              {/* Engine 2 */}
              <Link
                href="/deflator"
                className="group py-5 block hover:translate-x-1 transition-transform"
              >
                <div className="flex items-center justify-between font-mono text-xs mb-1.5">
                  <span className="font-bold text-[#141416]">ENGINE 02</span>
                  <span className="text-[#059669] font-bold">/deflator</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <SlidersHorizontal className="h-4 w-4 text-[#D94E34]" />
                  <h3 className="font-heading text-xl font-bold text-[#141416] group-hover:text-[#D94E34] transition-colors">
                    Deflator & Inflation Simulator
                  </h3>
                </div>
                <p className="font-sans text-xs text-[#57585C] leading-relaxed">
                  Stress-test how shifts in CPI food inflation, wholesale WPI, and global crude distort implicit price deflators.
                </p>
              </Link>

              {/* Engine 3 */}
              <Link
                href="/gdp/why"
                className="group py-5 block hover:translate-x-1 transition-transform"
              >
                <div className="flex items-center justify-between font-mono text-xs mb-1.5">
                  <span className="font-bold text-[#141416]">ENGINE 03</span>
                  <span className="text-[#059669] font-bold">/gdp/why</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Compass className="h-4 w-4 text-[#D94E34]" />
                  <h3 className="font-heading text-xl font-bold text-[#141416] group-hover:text-[#D94E34] transition-colors">
                    Growth Drivers & Discrepancies
                  </h3>
                </div>
                <p className="font-sans text-xs text-[#57585C] leading-relaxed">
                  Deconstruct Private Consumption (PFCE), Government Outlays (GFCE), and Capital Formation (GFCF) to isolate statistical anomalies.
                </p>
              </Link>

              {/* Engine 4 */}
              <Link
                href="/ratings"
                className="group py-5 block hover:translate-x-1 transition-transform"
              >
                <div className="flex items-center justify-between font-mono text-xs mb-1.5">
                  <span className="font-bold text-[#141416]">ENGINE 04</span>
                  <span className="text-[#059669] font-bold">/ratings</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Award className="h-4 w-4 text-[#D94E34]" />
                  <h3 className="font-heading text-xl font-bold text-[#141416] group-hover:text-[#D94E34] transition-colors">
                    Sovereign Ratings & Consistency
                  </h3>
                </div>
                <p className="font-sans text-xs text-[#57585C] leading-relaxed">
                  Audit Fitch, Moody's, and S&P ratings against fiscal deficit data, general government debt, and multi-agency reconciliation.
                </p>
              </Link>
            </div>
          </div>

          {/* Right: The Sovereign Copilot Interactive Research Console (7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-[#141416] text-[#ECEBE5] p-6 sm:p-8 space-y-6 shadow-2xl border border-[rgba(255,255,255,0.12)]">
              {/* Terminal Title Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[rgba(255,255,255,0.1)]">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-[#D94E34] flex items-center justify-center text-white font-bold">
                    <Bot className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="font-heading font-bold text-base text-white block">
                      MoSPI-Grounded Research Copilot
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#059669]">
                      PROVENANCE-BOUND: VERIFIED FACTS VS REASONING
                    </span>
                  </div>
                </div>

                {/* Question Selector Pills */}
                <div className="inline-flex rounded-xl bg-[#1E1F23] p-1 text-xs font-mono">
                  {COPILOT_DEMOS.map((demo) => (
                    <button
                      key={demo.id}
                      type="button"
                      onClick={() => setSelectedDemoId(demo.id)}
                      className={clsx(
                        "px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer",
                        selectedDemoId === demo.id
                          ? "bg-[#D94E34] text-white shadow-xs"
                          : "text-[#9E9EA4] hover:text-white"
                      )}
                    >
                      {demo.category.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inquired Research Prompt */}
              <div className="p-4 rounded-2xl bg-[#1B1C1F] border border-[rgba(255,255,255,0.08)] space-y-1.5">
                <span className="font-mono text-[10px] font-bold uppercase text-[#9E9EA4] block">
                  RESEARCH INQUIRY
                </span>
                <p className="font-heading text-lg sm:text-xl font-bold text-white">
                  "{currentDemo.question}"
                </p>
              </div>

              {/* Verified Citations Box */}
              <div className="p-4 rounded-2xl bg-[rgba(5,150,105,0.08)] border border-[rgba(5,150,105,0.25)] space-y-2">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#34D399]">
                  <ShieldCheck className="h-4 w-4" />
                  <span>VERIFIED MOSPI CITATION:</span>
                </div>
                <p className="font-mono text-xs text-[#34D399]">
                  {currentDemo.verifiedCitation}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  {currentDemo.officialDataPoints.map((point, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-[#141416] border border-white/10 text-xs font-mono"
                    >
                      <span className="text-[#9E9EA4] block text-[10px]">{point.label}</span>
                      <span className="font-bold text-white">{point.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Copilot Analytical Reasoning */}
              <div className="space-y-3 font-sans text-sm text-[#9E9EA4] leading-relaxed">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-white block">
                  ECONOMETRIC REASONING:
                </span>
                <p>{currentDemo.analyticalSynthesis}</p>
              </div>

              {/* Conclusion Banner */}
              <div className="p-3.5 rounded-xl bg-[#232428] border border-[rgba(255,255,255,0.08)] text-xs font-sans text-white font-medium flex items-center justify-between gap-4">
                <span>{currentDemo.conclusion}</span>
                <Link
                  href="/ai"
                  className="shrink-0 font-mono text-xs font-bold text-[#D94E34] hover:underline inline-flex items-center gap-1"
                >
                  <span>Launch Copilot</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
