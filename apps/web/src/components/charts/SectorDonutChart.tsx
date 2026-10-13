"use client";

import React, { useMemo, useState } from "react";
import type { SectorData } from "@/lib/api";
import {
  PieChart,
  PieSlice,
  PieCenter,
  type PieData,
} from "@bklitui/ui/charts";

interface Props {
  sectors: SectorData[];
  period: string;
  baseYear: string;
}

const SECTOR_PALETTE = [
  "#141416", // Obsidian Black
  "#059669", // Emerald Green
  "#D97706", // Amber
  "#2563EB", // Brand Blue
  "#7C3AED", // Royal Violet
  "#D94E34", // Crimson Red
  "#0284C7", // Cerulean
  "#E5A83B", // Gold
];

export function SectorDonutChart({ sectors, period, baseYear }: Props) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const pieData = useMemo<PieData[]>(() => {
    if (!sectors || sectors.length === 0) return [];
    const total = sectors.reduce((sum, s) => sum + (s.shareOfGdp || s.value || 0), 0);

    return sectors.map((s, i) => {
      const share = s.shareOfGdp != null ? s.shareOfGdp : total > 0 ? (s.value / total) * 100 : 0;
      return {
        label: s.sectorName,
        value: Number(share.toFixed(1)),
        color: SECTOR_PALETTE[i % SECTOR_PALETTE.length],
      };
    });
  }, [sectors]);

  if (!sectors || sectors.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-xs text-[#57585C]">
        No sector decomposition records available.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-[rgba(20,21,23,0.08)]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#57585C] block">
            Bklit UI Donut Chart // SNA 2008
          </span>
          <p className="text-xs font-mono font-semibold text-[#141416]">
            {period} — {baseYear} Base Series (Gross Value Added)
          </p>
        </div>
        <span className="text-[11px] font-mono text-[#828387] mt-1 sm:mt-0">
          Hover slice to inspect sectoral contribution
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Bklit UI Donut Chart Canvas */}
        <div className="lg:col-span-5 flex justify-center items-center py-2">
          <div className="w-72 h-72 relative flex items-center justify-center">
            <PieChart
              data={pieData}
              innerRadius={0.68}
              padAngle={0.03}
              cornerRadius={4}
              hoverOffset={12}
              hoveredIndex={hoveredIdx}
              onHoverChange={setHoveredIdx}
              className="w-full h-full"
            >
              {pieData.map((d, index) => (
                <PieSlice
                  key={d.label}
                  index={index}
                  hoverEffect="translate"
                  showGlow
                />
              ))}
              <PieCenter
                defaultLabel="Total GVA"
                suffix="%"
                valueClassName="text-xl sm:text-2xl font-black font-mono text-[#141416]"
                labelClassName="text-[11px] font-mono text-[#57585C] mt-0.5"
              />
            </PieChart>
          </div>
        </div>

        {/* Interactive Legend & Metric Breakdown */}
        <div className="lg:col-span-7 space-y-2">
          {sectors.map((s, i) => {
            const color = SECTOR_PALETTE[i % SECTOR_PALETTE.length];
            const isHovered = hoveredIdx === i;
            const share = s.shareOfGdp != null ? s.shareOfGdp : 0;

            return (
              <div
                key={s.sectorCode}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer ${
                  isHovered
                    ? "bg-white border-[#141416] shadow-xs translate-x-1"
                    : "bg-white/50 border-[rgba(20,21,23,0.08)] hover:bg-white/80"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <span
                    className="h-3 w-3 rounded-full shrink-0 shadow-2xs"
                    style={{ backgroundColor: color }}
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-[#141416] truncate">
                      {s.sectorName}
                    </div>
                    <div className="text-[10px] font-mono text-[#828387]">
                      Code: {s.sectorCode} • ₹{Math.round(s.value).toLocaleString("en-IN")} Cr
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono text-xs font-bold text-[#141416] block">
                    {share.toFixed(1)}%
                  </span>
                  {s.growthRate != null && (
                    <span
                      className={`font-mono text-[10px] font-semibold ${
                        s.growthRate >= 0 ? "text-[#059669]" : "text-[#D94E34]"
                      }`}
                    >
                      {s.growthRate >= 0 ? "+" : ""}
                      {s.growthRate.toFixed(1)}% YoY
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Accessible Table */}
      <details className="mt-4 text-xs text-[#57585C]">
        <summary className="cursor-pointer font-mono font-medium hover:text-[#141416]">
          View Accessible Sector Breakdown Table
        </summary>
        <table className="mt-2 w-full text-left font-mono text-xs border border-[rgba(20,21,23,0.12)] rounded overflow-hidden">
          <thead className="bg-black/5 border-b border-[rgba(20,21,23,0.1)]">
            <tr>
              <th className="p-2 font-medium">Sector</th>
              <th className="p-2 font-medium">Code</th>
              <th className="p-2 text-right font-medium">Value (INR Cr)</th>
              <th className="p-2 text-right font-medium">Share of GVA</th>
              <th className="p-2 text-right font-medium">YoY Growth</th>
            </tr>
          </thead>
          <tbody>
            {sectors.map((s) => (
              <tr key={s.sectorCode} className="border-b border-[rgba(20,21,23,0.06)] hover:bg-black/5">
                <td className="p-2 font-sans font-medium text-[#141416]">{s.sectorName}</td>
                <td className="p-2 text-[#57585C]">{s.sectorCode}</td>
                <td className="p-2 text-right text-[#141416]">{s.value.toLocaleString("en-IN")}</td>
                <td className="p-2 text-right font-bold text-[#141416]">{s.shareOfGdp?.toFixed(1)}%</td>
                <td className={`p-2 text-right ${s.growthRate && s.growthRate >= 0 ? "text-[#059669]" : "text-[#D94E34]"}`}>
                  {s.growthRate ? `${s.growthRate >= 0 ? "+" : ""}${s.growthRate.toFixed(1)}%` : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}

export default SectorDonutChart;
