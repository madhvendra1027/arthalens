"use client";

import React, { useMemo, useState, useCallback } from "react";
import {
  LineChart,
  Line,
  Grid,
  XAxis,
  ChartTooltip,
  ChartMarkers,
  ProjectionLine,
  SegmentBackground,
  SegmentLineFrom,
  SegmentLineTo,
  ChartBrushLayout,
  ChartBrush,
  type ChartMarker,
} from "@bklitui/ui/charts";
import type { GdpObservation } from "@/lib/api";

export type TimeRangeOption = "3Y" | "5Y" | "ALL";
export type SeriesMetricOption = "gdp" | "growth" | "both";

export interface BklitGdpLineChartProps {
  /** Array of GDP observations from MoSPI/RBI API */
  data?: GdpObservation[];
  /** Chart headline title */
  title?: string;
  /** Subtitle or source note */
  subtitle?: string;
  /** Base year string (e.g. "2022-23" or "2011-12") */
  baseYear?: string;
  /** Price valuation basis */
  priceType?: "constant" | "current";
  /** Loading state flag */
  isLoading?: boolean;
  /** Error state object or error message */
  error?: Error | string | null;
  /** Retry callback if fetching fails */
  onRetry?: () => void;
  /** Whether to show YoY growth rate by default */
  showGrowth?: boolean;
  /** Show forward economic projections (RBI / MoSPI estimates) */
  enableProjections?: boolean;
  /** Allow interactive brush selection */
  enableBrush?: boolean;
  /** Additional container styling */
  className?: string;
}

/**
 * Standard baseline historical observations if offline or pending initial ingest
 */
const DEFAULT_HISTORICAL_GDP: GdpObservation[] = [
  { id: "h1", period: "2014-15", periodType: "FY", valueCrore: 10527674, unit: "INR Crore", priceType: "constant", growthRateYoy: 7.4, baseYear: "2022-23", status: "official" },
  { id: "h2", period: "2015-16", periodType: "FY", valueCrore: 11369493, unit: "INR Crore", priceType: "constant", growthRateYoy: 8.0, baseYear: "2022-23", status: "official" },
  { id: "h3", period: "2016-17", periodType: "FY", valueCrore: 12308193, unit: "INR Crore", priceType: "constant", growthRateYoy: 8.3, baseYear: "2022-23", status: "official" },
  { id: "h4", period: "2017-18", periodType: "FY", valueCrore: 13144582, unit: "INR Crore", priceType: "constant", growthRateYoy: 6.8, baseYear: "2022-23", status: "official" },
  { id: "h5", period: "2018-19", periodType: "FY", valueCrore: 13992914, unit: "INR Crore", priceType: "constant", growthRateYoy: 6.5, baseYear: "2022-23", status: "official" },
  { id: "h6", period: "2019-20", periodType: "FY", valueCrore: 14516000, unit: "INR Crore", priceType: "constant", growthRateYoy: 3.9, baseYear: "2022-23", status: "official" },
  { id: "h7", period: "2020-21", periodType: "FY", valueCrore: 13687000, unit: "INR Crore", priceType: "constant", growthRateYoy: -5.8, baseYear: "2022-23", status: "official" },
  { id: "h8", period: "2021-22", periodType: "FY", valueCrore: 14925000, unit: "INR Crore", priceType: "constant", growthRateYoy: 9.1, baseYear: "2022-23", status: "official" },
  { id: "h9", period: "2022-23", periodType: "FY", valueCrore: 16071000, unit: "INR Crore", priceType: "constant", growthRateYoy: 7.2, baseYear: "2022-23", status: "official" },
  { id: "h10", period: "2023-24", periodType: "FY", valueCrore: 17382000, unit: "INR Crore", priceType: "constant", growthRateYoy: 8.2, baseYear: "2022-23", status: "official" },
];

/**
 * Parses Indian FY strings (e.g. "2022-23", "FY 2023-24") or Quarterly periods into valid JavaScript Date
 */
