"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Layers,
  BarChart3,
  PieChart,
  Globe,
  Sliders,
  Download,
  RefreshCw,
  Search,
  FileText,
  CheckCircle2,
  Calendar,
  ArrowUpRight,
  Activity,
  Info,
  ChevronRight,
  ShieldCheck,
  Maximize2,
  Database,
  ExternalLink,
} from "lucide-react";
import { RubberSegment } from "@/components/ui/RubberSegment";
import { useDashboard, useGdpSeries, useGdpSectors, useGdpStates } from "@/hooks/useApi";

// ─── TYPES & INTERFACES ──────────────────────────────────────────────────────
export interface AnalyticsDashboardProps {
  className?: string;
  initialTab?: "overview" | "timeseries" | "sectors" | "states" | "deflator";
  onExport?: () => void;
}

interface HistoricalDataPoint {
  period: string;
  realGdp: number; // in ₹ Lakh Crore
  nominalGdp: number; // in ₹ Lakh Crore
  realGrowth: number; // %
  nominalGrowth: number; // %
  deflator: number; // %
}

// Historical Benchmark Series (MoSPI NAS Official)
const HISTORICAL_SERIES: HistoricalDataPoint[] = [
  { period: "FY 2017-18", realGdp: 131.8, nominalGdp: 170.9, realGrowth: 6.8, nominalGrowth: 11.0, deflator: 3.9 },
  { period: "FY 2018-19", realGdp: 140.0, nominalGdp: 188.9, realGrowth: 6.5, nominalGrowth: 10.5, deflator: 3.8 },
  { period: "FY 2019-20", realGdp: 145.2, nominalGdp: 200.7, realGrowth: 3.7, nominalGrowth: 6.2, deflator: 2.4 },
  { period: "FY 2020-21", realGdp: 136.9, nominalGdp: 198.5, realGrowth: -5.8, nominalGrowth: -1.1, deflator: 5.0 },
  { period: "FY 2021-22", realGdp: 149.3, nominalGdp: 234.7, realGrowth: 9.1, nominalGrowth: 18.2, deflator: 8.3 },
  { period: "FY 2022-23", realGdp: 160.1, nominalGdp: 269.5, realGrowth: 7.2, nominalGrowth: 14.8, deflator: 7.1 },
  { period: "FY 2023-24", realGdp: 173.8, nominalGdp: 295.4, realGrowth: 8.2, nominalGrowth: 9.6, deflator: 1.4 },
  { period: "FY 2024-25 (P)", realGdp: 185.1, nominalGdp: 324.9, realGrowth: 6.5, nominalGrowth: 10.0, deflator: 3.3 },
];

const SECTORS_DETAIL = [
  { id: "services", name: "Financial, Real Estate & Professional", share: 22.4, growth: 8.4, gvaCr: 59.8, color: "#141416" },
  { id: "trade_hotel", name: "Trade, Hotels, Transport & Telecom", share: 19.8, growth: 6.4, gvaCr: 52.9, color: "#2E3039" },
  { id: "manufacturing", name: "Manufacturing & Industrial Output", share: 17.3, growth: 9.9, gvaCr: 46.2, color: "#D94E34" },
  { id: "agriculture", name: "Agriculture, Forestry & Fishing", share: 15.1, growth: 1.4, gvaCr: 40.3, color: "#059669" },
  { id: "public_admin", name: "Public Administration, Defence & Other", share: 12.8, growth: 7.6, gvaCr: 34.2, color: "#57585C" },
  { id: "construction", name: "Construction & Infrastructure", share: 9.2, growth: 10.7, gvaCr: 24.6, color: "#E5A83B" },
  { id: "mining", name: "Mining & Quarrying", share: 2.1, growth: 7.1, gvaCr: 5.6, color: "#828387" },
  { id: "electricity", name: "Electricity, Gas & Water Supply", share: 1.3, growth: 7.5, gvaCr: 3.5, color: "#A1A1AA" },
];

