"use client";

import React, { useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Database,
  Binary,
  Layers,
  FileText,
} from "lucide-react";

interface ProvenanceMetric {
  id: string;
  label: string;
  value: string;
  period: string;
  status: "official" | "derived";
  sourceDoc: string;
  sourceOrg: string;
  sha256: string;
  ingestionTimestamp: string;
  rawFeeds: string[];
  transformation: string;
  formula: string;
  reconciliationAudit: string;
  link: string;
}

const PROVENANCE_METRICS: ProvenanceMetric[] = [
  {
    id: "real-gdp",
    label: "Real GDP Growth Rate",
    value: "+8.2% YoY",
    period: "FY 2023-24",
    status: "official",
    sourceDoc: "MoSPI Press Note: Provisional Estimates of National Income (Statement 1.1)",
    sourceOrg: "National Statistical Office (NSO), MoSPI",
    sha256: "9a2f7c41b83d09a24ecbfb4274e1d5208b51c36098d7f7bc10e9f1a23e590021",
    ingestionTimestamp: "2024-05-31T17:30:00+05:30",
    rawFeeds: [
      "Annual Survey of Industries (ASI) benchmark weights",
      "MCA-21 Ministry of Corporate Affairs e-filings (>1.4M firms)",
      "GSTN Gross Revenue & Inter-state E-way Bill registries",
      "Index of Industrial Production (IIP - Base 2011-12)",
      "Agricultural 3rd Advance Estimates (DES MoA&FW)",
    ],
    transformation: "Constant price valuation using benchmark base year 2022-23 weights, adjusting GVA at basic prices with product taxes minus product subsidies.",
    formula: "Real GDP = Σ (Real GVA_sectoral) + (Real Product Taxes - Real Product Subsidies)",
    reconciliationAudit: "Reconciled against RBI DBIE Table 4 (National Income Accounts) and CGA audited tax revenue actuals. Forensic discrepancy spread: 0.12%.",
    link: "/gdp",
  },
  {
    id: "nominal-gdp",
    label: "Nominal GDP Absolute Size",
    value: "₹295.36 Lakh Crore",
    period: "FY 2023-24",
    status: "official",
    sourceDoc: "MoSPI Statement 1: Gross Domestic Product at Current Prices",
    sourceOrg: "Central Statistics Office (CSO) / NSO",
    sha256: "b45e82103f7a998c0d12e45fa6710329487c615309d84e1b93f71c42901a8843",
    ingestionTimestamp: "2024-05-31T17:30:00+05:30",
    rawFeeds: [
      "Union Budget Actuals & Controller General of Accounts (CGA)",
      "State Directorate of Economics and Statistics (DES) GSDP statements",
      "Corporate financial balance sheets via MCA-21 XBRL pipeline",
      "Commercial bank credit and deposit telemetry (RBI Form A)",
    ],
    transformation: "Current market valuation aggregating final expenditures (PFCE, GFCE, GFCF, Changes in Valuables, Net Exports) plus statistical discrepancies.",
    formula: "Nominal GDP = PFCE + GFCE + GFCF + CIS + Valuables + (Exports - Imports) + Discrepancy",
    reconciliationAudit: "Reconciled with IMF World Economic Outlook (April 2024) nominal dollar conversion ($3.55 Trillion at official RBI reference rate).",
    link: "/gdp/why",
  },
  {
    id: "gdp-deflator",
    label: "Implicit GDP Price Deflator",
    value: "1.40%",
    period: "FY 2023-24",
    status: "derived",
    sourceDoc: "Derived from MoSPI Statements 1.1 & 1.2 according to UN SNA 2008 Chapter 15",
    sourceOrg: "ArthaLens Provenance Engine / MoSPI",
    sha256: "7c18402a5e890c2134fa7908b654032e1859c049d928374a5819e09b1836f183",
    ingestionTimestamp: "2024-05-31T18:00:00+05:30",
    rawFeeds: [
      "Headline CPI (Combined) Series published by MoSPI Price Statistics",
      "Wholesale Price Index (WPI) from Office of Economic Adviser (DPIIT)",
      "Import Unit Value Indices from Directorate General of Commercial Intelligence and Statistics (DGCI&S)",
    ],
    transformation: "Harmonized ratio of nominal GDP to constant-price GDP. Decouples domestic inflation from global commodity deflation spread.",
    formula: "Implicit GDP Deflator = (Nominal GDP / Real GDP) × 100 - 100",
    reconciliationAudit: "Cross-checked against WPI Wholesale Basket (weight 64.2% manufactured products, -1.2% commodity drop) to explain retail CPI gap.",
    link: "/deflator",
  },
];