function parsePeriodToDate(periodStr: string): Date {
  const clean = periodStr.replace(/^FY\s*/i, "").trim();

  // Quarterly formats: "Q1 2023-24", "2023-24-Q1", "2023-Q1"
  const qMatch = clean.match(/Q([1-4])\s*(\d{4})|(\d{4})(?:-\d{2,4})?[-_\s]*Q([1-4])/i);
  if (qMatch) {
    const qNum = parseInt(qMatch[1] || qMatch[4], 10);
    const year = parseInt(qMatch[2] || qMatch[3], 10);
    // Indian FY: Q1 = Apr, Q2 = Jul, Q3 = Oct, Q4 = Jan (following calendar year)
    if (qNum === 1) return new Date(year, 3, 1);
    if (qNum === 2) return new Date(year, 6, 1);
    if (qNum === 3) return new Date(year, 9, 1);
    if (qNum === 4) return new Date(year + 1, 0, 1);
  }

  // Financial Year format: "2022-23" or "2022"
  const fyMatch = clean.match(/^(\d{4})/);
  if (fyMatch) {
    const startYear = parseInt(fyMatch[1], 10);
    // Financial year starts April 1st
    return new Date(startYear, 3, 1);
  }

  // Direct ISO date fallback
  const directDate = new Date(periodStr);
  if (!isNaN(directDate.getTime())) {
    return directDate;
  }

  // Graceful fallback
  return new Date();
}

/**
 * Formats Lakh Crore values into clean Indian currency notations
 */
function formatLakhCrore(lakhCroreVal: number): string {
  return `₹${lakhCroreVal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} L Cr`;
}

