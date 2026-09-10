"use client";

import Link from "next/link";

interface SectorContribution {
  sector: string;
  share: string;
  growth: string;
  contributionPoints: string;
  driver: "Primary Driver" | "Steady Contributor" | "Lagging Component";
}

const SECTOR_CONTRIBUTIONS: SectorContribution[] = [
  { sector: "Industry & Manufacturing", share: "28.5%", growth: "+9.3%", contributionPoints: "+2.65%", driver: "Primary Driver" },
  { sector: "Financial, Real Estate & Prof Services", share: "23.0%", growth: "+8.4%", contributionPoints: "+1.93%", driver: "Primary Driver" },
  { sector: "Trade, Hotels, Transport & Comm", share: "18.7%", growth: "+6.5%", contributionPoints: "+1.22%", driver: "Steady Contributor" },
  { sector: "Public Administration, Defence & Other", share: "14.7%", growth: "+5.6%", contributionPoints: "+0.82%", driver: "Steady Contributor" },
  { sector: "Agriculture, Forestry & Fishing", share: "15.1%", growth: "+1.4%", contributionPoints: "+0.21%", driver: "Lagging Component" },
];

export default function GDPWhyPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Official Header */}
      <div className="mb-6 rounded-md border border-slate-200 bg-white p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="rounded bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 text-[11px] font-mono font-bold uppercase">
              Growth Accounting & Factor Decomposition
            </span>
            <span className="text-xs text-slate-500">• MoSPI NAS FY 2023-24</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Why India Grew at 8.2%: Growth Drivers & Sector Decomposition
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Mathematical breakdown of FY 2023-24 Real GDP growth into weighted sectoral contributions (Gross Value Added).
          </p>
        </div>
        <Link
          href="/gdp"
          className="rounded border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs"
        >
          ➔ Return to GDP Explorer
        </Link>
      </div>

      {/* Headline Contribution Breakdown Grid */}
      <div className="grid gap-5 sm:grid-cols-3 mb-8">
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">Headline Growth</span>
          <div className="my-2 text-4xl font-extrabold text-emerald-950 font-mono">+8.2%</div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded px-2 py-0.5">
            Official MoSPI Provisional Estimate
          </span>
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">Top Growth Engine</span>
          <div className="my-2 text-2xl font-bold text-slate-900">Manufacturing & Industry</div>
          <p className="text-xs text-slate-600">+9.3% YoY Growth delivering +2.65% points to overall GDP expansion.</p>
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">Services Backbone</span>
          <div className="my-2 text-2xl font-bold text-slate-900">Financial & Trade Services</div>
          <p className="text-xs text-slate-600">Combined services accounted for over 54% of total Gross Value Added.</p>
        </div>
      </div>

      {/* Sector Contribution Decomposition Table */}
      <div className="rounded-md border border-slate-200 bg-white p-5 shadow-xs mb-8">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 border-b border-slate-200 pb-2">
          Sectoral Contribution Attribution Table (FY 2023-24)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs gov-table">
            <thead>
              <tr className="text-slate-700">
                <th className="p-2.5">Economic Sector (GVA Component)</th>
                <th className="p-2.5">Share of GVA</th>
                <th className="p-2.5">Sector Real Growth YoY</th>
                <th className="p-2.5">Weighted Contribution to GDP Growth</th>
                <th className="p-2.5">Attribution Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {SECTOR_CONTRIBUTIONS.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70">
                  <td className="p-2.5 font-semibold text-slate-900">{item.sector}</td>
                  <td className="p-2.5 font-mono text-slate-700">{item.share}</td>
                  <td className="p-2.5 font-mono font-bold text-slate-900">{item.growth}</td>
                  <td className="p-2.5 font-mono font-bold text-emerald-800">{item.contributionPoints}</td>
                  <td className="p-2.5">
                    <span className="rounded px-2 py-0.5 text-[10px] font-bold uppercase font-mono border" style={{
                      background: item.driver === "Primary Driver" ? "#ecfdf5" : item.driver === "Steady Contributor" ? "#eff6ff" : "#fffbeb",
                      color: item.driver === "Primary Driver" ? "#065f46" : item.driver === "Steady Contributor" ? "#1e40af" : "#92400e",
                      borderColor: item.driver === "Primary Driver" ? "#a7f3d0" : item.driver === "Steady Contributor" ? "#bfdbfe" : "#fde68a"
                    }}>
                      {item.driver}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
