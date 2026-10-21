"use client";

import React from "react";
import { SectorDefinition, EconomicRelationship } from "./types";

interface FlowVectorOverlayProps {
  relationships: EconomicRelationship[];
  sectors: SectorDefinition[];
  selectedSectorId: string | null;
  hoveredSectorId: string | null;
}

export function FlowVectorOverlay({
  relationships,
  sectors,
  selectedSectorId,
  hoveredSectorId,
}: FlowVectorOverlayProps) {
  // Helper to find coords
  const sectorMap = new Map<string, SectorDefinition>(
    sectors.map((s) => [s.id, s])
  );

  return (
    <g className="pointer-events-none">
      {relationships.map((rel) => {
        const fromSec = sectorMap.get(rel.fromSectorId);
        const toSec = sectorMap.get(rel.toSectorId);
        if (!fromSec || !toSec) return null;

        const isHighlighted =
          selectedSectorId === rel.fromSectorId ||
          selectedSectorId === rel.toSectorId ||
          hoveredSectorId === rel.fromSectorId ||
          hoveredSectorId === rel.toSectorId;

        const isDimmed =
          (selectedSectorId !== null || hoveredSectorId !== null) && !isHighlighted;

        const start = {
          x: fromSec.isometricCoords.x,
          y: fromSec.isometricCoords.y,
        };
        const end = {
          x: toSec.isometricCoords.x,
          y: toSec.isometricCoords.y,
        };

        // Midpoint bezier curve for aesthetic isometric arcs
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const cx = start.x + dx * 0.5 - dy * 0.15;
        const cy = start.y + dy * 0.5 + dx * 0.15;

        const pathD = `M ${start.x} ${start.y} Q ${cx} ${cy} ${end.x} ${end.y}`;

        return (
          <g
            key={rel.id}
            className={`transition-opacity duration-300 ${
              isDimmed ? "opacity-15" : isHighlighted ? "opacity-100" : "opacity-45"
            }`}
          >
            {/* Background Conduit Line */}
            <path
              d={pathD}
              fill="none"
              stroke={isHighlighted ? fromSec.color.primary : "rgba(20, 21, 23, 0.28)"}
              strokeWidth={isHighlighted ? "2.5" : "1.2"}
              strokeDasharray={isHighlighted ? "none" : "4 4"}
              className="transition-all duration-300"
            />

            {/* Moving Pulse Animation along path */}
            {isHighlighted && (
              <>
                <path
                  d={pathD}
                  fill="none"
                  stroke={fromSec.color.accent}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray="12 120"
                  className="animate-[dash_3s_linear_infinite]"
                />
                <circle r="4" fill={fromSec.color.accent} className="animate-ping">
                  <animateMotion path={pathD} dur="3s" repeatCount="indefinite" />
                </circle>
              </>
            )}

            {/* Label in the center of the arc if highlighted */}
            {isHighlighted && (
              <foreignObject
                x={cx - 100}
                y={cy - 16}
                width={200}
                height={40}
                className="overflow-visible"
              >
                <div className="flex items-center justify-center">
                  <span className="rounded-full bg-[#141416] px-2.5 py-0.5 font-mono text-[9px] font-bold text-[#ECEBE5] shadow-md border border-[rgba(255,255,255,0.15)] whitespace-nowrap">
                    {rel.label}
                  </span>
                </div>
              </foreignObject>
            )}
          </g>
        );
      })}
    </g>
  );
}