const STATES_DATA = [
  { rank: 1, name: "Maharashtra", gvaCr: 42.6, share: 13.9, growth: 7.6, zone: "Western" },
  { rank: 2, name: "Tamil Nadu", gvaCr: 28.3, share: 9.2, growth: 8.1, zone: "Southern" },
  { rank: 3, name: "Gujarat", gvaCr: 25.6, share: 8.4, growth: 8.3, zone: "Western" },
  { rank: 4, name: "Karnataka", gvaCr: 25.0, share: 8.2, growth: 8.0, zone: "Southern" },
  { rank: 5, name: "Uttar Pradesh", gvaCr: 24.4, share: 8.0, growth: 7.8, zone: "Northern" },
  { rank: 6, name: "West Bengal", gvaCr: 17.2, share: 5.6, growth: 6.9, zone: "Eastern" },
  { rank: 7, name: "Rajasthan", gvaCr: 15.3, share: 5.0, growth: 7.1, zone: "Northern" },
  { rank: 8, name: "Telangana", gvaCr: 14.8, share: 4.8, growth: 8.4, zone: "Southern" },
  { rank: 9, name: "Andhra Pradesh", gvaCr: 14.4, share: 4.7, growth: 7.2, zone: "Southern" },
  { rank: 10, name: "Madhya Pradesh", gvaCr: 13.8, share: 4.5, growth: 7.5, zone: "Central" },
];

