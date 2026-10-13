"use client";

import React from "react";
import type { GdpObservation } from "@/lib/api";
import { BklitGdpLineChart } from "./BklitGdpLineChart";

interface Props {
  data: GdpObservation[];
  title?: string;
  showGrowth?: boolean;
}

/**
 * Standard GDP Line Chart component, powered by the official Bklit UI Line Chart.
 */
export function GdpLineChart({ data, title, showGrowth = true }: Props) {
  return (
    <BklitGdpLineChart
      data={data}
      title={title}
      showGrowth={showGrowth}
      enableProjections
      enableBrush
    />
  );
}

export default GdpLineChart;
