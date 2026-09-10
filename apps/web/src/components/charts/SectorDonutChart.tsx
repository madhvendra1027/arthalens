"use client";
import { useRef, useEffect } from "react";
import type { SectorData } from "@/lib/api";

interface Props {
  sectors: SectorData[];
  period: string;
  baseYear: string;
}

const SECTOR_COLORS = [
  "oklch(65% 0.18 250)", "oklch(65% 0.18 145)", "oklch(65% 0.18 60)",
  "oklch(65% 0.15 200)", "oklch(65% 0.18 280)", "oklch(65% 0.15 30)",
  "oklch(65% 0.12 320)", "oklch(65% 0.12 170)",
];

export function SectorDonutChart({ sectors, period, baseYear }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || sectors.length === 0) return;
    import("echarts").then((ec) => {
      const chart = ec.init(ref.current!, "dark");
      chart.setOption({
        backgroundColor: "transparent",
        tooltip: { trigger: "item", formatter: "{b}: {d}% ({c} Cr)" },
        legend: { orient: "vertical", right: 10, top: "center", textStyle: { color: "#9CA3AF", fontSize: 11 } },
        series: [{
          type: "pie",
          radius: ["45%", "72%"],
          center: ["38%", "50%"],
          data: sectors.map((s, i) => ({
            name: s.sectorName,
            value: Math.round(s.value),
            itemStyle: { color: SECTOR_COLORS[i % SECTOR_COLORS.length] },
          })),
          label: { show: false },
          emphasis: { scale: true, scaleSize: 6 },
        }],
      });
      const resize = () => chart.resize();
      window.addEventListener("resize", resize);
      return () => { window.removeEventListener("resize", resize); chart.dispose(); };
    });
  }, [sectors]);

  if (sectors.length === 0) {
    return <div className="text-center text-sm text-[--color-text-muted]">No sector data.</div>;
  }

  return (
    <div>
      <p className="mb-1 text-xs text-[--color-text-muted]">
        {period} — {baseYear} base year, INR Crore
      </p>
      <div ref={ref} className="h-60 w-full" role="img" aria-label="GDP sector breakdown donut chart" />
      {/* Accessible table */}
      <details className="mt-2 text-xs text-[--color-text-muted]">
        <summary className="cursor-pointer">View as table</summary>
        <table className="mt-2 w-full text-left">
          <thead>
            <tr>
              <th className="pr-4 font-medium">Sector</th>
              <th className="pr-4 font-medium">Value (Cr)</th>
              <th className="font-medium">Share</th>
            </tr>
          </thead>
          <tbody>
            {sectors.map((s) => (
              <tr key={s.sectorCode}>
                <td className="pr-4">{s.sectorName}</td>
                <td className="pr-4">{s.value.toLocaleString("en-IN")}</td>
                <td>{s.shareOfGdp?.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