export function BklitGdpLineChart({
  data,
  title,
  subtitle,
  baseYear = "2022-23",
  priceType = "constant",
  isLoading = false,
  error = null,
  onRetry,
  showGrowth = true,
  enableProjections = true,
  enableBrush = false,
  className = "",
}: BklitGdpLineChartProps) {
  // Metric toggle: GDP size (Lakh Crore), YoY growth (%), or dual metrics
  const [metricMode, setMetricMode] = useState<SeriesMetricOption>("gdp");
  // Date range filter
  const [timeRange, setTimeRange] = useState<TimeRangeOption>("ALL");
  // Interactive feature toggles
  const [showProjections, setShowProjections] = useState<boolean>(true);
  const [brushMode, setBrushMode] = useState<boolean>(false);

  // Normalize source observations
  const rawObservations = useMemo<GdpObservation[]>(() => {
    if (data && data.length > 0) {
      return [...data].sort((a, b) => {
        const da = parsePeriodToDate(a.period).getTime();
        const db = parsePeriodToDate(b.period).getTime();
        return da - db;
      });
    }
    return DEFAULT_HISTORICAL_GDP;
  }, [data]);

  // Transform into Bklit chart records with valid dates & verified numerical values
  const allChartData = useMemo(() => {
    return rawObservations.map((obs) => {
      const date = parsePeriodToDate(obs.period);
      // Standardize GDP into Lakh Crore (₹1,00,000 Crore = ₹1 Lakh Crore)
      const gdpLakhCr = Number((obs.valueCrore / 100000).toFixed(2));
      const growthRate = obs.growthRateYoy != null ? Number(obs.growthRateYoy) : 0;

      return {
        id: obs.id,
        period: obs.period,
        date,
        // Primary line metric: Lakh Crore
        gdp: gdpLakhCr,
        // Growth rate metric: %
        growth: growthRate,
        rawCrore: obs.valueCrore,
        status: obs.status,
      };
    });
  }, [rawObservations]);

  // Date range filtering (preserves original dataset non-destructively)
  const filteredData = useMemo(() => {
    if (timeRange === "3Y") {
      return allChartData.slice(-3);
    }
    if (timeRange === "5Y") {
      return allChartData.slice(-5);
    }
    return allChartData;
  }, [allChartData, timeRange]);

  // Milestone event markers for India's macro history
  const markers = useMemo<ChartMarker[]>(() => {
    const list: ChartMarker[] = [];

    // 1. COVID-19 pandemic shock marker (FY 2020-21)
    const covidPoint = filteredData.find((d) => d.period.includes("2020-21"));
    if (covidPoint) {
      list.push({
        date: covidPoint.date,
        icon: "⚠️",
        title: "FY 2020-21 Pandemic Contraction",
        description: "National lockdown shock resulted in a -5.8% GDP contraction. Followed by fiscal support packages.",
        color: "#D94E34",
      });
    }

    // 2. Base Year Revision marker (FY 2022-23)
    const baseYearPoint = filteredData.find((d) => d.period.includes("2022-23"));
    if (baseYearPoint) {
      list.push({
        date: baseYearPoint.date,
        icon: "⚖️",
        title: "2022-23 Base Year Revision",
        description: "MoSPI transitioned to the modernized 2022-23 base year, incorporating double deflation and GST data.",
        color: "#D97706",
      });
    }

    // 3. Post-Pandemic Rebound marker (FY 2023-24)
    const reboundPoint = filteredData.find((d) => d.period.includes("2023-24"));
    if (reboundPoint) {
      list.push({
        date: reboundPoint.date,
        icon: "🚀",
        title: "FY 2023-24 Strong Rebound",
        description: "Real GDP accelerated to 8.2% YoY growth, driven by manufacturing and robust gross capital formation.",
        color: "#059669",
      });
    }

    return list;
  }, [filteredData]);

  // RBI & MoSPI forward macroeconomic projections
  const projectionPoints = useMemo(() => {
    if (!showProjections || filteredData.length === 0) return [];
    const lastItem = filteredData[filteredData.length - 1];

    if (metricMode === "gdp") {
      // Projected GDP size: FY 2024-25 (₹186.34 L Cr, +7.2%) and FY 2025-26 (₹200.32 L Cr, +7.5%)
      return [
        { date: lastItem.date, value: lastItem.gdp },
        { date: new Date(2024, 3, 1), value: 186.34 },
        { date: new Date(2025, 3, 1), value: 200.32 },
      ];
    } else if (metricMode === "growth") {
      // Projected Growth Rate: FY25 (~7.2%) and FY26 (~7.5%)
      return [
        { date: lastItem.date, value: lastItem.growth },
        { date: new Date(2024, 3, 1), value: 7.2 },
        { date: new Date(2025, 3, 1), value: 7.5 },
      ];
    }
    return [];
  }, [filteredData, showProjections, metricMode]);

  // Handle Error State
  if (error) {
    const errorMsg = typeof error === "string" ? error : error.message || "Failed to load GDP series records.";
    return (
      <div className={`rounded-xl border border-[rgba(217,78,52,0.2)] bg-[#ECEBE5] p-6 text-center ${className}`}>
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#D94E34]/10 text-[#D94E34]">
          ⚠️
        </div>
        <h3 className="font-serif text-lg font-medium text-[#141416]">Macroeconomic Data Unavailable</h3>
        <p className="mt-1 text-xs text-[#57585C] max-w-md mx-auto">{errorMsg}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn-realistic btn-solid-black mt-4 px-4 py-2 text-xs font-semibold"
          >
            Retry Connection
          </button>
        )}
      </div>
    );
  }

  // Handle Empty State
  if (!isLoading && filteredData.length === 0) {
    return (
      <div className={`rounded-xl border border-[rgba(20,21,23,0.12)] bg-[#ECEBE5] p-8 text-center ${className}`}>
        <p className="text-sm text-[#57585C]">No historical GDP series observations found for the specified parameters.</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn-realistic btn-outline-pill mt-3 px-3 py-1.5 text-xs font-medium"
          >
            Refresh Series
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative w-full rounded-xl border border-[rgba(20,21,23,0.12)] bg-[#ECEBE5] p-5 sm:p-6 shadow-xs ${className}`}
      role="region"
      aria-label={title || "India GDP Time Series Line Chart"}
    >
      {/* Chart Top Header & Controls */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[rgba(20,21,23,0.08)] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-[#141416] animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#57585C]">
              Bklit UI Interactive Chart // MoSPI NAS Series
            </span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#141416]">
            {title || `India GDP Trajectory — ${baseYear} Base Series`}
          </h2>
          <p className="text-xs text-[#57585C] mt-0.5">
            {subtitle || (priceType === "constant" ? "Real Constant Prices (INR Lakh Crore)" : "Nominal Current Prices (INR Lakh Crore)")}
          </p>
        </div>

        {/* Interactive Controls Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Time range selector */}
          <div className="inline-flex rounded-lg border border-[rgba(20,21,23,0.15)] bg-white/70 p-0.5 shadow-2xs" role="tablist" aria-label="Time horizon">
            {(["3Y", "5Y", "ALL"] as TimeRangeOption[]).map((range) => (
              <button
                key={range}
                role="tab"
                aria-selected={timeRange === range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all min-h-[36px] flex items-center ${
                  timeRange === range
                    ? "bg-[#141416] text-[#ECEBE5] shadow-xs"
                    : "text-[#57585C] hover:text-[#141416] hover:bg-black/5"
                }`}
              >
                {range === "ALL" ? "Full Horizon" : `Last ${range}`}
              </button>
            ))}
          </div>

          {/* Metric toggle */}
          <div className="inline-flex rounded-lg border border-[rgba(20,21,23,0.15)] bg-white/70 p-0.5 shadow-2xs">
            <button
              onClick={() => setMetricMode("gdp")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all min-h-[36px] flex items-center ${
                metricMode === "gdp"
                  ? "bg-[#141416] text-[#ECEBE5] shadow-xs"
                  : "text-[#57585C] hover:text-[#141416] hover:bg-black/5"
              }`}
            >
              GDP (₹ Lakh Cr)
            </button>
            {showGrowth && (
              <button
                onClick={() => setMetricMode("growth")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all min-h-[36px] flex items-center ${
                  metricMode === "growth"
                    ? "bg-[#141416] text-[#ECEBE5] shadow-xs"
                    : "text-[#57585C] hover:text-[#141416] hover:bg-black/5"
                }`}
              >
                YoY Growth (%)
              </button>
            )}
          </div>

          {/* Projection toggle */}
          {enableProjections && (
            <button
              onClick={() => setShowProjections(!showProjections)}
              aria-pressed={showProjections}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all min-h-[36px] flex items-center ${
                showProjections
                  ? "border-[#D97706] bg-[#FFFBEB] text-[#B45309]"
                  : "border-[rgba(20,21,23,0.15)] bg-white/60 text-[#57585C] hover:bg-white"
              }`}
              title="Toggle RBI / MoSPI Advance Projections"
            >
              ⚡ Forecasts {showProjections ? "ON" : "OFF"}
            </button>
          )}

          {/* Brush Zoom toggle */}
          {enableBrush && (
            <button
              onClick={() => setBrushMode(!brushMode)}
              aria-pressed={brushMode}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                brushMode
                  ? "border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8]"
                  : "border-[rgba(20,21,23,0.15)] bg-white/60 text-[#57585C] hover:bg-white"
              }`}
              title="Toggle interactive brush range slider"
            >
              🔍 Brush {brushMode ? "Active" : "Idle"}
            </button>
          )}
        </div>
      </div>

      {/* Main Chart Area rendered with official Bklit UI LineChart */}
      <div className="relative w-full">
        <ChartBrushLayout
          data={filteredData as unknown as Record<string, unknown>[]}
          enabled={brushMode}
          height={60}
          brushStrip={(layout) => (
            <div className="rounded-md border border-[rgba(20,21,23,0.12)] bg-black/5 p-1">
              <LineChart
                data={filteredData as unknown as Record<string, unknown>[]}
                aspectRatio="10 / 1"
                status="ready"
                className="w-full h-full"
              >
                <Line
                  dataKey={metricMode === "growth" ? "growth" : "gdp"}
                  stroke="var(--chart-line-primary)"
                  strokeWidth={1.5}
                />
                <ChartBrush
                  onSelectionChange={layout.onBrushSelectionChange}
                />
              </LineChart>
            </div>
          )}
        >
          {(_brushContext) => (
            <LineChart
              data={filteredData as unknown as Record<string, unknown>[]}
              xDataKey="date"
              aspectRatio="2 / 1"
              margin={{ top: 32, right: 32, bottom: 44, left: 32 }}
              status={isLoading ? "loading" : "ready"}
              loadingLabel="Loading MoSPI National Accounts Series..."
              className="w-full select-none"
            >
              {/* Subtle horizontal grid lines */}
              <Grid horizontal vertical={false} numTicksRows={5} />

              {/* Segment range selection background (if active) */}
              <SegmentBackground />
              <SegmentLineFrom />
              <SegmentLineTo />

              {/* Readable X-axis dates aligned with series points */}
              <XAxis numTicks={Math.min(6, filteredData.length)} />

              {/* Primary Series Line (GDP Lakh Crore or YoY Growth Rate) */}
              {metricMode === "gdp" ? (
                <Line
                  dataKey="gdp"
                  stroke="var(--chart-line-primary, #141416)"
                  strokeWidth={2.5}
                  fadeEdges
                  showHighlight
                />
              ) : (
                <Line
                  dataKey="growth"
                  stroke="var(--chart-line-secondary, #059669)"
                  strokeWidth={2.5}
                  fadeEdges
                  showHighlight
                />
              )}

              {/* Historical Milestone Event Markers */}
              {markers.length > 0 && (
                <ChartMarkers items={markers} size={26} showLines animate />
              )}

              {/* Forward Forecast / Projection Line */}
              {showProjections && projectionPoints.length > 0 && (
                <ProjectionLine
                  data={projectionPoints}
                  stroke="var(--chart-3, #D97706)"
                  strokeStyle="gradient"
                  gradientStart="var(--chart-3, #D97706)"
                  gradientEnd="var(--chart-5, #7C3AED)"
                  strokeWidth={2.2}
                  strokeDasharray="5,4"
                  showEndMarker
                />
              )}

              {/* Interactive Tooltip with formatted numbers & marker details */}
              <ChartTooltip
                showCrosshair
                showDots
                dotVariant="ring"
                dotSize={5}
                rows={(point: Record<string, unknown>) => {
                  const gdpVal = point.gdp as number | undefined;
                  const growthVal = point.growth as number | undefined;
                  const periodName = (point.period as string) || "";

                  const rows = [];
                  if (gdpVal != null) {
                    rows.push({
                      color: "var(--chart-line-primary, #141416)",
                      label: `GDP (${periodName})`,
                      value: formatLakhCrore(gdpVal),
                    });
                  }
                  if (growthVal != null) {
                    rows.push({
                      color: growthVal >= 0 ? "var(--chart-line-secondary, #059669)" : "var(--color-danger, #D94E34)",
                      label: "YoY Growth",
                      value: `${growthVal >= 0 ? "+" : ""}${growthVal.toFixed(1)}%`,
                    });
                  }
                  return rows;
                }}
              />
            </LineChart>
          )}
        </ChartBrushLayout>
      </div>

      {/* Chart Legend & Context Badges */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[rgba(20,21,23,0.08)] pt-3 text-xs text-[#57585C]">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-4 rounded-xs bg-[#141416]" />
            <span className="font-medium text-[#141416]">
              {metricMode === "gdp" ? "Real GDP (₹ Lakh Cr)" : "YoY Growth Rate (%)"}
            </span>
          </div>

          {showProjections && (
            <div className="flex items-center gap-1.5">
              <span className="h-0.5 w-4 border-b-2 border-dashed border-[#D97706]" />
              <span className="font-mono text-[#B45309]">FY25-26 RBI Forecast</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#828387]">
            <span>• Base Year: {baseYear}</span>
            <span>• {priceType === "constant" ? "Constant 2022-23 Prices" : "Current Prices"}</span>
          </div>
        </div>

        <span className="font-mono text-[10px] text-[#828387]">
          Powered by Bklit UI Charts & Visx Engine
        </span>
      </div>

      {/* Accessible Text & Data Table Fallback */}
      <details className="mt-4 text-xs text-[#57585C]">
        <summary className="cursor-pointer font-mono font-medium hover:text-[#141416]">
          View Accessible Data Table ({filteredData.length} Observations)
        </summary>
        <div className="mt-2 overflow-x-auto rounded border border-[rgba(20,21,23,0.12)] bg-white/50">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[rgba(20,21,23,0.12)] bg-black/5 font-mono text-[11px] text-[#57585C]">
                <th className="p-2">Period</th>
                <th className="p-2">Observation Date</th>
                <th className="p-2 text-right">GDP (₹ Lakh Cr)</th>
                <th className="p-2 text-right">GDP (₹ Crore)</th>
                <th className="p-2 text-right">YoY Growth (%)</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row) => (
                <tr key={row.period} className="border-b border-[rgba(20,21,23,0.06)] hover:bg-black/5">
                  <td className="p-2 font-mono font-medium text-[#141416]">{row.period}</td>
                  <td className="p-2 text-[#57585C]">{row.date.toLocaleDateString("en-IN", { year: "numeric", month: "short" })}</td>
                  <td className="p-2 text-right font-mono font-semibold text-[#141416]">{row.gdp.toFixed(2)}</td>
                  <td className="p-2 text-right font-mono text-[#57585C]">{row.rawCrore.toLocaleString("en-IN")}</td>
                  <td className={`p-2 text-right font-mono font-semibold ${row.growth >= 0 ? "text-[#059669]" : "text-[#D94E34]"}`}>
                    {row.growth >= 0 ? "+" : ""}{row.growth.toFixed(1)}%
                  </td>
                  <td className="p-2 font-mono text-[10px] uppercase text-[#828387]">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

export default BklitGdpLineChart;
