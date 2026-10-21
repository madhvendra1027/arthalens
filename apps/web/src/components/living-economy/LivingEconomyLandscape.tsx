"use client";

import React, { useState } from "react";
import { SectorDefinition, SectorId } from "./types";
import { ECONOMIC_SECTORS, ECONOMIC_RELATIONSHIPS } from "./economyData";
import { SectorPlatform } from "./SectorPlatform";
import { FlowVectorOverlay } from "./FlowVectorOverlay";
import { ContextualInspectorPanel } from "./ContextualInspectorPanel";
import { SectorSummaryBar } from "./SectorSummaryBar";
import {
  Sparkles,
  Maximize2,
  RotateCcw,
  Layers,
  ArrowRight,
  Info,
  ShieldCheck,
} from "lucide-react";

interface LivingEconomyLandscapeProps {
  className?: string;
  onNavigateToDeepAnalytics?: (route: string) => void;
}

export function LivingEconomyLandscape({
  className = "",
  onNavigateToDeepAnalytics,
}: LivingEconomyLandscapeProps) {
  const [selectedSector, setSelectedSector] = useState<SectorDefinition | null>(null);
  const [hoveredSector, setHoveredSector] = useState<SectorDefinition | null>(null);
  const [showFlows, setShowFlows] = useState<boolean>(true);

  // Painter's sorting order: lowest Y first (back to front)
  const sortedSectors = [...ECONOMIC_SECTORS].sort(
    (a, b) => a.isometricCoords.y - b.isometricCoords.y
  );

  const handleSelectSector = (sector: SectorDefinition | null) => {
    setSelectedSector(sector);
  };

  return (
    <section
      id="living-economy"
      aria-label="The Living Economy: Interconnected Macroeconomic Landscape"
      className={`relative w-full rounded-3xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.16)] shadow-xs overflow-hidden ${className}`}
    >
      {/* Stage Header & Control Strip */}
      <div className="p-4 sm:p-6 border-b border-[rgba(20,21,23,0.12)] bg-[#E6E5DF]/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-[#141416]">
            <span className="h-2 w-2 rounded-full bg-[#059669] animate-pulse" />
            <span>THE LIVING ECONOMY // INTERACTIVE SOVEREIGN LANDSCAPE</span>
          </div>
          <p className="font-sans text-xs text-[#57585C]">
            Select any sector platform to inspect verified MoSPI & RBI accounts, historical trends, and transmission pathways.
          </p>
        </div>

        {/* View & Flow Vector Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            onClick={() => setShowFlows(!showFlows)}
            aria-pressed={showFlows}
            className={`px-3 py-1.5 rounded-full font-mono text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#141416] ${
              showFlows
                ? "bg-[#141416] text-[#ECEBE5] border-[#141416]"
                : "bg-[#DFDED8] text-[#57585C] border-[rgba(20,21,23,0.15)] hover:text-[#141416]"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Economic Conduits</span>
          </button>

          {selectedSector && (
            <button
              onClick={() => setSelectedSector(null)}
              className="px-3 py-1.5 rounded-full font-mono text-xs font-semibold flex items-center gap-1 bg-[#DFDED8] text-[#141416] border border-[rgba(20,21,23,0.15)] hover:bg-[#D5D4CD] transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Selector Bar for Quick Navigation */}
      <div className="px-4 sm:px-6 pt-4 pb-2">
        <SectorSummaryBar
          sectors={ECONOMIC_SECTORS}
          selectedSectorId={selectedSector?.id ?? null}
          onSelectSector={handleSelectSector}
        />
      </div>

      {/* Isometric Canvas Stage */}
      <div className="relative w-full min-h-[460px] sm:min-h-[560px] lg:min-h-[620px] flex items-center justify-center p-2 sm:p-6 overflow-hidden select-none">
        {/* Subtle Background Isometric Grid Mesh */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="isometric-grid-pattern"
                width="60"
                height="34.64"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 30 0 L 60 17.32 L 30 34.64 L 0 17.32 Z"
                  fill="none"
                  stroke="#141416"
                  strokeWidth="0.6"
                  strokeDasharray="2 3"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#isometric-grid-pattern)" />
          </svg>
        </div>

        {/* Ambient Depth Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(20,21,23,0.06)_100%)]" />

        {/* Interactive SVG Isometric Stage */}
        <svg
          viewBox="0 0 880 580"
          className="w-full max-w-4xl h-auto drop-shadow-sm overflow-visible"
          role="img"
          aria-label="Isometric diagram of India's macroeconomic sectors: Production, Consumption, Capital, Government, and External Economy"
        >
          {/* Ground Reference Grid Axis */}
          <g className="opacity-30">
            <line x1="140" y1="360" x2="740" y2="360" stroke="#141416" strokeDasharray="4 6" />
            <line x1="440" y1="180" x2="440" y2="520" stroke="#141416" strokeDasharray="4 6" />
          </g>

          {/* Economic Conduits / Flow Overlays */}
          {showFlows && (
            <FlowVectorOverlay
              relationships={ECONOMIC_RELATIONSHIPS}
              sectors={ECONOMIC_SECTORS}
              selectedSectorId={selectedSector?.id ?? null}
              hoveredSectorId={hoveredSector?.id ?? null}
            />
          )}

          {/* Sorted Sector Platforms in Depth Order (Back to Front) */}
          {sortedSectors.map((sector) => (
            <SectorPlatform
              key={sector.id}
              sector={sector}
              isSelected={selectedSector?.id === sector.id}
              isHovered={hoveredSector?.id === sector.id}
              hasActiveSelection={selectedSector !== null}
              onSelect={handleSelectSector}
              onHover={setHoveredSector}
            />
          ))}
        </svg>

        {/* Contextual Inspector Side-Drawer */}
        <ContextualInspectorPanel
          sector={selectedSector}
          onClose={() => setSelectedSector(null)}
        />
      </div>

      {/* Stage Baseline Provenance Footer */}
      <div className="p-4 sm:p-5 border-t border-[rgba(20,21,23,0.12)] bg-[#E6E5DF]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-[#57585C]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0" />
          <span>OFFICIAL METRIC CITATIONS: MOSPI NAS • RBI DBIE • UNION BUDGET 2024-25</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-[#828387]">
          <span>UN SNA 2008 Standardized</span>
          <span>Double-Deflation Verified</span>
        </div>
      </div>
    </section>
  );
}
