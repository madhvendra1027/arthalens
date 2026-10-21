"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Compass,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export interface ObservatoryStation {
  id: string;
  name: string;
  shortName: string;
  code: string;
  location: string;
  category: "central" | "global" | "treasury";
  primaryMetric: string;
  primaryMetricLabel: string;
  delta: string;
  provenance: string;
  summary: string;
  metrics: { label: string; value: string }[];
  link: string;
  linkText: string;
  color: string;
  // Spatial coordinates retained for backward compatibility
  angle?: number;
  distance?: number;
  height?: number;
}

export const OBSERVATORY_STATIONS: ObservatoryStation[] = [
  {
    id: "sovereign-floor",
    name: "Sovereign Intelligence Floor",
    shortName: "Sovereign Floor",
    code: "NSO-NAS-SNA08",
    location: "New Delhi // MoSPI Central Observatory",
    category: "central",
    primaryMetric: "₹295.36L Cr",
    primaryMetricLabel: "Nominal Benchmark (Base 2022-23)",
    delta: "+9.6% YoY",
    provenance: "MoSPI National Accounts Statistics (Statement 1.1) • SHA-256 Gazette Verified",
    summary:
      "India's real gross domestic product expanded +8.2% in FY 2023-24, anchored by resilient capital formation (GFCF 33.5% of GDP) and double-deflation reconciliation of industrial manufacturing inputs.",
    metrics: [
      { label: "Real GDP Growth", value: "+8.2% YoY" },
      { label: "Implicit Deflator", value: "1.40%" },
      { label: "Services GVA Share", value: "54.2%" },
      { label: "Manufacturing Output", value: "+9.9% YoY" },
    ],
    link: "/gdp",
    linkText: "Launch Macro Accounts Workspace",
    color: "#059669",
    angle: 0,
    distance: 14,
    height: 1.5,
  },
  {
    id: "global-nexus",
    name: "Global Monetary & Trade Nexus",
    shortName: "Global Trade Nexus",
    code: "WB-ICP-2024",
    location: "Washington D.C. & Maritime Corridors",
    category: "global",
    primaryMetric: "$10.51 Trillion",
    primaryMetricLabel: "India Output (PPP Benchmark)",
    delta: "3rd Largest Globally",
    provenance: "World Bank WDI & UN System of National Accounts 2008 Chapter 15",
    summary:
      "Purchasing Power Parity conversion positioning India as the 3rd largest global economy. Methodological standard for double-deflation national income reconciliation and cross-border trade balances.",
    metrics: [
      { label: "Global PPP Rank", value: "3rd Largest" },
      { label: "Share of World GDP", value: "7.2% (PPP)" },
      { label: "Current Account Deficit", value: "-0.7% GDP" },
      { label: "Net Software Trade", value: "$32.4B / qtr" },
    ],
    link: "/global",
    linkText: "Inspect Global Nexus Telemetry",
    color: "#2563EB",
    angle: (2 * Math.PI) / 3,
    distance: 14,
    height: 1.5,
  },
  {
    id: "treasury-vault",
    name: "Central Bank Treasury & Mint",
    shortName: "Treasury Vault",
    code: "RBI-DBIE-WSS",
    location: "Mumbai // Reserve Bank of India",
    category: "treasury",
    primaryMetric: "$652.89 Billion",
    primaryMetricLabel: "Sovereign Forex Liquidity Buffer",
    delta: "11.2 Mo. Cover",
    provenance: "RBI Database on Indian Economy (Table 4) & Weekly Statistical Supplement",
    summary:
      "Strategic external liquidity reserve providing substantial cushion against currency volatility and commodity price shocks. Repo rate pegged at 6.50% to maintain real interest rate buffer.",
    metrics: [
      { label: "Policy Repo Rate", value: "6.50%" },
      { label: "External Debt / GDP", value: "18.7%" },
      { label: "Annual Remittances", value: "$120 Billion" },
      { label: "Import Coverage", value: "11.2 Months" },
    ],
    link: "/ratings",
    linkText: "Inspect Sovereign Ratings & Reserves",
    color: "#D94E34",
    angle: (4 * Math.PI) / 3,
    distance: 14,
    height: 1.5,
  },
];

interface SovereignMacroObservatoryProps {
  className?: string;
  stageHeight?: string;
}

