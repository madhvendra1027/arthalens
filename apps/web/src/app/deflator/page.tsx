"use client";

import { useState } from "react";
import { useDeflators } from "@/hooks/useApi";
import Link from "next/link";
import { BklitDeflatorLineChart } from "@/components/charts/BklitDeflatorLineChart";

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
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Official Antimetal Header Banner */}
      <div className="mb-8 rounded-lg border border-[rgba(20,21,23,0.12)] bg-[#ECEBE5] p-6 shadow-2xs">
        <div className="flex items-center gap-2 mb-2">
          <span className="rounded-full bg-[#141416] text-[#ECEBE5] px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider">
            02 // DEFLATOR LABORATORY
          </span>
          <span className="font-mono text-xs text-[#828387]">• Methodology: UN SNA 2008 Standard Deflation</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#141416]">
          GDP Deflator & Price Index Arithmetic Simulator
        </h1>
        <p className="text-xs sm:text-sm text-[#57585C] mt-2 max-w-3xl leading-relaxed">
          Technical laboratory measuring the mathematical relationship between Nominal GDP, Implicit Price Deflators, CPI, and WPI with single versus double deflation diagnostics.
        </p>
      </div>

      <div
        className="mb-8 rounded-lg border border-[rgba(20,21,23,0.15)] bg-[#E3E2DC] p-4 text-xs sm:text-sm text-[#141416] font-mono"
        role="alert"
      >
        <strong>Note on Statistical Methodology:</strong> The GDP Deflator is an implicit price index reflecting domestic output across all 14 economic sub-sectors. Adjusting simulation inputs below computes mathematical transformations without altering official records.
      </div>

      {/* Simulator Section */}
      <div className="grid gap-8 lg:grid-cols-2 mb-12">
        <div className="rounded-lg border border-[rgba(20,21,23,0.12)] bg-[#ECEBE5] p-6 shadow-2xs space-y-6">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#57585C] border-b border-[rgba(20,21,23,0.1)] pb-2">
            Nominal to Real GDP Conversion Tool
          </h2>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs font-semibold text-[#141416] mb-1.5 font-mono">
                <span>Nominal GDP (Current Prices)</span>
                <span className="font-bold text-[#141416]">₹{nominalGdp.toLocaleString()} Crore</span>
              </div>
              <input
                type="range"
                min="10000000"
                max="40000000"
                step="100000"
                value={nominalGdp}
                onChange={(e) => setNominalGdp(Number(e.target.value))}
                className="w-full h-2 rounded bg-black/10 accent-[#141416] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-[#141416] mb-1.5 font-mono">
                <span>Implicit GDP Deflator Index (Base 100)</span>
                <span className="font-bold text-[#D94E34]">
                  {deflatorIndex.toFixed(1)} ({impliedInflationNum >= 0 ? "+" : ""}{impliedInflation}% Implied Inflation)
                </span>
              </div>
              <input
                type="range"
                min="80.0"
                max="140.0"
                step="0.1"
                value={deflatorIndex}
                onChange={(e) => setDeflatorIndex(Number(e.target.value))}
                className="w-full h-2 rounded bg-black/10 accent-[#141416] cursor-pointer"
              />
            </div>
          </div>

          <div className="rounded-lg border border-[#059669]/30 bg-[#ECEBE5] p-5">
            <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#059669] mb-1">
              COMPUTED REAL GDP (CONSTANT BASIC PRICES)
            </div>
            <div className="text-3xl font-black text-[#141416] font-mono">
              ₹{realGdp.toLocaleString()} <span className="text-sm font-semibold text-[#57585C]">Crore</span>
            </div>
            <p className="mt-2 text-[11px] text-[#828387] font-mono">
              Formula: Real GDP = (Nominal GDP / Deflator Index) × 100
            </p>
          </div>
        </div>

        {/* Price Index Comparison */}
        <div className="rounded-lg border border-[rgba(20,21,23,0.12)] bg-[#ECEBE5] p-6 shadow-2xs space-y-4">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#57585C] border-b border-[rgba(20,21,23,0.1)] pb-2">
            Price Index Basket Scope & Composition
          </h2>
          <p className="text-xs text-[#57585C]">
            CPI, WPI, and the GDP Deflator represent distinct economic baskets and weighting mechanisms:
          </p>

          <div className="space-y-3 text-xs">
            <div className="rounded border border-[rgba(20,21,23,0.1)] bg-[#E8E7E1] p-3.5">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#141416] font-mono">Consumer Price Index (CPI Combined)</span>
                <span className="font-mono font-bold text-[#141416]">4.83% YoY</span>
              </div>
              <p className="text-[#57585C] text-[11px]">Retail household basket (food, housing, fuel, health, education). Primary anchor for RBI Monetary Policy Committee.</p>
            </div>

            <div className="rounded border border-[rgba(20,21,23,0.1)] bg-[#E8E7E1] p-3.5">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#141416] font-mono">Wholesale Price Index (WPI Headline)</span>
                <span className="font-mono font-bold text-[#141416]">1.26% YoY</span>
              </div>
              <p className="text-[#57585C] text-[11px]">Producer and bulk commodity level prices. Heavy weighting on manufactured goods and crude fuel; excludes services.</p>
            </div>

            <div className="rounded border border-[#D94E34]/20 bg-[#E8E7E1] p-3.5">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#D94E34] font-mono">Implicit GDP Deflator (Whole Economy)</span>
                <span className="font-mono font-bold text-[#D94E34]">1.40% YoY</span>
              </div>
              <p className="text-[#57585C] text-[11px]">Comprehensive measure covering domestic output across agriculture, industry, and tertiary services.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quarterly Deflator vs Inflation Trajectory Section */}
      <section aria-labelledby="deflator-chart-heading" className="mb-12 rounded-lg border border-[rgba(20,21,23,0.12)] bg-[#ECEBE5] p-6 shadow-2xs">
        <BklitDeflatorLineChart data={deflatorData?.data} baseYear={deflatorData?.baseYear} />
      </section>

      <div className="rounded-lg border border-[rgba(20,21,23,0.12)] bg-[#ECEBE5] p-5 text-xs text-[#828387] font-mono flex items-center justify-between">
        <span>PROVENANCE: MoSPI NATIONAL ACCOUNTS STATISTICS (NAS) • DOUBLE DEFLATION ENGINE</span>
        <Link href="/methodology" className="underline underline-offset-4 text-[#141416]">
          Read Splicing Guidelines →
        </Link>
      </div>
    </div>
  );
}