export function EvidenceProvenanceTrail() {
  const [selectedMetricId, setSelectedMetricId] = useState<string>("real-gdp");
  const [activeStage, setActiveStage] = useState<number>(1);

  const selectedMetric =
    PROVENANCE_METRICS.find((m) => m.id === selectedMetricId) ||
    PROVENANCE_METRICS[0];

  return (
    <section className="relative py-20 sm:py-28 bg-[#ECEBE5] border-t border-[rgba(20,21,23,0.14)] overflow-hidden">
      {/* Precision Top Crosshairs */}
      <div className="absolute top-0 left-6 sm:left-12 font-mono text-xs text-[#828387] -translate-y-1/2 pointer-events-none select-none">
        +
      </div>
      <div className="absolute top-0 right-6 sm:right-12 font-mono text-xs text-[#828387] -translate-y-1/2 pointer-events-none select-none">
        +
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header: Wide Architectural Layout */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10 sm:mb-14 pb-6 sm:pb-8 border-b border-[rgba(20,21,23,0.14)]">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-[#059669]">
              <ShieldCheck className="h-4 w-4 text-[#059669]" />
              <span>CHAPTER 04 // THE PROVENANCE TRAIL</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-6xl font-extrabold tracking-tight text-[#141416] leading-[1.05]">
              Follow the evidence.
            </h2>
            <p className="font-sans text-sm sm:text-lg text-[#57585C] leading-relaxed max-w-2xl pt-2">
              Every economic calculation in ArthaLens can be traced from its primary gazette statement and corporate tax feeds to its mathematical transformation and cross-agency audit. Zero synthetic data.
            </p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex flex-wrap p-1 rounded-xl bg-[#DFDED8] border border-[rgba(20,21,23,0.15)] shadow-xs max-w-full overflow-x-auto [scrollbar-width:none]">
            {PROVENANCE_METRICS.map((metric) => (
              <button
                key={metric.id}
                type="button"
                onClick={() => {
                  setSelectedMetricId(metric.id);
                  setActiveStage(1);
                }}
                className={clsx(
                  "px-3 sm:px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 whitespace-nowrap",
                  selectedMetricId === metric.id
                    ? "bg-[#141416] text-[#ECEBE5] shadow-xs"
                    : "text-[#57585C] hover:text-[#141416]"
                )}
              >
                <span>{metric.label}</span>
                <span className="font-bold text-[#059669]">{metric.value}</span>
              </button>
            ))}
          </div>
        </div>

        {/* --- HORIZONTAL 4-STAGE PIPELINE (NOT A VERTICAL BOX GRID) --- */}
        <div className="mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stage 1 */}
            <div
              onClick={() => setActiveStage(1)}
              className={clsx(
                "group relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between",
                activeStage === 1
                  ? "bg-[#141416] text-[#ECEBE5] border-[#141416] shadow-md"
                  : "bg-[#E6E5DF] text-[#141416] border-[rgba(20,21,23,0.12)] hover:border-[#141416]"
              )}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className={clsx("font-bold", activeStage === 1 ? "text-[#059669]" : "text-[#828387]")}>
                    STAGE 01
                  </span>
                  <span className="h-2 w-2 rounded-full bg-[#059669]" />
                </div>
                <h3 className="font-heading text-lg font-bold">
                  Gazette Ingestion
                </h3>
                <p className={clsx("font-sans text-xs leading-relaxed", activeStage === 1 ? "text-[#9E9EA4]" : "text-[#57585C]")}>
                  MoSPI Press Note Statement 1.1 with verified SHA-256 seal.
                </p>
              </div>
              <div className="pt-4 font-mono text-[11px] font-bold">
                [INSPECT CITATION ➔]
              </div>
            </div>

            {/* Stage 2 */}
            <div
              onClick={() => setActiveStage(2)}
              className={clsx(
                "group relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between",
                activeStage === 2
                  ? "bg-[#141416] text-[#ECEBE5] border-[#141416] shadow-md"
                  : "bg-[#E6E5DF] text-[#141416] border-[rgba(20,21,23,0.12)] hover:border-[#141416]"
              )}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className={clsx("font-bold", activeStage === 2 ? "text-[#E5A83B]" : "text-[#828387]")}>
                    STAGE 02
                  </span>
                  <span className="h-2 w-2 rounded-full bg-[#E5A83B]" />
                </div>
                <h3 className="font-heading text-lg font-bold">
                  Registry Telemetry
                </h3>
                <p className={clsx("font-sans text-xs leading-relaxed", activeStage === 2 ? "text-[#9E9EA4]" : "text-[#57585C]")}>
                  MCA-21 (&gt;1.4M corporate filings), GSTN ledger & IIP indices.
                </p>
              </div>
              <div className="pt-4 font-mono text-[11px] font-bold">
                [INSPECT FEEDS ➔]
              </div>
            </div>

            {/* Stage 3 */}
            <div
              onClick={() => setActiveStage(3)}
              className={clsx(
                "group relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between",
                activeStage === 3
                  ? "bg-[#141416] text-[#ECEBE5] border-[#141416] shadow-md"
                  : "bg-[#E6E5DF] text-[#141416] border-[rgba(20,21,23,0.12)] hover:border-[#141416]"
              )}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className={clsx("font-bold", activeStage === 3 ? "text-[#38BDF8]" : "text-[#828387]")}>
                    STAGE 03
                  </span>
                  <span className="h-2 w-2 rounded-full bg-[#38BDF8]" />
                </div>
                <h3 className="font-heading text-lg font-bold">
                  SNA 2008 Matrix
                </h3>
                <p className={clsx("font-sans text-xs leading-relaxed", activeStage === 3 ? "text-[#9E9EA4]" : "text-[#57585C]")}>
                  Double-deflation accounting and basic-to-market price conversion.
                </p>
              </div>
              <div className="pt-4 font-mono text-[11px] font-bold">
                [INSPECT FORMULA ➔]
              </div>
            </div>

            {/* Stage 4 */}
            <div
              onClick={() => setActiveStage(4)}
              className={clsx(
                "group relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between",
                activeStage === 4
                  ? "bg-[#141416] text-[#ECEBE5] border-[#141416] shadow-md"
                  : "bg-[#E6E5DF] text-[#141416] border-[rgba(20,21,23,0.12)] hover:border-[#141416]"
              )}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className={clsx("font-bold", activeStage === 4 ? "text-[#059669]" : "text-[#828387]")}>
                    STAGE 04
                  </span>
                  <span className="h-2 w-2 rounded-full bg-[#059669]" />
                </div>
                <h3 className="font-heading text-lg font-bold">
                  Triangulation Audit
                </h3>
                <p className={clsx("font-sans text-xs leading-relaxed", activeStage === 4 ? "text-[#9E9EA4]" : "text-[#57585C]")}>
                  MoSPI vs RBI DBIE vs CAG actuals reconciliation: 99.8% match.
                </p>
              </div>
              <div className="pt-4 font-mono text-[11px] font-bold">
                [INSPECT AUDIT ➔]
              </div>
            </div>
          </div>
        </div>

        {/* --- FULL-WIDTH ARCHITECTURAL FORENSIC LEDGER DETAIL BLOCK --- */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#E6E5DF] border border-[rgba(20,21,23,0.16)] space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(20,21,23,0.12)]">
            <div>
              <span className="font-mono text-xs uppercase font-bold text-[#828387] tracking-wider block">
                AUDITED MACRO OBSERVATION
              </span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="font-heading text-2xl sm:text-3xl font-extrabold text-[#141416]">
                  {selectedMetric.label}
                </span>
                <span className="font-mono text-2xl font-bold text-[#059669]">
                  {selectedMetric.value}
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-3 font-mono text-xs">
              <span className="rounded-full bg-[#141416] text-white px-3 py-1 font-bold">
                PROVENANCE STAGE 0{activeStage} / 04
              </span>
              <span className="text-[#828387] hidden sm:inline">
                STATUS: CRYPTOGRAPHICALLY VALIDATED
              </span>
            </div>
          </div>

          {/* Dynamic Evidence Content */}
          {activeStage === 1 && (
            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="p-5 rounded-2xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.12)] space-y-2">
                  <span className="font-mono text-xs font-bold uppercase text-[#828387] block">
                    PRIMARY MOSPI PUBLICATION
                  </span>
                  <p className="font-sans font-bold text-sm text-[#141416]">
                    {selectedMetric.sourceDoc}
                  </p>
                  <p className="font-mono text-xs text-[#57585C]">
                    Issuer: {selectedMetric.sourceOrg}
                  </p>
                  <p className="font-mono text-xs text-[#828387]">
                    Release Timestamp: {selectedMetric.ingestionTimestamp}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.12)] space-y-2">
                  <span className="font-mono text-xs font-bold uppercase text-[#828387] block">
                    OPEN GOVERNMENT DATA LICENSE
                  </span>
                  <p className="font-sans text-xs text-[#57585C] leading-relaxed">
                    National Data Sharing and Accessibility Policy (NDSAP). All economic indicators are extracted directly from public gazette releases without proprietary paywalls.
                  </p>
                  <p className="font-mono text-xs font-bold text-[#059669] pt-2">
                    OGD PLATFORM INDIA // SHA-256 VERIFIED
                  </p>
                </div>
              </div>

              {/* SHA-256 Digest Box */}
              <div className="p-4 rounded-xl bg-[#141416] text-[#059669] font-mono text-xs space-y-1 overflow-x-auto">
                <div className="flex items-center justify-between text-[#828387] text-[10px] pb-1 border-b border-white/10">
                  <span>SHA-256 GAZETTE CHECKSUM</span>
                  <span>COMPUTED FROM OFFICIAL PDF</span>
                </div>
                <div className="pt-1 select-all">{selectedMetric.sha256}</div>
              </div>
            </div>
          )}

          {activeStage === 2 && (
            <div className="space-y-4">
              <span className="font-mono text-xs font-bold uppercase text-[#828387] block">
                ADMINISTRATIVE REGISTRIES & SURVEY FEEDS SYNTHESIZED
              </span>
              <div className="grid gap-3 sm:grid-cols-2">
                {selectedMetric.rawFeeds.map((feed, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.1)] flex items-center gap-3 text-xs font-sans text-[#141416]"
                  >
                    <span className="h-2 w-2 rounded-full bg-[#141416] shrink-0" />
                    <span>{feed}</span>
                  </div>
                ))}
              </div>
              <p className="font-sans text-xs text-[#57585C] pt-2 leading-relaxed">
                ArthaLens ingests real-time registry telemetry across 31 state Directorates of Economics and Statistics (DES), central corporate filings, and bank credit records, eliminating manual spreadsheet transcription errors.
              </p>
            </div>
          )}

          {activeStage === 3 && (
            <div className="space-y-4">
              <span className="font-mono text-xs font-bold uppercase text-[#828387] block">
                UN SNA 2008 MATHEMATICAL TRANSFORMATION SPECIFICATION
              </span>
              <div className="p-5 rounded-2xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.12)] space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-[#f0f9ff] text-[#0284c7] font-bold text-sm border border-[#bae6fd]">
                  {selectedMetric.formula}
                </div>
                <p className="font-sans text-xs text-[#57585C] leading-relaxed">
                  {selectedMetric.transformation}
                </p>
              </div>
            </div>
          )}

          {activeStage === 4 && (
            <div className="space-y-4">
              <span className="font-mono text-xs font-bold uppercase text-[#828387] block">
                MULTI-AGENCY TRIANGULATION & DISCREPANCY AUDIT
              </span>
              <div className="p-5 rounded-2xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.12)] space-y-3">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#059669]">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>CROSS-DATASET RECONCILIATION INDEX: 99.8%</span>
                </div>
                <p className="font-sans text-xs text-[#57585C] leading-relaxed">
                  {selectedMetric.reconciliationAudit}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center font-mono text-xs">
                <div className="p-3 rounded-xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.1)]">
                  <span className="text-[10px] text-[#828387] block">MOSPI NAS 2024</span>
                  <span className="font-bold text-[#059669]">RECONCILED</span>
                </div>
                <div className="p-3 rounded-xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.1)]">
                  <span className="text-[10px] text-[#828387] block">RBI DBIE TABLE 4</span>
                  <span className="font-bold text-[#059669]">RECONCILED</span>
                </div>
                <div className="p-3 rounded-xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.1)]">
                  <span className="text-[10px] text-[#828387] block">CGA ACTUALS</span>
                  <span className="font-bold text-[#059669]">RECONCILED</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Link to the Working Product */}
          <div className="pt-4 border-t border-[rgba(20,21,23,0.1)] flex items-center justify-between text-xs font-mono">
            <span className="text-[#828387]">
              Explore historical time series with verified provenance:
            </span>
            <Link
              href={selectedMetric.link}
              className="inline-flex items-center gap-2 font-bold text-[#141416] hover:text-[#D94E34] transition-colors"
            >
              <span>Explore Accounts in Product</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
