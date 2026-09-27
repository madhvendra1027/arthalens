"use client";

import React, { useState, useMemo } from "react";
import { useGdpStates } from "@/hooks/useApi";
import { ErrorState, EmptyState } from "@/components/ui/StateComponents";
import { ArrowUpDown, MapPin, Building, TrendingUp, Info } from "lucide-react";

interface Props {
  baseYear: "2022-23" | "2011-12";
}

export function StateGvaSection({ baseYear }: Props) {
  const { data, isLoading, isError, error, refetch } = useGdpStates(baseYear);
  const [sortBy, setSortBy] = useState<"gsdp" | "growth" | "share" | "name">("gsdp");
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
      case "name":
        return list.sort((a, b) => a.stateName.localeCompare(b.stateName));
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
      <div className="card mb-6 p-6">
        <div className="skeleton h-6 w-1/3 mb-4" />
        <div className="skeleton h-64 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="card mb-6 p-6">
        <ErrorState
          message={(error as Error)?.message || "Failed to load state-level GVA records."}
          retry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <section className="card mb-6" aria-label="State-level GVA distribution">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-indigo-50 text-indigo-900 border border-indigo-200 px-2 py-0.5 text-[10px] font-mono font-bold uppercase">
              State Accounts (SDP)
            </span>
            <span className="text-xs text-slate-500 font-mono">Period: {data?.period || "FY 2023-24"}</span>
          </div>
          <h2 className="text-base font-extrabold text-slate-900 mt-1 flex items-center gap-2">
            <Building className="h-4 w-4 text-blue-900" />
            State-Level GSDP & Economic Contribution Breakdown
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Official Gross State Domestic Product and Value Added compiled by MoSPI in coordination with State Directorates of Economics &amp; Statistics (DES).
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <input
            type="text"
            placeholder="Search state..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="rounded border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-300 shadow-inner text-xs">
            <button
              onClick={() => setSortBy("gsdp")}
              className={`btn-realistic px-2.5 py-1 text-xs rounded-md transition-all ${
                sortBy === "gsdp"
                  ? "btn-solid-blue font-extrabold"
                  : "btn-solid-slate font-semibold text-slate-700"
              }`}
            >
              Output Size
            </button>
            <button
              onClick={() => setSortBy("growth")}
              className={`btn-realistic px-2.5 py-1 text-xs rounded-md transition-all ${
                sortBy === "growth"
                  ? "btn-solid-blue font-extrabold"
                  : "btn-solid-slate font-semibold text-slate-700"
              }`}
            >
              Growth YoY
            </button>
            <button
              onClick={() => setSortBy("share")}
              className={`btn-realistic px-2.5 py-1 text-xs rounded-md transition-all ${
                sortBy === "share"
                  ? "btn-solid-blue font-extrabold"
                  : "btn-solid-slate font-semibold text-slate-700"
              }`}
            >
              National Share
            </button>
          </div>
        </div>
      </div>

      {sortedStates.length === 0 ? (
        <EmptyState message="No state records matched your filter." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-mono font-bold text-slate-700 uppercase">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">State / UT</th>
                <th className="py-2.5 px-3">GSDP (Nominal)</th>
                <th className="py-2.5 px-3">Share of National GVA</th>
                <th className="py-2.5 px-3">Real Growth (YoY)</th>
                <th className="py-2.5 px-3">Relative Scale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedStates.map((state, idx) => {
                const nominalLakhCr = (state.gsdpCrore / 100000).toFixed(2);
                const percentWidth = Math.min(100, Math.max(6, (state.gsdpCrore / maxGsdp) * 100));

                return (
                  <tr key={state.id || state.stateCode} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-400">
                      {idx + 1}
                    </td>

                    <td className="py-3 px-3 font-semibold text-slate-900 flex items-center gap-1.5">
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold border border-slate-200">
                        {state.stateCode}
                      </span>
                      <span>{state.stateName}</span>
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      ₹{nominalLakhCr} L Cr
                      <span className="text-[10px] text-slate-500 font-normal block">
                        ({state.gsdpCrore.toLocaleString()} Cr)
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono">
                      <span className="font-bold text-slate-900">{state.shareOfNationalGva}%</span>
                      <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className="bg-blue-900 h-full rounded-full"
                          style={{ width: `${state.shareOfNationalGva * 5}%` }}
                        />
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold border ${
                          state.growthRateYoy >= 8.0
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : state.growthRateYoy >= 7.0
                            ? "bg-blue-50 text-blue-800 border-blue-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        +{state.growthRateYoy}%
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="w-32 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-700 to-indigo-600 h-full rounded-full"
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

      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
        <div className="flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 text-slate-400" />
          <span>Authority: {data?.authority || "MoSPI National Accounts Division & State Directorates"}</span>
        </div>
        <div className="font-mono text-slate-400 text-[10px]">
          Benchmark: {baseYear} Base Series • Denomination: INR Crore
        </div>
      </div>
    </section>
  );
}
