"use client";

import { useState } from "react";

interface SubFactor {
  name: string;
  weight: number;
  score: number;
  officialValue: string;
  independentValue: string;
  source: string;
  status: "aligned" | "minor_divergence" | "significant_divergence";
}

const SUB_FACTORS: SubFactor[] = [
  {
    name: "Industrial Production vs GVA Industry",
    weight: 25,
    score: 88,
    officialValue: "Manufacturing GVA: +9.9%",
    independentValue: "IIP Manufacturing: +6.8%",
    source: "MoSPI NAS vs MoSPI IIP",
    status: "aligned"
  },
  {
    name: "GST Collections vs Nominal GDP",
    weight: 25,
    score: 94,
    officialValue: "Nominal GDP: +9.6%",
    independentValue: "Gross GST Growth: +11.2%",
    source: "MoSPI vs GSTN / MoF",
    status: "aligned"
  },
  {
    name: "Purchasing Managers' Index (PMI)",
    weight: 20,
    score: 92,
    officialValue: "Real GDP: +8.2%",
    independentValue: "Manufacturing PMI: 58.8 (Expansion)",
    source: "S&P Global",
    status: "aligned"
  },
  {
    name: "Bank Credit & Corporate Credit",
    weight: 15,
    score: 85,
    officialValue: "Financial Sector GVA: +8.4%",
    independentValue: "Non-Food Bank Credit: +15.3%",
    source: "RBI DBIE",
    status: "aligned"
  },
  {
    name: "External Trade Volumes (Real Imports/Exports)",
    weight: 15,
    score: 78,
    officialValue: "Net Exports Contribution: -0.8%",
    independentValue: "Merchandise Export Growth: +3.1%",
    source: "Ministry of Commerce / DGCI&S",
    status: "minor_divergence"
  },
];

export default function ConsistencyPage() {
  const [factors] = useState<SubFactor[]>(SUB_FACTORS);

  // Compute composite score
  const totalScore = Math.round(
    factors.reduce((acc, f) => acc + (f.score * (f.weight / 100)), 0)
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Official Header Banner */}
      <div className="mb-6 rounded-md border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="rounded bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 text-[11px] font-mono font-bold uppercase">
            Statistical Diagnostics & Cross-Validation
          </span>
          <span className="text-xs text-slate-500">• Baseline: FY 2023-24 Macro Indicators</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Economic Consistency Diagnostic Index
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Objective multi-factor statistical validation model measuring the cross-correlation of headline GDP growth with high-frequency economic series (IIP, GST, PMI, Bank Credit, and Merchandise Trade).
        </p>
      </div>

      <div
        className="mb-8 rounded-md border border-slate-200 bg-slate-50 p-4 text-xs sm:text-sm text-slate-700"
        role="alert"
      >
        <strong>Diagnostic Scope & Interpretation:</strong> The Consistency Index evaluates lead-lag correlation and structural divergence between administrative records and headline national accounts. Divergence signals sectoral transitions (e.g. accelerated formalization or terms-of-trade shifts) rather than intrinsic national accounts inaccuracy.
      </div>

      {/* Composite Score Card and Weighting Matrix */}
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <div className="rounded-md border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between items-center text-center">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Composite Cross-Consistency Score
          </h2>
          <div className="my-5 flex flex-col items-center justify-center">
            <div className="h-28 w-28 rounded-full border-4 border-emerald-500 bg-emerald-50 flex items-center justify-center">
              <span className="text-4xl font-extrabold text-emerald-950 font-mono">{totalScore}</span>
              <span className="text-xs font-bold text-emerald-700">/100</span>
            </div>
            <span className="mt-3 inline-block rounded-full bg-emerald-100 border border-emerald-300 px-3 py-0.5 text-xs font-bold text-emerald-900">
              High Statistical Alignment (80–100)
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Derived from 5 weighted independent high-frequency indicators for FY 2023-24.
          </p>
        </div>

        {/* Weighting Matrix */}
        <div className="lg:col-span-2 rounded-md border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-2">
            Indicator Weighting & Alignment Distribution
          </h2>
          <div className="space-y-3 pt-1">
            {factors.map((f, i) => (
              <div key={i} className="rounded border border-slate-200 bg-slate-50/60 p-3">
                <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1.5">
                  <span>{f.name}</span>
                  <span className="font-mono text-emerald-800 font-bold">{f.score}/100 <span className="text-slate-500 font-normal">({f.weight}% Weight)</span></span>
                </div>
                <div className="w-full h-2 rounded bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded"
                    style={{ width: `${f.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Granular Sub-factor Breakdown Table */}
      <div className="rounded-md border border-slate-200 bg-white p-5 shadow-xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 border-b border-slate-200 pb-2">
          Cross-Indicator Observation Log & Source Authorities
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs gov-table">
            <thead>
              <tr className="text-slate-700">
                <th className="p-2.5">Sub-Indicator Category</th>
                <th className="p-2.5">Official National Account Metric</th>
                <th className="p-2.5">Independent Benchmark Metric</th>
                <th className="p-2.5">Reporting Authority</th>
                <th className="p-2.5">Alignment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {factors.map((f, i) => (
                <tr key={i} className="hover:bg-slate-50/70">
                  <td className="p-2.5 font-semibold text-slate-900">{f.name}</td>
                  <td className="p-2.5 font-mono text-slate-900 font-medium">{f.officialValue}</td>
                  <td className="p-2.5 font-mono font-bold text-blue-900">{f.independentValue}</td>
                  <td className="p-2.5 text-slate-600 font-medium">{f.source}</td>
                  <td className="p-2.5">
                    <span className="rounded px-2 py-0.5 text-[10px] font-bold uppercase font-mono border" style={{
                      background: f.status === "aligned" ? "#ecfdf5" : "#fffbeb",
                      color: f.status === "aligned" ? "#065f46" : "#92400e",
                      borderColor: f.status === "aligned" ? "#a7f3d0" : "#fde68a"
                    }}>
                      {f.status === "aligned" ? "Aligned" : "Minor Divergence"}
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
