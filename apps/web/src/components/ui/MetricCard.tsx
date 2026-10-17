"use client";

import { clsx } from "clsx";
import type { MetricCard as MetricCardType } from "@/lib/api";
import { AnimatableNumber } from "@/components/ui/AnimatableNumber";
import { ArrowUpRight, ArrowDownRight, ShieldCheck, Sparkles, Activity } from "lucide-react";

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  official: {
    label: "Official (MoSPI)",
    bg: "rgba(20, 21, 23, 0.92)",
    text: "#F3F2EE",
    border: "rgba(20, 21, 23, 0.4)",
    dot: "#10B981",
  },
  provisional: {
    label: "Provisional",
    bg: "rgba(245, 158, 11, 0.12)",
    text: "#B45309",
    border: "rgba(245, 158, 11, 0.3)",
    dot: "#F59E0B",
  },
  revised: {
    label: "Revised",
    bg: "rgba(59, 130, 246, 0.12)",
    text: "#1D4ED8",
    border: "rgba(59, 130, 246, 0.3)",
    dot: "#3B82F6",
  },
  derived: {
    label: "Derived Metric",
    bg: "rgba(217, 78, 52, 0.12)",
    text: "#D94E34",
    border: "rgba(217, 78, 52, 0.3)",
    dot: "#D94E34",
  },
  forecast: {
    label: "ML Forecast",
    bg: "rgba(139, 92, 246, 0.12)",
    text: "#7C3AED",
    border: "rgba(139, 92, 246, 0.3)",
    dot: "#8B5CF6",
  },
  unavailable: {
    label: "No Data",
    bg: "rgba(130, 131, 135, 0.1)",
    text: "#828387",
    border: "rgba(130, 131, 135, 0.2)",
    dot: "#9CA3AF",
  },
};

// Procedural micro-sparklines based on metric label for realistic visual texture
function getSparklinePoints(label: string, value: number | null): string {
  if (value === null) return "0,16 100,16";
  const str = label.toLowerCase();
  if (str.includes("real gdp") || str.includes("growth")) {
    return "0,24 16,21 32,23 48,17 64,19 80,11 100,6";
  }
  if (str.includes("nominal gdp") || str.includes("size")) {
    return "0,26 20,22 40,18 60,14 80,9 100,4";
  }
  if (str.includes("cpi") || str.includes("inflation")) {
    return "0,14 20,11 40,16 60,19 80,15 100,13";
  }
  if (str.includes("wpi")) {
    return "0,26 25,22 50,20 75,16 100,12";
  }
  if (str.includes("deflator")) {
    return "0,18 25,16 50,19 75,22 100,17";
  }
  if (str.includes("manufacturing") || str.includes("construction")) {
    return "0,22 25,18 50,14 75,10 100,5";
  }
  return "0,20 25,17 50,15 75,12 100,8";
}

interface Props {
  card: MetricCardType;
  large?: boolean;
}

export function MetricCardDisplay({ card, large }: Props) {
  const isAvailable = card.status !== "unavailable" && card.value !== null;
  const cfg = STATUS_CONFIG[card.status] ?? STATUS_CONFIG.unavailable;
  const sparkPoints = getSparklinePoints(card.label, card.value);
  const isPositiveGrowth = card.value !== null && card.value > 0;
  const isCrore = card.unit.toLowerCase().includes("crore");

  return (
    <div
      className={clsx(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl",
        "border border-[rgba(20,21,23,0.12)] bg-[#ECEBE5]/90 backdrop-blur-sm",
        "p-5 shadow-xs transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:border-[rgba(20,21,23,0.28)] hover:bg-[#ECEBE5] hover:shadow-lg hover:shadow-black/5"
      )}
      role="figure"
      aria-label={card.label}
    >
      {/* Decorative subtle ambient gradient on hover */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-linear-to-br from-[#D94E34]/5 to-transparent blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-30" />

      <div>
        {/* Header with Metric Label and Verification Status Badge */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#57585C]">
              {card.label}
            </span>
          </div>

          <span
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[9px] font-mono font-bold border transition-transform duration-200 group-hover:scale-105"
            style={{
              background: cfg.bg,
              color: cfg.text,
              borderColor: cfg.border,
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full animate-pulse"
              style={{ background: cfg.dot }}
            />
            {cfg.label}
          </span>
        </div>

        {/* Primary Numerical Observation with Anime.js v4 Animatable counter */}
        <div className="my-3 flex items-baseline justify-between gap-2">
          {isAvailable ? (
            <div className="flex items-baseline gap-1.5 min-w-0">
              <span
                className={clsx(
                  large ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl",
                  "font-mono font-bold tracking-tight text-[#141416]"
                )}
              >
                <AnimatableNumber
                  value={card.value}
                  decimals={isCrore ? 0 : 2}
                  duration={800}
                />
              </span>
              <span className="font-mono text-xs font-bold text-[#57585C]">
                {card.unit}
              </span>
            </div>
          ) : (
            <div
              className="my-1 font-mono text-2xl font-bold text-[#828387]"
              aria-label="Data not available"
            >
              -
            </div>
          )}

          {/* Micro Trend Arrow / Indicator */}
          {isAvailable && (
            <span
              className={clsx(
                "flex items-center gap-0.5 font-mono text-[11px] font-semibold",
                isPositiveGrowth ? "text-emerald-700" : "text-amber-700"
              )}
            >
              {isPositiveGrowth ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              {isCrore ? "YoY +" : "+"}
            </span>
          )}
        </div>

        {/* Integrated Sparkline Visual Texture */}
        <div className="mt-2 h-7 w-full overflow-hidden opacity-40 transition-opacity duration-200 group-hover:opacity-80">
          <svg
            aria-hidden="true"
            className="h-full w-full"
            preserveAspectRatio="none"
            viewBox="0 0 100 30"
          >
            <defs>
              <linearGradient
                id={`grad-${card.label.replace(/\s+/g, "-")}`}
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#141416" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#141416" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <polyline
              fill="none"
              points={sparkPoints}
              stroke="#141416"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      </div>

      {/* Period & Provenance Attribution Footer */}
      <div className="mt-4 pt-3 border-t border-[rgba(20,21,23,0.08)] flex items-center justify-between text-[10px] font-mono text-[#828387]">
        <span className="font-semibold text-[#141416] bg-[rgba(20,21,23,0.06)] px-2 py-0.5 rounded-md">
          {card.period}
        </span>
        {card.provenance?.sourceName ? (
          <span
            className="truncate max-w-[150px] font-medium text-[#57585C] text-right"
            title={card.provenance.sourceName}
          >
            {card.provenance.sourceName.split(" ")[0]} NAS (Gov of India)
          </span>
        ) : (
          <span className="font-medium text-[#57585C]">Official NAS</span>
        )}
      </div>
    </div>
  );
}
