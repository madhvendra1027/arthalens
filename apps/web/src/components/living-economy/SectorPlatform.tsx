"use client";

import React, { useId } from "react";
import { SectorDefinition } from "./types";
import { Factory, ShoppingBag, Landmark, Building2, Globe2 } from "lucide-react";

interface SectorPlatformProps {
  sector: SectorDefinition;
  isSelected: boolean;
  isHovered: boolean;
  hasActiveSelection: boolean;
  onSelect: (sector: SectorDefinition) => void;
  onHover: (sector: SectorDefinition | null) => void;
}

export function SectorPlatform({
  sector,
  isSelected,
  isHovered,
  hasActiveSelection,
  onSelect,
  onHover,
}: SectorPlatformProps) {
  const filterId = useId();
  const { x, y, platformWidth, platformHeight, elevation } = sector.isometricCoords;
  const isDimmed = hasActiveSelection && !isSelected;

  // Icon mapping
  const getIcon = () => {
    switch (sector.id) {
      case "production":
        return <Factory className="h-4 w-4" style={{ color: sector.color.primary }} />;
      case "consumption":
        return <ShoppingBag className="h-4 w-4" style={{ color: sector.color.primary }} />;
      case "capital":
        return <Landmark className="h-4 w-4" style={{ color: sector.color.primary }} />;
      case "government":
        return <Building2 className="h-4 w-4" style={{ color: sector.color.primary }} />;
      case "external":
        return <Globe2 className="h-4 w-4" style={{ color: sector.color.primary }} />;
    }
  };

  // Isometric diamond geometry
  // Top face vertices: Top, Right, Bottom, Left
  const hw = platformWidth / 2;
  const hh = platformHeight / 2;

  // Elevation offset for 3D extrusion
  const lift = isSelected ? elevation + 12 : isHovered ? elevation + 6 : elevation;
  const currentY = y - (lift - elevation);

  const topCenter = { x, y: currentY - lift };
  const pTop = `${topCenter.x},${topCenter.y - hh}`;
  const pRight = `${topCenter.x + hw},${topCenter.y}`;
  const pBottom = `${topCenter.x},${topCenter.y + hh}`;
  const pLeft = `${topCenter.x - hw},${topCenter.y}`;
  const topFacePoints = `${pTop} ${pRight} ${pBottom} ${pLeft}`;

  // Front-Left Face (From Left to Bottom, extruded down by elevation)
  const leftFacePoints = `${pLeft} ${pBottom} ${topCenter.x},${topCenter.y + hh + elevation} ${topCenter.x - hw},${topCenter.y + elevation}`;

  // Front-Right Face (From Bottom to Right, extruded down by elevation)
  const rightFacePoints = `${pBottom} ${pRight} ${topCenter.x + hw},${topCenter.y + elevation} ${topCenter.x},${topCenter.y + hh + elevation}`;

  // Base Drop Shadow
  const shadowTop = `${x},${y - hh + elevation}`;
  const shadowRight = `${x + hw + 8},${y + elevation}`;
  const shadowBottom = `${x},${y + hh + elevation + 8}`;
  const shadowLeft = `${x - hw - 8},${y + elevation}`;
  const shadowPoints = `${shadowTop} ${shadowRight} ${shadowBottom} ${shadowLeft}`;

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`${sector.title} sector: ${sector.headlineMetric.label} ${sector.headlineMetric.value}. Press Enter to inspect details.`}
      aria-selected={isSelected}
      onClick={() => onSelect(sector)}
      onMouseEnter={() => onHover(sector)}
      onMouseLeave={() => onHover(null)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(sector);
        }
      }}
      className={`cursor-pointer transition-all duration-300 focus:outline-hidden ${
        isDimmed ? "opacity-35" : "opacity-100"
      }`}
      style={{
        transformOrigin: `${x}px ${y}px`,
      }}
    >
      <defs>
        <filter id={`shadow-${filterId}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation={isSelected ? "8" : "4"} />
          <feColorMatrix type="matrix" values="0 0 0 0 0.08  0 0 0 0 0.08  0 0 0 0 0.09  0 0 0 0.22 0" />
          <feOffset dx="0" dy={isSelected ? "12" : "6"} />
          <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
        </filter>
      </defs>

      {/* Ground Projection Shadow */}
      <polygon
        points={shadowPoints}
        fill="rgba(20, 21, 23, 0.14)"
        filter={`url(#shadow-${filterId})`}
        className="transition-all duration-300"
      />

      {/* Extruded Left Face */}
      <polygon
        points={leftFacePoints}
        fill={isSelected ? sector.color.leftFace : "#C8C7C1"}
        stroke="rgba(20, 21, 23, 0.22)"
        strokeWidth="1"
        className="transition-colors duration-200"
      />

      {/* Extruded Right Face */}
      <polygon
        points={rightFacePoints}
        fill={isSelected ? sector.color.rightFace : "#B6B5AF"}
        stroke="rgba(20, 21, 23, 0.22)"
        strokeWidth="1"
        className="transition-colors duration-200"
      />

      {/* Top Isometric Face */}
      <polygon
        points={topFacePoints}
        fill={isSelected ? sector.color.topFace : isHovered ? "#ECEAE2" : "#DFDED7"}
        stroke={isSelected ? sector.color.primary : "rgba(20, 21, 23, 0.3)"}
        strokeWidth={isSelected ? "2.5" : "1.2"}
        className="transition-all duration-200"
      />

      {/* Inner Accent Ring on Selected Platform */}
      {isSelected && (
        <polygon
          points={`${topCenter.x},${topCenter.y - hh + 10} ${topCenter.x + hw - 14},${topCenter.y} ${topCenter.x},${topCenter.y + hh - 10} ${topCenter.x - hw + 14},${topCenter.y}`}
          fill="none"
          stroke={sector.color.primary}
          strokeWidth="1"
          strokeDasharray="4 3"
          className="animate-pulse"
        />
      )}

      {/* Floating Info Badge in World Space */}
      <foreignObject
        x={topCenter.x - 75}
        y={topCenter.y - 48}
        width={150}
        height={96}
        className="pointer-events-none overflow-visible"
      >
        <div className="flex flex-col items-center justify-center text-center select-none">
          {/* Beacon / Icon Pill */}
          <div
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider transition-all duration-200 shadow-xs border ${
              isSelected
                ? "bg-[#141416] text-[#ECEBE5] border-[#141416] ring-2 ring-offset-1"
                : "bg-[#ECEBE5] text-[#141416] border-[rgba(20,21,23,0.18)]"
            }`}
            style={{
              borderColor: isSelected ? sector.color.primary : undefined,
            }}
          >
            <span
              className="h-2 w-2 rounded-full shrink-0 animate-pulse"
              style={{ backgroundColor: sector.color.primary }}
            />
            <span className="truncate max-w-[90px]">{sector.title}</span>
          </div>

          {/* Headline Metric Readout */}
          <div className="mt-1.5 rounded-lg px-2 py-0.5 bg-[rgba(236,235,229,0.92)] border border-[rgba(20,21,23,0.12)] shadow-xs">
            <span className="font-mono text-xs font-black text-[#141416] tracking-tight">
              {sector.headlineMetric.value}
            </span>
            <span className="ml-1 text-[9px] font-mono text-[#57585C]">
              {sector.headlineMetric.period}
            </span>
          </div>
        </div>
      </foreignObject>
    </g>
  );
}
