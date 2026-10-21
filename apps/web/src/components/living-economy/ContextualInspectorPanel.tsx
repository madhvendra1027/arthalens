"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { SectorDefinition, EconomicIndicator } from "./types";
import {
  X,
  ArrowRight,
  ShieldCheck,
  Calendar,
  ExternalLink,
  Layers,
  ChevronRight,
  Info,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface ContextualInspectorPanelProps {
  sector: SectorDefinition | null;
  onClose: () => void;
}

export function ContextualInspectorPanel({
  sector,
  onClose,
}: ContextualInspectorPanelProps) {
  const [selectedIndicatorIndex, setSelectedIndicatorIndex] = useState<number>(0);
  const panelRef = useRef<HTMLDivElement>(null);

  // Reset selected indicator when sector changes
  useEffect(() => {
    setSelectedIndicatorIndex(0);
  }, [sector?.id]);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!sector) return null;

  const currentIndicator: EconomicIndicator | undefined =
    sector.indicators[selectedIndicatorIndex] ?? sector.indicators[0];

  // Helper for sparkline
  const renderSparkline = (trend: { period: string; value: number }[]) => {
    if (!trend || trend.length < 2) return null;

    const values = trend.map((t) => t.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const width = 280;
    const height = 64;
    const padding = 10;
    const plotWidth = width - padding * 2;
    const plotHeight = height - padding * 2;

    const points = trend.map((t, idx) => {
      const x = padding + (idx / (trend.length - 1)) * plotWidth;
      const y = height - padding - ((t.value - min) / range) * plotHeight;
      return `${x},${y}`;
    });

    const pathData = `M ${points.join(" L ")}`;

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-[#57585C]">
          <span>Historical Sequence</span>
          <span>
            {trend[0].period} &rarr; {trend[trend.length - 1].period}
          </span>
        </div>
        <div className="relative rounded-xl bg-[#E6E5DF] p-2.5 border border-[rgba(20,21,23,0.12)]">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-16 overflow-visible">
            {/* Horizontal baseline */}
            <line
              x1={padding}
              y1={height - padding}
              x2={width - padding}
              y2={height - padding}
              stroke="rgba(20, 21, 23, 0.12)"
              strokeDasharray="2 2"
            />
            {/* Trend line */}
            <path
              d={pathData}
              fill="none"
              stroke={sector.color.primary}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Data points */}
            {trend.map((t, idx) => {
              const x = padding + (idx / (trend.length - 1)) * plotWidth;
              const y = height - padding - ((t.value - min) / range) * plotHeight;
              const isLast = idx === trend.length - 1;
              return (
                <g key={t.period}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isLast ? "4.5" : "3"}
                    fill={isLast ? "#141416" : sector.color.primary}
                    stroke="#ECEBE5"
                    strokeWidth="1.5"
                  />
                  {isLast && (
                    <text
                      x={x}
                      y={y - 8}
                      textAnchor="middle"
                      className="fill-[#141416] font-mono text-[9px] font-bold"
                    >
                      {t.value}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-stretch sm:items-end pointer-events-none">
      {/* Clickable Backdrop */}
      <div
        className="fixed inset-0 bg-[#141416]/50 backdrop-blur-xs pointer-events-auto transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Responsive Sheet / Drawer Container */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${sector.title} Sector Investigation Panel`}
        className="relative z-10 w-full sm:max-w-lg md:max-w-xl bg-[#ECEBE5] border-t sm:border-t-0 sm:border-l border-[rgba(20,21,23,0.18)] shadow-2xl rounded-t-3xl sm:rounded-none flex flex-col justify-between overflow-y-auto max-h-[90vh] sm:max-h-full sm:h-full pointer-events-auto pb-safe animate-in slide-in-from-bottom sm:slide-in-from-right duration-300"
      >
        {/* Mobile Drag / Sheet Handle */}
        <div className="sm:hidden flex justify-center pt-3 pb-1" onClick={onClose}>
          <div className="w-12 h-1.5 rounded-full bg-[#141416]/20" />
        </div>

        {/* Top Header Bar */}
        <div className="p-4 sm:p-6 border-b border-[rgba(20,21,23,0.12)] space-y-2.5 sm:space-y-3 sticky top-0 bg-[#ECEBE5]/95 backdrop-blur-md z-10">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#141416] bg-[#DFDED8] border border-[rgba(20,21,23,0.12)]">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: sector.color.primary }}
              />
              <span>{sector.category}</span>
            </div>

            <button
              onClick={onClose}
              aria-label="Close analytical inspection drawer"
              className="rounded-full p-2.5 text-[#57585C] hover:text-[#141416] hover:bg-[#DFDED8] transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#141416] min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

        <div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#141416] tracking-tight">
            {sector.title}
          </h2>
          <p className="font-sans text-xs text-[#57585C] leading-relaxed mt-1">
            {sector.description}
          </p>
        </div>

        {/* Share of Economy Callout */}
        <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-[#141416] bg-[#E6E5DF] px-3 py-1.5 rounded-lg border border-[rgba(20,21,23,0.12)] w-full justify-between">
          <span className="text-[#828387] font-normal uppercase text-[10px]">Macro Weight</span>
          <span>{sector.shareOfEconomy}</span>
        </div>
      </div>

      {/* Indicator Selection Tabs */}
      <div className="px-6 pt-4 border-b border-[rgba(20,21,23,0.12)]">
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#828387] block mb-2">
          Supported Indicators ({sector.indicators.length})
        </span>
        <div className="flex gap-2 overflow-x-auto pb-3 [scrollbar-width:none]">
          {sector.indicators.map((ind, idx) => {
            const isTabActive = idx === selectedIndicatorIndex;
            return (
              <button
                key={ind.id}
                onClick={() => setSelectedIndicatorIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all shrink-0 border cursor-pointer ${
                  isTabActive
                    ? "bg-[#141416] text-[#ECEBE5] border-[#141416] shadow-xs"
                    : "bg-[#DFDED8] text-[#57585C] border-[rgba(20,21,23,0.1)] hover:text-[#141416]"
                }`}
              >
                {ind.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Analytical Body */}
      {currentIndicator && (
        <div className="p-6 space-y-6 flex-1">
          {/* Big Metric Display */}
          <div className="rounded-2xl p-5 bg-[#E6E5DF] border border-[rgba(20,21,23,0.15)] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-semibold text-[#57585C] uppercase">
                {currentIndicator.code}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#DFDED8] px-2.5 py-0.5 text-[10px] font-bold text-[#141416] border border-[rgba(20,21,23,0.12)]">
                {currentIndicator.status.toUpperCase()}
              </span>
            </div>

            <div className="flex items-baseline justify-between gap-4">
              <div className="font-mono text-4xl sm:text-5xl font-black text-[#141416] tracking-tight">
                {currentIndicator.value}
              </div>
              <div className="text-right font-mono">
                <span className="text-xs text-[#57585C] block">{currentIndicator.unit}</span>
                <span
                  className={`text-xs font-bold flex items-center gap-1 justify-end ${
                    currentIndicator.isPositive ? "text-emerald-700" : "text-amber-700"
                  }`}
                >
                  {currentIndicator.isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {currentIndicator.change}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-[rgba(20,21,23,0.1)] flex items-center justify-between text-[11px] font-mono text-[#828387]">
              <span>Observation Period:</span>
              <span className="font-bold text-[#141416]">{currentIndicator.period}</span>
            </div>
          </div>

          {/* Historical Micro Trend Sparkline */}
          {renderSparkline(currentIndicator.historicalTrend)}

          {/* Methodology & Analytical Notes */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#141416]">
              <Info className="h-3.5 w-3.5 text-[#57585C]" />
              <span>Methodology & Measurement</span>
            </div>
            <p className="font-sans text-xs text-[#57585C] leading-relaxed rounded-xl bg-[#DFDED8]/60 p-3.5 border border-[rgba(20,21,23,0.1)]">
              {currentIndicator.methodologyNote}
            </p>
          </div>

          {/* Official Source & Provenance Attribution */}
          <div className="rounded-xl p-4 bg-[#DFDED8] border border-[rgba(20,21,23,0.14)] space-y-2 text-xs font-mono">
            <div className="flex items-center gap-2 font-bold text-[#141416]">
              <ShieldCheck className="h-4 w-4 text-emerald-700" />
              <span>Primary Source Attribution</span>
            </div>
            <div className="space-y-1 text-[#57585C] text-[11px] pl-6">
              <div>
                <span className="text-[#828387]">Release:</span> {currentIndicator.sourceName}
              </div>
              <div>
                <span className="text-[#828387]">Authority:</span> {currentIndicator.authority}
              </div>
              <div>
                <span className="text-[#828387]">Publication:</span> {currentIndicator.publicationDate} • Base Year: {currentIndicator.baseYear}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="p-6 border-t border-[rgba(20,21,23,0.14)] bg-[#E6E5DF] space-y-3">
        <Link
          href={sector.primaryAnalyticsRoute}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#141416] px-5 py-3 font-mono text-xs font-semibold text-[#ECEBE5] hover:bg-[#D94E34] transition-colors shadow-xs group"
        >
          <span>{sector.primaryAnalyticsLabel}</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
        <div className="text-center pt-1">
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center font-mono text-xs text-[#57585C] hover:text-[#141416] py-2 px-4 rounded-full hover:bg-black/5 transition-colors cursor-pointer min-h-[44px]"
          >
            &larr; Return to Isometric Landscape
          </button>
        </div>
      </div>
    </div>
  </div>
  );
}
