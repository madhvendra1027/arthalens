"use client";
import { useRef, useEffect } from "react";
import type { GdpObservation } from "@/lib/api";

interface Props {
  data: GdpObservation[];
  title?: string;
  showGrowth?: boolean;
}

export function GdpLineChart({ data, title, showGrowth = true }: Props) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    let echarts: any;
    import("echarts").then((ec) => {
      echarts = ec;
      if (chartInstance.current) chartInstance.current.dispose();
      const chart = echarts.init(chartRef.current!, "dark");
      chartInstance.current = chart;

      const periods = data.map((d) => d.period);
      const values = data.map((d) => d.valueCrore ?? null);
      const growth = data.map((d) => d.growthRateYoy ?? null);

      const option: any = {
        backgroundColor: "transparent",
        tooltip: {
          trigger: "axis",
          formatter: (params: any[]) => {
            return params
              .map(
                (p: any) =>
                  `<b>${p.seriesName}</b>: ${p.value != null ? p.value.toLocaleString("en-IN", { maximumFractionDigits: 2 }) : "N/A"}`
              )
              .join("<br/>");
          },
        },
        legend: { data: showGrowth ? ["GDP (INR Crore)", "YoY Growth (%)"] : ["GDP (INR Crore)"], textStyle: { color: "#9CA3AF" } },
        xAxis: { type: "category", data: periods, axisLabel: { color: "#9CA3AF", rotate: 30 } },
        yAxis: [
          { type: "value", name: "INR Crore", nameTextStyle: { color: "#9CA3AF" }, axisLabel: { color: "#9CA3AF", formatter: (v: number) => (v / 1e6).toFixed(0) + "L Cr" } },
          showGrowth ? { type: "value", name: "Growth %", nameTextStyle: { color: "#9CA3AF" }, axisLabel: { color: "#9CA3AF", formatter: (v: number) => v + "%" } } : undefined,
        ].filter(Boolean),
        series: [
          {
            name: "GDP (INR Crore)",
            type: "line",
            data: values,
            smooth: true,
            lineStyle: { color: "oklch(65% 0.18 250)", width: 2 },
            itemStyle: { color: "oklch(65% 0.18 250)" },
            areaStyle: { color: "oklch(65% 0.18 250 / 0.08)" },
          },
          showGrowth
            ? {
                name: "YoY Growth (%)",
                type: "bar",
                yAxisIndex: 1,
                data: growth,
                itemStyle: {
                  color: (params: any) =>
                    params.value >= 0 ? "oklch(65% 0.18 145 / 0.7)" : "oklch(65% 0.18 15 / 0.7)",
                },
              }
            : undefined,
        ].filter(Boolean),
        grid: { top: 50, right: 60, bottom: 60, left: 80 },
      };

      chart.setOption(option);

      const resize = () => chart.resize();
      window.addEventListener("resize", resize);
      return () => {
        window.removeEventListener("resize", resize);
        chart.dispose();
      };
    });
  }, [data, showGrowth]);

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-[--color-text-muted] text-sm">
        No GDP series data available.
      </div>
    );
  }

  return (
    <div>
      {title && <h2 className="mb-3 text-lg font-semibold">{title}</h2>}
      <div ref={chartRef} className="h-72 w-full" role="img" aria-label={`${title ?? "GDP"} chart`} />
      {/* Accessible text fallback */}
      <details className="mt-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
        <summary className="cursor-pointer">View as table</summary>
        <table className="mt-2 w-full text-left">
          <thead>
            <tr>
              <th className="pr-4 font-medium">Period</th>
              <th className="pr-4 font-medium">GDP (INR Crore)</th>
              {showGrowth && <th className="font-medium">YoY Growth %</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.id}>
                <td className="pr-4">{d.period}</td>
                <td className="pr-4">{d.valueCrore?.toLocaleString("en-IN") ?? "—"}</td>
                {showGrowth && <td>{d.growthRateYoy != null ? `${d.growthRateYoy.toFixed(2)}%` : "—"}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
