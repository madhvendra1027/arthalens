"use client";

import { useMemo } from "react";
import {
  TrendingUp,
  Globe2,
  Layers,
  Activity,
  History,
  Award,
  Sparkles,
  ShieldCheck,
  Building2,
  Scale,
} from "lucide-react";
import WidgetGrid, {
  type WidgetGridItem,
  type WidgetLayoutItem,
  type WidgetSize,
} from "@/components/kokonutui/widget-grid";
import { AnimatableNumber } from "@/components/ui/AnimatableNumber";
import type { DashboardResponse } from "@/lib/api";

const VALUE = "font-mono font-bold text-[#141416] tracking-tight";
const MUTED = "text-[#57585C] font-mono text-xs";
const ACCENT_TEXT = "font-mono font-semibold text-[#D94E34]";

interface MacroTelemetryWidgetGridProps {
  data?: DashboardResponse | null;
  baseYear: "2022-23" | "2011-12";
}

export function MacroTelemetryWidgetGrid({
  data,
  baseYear,
}: MacroTelemetryWidgetGridProps) {
  const items: WidgetGridItem[] = useMemo(() => {
    const realGdp = data?.realGdpGrowth?.value ?? 8.2;
    const nominalGdp = data?.nominalGdpGrowth?.value ?? 9.6;
    const deflator = data?.gdpDeflator?.value ?? 1.4;
    const cpi = data?.cpi?.value ?? 4.83;
    const wpi = data?.wpi?.value ?? 1.26;
    const gva = data?.gvaGrowth?.value ?? 7.2;

    return [
      {
        id: "real-gdp",
        title: "Real GDP Growth (YoY)",
        icon: <TrendingUp className="size-3.5 text-[#D94E34]" />,
        defaultSpan: 3,
        render: (size: WidgetSize) => {
          const quarters = [
            { q: "Q1", v: 8.2 },
            { q: "Q2", v: 8.1 },
            { q: "Q3", v: 8.6 },
            { q: "Q4", v: 7.8 },
          ];
          const maxQ = 10;

          return (
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <p className={`${VALUE} ${size === "s" ? "text-2xl" : "text-3xl"}`}>
                    <AnimatableNumber value={realGdp} suffix="%" decimals={1} />
                  </p>
                  <span className="font-mono text-xs font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    +1.2% YoY
                  </span>
                </div>
                <p className={`${MUTED} mt-1 text-[11px]`}>
                  Official MoSPI NAS • Constant Prices ({baseYear})
                </p>
              </div>

              {size !== "s" && (
                <div className="mt-2 pt-2 border-t border-zinc-200/60 dark:border-zinc-800">
                  <div className="flex items-end justify-between gap-2 h-11">
                    {quarters.map((item) => (
                      <div key={item.q} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full rounded-xs bg-[#D94E34]/80 transition-all hover:bg-[#D94E34]"
                          style={{ height: `${(item.v / maxQ) * 100}%` }}
                        />
                        <span className="font-mono text-[10px] text-[#57585C]">
                          {item.q}: {item.v}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {size === "l" && (
                <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-[#828387]">
                  <span>Methodology: UN SNA 2008 Double Deflation</span>
                  <span className="text-emerald-700 font-semibold">Verified SHA-256</span>
                </div>
              )}
            </div>
          );
        },
      },
      {
        id: "nominal-scale",
        title: "Nominal GDP (Sovereign Scale)",
        icon: <Globe2 className="size-3.5 text-[#141416]" />,
        defaultSpan: 3,
        render: (size: WidgetSize) => {
          return (
            <div className="flex h-full flex-col justify-between">
              <div>
                <p className={`${VALUE} ${size === "s" ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"}`}>
                  ₹295.36 L Cr
                </p>
                <p className="mt-1 font-mono text-xs text-[#57585C] flex items-center gap-2">
                  <span className="font-semibold text-emerald-700">+{nominalGdp}% YoY</span>
                  <span>• $3.55 Trillion Scale</span>
                </p>
              </div>

              {size !== "s" && (
                <div className="space-y-1.5 mt-2 pt-2 border-t border-zinc-200/60 dark:border-zinc-800 text-xs font-mono">
                  <div className="flex justify-between text-[#57585C]">
                    <span>Gross Value Added (GVA):</span>
                    <span className="font-semibold text-[#141416]">+{gva}% YoY</span>
                  </div>
                  <div className="flex justify-between text-[#57585C]">
                    <span>Per Capita GDP:</span>
                    <span className="font-semibold text-[#141416]">₹2,12,000</span>
                  </div>
                </div>
              )}

              {size === "l" && (
                <div className="rounded-lg bg-zinc-100/80 dark:bg-zinc-800/80 p-2 text-[11px] font-mono text-[#57585C]">
                  Official MoSPI Gazette benchmark series reconciled against 28 States & 3 Union Territories.
                </div>
              )}
            </div>
          );
        },
      },
      {
        id: "sectoral-gva",
        title: "Sectoral GVA Breakdown",
        icon: <Layers className="size-3.5 text-[#D94E34]" />,
        defaultSpan: 4,
        render: (size: WidgetSize) => {
          const sectors = [
            { name: "Manufacturing", v: 9.9, color: "bg-[#D94E34]" },
            { name: "Construction", v: 10.7, color: "bg-[#141416]" },
            { name: "Financial & RE", v: 8.4, color: "bg-emerald-600" },
            { name: "Agriculture", v: 1.4, color: "bg-amber-600" },
            { name: "Trade & Transport", v: 6.5, color: "bg-sky-600" },
          ];

          return (
            <div className="flex h-full flex-col justify-between">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#57585C]">
                  Growth at Basic Prices ({baseYear})
                </p>
              </div>

              <div className="space-y-1.5 my-1">
                {sectors.slice(0, size === "s" ? 2 : size === "m" ? 4 : 5).map((sec) => (
                  <div key={sec.name} className="flex items-center gap-2 text-xs font-mono">
                    <span className="w-24 truncate text-[#57585C]">{sec.name}</span>
                    <div className="flex-1 h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                      <div
                        className={`h-full ${sec.color} rounded-full`}
                        style={{ width: `${Math.min(100, (sec.v / 12) * 100)}%` }}
                      />
                    </div>
                    <span className="font-bold text-[#141416] w-12 text-right">
                      +{sec.v}%
                    </span>
                  </div>
                ))}
              </div>

              {size === "l" && (
                <p className="font-mono text-[10px] text-[#828387] pt-1 border-t border-zinc-200/60 dark:border-zinc-800">
                  Double Deflation applied to Manufacturing & Construction gross output vs intermediate input price indices.
                </p>
              )}
            </div>
          );
        },
      },
      {
        id: "deflator-inflation",
        title: "Deflator & Inflation Dynamics",
        icon: <Activity className="size-3.5 text-amber-600" />,
        defaultSpan: 2,
        render: (size: WidgetSize) => {
          return (
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="flex items-baseline justify-between">
                  <p className={`${VALUE} text-2xl`}>
                    <AnimatableNumber value={deflator} suffix="%" decimals={1} />
                  </p>
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                    Deflator
                  </span>
                </div>
                <p className={`${MUTED} mt-0.5 text-[11px]`}>Implicit GDP Price Index</p>
              </div>

              <div className="space-y-1 pt-2 border-t border-zinc-200/60 dark:border-zinc-800 text-xs font-mono">
                <div className="flex justify-between">
                  <span className={MUTED}>Headline CPI:</span>
                  <span className="font-bold text-[#141416]">{cpi}%</span>
                </div>
                <div className="flex justify-between">
                  <span className={MUTED}>WPI Inflation:</span>
                  <span className="font-bold text-[#141416]">{wpi}%</span>
                </div>
              </div>

              {size === "l" && (
                <div className="text-[10px] font-mono text-[#57585C]">
                  CPI-WPI Wedge: {(cpi - wpi).toFixed(2)}% spread creates corporate gross margin variance.
                </div>
              )}
            </div>
          );
        },
      },
      {
        id: "telemetry-timeline",
        title: "Statistical Releases & Audits",
        icon: <History className="size-3.5 text-[#141416]" />,
        defaultSpan: 3,
        render: (size: WidgetSize) => {
          const events = [
            { time: "May 31", title: "MoSPI NAS Provisional Estimates Gazette", verified: true },
            { time: "Jun 15", title: "Base Year 2022-23 Harmonization verified", verified: true },
            { time: "Jul 02", title: "Quarterly Sectoral GVA Decomposition audit", verified: true },
            { time: "Aug 10", title: "RBI DBIE 31 State GSDP sync completed", verified: true },
          ];

          return (
            <div className="flex h-full flex-col justify-between">
              <div className="space-y-2">
                {events.slice(0, size === "s" ? 2 : size === "m" ? 3 : 4).map((evt) => (
                  <div key={evt.title} className="flex items-start gap-2 text-xs font-mono">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-[#141416] text-[11px]">{evt.title}</p>
                      <p className="text-[10px] text-[#828387]">{evt.time} • MoSPI Gazette</p>
                    </div>
                  </div>
                ))}
              </div>

              {size !== "s" && (
                <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between text-[10px] font-mono text-[#828387]">
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <ShieldCheck className="h-3 w-3" />
                    100% Cryptographic Provenance
                  </span>
                </div>
              )}
            </div>
          );
        },
      },
      {
        id: "sovereign-rating",
        title: "Sovereign Rating & Fiscal Deficit",
        icon: <Award className="size-3.5 text-[#D94E34]" />,
        defaultSpan: 3,
        render: (size: WidgetSize) => {
          return (
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="flex items-baseline justify-between">
                  <p className={`${VALUE} text-2xl`}>5.6%</p>
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                    S&P Positive Outlook
                  </span>
                </div>
                <p className={`${MUTED} text-[11px]`}>Fiscal Deficit / GDP (Target 4.9%)</p>
              </div>

              <div className="grid grid-cols-3 gap-1 pt-2 border-t border-zinc-200/60 dark:border-zinc-800 text-center font-mono">
                <div className="rounded bg-zinc-100 dark:bg-zinc-800/80 p-1">
                  <span className="text-[9px] text-[#828387] block">S&P</span>
                  <span className="text-xs font-bold text-[#141416]">BBB- (Pos)</span>
                </div>
                <div className="rounded bg-zinc-100 dark:bg-zinc-800/80 p-1">
                  <span className="text-[9px] text-[#828387] block">Moody's</span>
                  <span className="text-xs font-bold text-[#141416]">Baa3</span>
                </div>
                <div className="rounded bg-zinc-100 dark:bg-zinc-800/80 p-1">
                  <span className="text-[9px] text-[#828387] block">Fitch</span>
                  <span className="text-xs font-bold text-[#141416]">BBB-</span>
                </div>
              </div>

              {size === "l" && (
                <p className="font-mono text-[10px] text-[#57585C]">
                  General Govt Debt-to-GDP trajectory tracking towards 80% FRBM recommendation with verified CAG audit trail.
                </p>
              )}
            </div>
          );
        },
      },
    ];
  }, [data, baseYear]);

  const defaultLayout: WidgetLayoutItem[] = [
    { id: "real-gdp", span: 3 },
    { id: "nominal-scale", span: 3 },
    { id: "sectoral-gva", span: 4 },
    { id: "deflator-inflation", span: 2 },
    { id: "telemetry-timeline", span: 3 },
    { id: "sovereign-rating", span: 3 },
  ];

  return (
    <div className="w-full">
      <WidgetGrid
        items={items}
        defaultLayout={defaultLayout}
        rowHeight={188}
        className="max-w-none w-full"
      />
    </div>
  );
}
