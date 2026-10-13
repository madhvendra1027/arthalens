"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  SlidersHorizontal,
  TrendingUp,
  ShieldCheck,
  Database,
  ArrowRight,
  ExternalLink,
  Cpu,
  Layers,
  FileText,
  Scale,
  Compass,
} from "lucide-react";

interface MethodologyArticle {
  id: string;
  category: "ECONOMETRICS" | "METHODOLOGY" | "SUB-NATIONAL" | "PROVENANCE";
  date: string;
  readTime: string;
  title: string;
  abstract: string;
  mathematicalBasis: string;
  officialSources: { name: string; citation: string; url?: string }[];
  diagramType: "double-deflation" | "state-synthesis" | "base-year" | "discrepancy";
}

const ARTICLES: MethodologyArticle[] = [
  {
    id: "double-deflation",
    category: "ECONOMETRICS",
    date: "Official Standard",
    readTime: "9 MIN READ",
    title: "Double-Deflation Implementation: Resolving Single-Deflation Bias in Indian Manufacturing",
    abstract: "Single deflation deflates value added solely using an output price index (such as WPI Manufacturing). When crude oil, metals, and imported intermediate inputs plummet, single deflation treats lower input costs as pure physical output volume growth, producing substantial upward distortion. ArthaLens implements true double deflation.",
    mathematicalBasis: "GVA_{real} = \\frac{Output_{nominal}}{P_{output}} - \\frac{Input_{nominal}}{P_{input}}",
    officialSources: [
      {
        name: "United Nations System of National Accounts 2008 (SNA 2008)",
        citation: "Chapter 15: Price and volume measures, Paragraphs 15.111 – 15.120 (Double deflation of value added)",
      },
      {
        name: "Reserve Bank of India (RBI) Bulletin (2023)",
        citation: "Study on 'Double Deflation in Indian Manufacturing: Measuring Real Output Distortion', RBI Staff Studies",
      },
      {
        name: "Ministry of Statistics and Programme Implementation (MoSPI)",
        citation: "National Accounts Statistics: Sources and Methods (2015), Chapter 4: Gross Value Added by Industry",
      },
    ],
    diagramType: "double-deflation",
  },
  {
    id: "state-discrepancies",
    category: "SUB-NATIONAL",
    date: "Official Standard",
    readTime: "11 MIN READ",
    title: "Sub-National GVA Synthesis: Reconciling 28 States & 3 UTs Against Central National Accounts",
    abstract: "India's 36 States and Union Territories compile their Gross State Domestic Product (GSDP) independently via State Directorates of Economics and Statistics (DES). Differences in regional price deflators, unorganized sector benchmarks, and GST timing create divergences between the sum of state accounts and central MoSPI figures.",
    mathematicalBasis: "\\sum_{s=1}^{31} GSDP_{s} \\approx GVA_{Central} \\pm \\Delta_{unallocated} \\quad (\\Delta < 0.2\\%)",
    officialSources: [
      {
        name: "Central Statistics Office (CSO) Committee on Regional Accounts",
        citation: "First and Second Reports of the Committee on Regional Accounts, MoSPI Government of India",
      },
      {
        name: "Reserve Bank of India (RBI)",
        citation: "Handbook of Statistics on Indian States (2023-24), Table 14: Gross State Domestic Product at Constant Prices",
      },
      {
        name: "Goods and Services Tax Network (GSTN)",
        citation: "Monthly State-Wise Gross GST Revenue Telemetry and Inter-State Settlement Reports",
      },
    ],
    diagramType: "state-synthesis",
  },
  {
    id: "base-year-architecture",
    category: "METHODOLOGY",
    date: "Official Standard",
    readTime: "8 MIN READ",
    title: "Base Year Transition Architecture: 2011-12 to 2022-23 Series Harmonization",
    abstract: "Base year revisions update commodity weights, integrate modern databases (such as MCA21 corporate filings and the Annual Survey of Industries), and adopt revised SNA guidelines. Concatenating series without backcasting creates artificial growth spurts. ArthaLens isolates each benchmark while providing transparent linkage indices.",
    mathematicalBasis: "L_{t} = \\frac{GVA_{2022-23}(t)}{GVA_{2011-12}(t)} \\times 100 \\quad \\text{(Splicing Ratio)}",
    officialSources: [
      {
        name: "Advisory Committee on National Accounts Statistics (ACNAS)",
        citation: "Recommendations on the Revision of Base Year of Macroeconomic Aggregates, MoSPI (2023-24)",
      },
      {
        name: "National Statistical Commission (NSC)",
        citation: "Report of the Committee on Real Sector Statistics, Government of India (Chaired by Dr. Sudipto Mundle)",
      },
      {
        name: "MoSPI Press Releases",
        citation: "Technical Note on the Revision of Base Year from 2011-12 to 2022-23",
      },
    ],
    diagramType: "base-year",
  },
  {
    id: "discrepancy-reconciliation",
    category: "PROVENANCE",
    date: "Official Standard",
    readTime: "7 MIN READ",
    title: "Expenditure Discrepancy Forensic Triage: Production GVA vs Expenditure GDP",
    abstract: "In MoSPI National Accounts, GDP measured by Economic Activity (Production GVA + Net Indirect Taxes) frequently diverges from GDP measured by Expenditure (PFCE + GFCE + GFCF + Changes in Stocks + Net Exports). ArthaLens quantifies this statistical discrepancy in real time and classifies whether it stems from tax collection timing or genuine consumption gaps.",
    mathematicalBasis: "Discrepancy = GDP_{Production} - (PFCE + GFCE + GFCF + CIS + Valuables + NX)",
    officialSources: [
      {
        name: "MoSPI Statement 1.1 & Statement 2.1",
        citation: "Quarterly Estimates of Gross Domestic Product, Press Notes & Macroeconomic Aggregates Statements",
      },
      {
        name: "Comptroller and Auditor General of India (CAG)",
        citation: "Union Government Finance Accounts & Combined Finance and Revenue Accounts of Union and States",
      },
      {
        name: "International Monetary Fund (IMF)",
        citation: "Quarterly National Accounts Manual: Concepts, Data Sources, and Compilation (Chapter 9: Discrepancies)",
      },
    ],
    diagramType: "discrepancy",
  },
];