export function SovereignMacroObservatory({
  className = "",
}: SovereignMacroObservatoryProps) {
  const [activeStationId, setActiveStationId] = useState<string>("sovereign-floor");

  const activeStation = useMemo(
    () => OBSERVATORY_STATIONS.find((s) => s.id === activeStationId) ?? OBSERVATORY_STATIONS[0],
    [activeStationId]
  );

  return (
    <div
      className={`w-full rounded-2xl border border-[rgba(20,21,23,0.14)] bg-[#0E1015] text-[#ECEBE5] shadow-xl overflow-hidden ${className}`}
    >
      {/* 1. TOP CONTROL & TELEMETRY STATUS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#14161E]/80 px-4 sm:px-6 py-3 backdrop-blur-md">
        <div className="flex items-center gap-2.5 font-mono text-[11px] text-[#ECEBE5]">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#059669] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#059669]" />
          </span>
          <span className="font-bold uppercase tracking-wider text-white">
            SOVEREIGN MACRO OBSERVATORY
          </span>
          <span className="text-white/30 hidden sm:inline">•</span>
          <span className="text-white/60 hidden sm:inline">
            CENTRAL TELEMETRY DECK // 3 DESKS
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px] text-white/50">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>OFFICIAL STATISTICAL FEEDS ACTIVE</span>
        </div>
      </div>

      {/* 2. OBSERVATORY DESKS SELECTOR TILES */}
      <div className="p-4 sm:p-6 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-white/70">
              <Compass className="h-4 w-4 text-emerald-400" />
              <span>MACROECONOMIC DESKS</span>
            </div>
            <span className="font-mono text-[10px] text-white/40">
              SELECT DESK TO FOCUS TELEMETRY
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {OBSERVATORY_STATIONS.map((station) => {
              const isSelected = activeStationId === station.id;
              return (
                <button
                  key={station.id}
                  onClick={() => setActiveStationId(station.id)}
                  aria-pressed={isSelected}
                  className={`group relative flex flex-col justify-between p-4 rounded-xl border transition-all text-left cursor-pointer ${
                    isSelected
                      ? "bg-[#181B24] border-white/30 ring-2 ring-emerald-500/80 shadow-lg"
                      : "bg-[#13151C] border-white/10 hover:border-white/20 hover:bg-[#161820]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase text-white/60">
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: station.color }}
                      />
                      <span className="truncate">{station.code}</span>
                    </div>
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>ACTIVE</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-heading text-sm font-bold text-white group-hover:text-emerald-300 transition-colors mb-2">
                    {station.name}
                  </h3>

                  <div className="flex items-baseline justify-between pt-2 border-t border-white/10 mt-auto">
                    <span className="font-heading text-base font-extrabold text-white">
                      {station.primaryMetric}
                    </span>
                    <span
                      className="font-mono text-[10px] font-semibold"
                      style={{ color: station.color }}
                    >
                      {station.delta}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. ACTIVE DESK TELEMETRY DEEP-DIVE PANEL */}
        {activeStation && (
          <div className="rounded-2xl border border-white/15 bg-[#12151D] p-5 sm:p-7 space-y-5 shadow-xl">
            {/* Active Desk Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-white/10">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: activeStation.color }}
                  />
                  <span>{activeStation.location}</span>
                  <span className="text-white/40">•</span>
                  <span className="text-white/70">{activeStation.code}</span>
                </div>
                <h2 className="font-heading text-xl sm:text-2xl font-black text-white">
                  {activeStation.name}
                </h2>
              </div>

              {/* Provenance Tag */}
              <div className="inline-flex items-center gap-1.5 self-start rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 font-mono text-[10px] font-semibold text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>OFFICIAL GAZETTE AUDITED</span>
              </div>
            </div>

            {/* Primary Headline Metric */}
            <div className="rounded-xl border border-white/10 bg-[#161922] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-wider text-white/50 mb-1">
                  {activeStation.primaryMetricLabel}
                </div>
                <div className="font-heading text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {activeStation.primaryMetric}
                </div>
              </div>
              <div className="text-left sm:text-right font-mono space-y-0.5">
                <div
                  className="text-base sm:text-lg font-bold"
                  style={{ color: activeStation.color }}
                >
                  {activeStation.delta}
                </div>
                <div className="text-[10px] text-white/40">
                  ANNUAL BENCHMARK TRAJECTORY
                </div>
              </div>
            </div>

            {/* Narrative Analytical Synthesis */}
            <div className="space-y-2">
              <div className="font-mono text-[11px] uppercase tracking-wider text-white/50">
                Analytical Desk Briefing
              </div>
              <p className="font-sans text-xs sm:text-sm text-white/80 leading-relaxed">
                {activeStation.summary}
              </p>
            </div>

            {/* Secondary Macro Metric Grid */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="font-mono text-[11px] uppercase tracking-wider text-white/50">
                Key Micro & Macro Telemetry Indicators
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {activeStation.metrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-white/10 bg-white/5 p-3 space-y-1"
                  >
                    <div className="font-mono text-[10px] uppercase text-white/50 truncate">
                      {metric.label}
                    </div>
                    <div className="font-heading text-sm sm:text-base font-bold text-white">
                      {metric.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action & Provenance Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 font-mono text-[11px] text-white/50">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="leading-snug">{activeStation.provenance}</span>
              </div>

              <Link
                href={activeStation.link}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 font-mono text-xs font-bold text-[#0E1015] hover:bg-emerald-400 hover:text-black transition-colors shrink-0 shadow-sm cursor-pointer"
              >
                <span>{activeStation.linkText}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
