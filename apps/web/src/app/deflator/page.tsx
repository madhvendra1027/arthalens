"use client";

import { useState } from "react";
import { useDeflators } from "@/hooks/useApi";

export default function DeflatorPage() {
  const { data: deflatorData } = useDeflators("2022-23");

  // Simulator state
  const [nominalGdp, setNominalGdp] = useState<number>(29536000); // in Crore
  const [deflatorIndex, setDeflatorIndex] = useState<number>(101.4); // Base 100

  // Real GDP = (Nominal / Deflator) * 100
  const realGdp = Math.round((nominalGdp / deflatorIndex) * 100);
  const impliedInflationNum = deflatorIndex - 100;
  const impliedInflation = impliedInflationNum.toFixed(2);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Official Header Banner */}
      <div className="mb-6 rounded-md border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="rounded bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 text-[11px] font-mono font-bold uppercase">
            National Accounts Statistical Diagnostic
          </span>
          <span className="text-xs text-slate-500">  Methodology: SNA 2008 Standard Deflation</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          GDP Deflator & Price Index Arithmetic Simulator
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Technical explainer and interactive laboratory measuring the mathematical relationship between Nominal GDP, Implicit Price Deflators, CPI, and WPI.
        </p>
      </div>

      <div
        className="mb-8 rounded-md border border-blue-200 bg-blue-50/70 p-4 text-xs sm:text-sm text-blue-900"
        role="alert"
      >
        <strong>Note on Statistical Methodology:</strong> The GDP Deflator is an implicit price index reflecting domestic output across all economic sectors. Adjusting simulation inputs below computes mathematical transformations and does not alter official national accounts records.
      </div>

      {/* Simulator Section */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-xs space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2">
            Nominal to Real GDP Conversion Tool
          </h2>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Nominal GDP (Current Prices)</span>
                <span className="font-mono text-blue-800 font-bold">₹{nominalGdp.toLocaleString()} Crore</span>
              </div>
              <input
                type="range"
                min="10000000"
                max="40000000"
                step="100000"
                value={nominalGdp}
                onChange={(e) => setNominalGdp(Number(e.target.value))}
                className="w-full h-2 rounded bg-slate-200 accent-blue-700 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Implicit GDP Deflator Index (Base 100)</span>
                <span className="font-mono text-blue-800 font-bold">{deflatorIndex.toFixed(1)} ({impliedInflationNum >= 0 ? "+" : ""}{impliedInflation}% Implied Inflation)</span>
              </div>
              <input
                type="range"
                min="80.0"
                max="140.0"
                step="0.1"
                value={deflatorIndex}
                onChange={(e) => setDeflatorIndex(Number(e.target.value))}
                className="w-full h-2 rounded bg-slate-200 accent-blue-700 cursor-pointer"
              />
            </div>
          </div>

          <div className="rounded-md border border-emerald-200 bg-emerald-50/60 p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 mb-1">
              Computed Real GDP (Constant Basic Prices)
            </div>
            <div className="text-3xl font-extrabold text-emerald-950 font-mono">
              ₹{realGdp.toLocaleString()} <span className="text-sm font-semibold text-emerald-700">Crore</span>
            </div>
            <p className="mt-2 text-[11px] text-slate-600 font-mono">
              Mathematical Formula: Real GDP = (Nominal GDP / Deflator) x 100
            </p>
          </div>
        </div>

        {/* Price Index Comparison */}
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2">
            Price Index Basket Scope & Composition
          </h2>
          <p className="text-xs text-slate-600">
            CPI, WPI, and the GDP Deflator represent distinct economic baskets and weighting mechanisms:
          </p>

          <div className="space-y-2.5 text-xs">
            <div className="rounded border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-bold text-slate-900">Consumer Price Index (CPI Combined)</span>
                <span className="font-mono font-bold text-blue-800">4.83% YoY</span>
              </div>
              <p className="text-slate-600 text-[11px]">Retail household basket (food, housing, fuel, health, education). Target anchor for RBI Monetary Policy.</p>
            </div>

            <div className="rounded border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-bold text-slate-900">Wholesale Price Index (WPI)</span>
                <span className="font-mono font-bold text-blue-800">1.26% YoY</span>
              </div>
              <p className="text-slate-600 text-[11px]">Producer and bulk commodity level prices. Heavy weighting on manufactured goods and fuel; excludes services.</p>
            </div>

            <div className="rounded border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-bold text-slate-900">Implicit GDP Deflator</span>
                <span className="font-mono font-bold text-emerald-800">1.40% YoY</span>
              </div>
              <p className="text-slate-600 text-[11px]">Comprehensive measure covering entire domestic output. Includes both goods and services produced in India.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Observations Table */}
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 border-b border-slate-200 pb-2">
          Quarterly Price Index & Deflator Time Series (MoSPI / RBI)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs gov-table">
            <thead>
              <tr className="text-slate-700">
                <th className="p-2.5">Quarterly Period</th>
                <th className="p-2.5">GDP Deflator (% YoY)</th>
                <th className="p-2.5">Headline CPI (% YoY)</th>
                <th className="p-2.5">WPI (% YoY)</th>
                <th className="p-2.5">Divergence (CPI - Deflator)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {deflatorData?.data?.map((row, idx) => {
                const divergence = (row.cpi && row.gdpDeflator) ? (row.cpi - row.gdpDeflator).toFixed(2) : "-";
                return (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="p-2.5 font-semibold text-slate-900">{row.period}</td>
                    <td className="p-2.5 font-mono font-bold text-emerald-800">{row.gdpDeflator}%</td>
                    <td className="p-2.5 font-mono text-slate-800">{row.cpi}%</td>
                    <td className="p-2.5 font-mono text-slate-800">{row.wpi}%</td>
                    <td className="p-2.5 font-mono text-slate-600">+{divergence}% pts</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
