"use client";

import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  Grid,
  XAxis,
  ChartTooltip,
} from "@bklitui/ui/charts";

import type { DeflatorPoint } from "@/lib/api";

interface Props {
  data?: DeflatorPoint[];
  baseYear?: string;
}

function parseQuarterToDate(qStr: string): Date {
  const match = qStr.match(/Q([1-4])\s*(\d{4})/i);
  if (match) {
    const q = parseInt(match[1], 10);
    const yr = parseInt(match[2], 10);
    if (q === 1) return new Date(yr, 3, 1);
    if (q === 2) return new Date(yr, 6, 1);
    if (q === 3) return new Date(yr, 9, 1);
    if (q === 4) return new Date(yr + 1, 0, 1);
  }
  return new Date();
}

const DEFAULT_DEFLATOR_SERIES: DeflatorPoint[] = [
  { period: "Q1 2023-24", gdpDeflator: 0.8, cpi: 4.6, wpi: -2.8 },
  { period: "Q2 2023-24", gdpDeflator: 1.6, cpi: 6.4, wpi: -0.4 },
  { period: "Q3 2023-24", gdpDeflator: 1.2, cpi: 5.4, wpi: 0.5 },
  { period: "Q4 2023-24", gdpDeflator: 1.9, cpi: 4.8, wpi: 1.3 },
];

export function BklitDeflatorLineChart({
  data = DEFAULT_DEFLATOR_SERIES,
  baseYear = "2022-23",
}: Props) {
  const chartData = useMemo(() => {
    const list = data && data.length > 0 ? data : DEFAULT_DEFLATOR_SERIES;
    return list.map((item) => ({
      period: item.period,
      date: parseQuarterToDate(item.period),
      deflator: item.gdpDeflator ?? 0,
      cpi: item.cpi ?? 0,
      wpi: item.wpi ?? 0,
    }));
  }, [data]);

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-[rgba(20,21,23,0.08)]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#57585C] block">
            Bklit UI Multi-Series Comparison // Quarterly Trajectory
          </span>
          <p className="text-xs font-mono font-semibold text-[#141416]">
            Implicit GDP Deflator vs CPI vs WPI Inflation (YoY %)
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs font-mono text-[#57585C] mt-2 sm:mt-0">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-3 rounded-xs bg-[#D94E34]" />
            GDP Deflator
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-3 rounded-xs bg-[#141416]" />
            CPI
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-3 rounded-xs bg-[#059669]" />
            WPI
          </span>
        </div>
      </div>

      <div className="w-full relative select-none">
        <LineChart
          data={chartData as unknown as Record<string, unknown>[]}
          xDataKey="date"
          aspectRatio="5 / 2"
          margin={{ top: 24, right: 24, bottom: 40, left: 24 }}
          status="ready"
          className="w-full"
        >
          <Grid horizontal vertical={false} numTicksRows={4} />
          <XAxis numTicks={chartData.length} />

          {/* GDP Deflator Line (Crimson) */}
          <Line
            dataKey="deflator"
            stroke="#D94E34"
            strokeWidth={2.5}
            fadeEdges
            showHighlight
          />

          {/* CPI Retail Line (Obsidian Black) */}
          <Line
            dataKey="cpi"
            stroke="#141416"
            strokeWidth={2}
            fadeEdges
            showHighlight
          />

          {/* WPI Wholesale Line (Emerald) */}
          <Line
            dataKey="wpi"
            stroke="#059669"
            strokeWidth={2}
            fadeEdges
            showHighlight
          />

          <ChartTooltip
            showCrosshair
            showDots
            dotVariant="ring"
            dotSize={5}
            rows={(point: Record<string, unknown>) => {
              const period = (point.period as string) || "";
              const deflator = point.deflator as number;
              const cpi = point.cpi as number;
              const wpi = point.wpi as number;

              return [
                {
                  color: "#D94E34",
                  label: `GDP Deflator (${period})`,
                  value: `${deflator >= 0 ? "+" : ""}${deflator.toFixed(2)}%`,
                },
                {
                  color: "#141416",
                  label: "CPI Combined (Retail)",
                  value: `${cpi >= 0 ? "+" : ""}${cpi.toFixed(2)}%`,
                },
                {
                  color: "#059669",
                  label: "WPI Headline (Wholesale)",
                  value: `${wpi >= 0 ? "+" : ""}${wpi.toFixed(2)}%`,
                },
              ];
            }}
          />
        </LineChart>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-[#828387] border-t border-[rgba(20,21,23,0.08)] pt-2">
        <span>Source: MoSPI NAS & RBI Inflation Statistics • {baseYear} Base Series</span>
        <span>Powered by Bklit UI Charts</span>
      </div>
    </div>
  );
}

export default BklitDeflatorLineChart;
