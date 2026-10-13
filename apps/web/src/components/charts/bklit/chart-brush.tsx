"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useChart } from "./chart-context";

export interface ChartBrushSelection {
  startIndex: number;
  endIndex: number;
}

export interface ChartBrushLayoutContext {
  xDomain?: [Date, Date];
  xDomainSlotCount?: number;
  brushSelection?: [number, number] | null;
  onBrushSelectionChange: (range: [number, number] | null) => void;
}

export interface ChartBrushLayoutProps {
  data: Record<string, unknown>[];
  enabled?: boolean;
  height?: number;
  brushStrip?: (layout: ChartBrushLayoutContext) => React.ReactNode;
  children: (layout: ChartBrushLayoutContext) => React.ReactNode;
  className?: string;
}

export function ChartBrushLayout({
  data,
  enabled = true,
  height = 72,
  brushStrip,
  children,
  className = "",
}: ChartBrushLayoutProps) {
  const [brushSelection, setBrushSelection] = useState<[number, number] | null>(null);

  const xDomain = useMemo<[Date, Date] | undefined>(() => {
    if (!brushSelection || !enabled || data.length === 0) return undefined;
    const [startRatio, endRatio] = brushSelection;
    const startIdx = Math.max(0, Math.floor(startRatio * (data.length - 1)));
    const endIdx = Math.min(data.length - 1, Math.ceil(endRatio * (data.length - 1)));
    
    const startDate = (data[startIdx] as any)?.date;
    const endDate = (data[endIdx] as any)?.date;

    if (startDate instanceof Date && endDate instanceof Date) {
      return [startDate, endDate];
    }
    return undefined;
  }, [brushSelection, enabled, data]);

  const layoutContext = useMemo<ChartBrushLayoutContext>(() => ({
    xDomain,
    xDomainSlotCount: data.length,
    brushSelection,
    onBrushSelectionChange: (range) => setBrushSelection(range),
  }), [xDomain, data.length, brushSelection]);

  return (
    <div className={`flex flex-col gap-3 w-full ${className}`}>
      <div className="w-full flex-1">
        {children(layoutContext)}
      </div>
      {enabled && brushStrip && (
        <div className="w-full shrink-0" style={{ height }}>
          {brushStrip(layoutContext)}
        </div>
      )}
    </div>
  );
}

export interface ChartBrushProps {
  initialSelection?: [number, number];
  onSelectionChange?: (range: [number, number] | null) => void;
  fadeOuterEdges?: boolean;
  selectionPattern?: { color?: string; preset?: string };
}

export function ChartBrush({
  initialSelection,
  onSelectionChange,
}: ChartBrushProps) {
  const { innerWidth, innerHeight } = useChart();
  const [selection, setSelection] = useState<[number, number] | null>(
    initialSelection ?? null
  );

  const handleMouseDown = useCallback((e: React.MouseEvent<SVGRectElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const startX = (e.clientX - rect.left) / rect.width;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const currentX = Math.max(0, Math.min(1, (moveEvent.clientX - rect.left) / rect.width));
      const newRange: [number, number] = [
        Math.min(startX, currentX),
        Math.max(startX, currentX),
      ];
      setSelection(newRange);
      if (onSelectionChange) onSelectionChange(newRange);
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }, [onSelectionChange]);

  const left = selection ? selection[0] * innerWidth : 0;
  const width = selection ? (selection[1] - selection[0]) * innerWidth : innerWidth;

  return (
    <g className="cursor-ew-resize">
      {/* Background interaction overlay */}
      <rect
        x={0}
        y={0}
        width={innerWidth}
        height={innerHeight}
        fill="transparent"
        onMouseDown={handleMouseDown}
      />
      {/* Selected range highlight */}
      {selection && (
        <>
          <rect
            x={left}
            y={0}
            width={width}
            height={innerHeight}
            fill="var(--chart-line-primary, rgba(37,99,235,0.15))"
            fillOpacity={0.2}
            stroke="var(--chart-line-primary, #2563eb)"
            strokeWidth={1}
            pointerEvents="none"
          />
        </>
      )}
    </g>
  );
}
