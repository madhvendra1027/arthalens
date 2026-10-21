"use client";

import React, { useState, useMemo } from "react";
import { useGdpStates } from "@/hooks/useApi";
import { ErrorState, EmptyState } from "@/components/ui/StateComponents";
import { RubberSegment } from "@/components/ui/RubberSegment";
import { Building, Info, Search } from "lucide-react";

interface Props {
  baseYear: "2022-23" | "2011-12";
}

export function StateGvaSection({ baseYear }: Props) {
  const { data, isLoading, isError, error, refetch } = useGdpStates(baseYear);
  const [sortBy, setSortBy] = useState<"gsdp" | "growth" | "share">("gsdp");
  const [filterQuery, setFilterQuery] = useState("");

  const sortedStates = useMemo(() => {
    if (!data?.states) return [];
    let list = [...data.states];

    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.stateName.toLowerCase().includes(q) ||
          s.stateCode.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "growth":
        return list.sort((a, b) => b.growthRateYoy - a.growthRateYoy);
      case "share":
        return list.sort((a, b) => b.shareOfNationalGva - a.shareOfNationalGva);
      case "gsdp":
      default:
        return list.sort((a, b) => b.gsdpCrore - a.gsdpCrore);
    }
  }, [data?.states, sortBy, filterQuery]);

  const maxGsdp = useMemo(() => {
    if (!data?.states?.length) return 1;
    return Math.max(...data.states.map((s) => s.gsdpCrore));
  }, [data?.states]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-[rgba(20,21,23,0.12)] bg-[#ECEBE5] p-6 mb-6">
        <div className="h-6 w-1/3 bg-black/5 animate-pulse rounded mb-4" />
        <div className="h-64 w-full bg-black/5 animate-pulse rounded" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-[rgba(20,21,23,0.12)] bg-[#ECEBE5] p-6 mb-6">
        <ErrorState
          message={(error as Error)?.message || "Failed to load state-level GVA records."}
          retry={() => refetch()}
        />
      </div>
    );
  }

  const sortOptions = ["Output Size", "Growth YoY", "National Share"];
  const currentSortLabel =
    sortBy === "growth" ? "Growth YoY" : sortBy === "share" ? "National Share" : "Output Size";

  return (
    <section className="rounded-2xl border border-[rgba(20,21,23,0.12)] bg-[#ECEBE5] p-5 sm:p-6 mb-8 shadow-2xs" aria-label="State-level GVA distribution">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(20,21,23,0.1)] pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#141416] text-[#ECEBE5] px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider">
              State Accounts (SDP)
            </span>
            <span className="text-xs text-[#828387] font-mono">Period: {data?.period || "FY 2023-24"}</span>
          </div>
          <h2 className="font-heading text-lg sm:text-xl font-bold text-[#141416] mt-1.5 flex items-center gap-2">
            <Building className="h-4.5 w-4.5 text-[#D94E34]" />
            <span>State-Level GSDP & Economic Contribution Breakdown</span>
          </h2>
          <p className="font-sans text-xs text-[#57585C] mt-0.5 max-w-2xl">
            Official Gross State Domestic Product and Value Added compiled by MoSPI in coordination with State Directorates of Economics &amp; Statistics (DES).
          </p>
        </div>

        {/* Search & RubberSegment Sort Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 w-full sm:w-auto pt-2 sm:pt-0">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#828387]" />
            <input
              type="text"
              placeholder="Search state..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="rounded-full border border-[rgba(20,21,23,0.18)] bg-white/90 pl-8.5 pr-3 py-1.5 text-xs font-sans text-[#141416] placeholder-[#828387] focus:outline-none focus:border-[#141416] shadow-2xs w-full sm:w-44 min-h-[38px]"
            />
          </div>

          <div className="max-w-full overflow-x-auto touch-pan-x [scrollbar-width:none] pb-0.5">
            <RubberSegment
              items={sortOptions}
              defaultValue={currentSortLabel}
              value={currentSortLabel}
              onChange={(val) => {
                if (val === "Growth YoY") setSortBy("growth");
                else if (val === "National Share") setSortBy("share");
                else setSortBy("gsdp");
              }}
              trackColor="#E3E2DC"
              thumbColor="#141416"
              textColor="#57585C"
              activeTextColor="#ECEBE5"
              size="sm"
              radius={9999}
              inset={2}
              equalSlots={false}
              stretch={50}
              squash={2}
              preset="state-sorting"
            />
          </div>
        </div>
      </div>

      {sortedStates.length === 0 ? (
        <EmptyState message="No state records matched your filter." />
      ) : (
        <div className="overflow-x-auto touch-pan-x rounded-xl border border-[rgba(20,21,23,0.08)] bg-white/70">
          <table className="w-full min-w-[560px] text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[rgba(20,21,23,0.1)] bg-[#ECEBE5]/60 text-[11px] font-mono font-bold text-[#57585C] uppercase tracking-wider">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">State / UT</th>
                <th className="py-2.5 px-3">GSDP (Nominal)</th>
                <th className="py-2.5 px-3">Share of National GVA</th>
                <th className="py-2.5 px-3">Real Growth (YoY)</th>
                <th className="py-2.5 px-3">Relative Scale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(20,21,23,0.06)] font-sans">
              {sortedStates.map((state, idx) => {
                const nominalLakhCr = (state.gsdpCrore / 100000).toFixed(2);
                const percentWidth = Math.min(100, Math.max(6, (state.gsdpCrore / maxGsdp) * 100));

                return (
                  <tr key={state.id || state.stateCode} className="hover:bg-black/[0.02] transition-colors">
                    <td className="py-3 px-3 font-mono font-medium text-[#828387] tabular-nums">
                      {idx + 1}
                    </td>

                    <td className="py-3 px-3 font-medium text-[#141416]">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/5 text-[#57585C] font-bold border border-black/10">
                          {state.stateCode}
                        </span>
                        <span className="font-sans font-semibold text-xs text-[#141416]">{state.stateName}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono font-medium text-[#141416] tabular-nums">
                      ₹{nominalLakhCr} L Cr
                      <span className="text-[10px] text-[#828387] font-normal block">
                        ({state.gsdpCrore.toLocaleString()} Cr)
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono">
                      <span className="font-medium text-[#141416] tabular-nums">{state.shareOfNationalGva}%</span>
                      <div className="w-24 bg-black/5 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className="bg-[#141416] h-full rounded-full"
                          style={{ width: `${Math.min(100, state.shareOfNationalGva * 5)}%` }}
                        />
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium border tabular-nums ${
                          state.growthRateYoy >= 8.0
                            ? "bg-[#059669]/10 text-[#059669] border-[#059669]/25"
                            : state.growthRateYoy >= 7.0
                            ? "bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/25"
                            : "bg-black/5 text-[#57585C] border-black/10"
                        }`}
                      >
                        +{state.growthRateYoy}%
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="w-32 bg-black/5 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#D94E34] h-full rounded-full transition-all duration-300"
                          style={{ width: `${percentWidth}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-[rgba(20,21,23,0.08)] flex flex-wrap items-center justify-between text-[11px] text-[#828387] gap-2 font-mono">
        <div className="flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 text-[#828387]" />
          <span>Authority: {data?.authority || "MoSPI National Accounts Division & State Directorates"}</span>
        </div>
        <div className="text-[10px]">
          Benchmark: {baseYear} Base Series • Denomination: INR Crore
        </div>
      </div>
    </section>
  );
}

export default StateGvaSection;
