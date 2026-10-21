"use client";

import React from "react";
import { SectorDefinition, SectorId } from "./types";
import { LayoutGrid } from "lucide-react";

interface SectorSummaryBarProps {
  sectors: SectorDefinition[];
  selectedSectorId: SectorId | null;
  onSelectSector: (sector: SectorDefinition | null) => void;
}

export function SectorSummaryBar({
  sectors,
  selectedSectorId,
  onSelectSector,
}: SectorSummaryBarProps) {
  return (
    <div
      role="tablist"
      aria-label="Economic Sectors Selector"
      className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.16)] shadow-xs overflow-x-auto [scrollbar-width:none] touch-pan-x max-w-full -mx-1 px-2.5 sm:mx-0 sm:px-1.5"
    >
      {/* Overview / Reset Button */}
      <button
        role="tab"
        aria-selected={selectedSectorId === null}
        onClick={() => onSelectSector(null)}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all shrink-0 cursor-pointer min-h-[44px] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#141416] ${
          selectedSectorId === null
            ? "bg-[#141416] text-[#ECEBE5] shadow-xs"
            : "text-[#57585C] hover:text-[#141416] hover:bg-[#DFDED8]"
        }`}
      >
        <LayoutGrid className="h-3.5 w-3.5" />
        <span>Full Macro Overview</span>
      </button>

      {/* Sector Tabs */}
      {sectors.map((sector) => {
        const isSelected = selectedSectorId === sector.id;
        return (
          <button
            key={sector.id}
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelectSector(sector)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all shrink-0 cursor-pointer border min-h-[44px] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#141416] ${
              isSelected
                ? "bg-[#141416] text-[#ECEBE5] border-[#141416] shadow-xs font-bold"
                : "bg-white/60 text-[#57585C] border-[rgba(20,21,23,0.1)] hover:text-[#141416] hover:bg-white"
            }`}
          >
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: sector.color.primary }}
            />
            <span>{sector.title}</span>
            <span
              className={`text-[10px] font-mono ${
                isSelected ? "text-[#E6E5DF]/80" : "text-[#828387]"
              }`}
            >
              {sector.headlineMetric.value}
            </span>
          </button>
        );
      })}
    </div>
  );
}
