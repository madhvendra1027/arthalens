"use client";

import React from "react";
import { useChart } from "./chart-context";

export interface SegmentBackgroundProps {
  fill?: string;
  fillOpacity?: number;
  className?: string;
}

export function SegmentBackground({
  fill = "var(--chart-segment-background, rgba(0,0,0,0.06))",
  fillOpacity,
  className = "",
}: SegmentBackgroundProps) {
  const { selection, innerHeight } = useChart();

  if (!selection?.active) return null;

  const left = Math.min(selection.startX, selection.endX);
  const width = Math.abs(selection.endX - selection.startX);

  if (width <= 0) return null;

  return (
    <rect
      x={left}
      y={0}
      width={width}
      height={innerHeight}
      fill={fill}
      fillOpacity={fillOpacity}
      className={className}
      pointerEvents="none"
    />
  );
}

export interface SegmentLineProps {
  stroke?: string;
  strokeWidth?: number;
  variant?: "dashed" | "solid" | "gradient";
  className?: string;
}

export function SegmentLineFrom({
  stroke = "var(--chart-segment-line, rgba(0,0,0,0.25))",
  strokeWidth = 1,
  variant = "dashed",
  className = "",
}: SegmentLineProps) {
  const { selection, innerHeight } = useChart();

  if (!selection?.active) return null;

  const x = selection.startX;
  const strokeDasharray = variant === "dashed" ? "4,4" : undefined;

  return (
    <line
      x1={x}
      y1={0}
      x2={x}
      y2={innerHeight}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeDasharray={strokeDasharray}
      className={className}
      pointerEvents="none"
    />
  );
}

export function SegmentLineTo({
  stroke = "var(--chart-segment-line, rgba(0,0,0,0.25))",
  strokeWidth = 1,
  variant = "dashed",
  className = "",
}: SegmentLineProps) {
  const { selection, innerHeight } = useChart();

  if (!selection?.active) return null;

  const x = selection.endX;
  const strokeDasharray = variant === "dashed" ? "4,4" : undefined;

  return (
    <line
      x1={x}
      y1={0}
      x2={x}
      y2={innerHeight}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeDasharray={strokeDasharray}
      className={className}
      pointerEvents="none"
    />
  );
}