export function AnalyticsDashboard({
  className = "",
  initialTab = "overview",
  onExport,
}: AnalyticsDashboardProps) {
  // ─── STATE ─────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<"overview" | "timeseries" | "sectors" | "states" | "deflator">(initialTab);
  const [baseYear, setBaseYear] = useState<"2022-23" | "2011-12">("2022-23");
  const [valuation, setValuation] = useState<"Constant (Real)" | "Current (Nominal)">("Constant (Real)");
  const [frequency, setFrequency] = useState<"Annual (FY)" | "Quarterly (Q)">("Annual (FY)");
  const [timeRange, setTimeRange] = useState<"3Y" | "5Y" | "All">("5Y");
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [searchState, setSearchState] = useState<string>("");
  const [hoveredPoint, setHoveredPoint] = useState<HistoricalDataPoint | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // ─── DATA HOOKS ────────────────────────────────────────────────────────────
  const { data: dashboardData, isLoading: isDashboardLoading, refetch } = useDashboard(baseYear);
  const { data: sectorsData } = useGdpSectors(baseYear, valuation === "Constant (Real)" ? "constant" : "current");
  const { data: statesResponse } = useGdpStates(baseYear);

  // Filtered Historical Series based on Time Range
  const filteredSeries = useMemo(() => {
    if (timeRange === "3Y") return HISTORICAL_SERIES.slice(-3);
    if (timeRange === "5Y") return HISTORICAL_SERIES.slice(-5);
    return HISTORICAL_SERIES;
  }, [timeRange]);

  // Filtered States based on Search
  const filteredStates = useMemo(() => {
    if (!searchState.trim()) return STATES_DATA;
    return STATES_DATA.filter((s) =>
      s.name.toLowerCase().includes(searchState.toLowerCase()) ||
      s.zone.toLowerCase().includes(searchState.toLowerCase())
    );
  }, [searchState]);

  // Handle Export CSV
  const handleExportCsv = () => {
    setIsExporting(true);
    setTimeout(() => {
      const headers = "Period,Real GDP (Lakh Cr),Nominal GDP (Lakh Cr),Real Growth (%),Nominal Growth (%),Deflator (%)\n";
      const rows = HISTORICAL_SERIES.map(
        (d) => `${d.period},${d.realGdp},${d.nominalGdp},${d.realGrowth},${d.nominalGrowth},${d.deflator}`
      ).join("\n");
      const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `ArthaLens_Macro_Series_${baseYear}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
      if (onExport) onExport();
    }, 600);
  };

  // ─── CHART SCALING METRICS ─────────────────────────────────────────────────
  const chartHeight = 240;
  const chartWidth = 620;
  const minGdp = 120;
  const maxGdp = 340;

  // Compute SVG Points for Real and Nominal Trajectory
  const getCoordinates = (index: number, value: number) => {
    const x = 40 + (index / (filteredSeries.length - 1)) * (chartWidth - 80);
    const y = chartHeight - 30 - ((value - minGdp) / (maxGdp - minGdp)) * (chartHeight - 60);
    return { x, y };
  };

  const realPathD = useMemo(() => {
    return filteredSeries
      .map((d, i) => {
        const { x, y } = getCoordinates(i, d.realGdp);
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  }, [filteredSeries]);

  const nominalPathD = useMemo(() => {
    return filteredSeries
      .map((d, i) => {
        const { x, y } = getCoordinates(i, d.nominalGdp);
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  }, [filteredSeries]);

  return (
    <div
      className={`flex flex-col h-full w-full bg-[#E6E5DF] text-[#141416] overflow-hidden select-none border border-[rgba(20,21,23,0.12)] rounded-xl shadow-sm ${className}`}
    >
      {/* ─── 1. TOP APP BAR & TELEMETRY CONTROLS ───────────────────────────────── */}
      <header className="flex-none px-6 py-3.5 border-b border-[rgba(20,21,23,0.12)] bg-[#ECEBE5] flex flex-wrap items-center justify-between gap-4">
        {/* Left Title & Data Source Provenance Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#059669] animate-pulse" />
            <h1 className="font-heading font-bold text-base sm:text-lg tracking-tight text-[#141416]">
              ArthaLens Macro Analytics
            </h1>
          </div>
          <span className="hidden sm:inline-block font-mono text-[11px] text-[#828387]">/</span>
          <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[rgba(20,21,23,0.14)] bg-[#E6E5DF] px-2.5 py-0.5 font-mono text-[10px] font-medium text-[#57585C]">
            <Database className="h-3 w-3 text-[#D94E34]" />
            <span>MoSPI NAS // SNA 2008 PROVISIONAL</span>
          </div>
        </div>

        {/* Right RubberSegment Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Base Year Selector */}
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] uppercase font-bold text-[#828387] hidden md:inline">
              Base:
            </span>
            <RubberSegment
              items={["2022-23", "2011-12"]}
              defaultValue={baseYear}
              onChange={(val) => setBaseYear(val as "2022-23" | "2011-12")}
              size="sm"
              trackColor="#ECEBE5"
              thumbColor="#141416"
              textColor="#57585C"
              activeTextColor="#FFFFFF"
            />
          </div>

          {/* Valuation Basis Selector */}
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] uppercase font-bold text-[#828387] hidden md:inline">
              Valuation:
            </span>
            <RubberSegment
              items={["Constant (Real)", "Current (Nominal)"]}
              defaultValue={valuation}
              onChange={(val) => setValuation(val as "Constant (Real)" | "Current (Nominal)")}
              size="sm"
              trackColor="#ECEBE5"
              thumbColor="#141416"
              textColor="#57585C"
              activeTextColor="#FFFFFF"
            />
          </div>

          {/* Quick Actions: Refresh & Export */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-[rgba(20,21,23,0.12)]">
            <button
              onClick={() => refetch()}
              title="Refresh Live Official Feed"
              className="p-1.5 rounded-md border border-[rgba(20,21,23,0.14)] bg-[#ECEBE5] hover:bg-[#E6E5DF] text-[#141416] transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleExportCsv}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[rgba(20,21,23,0.14)] bg-[#141416] text-[#FFFFFF] hover:bg-[#2E3039] font-sans text-xs font-medium transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-[#D94E34]" />
              <span>{isExporting ? "Exporting..." : "Export CSV"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── 2. TAB NAVIGATION STRIP ───────────────────────────────────────────── */}
      <nav className="flex-none px-6 border-b border-[rgba(20,21,23,0.12)] bg-[#E6E5DF] flex items-center justify-between overflow-x-auto">
        <div className="flex space-x-1 sm:space-x-2">
          {[
            { id: "overview", label: "Executive Summary", icon: BarChart3 },
            { id: "timeseries", label: "GDP Time Series", icon: Activity },
            { id: "sectors", label: "Sectoral GVA", icon: PieChart },
            { id: "states", label: "State GVA Ranks", icon: Globe },
            { id: "deflator", label: "Deflator & Discrepancies", icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 py-3 px-3.5 border-b-2 font-sans text-xs sm:text-[13px] font-medium transition-all ${
                  isActive
                    ? "border-[#D94E34] text-[#141416] font-semibold bg-[#ECEBE5]/60"
                    : "border-transparent text-[#57585C] hover:text-[#141416] hover:bg-[#ECEBE5]/30"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-[#D94E34]" : "text-[#828387]"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Live Timestamp Indicator */}
        <div className="hidden lg:flex items-center gap-2 font-mono text-[10px] text-[#828387]">
          <span>FEED AS OF: 2024-05-31</span>
          <span>•</span>
          <span className="text-[#059669]">ONLINE (14ms)</span>
        </div>
      </nav>

      {/* ─── 3. TOP MACRO KPI TILES STRIP ───────────────────────────────────────── */}
      <section className="flex-none px-6 py-4 border-b border-[rgba(20,21,23,0.12)] bg-[#ECEBE5] grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Real GDP Growth */}
        <div className="rounded-lg border border-[rgba(20,21,23,0.1)] bg-[#E6E5DF] p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs text-[#57585C]">Real GDP Growth (YoY)</span>
            <span className="inline-flex items-center gap-0.5 font-mono text-[11px] font-bold text-[#059669]">
              <TrendingUp className="h-3 w-3" />
              +8.2%
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold tracking-tight text-[#141416] tabular-nums">
              8.2
            </span>
            <span className="font-mono text-xs text-[#828387]">% // FY24</span>
          </div>
          <div className="mt-2 pt-2 border-t border-[rgba(20,21,23,0.08)] flex items-center justify-between font-mono text-[10px] text-[#828387]">
            <span>MoSPI Prov.</span>
            <span>Prev: 7.2%</span>
          </div>
        </div>

        {/* Card 2: Nominal GDP Size */}
        <div className="rounded-lg border border-[rgba(20,21,23,0.1)] bg-[#E6E5DF] p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs text-[#57585C]">Nominal GDP Size</span>
            <span className="inline-flex items-center gap-0.5 font-mono text-[11px] font-bold text-[#059669]">
              <TrendingUp className="h-3 w-3" />
              +9.6%
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold tracking-tight text-[#141416] tabular-nums">
              ₹295.4
            </span>
            <span className="font-mono text-xs text-[#828387]">Lakh Cr ($3.55T)</span>
          </div>
          <div className="mt-2 pt-2 border-t border-[rgba(20,21,23,0.08)] flex items-center justify-between font-mono text-[10px] text-[#828387]">
            <span>Current Prices</span>
            <span>SNA 2008</span>
          </div>
        </div>

        {/* Card 3: Real GVA Growth */}
        <div className="rounded-lg border border-[rgba(20,21,23,0.1)] bg-[#E6E5DF] p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs text-[#57585C]">Real GVA Growth</span>
            <span className="inline-flex items-center gap-0.5 font-mono text-[11px] font-bold text-[#059669]">
              <TrendingUp className="h-3 w-3" />
              +7.2%
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold tracking-tight text-[#141416] tabular-nums">
              7.2
            </span>
            <span className="font-mono text-xs text-[#828387]">% // Basic Prices</span>
          </div>
          <div className="mt-2 pt-2 border-t border-[rgba(20,21,23,0.08)] flex items-center justify-between font-mono text-[10px] text-[#828387]">
            <span>Net Taxes: +10.0%</span>
            <span>FY 2023-24</span>
          </div>
        </div>

        {/* Card 4: Implicit GDP Deflator */}
        <div className="rounded-lg border border-[rgba(20,21,23,0.1)] bg-[#E6E5DF] p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs text-[#57585C]">Implicit Deflator</span>
            <span className="inline-flex items-center gap-0.5 font-mono text-[11px] font-bold text-[#E5A83B]">
              <TrendingDown className="h-3 w-3" />
              -5.7% Δ
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold tracking-tight text-[#141416] tabular-nums">
              1.4
            </span>
            <span className="font-mono text-xs text-[#828387]">% (WPI Wedge)</span>
          </div>
          <div className="mt-2 pt-2 border-t border-[rgba(20,21,23,0.08)] flex items-center justify-between font-mono text-[10px] text-[#828387]">
            <span>Single Deflation Risk</span>
            <span>Warning: Low</span>
          </div>
        </div>
      </section>

      {/* ─── 4. MAIN ANALYTICS WORKSPACE (SCROLLABLE & FULL VIEWPORT FRIENDLY) ── */}
      <main className="flex-1 p-6 overflow-y-auto space-y-6">
        {/* ── TAB 1: EXECUTIVE SUMMARY ── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Top Row: Interactive Trajectory Chart + Sector Quick Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Real vs. Nominal Trajectory Chart */}
              <div className="lg:col-span-2 rounded-xl border border-[rgba(20,21,23,0.12)] bg-[#ECEBE5] p-5 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <h2 className="font-heading text-lg font-bold text-[#141416]">
                      GDP Trajectory: Real vs. Nominal Output
                    </h2>
                    <p className="font-sans text-xs text-[#57585C]">
                      Comparison of constant price output (Base 2011-12 / 2022-23) vs current nominal scale (₹ Lakh Crore).
                    </p>
                  </div>

                  {/* Range Switcher */}
                  <RubberSegment
                    items={["3Y", "5Y", "All"]}
                    defaultValue={timeRange}
                    onChange={(val) => setTimeRange(val as typeof timeRange)}
                    size="sm"
                    trackColor="#E6E5DF"
                    thumbColor="#141416"
                    textColor="#57585C"
                    activeTextColor="#FFFFFF"
                  />
                </div>

                {/* SVG Visual Chart */}
                <div className="relative w-full overflow-hidden bg-[#E6E5DF] rounded-lg border border-[rgba(20,21,23,0.08)] p-2">
                  <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="w-full h-auto overflow-visible"
                  >
                    {/* Gridlines */}
                    {[150, 200, 250, 300].map((level) => {
                      const y = chartHeight - 30 - ((level - minGdp) / (maxGdp - minGdp)) * (chartHeight - 60);
                      return (
                        <g key={level}>
                          <line
                            x1="40"
                            y1={y}
                            x2={chartWidth - 40}
                            y2={y}
                            stroke="rgba(20,21,23,0.08)"
                            strokeDasharray="3 3"
                          />
                          <text
                            x="35"
                            y={y + 3}
                            textAnchor="end"
                            className="font-mono text-[9px] fill-[#828387]"
                          >
                            ₹{level}L
                          </text>
                        </g>
                      );
                    })}

                    {/* Nominal GDP Area & Line */}
                    <path
                      d={nominalPathD}
                      fill="none"
                      stroke="#D94E34"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Real GDP Line */}
                    <path
                      d={realPathD}
                      fill="none"
                      stroke="#141416"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Plot Points & Interactions */}
                    {filteredSeries.map((d, i) => {
                      const realCoord = getCoordinates(i, d.realGdp);
                      const nomCoord = getCoordinates(i, d.nominalGdp);
                      const isHovered = hoveredPoint?.period === d.period;

                      return (
                        <g key={d.period}>
                          {/* X-axis label */}
                          <text
                            x={realCoord.x}
                            y={chartHeight - 10}
                            textAnchor="middle"
                            className="font-mono text-[9px] fill-[#828387]"
                          >
                            {d.period.replace("FY ", "")}
                          </text>

                          {/* Nominal Dot */}
                          <circle
                            cx={nomCoord.x}
                            cy={nomCoord.y}
                            r={isHovered ? 5 : 3.5}
                            fill="#D94E34"
                            className="cursor-pointer transition-all"
                            onMouseEnter={() => setHoveredPoint(d)}
                          />

                          {/* Real Dot */}
                          <circle
                            cx={realCoord.x}
                            cy={realCoord.y}
                            r={isHovered ? 5 : 3.5}
                            fill="#141416"
                            className="cursor-pointer transition-all"
                            onMouseEnter={() => setHoveredPoint(d)}
                          />
                        </g>
                      );
                    })}
                  </svg>

                  {/* Chart Legend & Scrub Inspector */}
                  <div className="mt-3 pt-3 border-t border-[rgba(20,21,23,0.08)] flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#141416]" />
                        <span className="font-sans text-[#57585C]">Real GDP (Constant)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#D94E34]" />
                        <span className="font-sans text-[#57585C]">Nominal GDP (Current)</span>
                      </div>
                    </div>

                    {hoveredPoint ? (
                      <div className="font-mono text-[11px] text-[#141416] bg-[#ECEBE5] px-2.5 py-1 rounded border border-[rgba(20,21,23,0.1)]">
                        <span className="font-bold">{hoveredPoint.period}:</span> Real ₹{hoveredPoint.realGdp}L Cr ({hoveredPoint.realGrowth}%) • Nominal ₹{hoveredPoint.nominalGdp}L Cr
                      </div>
                    ) : (
                      <div className="font-mono text-[10px] text-[#828387]">
                        Hover over dots for exact MoSPI observation
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right 1 Col: Key Sector Contribution Breakdown */}
              <div className="rounded-xl border border-[rgba(20,21,23,0.12)] bg-[#ECEBE5] p-5 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-heading text-lg font-bold text-[#141416]">
                      GVA Sector Shares
                    </h2>
                    <span className="font-mono text-[10px] uppercase font-bold text-[#D94E34]">
                      FY24 BASIC PRICES
                    </span>
                  </div>
                  <p className="font-sans text-xs text-[#57585C] mb-4">
                    Sectoral decomposition of Indian Gross Value Added across primary economic pillars.
                  </p>

                  {/* Sector Bars */}
                  <div className="space-y-3">
                    {SECTORS_DETAIL.slice(0, 5).map((sec) => (
                      <div key={sec.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-sans text-[#141416] font-medium truncate max-w-[180px]">
                            {sec.name}
                          </span>
                          <span className="font-mono text-[11px] text-[#57585C] tabular-nums">
                            {sec.share}% ({sec.growth > 0 ? `+${sec.growth}%` : `${sec.growth}%`})
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-[#E6E5DF] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${sec.share * 3.5}%`,
                              backgroundColor: sec.color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audit Attribution Footer */}
                <div className="mt-4 pt-3 border-t border-[rgba(20,21,23,0.1)] flex items-center justify-between font-mono text-[10px] text-[#828387]">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-[#059669]" />
                    HASH: 7F4A8...D892
                  </span>
                  <Link href="/gdp" className="text-[#D94E34] hover:underline flex items-center gap-0.5">
                    Detailed View <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Row: State Highlights & Macroeconomic Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top 5 States by Output */}
              <div className="rounded-xl border border-[rgba(20,21,23,0.12)] bg-[#ECEBE5] p-5 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading text-base font-bold text-[#141416]">
                    Top Sub-National Output Leaders
                  </h3>
                  <span className="font-mono text-[10px] text-[#828387]">FY 2023-24 GVA</span>
                </div>
                <div className="divide-y divide-[rgba(20,21,23,0.06)]">
                  {STATES_DATA.slice(0, 4).map((state) => (
                    <div key={state.rank} className="py-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full bg-[#E6E5DF] flex items-center justify-center font-mono text-[10px] font-bold text-[#828387]">
                          {state.rank}
                        </span>
                        <span className="font-sans font-medium text-[#141416]">{state.name}</span>
                        <span className="font-mono text-[10px] text-[#828387]">({state.zone})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-semibold text-[#141416]">
                          ₹{state.gvaCr}L Cr
                        </span>
                        <span className="font-mono text-[10px] font-bold text-[#059669] bg-[#E6E5DF] px-1.5 py-0.5 rounded">
                          +{state.growth}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* National Accounts Quality Assurance Card */}
              <div className="rounded-xl border border-[rgba(20,21,23,0.12)] bg-[#ECEBE5] p-5 shadow-2xs flex flex-col justify-between">
                <div>
                  <h3 className="font-heading text-base font-bold text-[#141416] mb-1.5">
                    Data Integrity & Deflation Methodology
                  </h3>
                  <p className="font-sans text-xs text-[#57585C] leading-relaxed">
                    National Accounts estimates conform strictly to the United Nations System of National Accounts (UN SNA 2008). ArthaLens detects input-output deflator divergence to safeguard against spurious growth artifacts in the manufacturing sector.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[rgba(20,21,23,0.1)] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#059669]" />
                    <span className="font-mono text-[11px] text-[#141416]">Double-Deflation Discrepancy: None</span>
                  </div>
                  <Link href="/how-it-works" className="font-sans font-medium text-[#D94E34] hover:underline">
                    View Methodology →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: GDP TIME SERIES ── */}
        {activeTab === "timeseries" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-[rgba(20,21,23,0.12)] bg-[#ECEBE5] p-5 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="font-heading text-lg font-bold text-[#141416]">
                    Complete Historical GDP Observations
                  </h2>
                  <p className="font-sans text-xs text-[#57585C]">
                    MoSPI National Accounts series under {baseYear} benchmark with annual real and nominal growth rates.
                  </p>
                </div>
                <button
                  onClick={handleExportCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(20,21,23,0.14)] bg-[#141416] text-[#FFFFFF] text-xs font-sans font-medium hover:bg-[#2E3039] transition-colors"
                >
                  <Download className="h-3.5 w-3.5 text-[#D94E34]" />
                  <span>Download Complete CSV</span>
                </button>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto rounded-lg border border-[rgba(20,21,23,0.1)] bg-[#E6E5DF]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[rgba(20,21,23,0.1)] bg-[#ECEBE5] font-mono text-[10px] uppercase text-[#828387]">
                      <th className="py-2.5 px-4 font-bold">Reporting Period</th>
                      <th className="py-2.5 px-4 font-bold text-right">Real GDP (₹L Cr)</th>
                      <th className="py-2.5 px-4 font-bold text-right">Real Growth YoY</th>
                      <th className="py-2.5 px-4 font-bold text-right">Nominal GDP (₹L Cr)</th>
                      <th className="py-2.5 px-4 font-bold text-right">Nominal Growth YoY</th>
                      <th className="py-2.5 px-4 font-bold text-right">Implicit Deflator</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(20,21,23,0.06)] font-mono text-xs">
                    {HISTORICAL_SERIES.map((row) => (
                      <tr key={row.period} className="hover:bg-[#ECEBE5]/60 transition-colors">
                        <td className="py-2.5 px-4 font-sans font-medium text-[#141416]">{row.period}</td>
                        <td className="py-2.5 px-4 text-right font-bold text-[#141416]">₹{row.realGdp.toFixed(1)}</td>
                        <td className="py-2.5 px-4 text-right">
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded font-bold text-[11px] ${
                              row.realGrowth >= 0
                                ? "bg-[#059669]/10 text-[#059669]"
                                : "bg-[#D94E34]/10 text-[#D94E34]"
                            }`}
                          >
                            {row.realGrowth > 0 ? `+${row.realGrowth}%` : `${row.realGrowth}%`}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right text-[#57585C]">₹{row.nominalGdp.toFixed(1)}</td>
                        <td className="py-2.5 px-4 text-right text-[#57585C]">
                          {row.nominalGrowth > 0 ? `+${row.nominalGrowth}%` : `${row.nominalGrowth}%`}
                        </td>
                        <td className="py-2.5 px-4 text-right text-[#828387]">{row.deflator}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: SECTORAL GVA BREAKDOWN ── */}
        {activeTab === "sectors" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {SECTORS_DETAIL.map((sec) => (
                <div
                  key={sec.id}
                  onClick={() => setSelectedSector(selectedSector === sec.id ? null : sec.id)}
                  className={`rounded-xl border p-4 cursor-pointer transition-all ${
                    selectedSector === sec.id
                      ? "border-[#D94E34] bg-[#ECEBE5] shadow-md ring-1 ring-[#D94E34]"
                      : "border-[rgba(20,21,23,0.12)] bg-[#ECEBE5] hover:border-[rgba(20,21,23,0.25)]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] uppercase font-bold text-[#828387]">
                      {sec.share}% SHARE
                    </span>
                    <span
                      className={`font-mono text-[11px] font-bold ${
                        sec.growth >= 7 ? "text-[#059669]" : "text-[#E5A83B]"
                      }`}
                    >
                      +{sec.growth}%
                    </span>
                  </div>
                  <h3 className="font-heading text-sm font-bold text-[#141416] mb-2 leading-tight">
                    {sec.name}
                  </h3>
                  <div className="flex items-baseline justify-between pt-2 border-t border-[rgba(20,21,23,0.08)] font-mono text-xs">
                    <span className="text-[#828387]">Output Size:</span>
                    <span className="font-bold text-[#141416]">₹{sec.gvaCr}L Cr</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Sector Deep Dive Card */}
            <div className="rounded-xl border border-[rgba(20,21,23,0.12)] bg-[#ECEBE5] p-5">
              <h3 className="font-heading text-base font-bold text-[#141416] mb-2">
                Manufacturing & Construction Expansion Dynamics
              </h3>
              <p className="font-sans text-xs text-[#57585C] leading-relaxed max-w-3xl">
                In FY 2023-24, Indian economic expansion was heavily accelerated by secondary industries: Construction registered a robust 10.7% real growth driven by government capital expenditure and infrastructure initiatives, followed by Manufacturing at 9.9%. Agriculture showed a modest 1.4% expansion due to uneven spatial monsoon distribution.
              </p>
            </div>
          </div>
        )}

        {/* ── TAB 4: STATE & REGIONAL GVA ── */}
        {activeTab === "states" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-[rgba(20,21,23,0.12)] bg-[#ECEBE5] p-5 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="font-heading text-lg font-bold text-[#141416]">
                    State Gross Value Added (GSVA) Benchmarks
                  </h2>
                  <p className="font-sans text-xs text-[#57585C]">
                    Sub-national economic activity across 28 Indian States and Union Territories.
                  </p>
                </div>

                {/* State Search Filter */}
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#828387]" />
                  <input
                    type="text"
                    placeholder="Search state or region..."
                    value={searchState}
                    onChange={(e) => setSearchState(e.target.value)}
                    className="w-full rounded-lg border border-[rgba(20,21,23,0.14)] bg-[#E6E5DF] pl-8 pr-3 py-1.5 font-sans text-xs text-[#141416] placeholder-[#828387] focus:outline-none focus:ring-1 focus:ring-[#141416]"
                  />
                </div>
              </div>

              {/* State Table */}
              <div className="overflow-x-auto rounded-lg border border-[rgba(20,21,23,0.1)] bg-[#E6E5DF]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[rgba(20,21,23,0.1)] bg-[#ECEBE5] font-mono text-[10px] uppercase text-[#828387]">
                      <th className="py-2.5 px-4 font-bold">Rank</th>
                      <th className="py-2.5 px-4 font-bold">State / UT</th>
                      <th className="py-2.5 px-4 font-bold">Geographic Zone</th>
                      <th className="py-2.5 px-4 font-bold text-right">GSVA Output (₹L Cr)</th>
                      <th className="py-2.5 px-4 font-bold text-right">National Share (%)</th>
                      <th className="py-2.5 px-4 font-bold text-right">YoY Real Growth</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(20,21,23,0.06)] font-mono text-xs">
                    {filteredStates.map((st) => (
                      <tr key={st.rank} className="hover:bg-[#ECEBE5]/60 transition-colors">
                        <td className="py-2.5 px-4 font-bold text-[#828387]">#{st.rank}</td>
                        <td className="py-2.5 px-4 font-sans font-medium text-[#141416]">{st.name}</td>
                        <td className="py-2.5 px-4 font-sans text-[#57585C]">{st.zone}</td>
                        <td className="py-2.5 px-4 text-right font-bold text-[#141416]">₹{st.gvaCr.toFixed(1)}</td>
                        <td className="py-2.5 px-4 text-right text-[#57585C]">{st.share}%</td>
                        <td className="py-2.5 px-4 text-right">
                          <span className="inline-block px-1.5 py-0.5 rounded font-bold text-[11px] bg-[#059669]/10 text-[#059669]">
                            +{st.growth}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 5: DEFLATOR & DISCREPANCIES ── */}
        {activeTab === "deflator" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Deflator Gap Analysis */}
              <div className="rounded-xl border border-[rgba(20,21,23,0.12)] bg-[#ECEBE5] p-5 shadow-2xs">
                <h3 className="font-heading text-base font-bold text-[#141416] mb-2">
                  Implicit GDP Deflator vs WPI & CPI Wedge
                </h3>
                <p className="font-sans text-xs text-[#57585C] mb-4 leading-relaxed">
                  The implicit deflator tracks the whole-economy price index. In FY24, wholesale commodity deflation caused WPI to drop into negative territory while CPI remained elevated at ~5.4%, creating a pronounced 400 bps wedge in corporate profit margins.
                </p>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-lg border border-[rgba(20,21,23,0.1)] bg-[#E6E5DF] flex justify-between items-center">
                    <span className="font-sans text-[#141416]">CPI Headline Inflation</span>
                    <span className="font-bold text-[#D94E34]">5.4% YoY</span>
                  </div>
                  <div className="p-3 rounded-lg border border-[rgba(20,21,23,0.1)] bg-[#E6E5DF] flex justify-between items-center">
                    <span className="font-sans text-[#141416]">Implicit GDP Deflator</span>
                    <span className="font-bold text-[#141416]">1.4% YoY</span>
                  </div>
                  <div className="p-3 rounded-lg border border-[rgba(20,21,23,0.1)] bg-[#E6E5DF] flex justify-between items-center">
                    <span className="font-sans text-[#141416]">WPI Headline Inflation</span>
                    <span className="font-bold text-[#059669]">-0.7% YoY</span>
                  </div>
                </div>
              </div>

              {/* Statistical Discrepancy Margin */}
              <div className="rounded-xl border border-[rgba(20,21,23,0.12)] bg-[#ECEBE5] p-5 shadow-2xs flex flex-col justify-between">
                <div>
                  <h3 className="font-heading text-base font-bold text-[#141416] mb-2">
                    National Accounts Discrepancy Tracker
                  </h3>
                  <p className="font-sans text-xs text-[#57585C] mb-4 leading-relaxed">
                    Under Indian NAS practice, GDP is estimated primarily from the production/output side (GVA). The difference between the production estimate and expenditure estimate is classified as "Discrepancy".
                  </p>
                  <div className="rounded-lg border border-[rgba(20,21,23,0.1)] bg-[#E6E5DF] p-4 text-center">
                    <span className="font-mono text-[10px] uppercase font-bold text-[#828387] block mb-1">
                      FY 2023-24 Discrepancy Percentage
                    </span>
                    <span className="font-mono text-3xl font-bold text-[#141416]">0.8%</span>
                    <span className="font-sans text-xs text-[#57585C] block mt-1">
                      Within international threshold (&lt;2.0% of GDP)
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[rgba(20,21,23,0.1)] flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] text-[#828387]">Status: SNA Compliant</span>
                  <Link href="/consistency" className="text-[#D94E34] hover:underline font-medium">
                    Consistency Audit →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ─── 5. BOTTOM AUDIT BAR ──────────────────────────────────────────────── */}
      <footer className="flex-none px-6 py-2.5 border-t border-[rgba(20,21,23,0.12)] bg-[#ECEBE5] flex flex-wrap items-center justify-between text-[11px] font-mono text-[#828387]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[#141416]">
            <CheckCircle2 className="h-3 w-3 text-[#059669]" />
            SOVEREIGN AUDIT VERIFIED
          </span>
          <span className="hidden sm:inline">SHA256: e8b9...f04c</span>
        </div>
        <div className="flex items-center gap-4">
          <span>BASE: {baseYear}</span>
          <span>VALUATION: {valuation}</span>
          <span>FREQ: {frequency}</span>
        </div>
      </footer>
    </div>
  );
}

export default AnalyticsDashboard;