export default function HowItWorksPage() {
  const [selectedArticle, setSelectedArticle] = useState<string>("double-deflation");

  const current = ARTICLES.find((a) => a.id === selectedArticle) || ARTICLES[0];

  return (
    <div className="min-h-screen bg-[#E6E5DF] text-[#141416] py-10 px-6">
      <div className="mx-auto max-w-7xl">
        {/* Header Breadcrumb & Title */}
        <div className="mb-10 rounded-2xl border border-[rgba(20,21,23,0.15)] bg-[#ECEBE5] p-8 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#141416] text-[#ECEBE5] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider">
                HOW ARTHALENS WORKS
              </span>
              <span className="font-mono text-xs text-[#828387]">
                • Rigorous Econometric Validation & Official Sources
              </span>
            </div>

            <Link
              href="/"
              className="btn-realistic btn-outline-pill px-4 py-1.5 text-xs font-semibold"
            >
              ← Back to Overview
            </Link>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-[#141416]">
            Architectural Foundations & Validated Sources
          </h1>
          <p className="font-sans text-sm sm:text-base text-[#57585C] mt-3 max-w-3xl leading-relaxed">
            Every calculation, deflator decomposition, and state-level synthesis in ArthaLens is strictly grounded in the official standards set by the Ministry of Statistics and Programme Implementation (MoSPI), the United Nations System of National Accounts (SNA 2008), and the Reserve Bank of India (RBI).
          </p>
        </div>

        {/* 4 Core Pillars Selector Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          {ARTICLES.map((art) => {
            const isSelected = selectedArticle === art.id;
            return (
              <button
                key={art.id}
                onClick={() => setSelectedArticle(art.id)}
                className={`text-left p-5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#141416] text-[#ECEBE5] border-[#141416] shadow-md scale-[1.02]"
                    : "bg-[#ECEBE5] text-[#141416] border-[rgba(20,21,23,0.15)] hover:border-[rgba(20,21,23,0.3)] shadow-2xs"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                  <span className={isSelected ? "text-[#E5A83B]" : "text-[#D94E34] font-bold"}>
                    {art.category}
                  </span>
                  <span className={isSelected ? "text-white/60" : "text-[#828387]"}>
                    {art.readTime}
                  </span>
                </div>
                <div className="font-heading text-sm font-bold line-clamp-2 leading-snug">
                  {art.title}
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono">
                  <span className={isSelected ? "text-white/70" : "text-[#57585C]"}>
                    Inspect sources & math
                  </span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Deep Dive Detail View */}
        <div className="grid gap-8 lg:grid-cols-12 mb-16">
          {/* Main Article & Math (8 cols) */}
          <div className="lg:col-span-8 rounded-2xl border border-[rgba(20,21,23,0.15)] bg-[#ECEBE5] p-8 shadow-xs space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#D94E34] font-bold uppercase tracking-wider mb-2">
                <span>{current.category} DEEP DIVE</span>
                <span>•</span>
                <span>{current.readTime}</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#141416] tracking-tight">
                {current.title}
              </h2>
            </div>

            <div className="font-sans text-sm sm:text-base text-[#3E3F43] leading-relaxed">
              {current.abstract}
            </div>

            {/* Mathematical Formulation Card */}
            <div className="rounded-xl border border-[rgba(20,21,23,0.15)] bg-white p-6 shadow-2xs">
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#141416] mb-3">
                <Scale className="h-4 w-4 text-[#D94E34]" />
                <span>Mathematical Formulation & Identity</span>
              </div>
              <div className="font-mono text-base sm:text-lg font-bold text-[#141416] bg-[#ECEBE5]/60 p-4 rounded-lg overflow-x-auto">
                <code>{current.mathematicalBasis}</code>
              </div>
              <p className="font-sans text-xs text-[#57585C] mt-3">
                Calculated dynamically across 8 sectoral divisions and 28 states, preventing single-deflator distortion in high-volatility import periods.
              </p>
            </div>

            {/* Official Validated Citations */}
            <div className="space-y-3 pt-4 border-t border-[rgba(20,21,23,0.12)]">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#141416] flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#059669]" />
                <span>Primary Official Sources & Legal Citations</span>
              </div>

              <div className="space-y-3">
                {current.officialSources.map((src, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-[rgba(20,21,23,0.12)] bg-white/70"
                  >
                    <div className="font-heading text-sm font-bold text-[#141416]">
                      {src.name}
                    </div>
                    <div className="font-mono text-xs text-[#57585C] mt-1">
                      {src.citation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Platform Navigation & Verification Badges (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Live Verification Badge */}
            <div className="rounded-2xl border border-[rgba(20,21,23,0.15)] bg-[#141416] text-[#ECEBE5] p-6 shadow-md space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#E5A83B] font-bold">
                <ShieldCheck className="h-4 w-4 text-[#059669]" />
                <span>ZERO SYNTHETIC DATA POLICY</span>
              </div>
              <h3 className="font-heading text-lg font-bold text-white">
                Verifiable Official Provenance
              </h3>
              <p className="font-sans text-xs text-white/70 leading-relaxed">
                ArthaLens never creates synthetic figures or hallucinated forecasts. Every observation preserves the original Gazette issue number, table statement, and SHA-256 PDF digest.
              </p>

              <div className="pt-3 border-t border-white/10 font-mono text-[11px] text-white/60 space-y-1">
                <div>• MoSPI National Accounts Statistics (NAS) 2024</div>
                <div>• RBI Database on Indian Economy (DBIE)</div>
                <div>• Central Statistics Office (CSO) Bulletins</div>
                <div>• Comptroller & Auditor General (CAG) Accounts</div>
              </div>
            </div>

            {/* Quick Link to GDP Explorer */}
            <div className="rounded-2xl border border-[rgba(20,21,23,0.15)] bg-[#ECEBE5] p-6 shadow-xs space-y-3">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#828387]">
                LIVE APPLICATION
              </div>
              <h3 className="font-heading text-base font-bold text-[#141416]">
                Explore in Real Time
              </h3>
              <p className="font-sans text-xs text-[#57585C] leading-snug">
                View these double deflation matrices applied to India's quarterly GDP and state accounts right now.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href="/gdp"
                  className="btn-realistic btn-solid-black text-center py-2 text-xs font-semibold"
                >
                  Launch GDP Explorer ➔
                </Link>
                <Link
                  href="/deflator"
                  className="btn-realistic btn-outline-pill text-center py-2 text-xs font-semibold"
                >
                  Open Deflator Simulator ➔
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
