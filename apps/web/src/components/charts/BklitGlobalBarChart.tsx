"use client";

import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  BarXAxis,
  Grid,
  ChartTooltip,
} from "@bklitui/ui/charts";

import type { CountryEconomy } from "@/data/globalEconomies";

interface Props {
  economies: CountryEconomy[];
}

export function BklitGlobalBarChart({ economies }: Props) {
  const [metric, setMetric] = useState<"gdp" | "growth">("gdp");

  // Format data for Bklit BarChart
  const barData = useMemo(() => {
    return economies.slice(0, 10).map((c) => ({
      name: c.name.length > 9 ? c.code : c.name,
      fullName: c.name,
      flag: c.flag,
      gdp: c.nominalGdpTrillion,
      growth: c.realGdpGrowth,
      perCapita: c.gdpPerCapitaUsd,
      isIndia: c.id === "india",
    }));
  }, [economies]);

  return (
    <div className="w-full">
      {/* Chart Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-[rgba(20,21,23,0.08)]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#57585C] block">
            Bklit UI Bar Chart // World Bank & Official NAS
          </span>
          <p className="text-xs font-mono font-semibold text-[#141416]">
            {metric === "gdp"
              ? "Nominal GDP Scale (USD Trillion)"
              : "Annual Real GDP Growth Rate (YoY %)"}
          </p>
        </div>

        {/* Metric Selector Pills */}
        <div className="inline-flex rounded-lg border border-[rgba(20,21,23,0.15)] bg-white/70 p-0.5 shadow-2xs mt-2 sm:mt-0">
          <button
            onClick={() => setMetric("gdp")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              metric === "gdp"
                ? "bg-[#141416] text-[#ECEBE5] shadow-xs"
                : "text-[#57585C] hover:text-[#141416] hover:bg-black/5"
            }`}
          >
            Nominal GDP ($T)
          </button>
          <button
            onClick={() => setMetric("growth")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              metric === "growth"
                ? "bg-[#141416] text-[#ECEBE5] shadow-xs"
                : "text-[#57585C] hover:text-[#141416] hover:bg-black/5"
            }`}
          >
            YoY Growth (%)
          </button>
        </div>
      </div>

      {/* Bklit UI BarChart */}
      <div className="w-full h-72 sm:h-80 relative select-none">
        <BarChart
          data={barData as unknown as Record<string, unknown>[]}
          xDataKey="name"
          aspectRatio="3 / 1"
          barGap={0.3}
          status="ready"
          margin={{ top: 20, right: 20, bottom: 40, left: 20 }}
          className="w-full h-full"
        >
          <Grid horizontal vertical={false} numTicksRows={4} />

          {metric === "gdp" ? (
            <Bar
              dataKey="gdp"
              fill="var(--chart-line-primary, #141416)"
              lineCap={4}
            />
          ) : (
            <Bar
              dataKey="growth"
              fill="var(--chart-line-secondary, #059669)"
              lineCap={4}
            />
          )}

          <BarXAxis showAllLabels tickerHalfWidth={40} />

          <ChartTooltip
            showCrosshair
            rows={(point: Record<string, unknown>) => {
              const fullName = (point.fullName as string) || (point.name as string);
              const flag = (point.flag as string) || "";
              const gdpVal = point.gdp as number;
              const growthVal = point.growth as number;

              return [
                {
                  color: "var(--chart-line-primary, #141416)",
                  label: `${flag} ${fullName} Output`,
                  value: `$${gdpVal.toFixed(2)} Trillion`,
                },
                {
                  color: growthVal >= 0 ? "var(--chart-line-secondary, #059669)" : "var(--color-danger, #D94E34)",
                  label: "Real Annual Growth",
                  value: `${growthVal >= 0 ? "+" : ""}${growthVal.toFixed(1)}%`,
                },
              ];
            }}
          />
        </BarChart>
      </div>

      {/* Sub-label and Highlights */}
      <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] text-[#57585C] font-mono border-t border-[rgba(20,21,23,0.08)] pt-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#141416]" />
          <span>India Benchmark: $3.94T (₹295.36 Lakh Cr) • Fastest growing major economy (+8.2%)</span>
        </div>
        <span className="text-[#828387]">Bklit UI BarChart Engine</span>
      </div>
    </div>
  );
}

export default BklitGlobalBarChart;
