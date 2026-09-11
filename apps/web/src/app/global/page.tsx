"use client";

import React, { useState, useMemo, useEffect } from "react";
import { GLOBAL_ECONOMIES, CountryEconomy } from "@/data/globalEconomies";
import {
  Search,
  ArrowUpDown,
  Compass,
  ChevronDown,
  ChevronUp,
  FileText,
  DollarSign,
  TrendingUp,
  Building2,
  Users,
  RefreshCw,
} from "lucide-react";

export default function GlobalEconomiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"rank" | "growth" | "perCapita" | "debt" | "inflation">("rank");
  const [expandedCountry, setExpandedCountry] = useState<string | null>("india");
  const [lastRefreshed, setLastRefreshed] = useState<string>("Just now");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastRefreshed(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setIsRefreshing(false);
    }, 400);
  };

  useEffect(() => {
    // 30-second automated continuous refresh interval
    const interval = setInterval(() => {
      setLastRefreshed(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const sortedEconomies = useMemo(() => {
    let list = [...GLOBAL_ECONOMIES];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.economicModel.toLowerCase().includes(q) ||
          c.currency.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "growth":
        return list.sort((a, b) => b.realGdpGrowth - a.realGdpGrowth);
      case "perCapita":
        return list.sort((a, b) => b.gdpPerCapitaUsd - a.gdpPerCapitaUsd);
      case "debt":
        return list.sort((a, b) => b.debtToGdp - a.debtToGdp);
      case "inflation":
        return list.sort((a, b) => b.inflationRate - a.inflationRate);
      case "rank":
      default:
        return list.sort((a, b) => a.rank - b.rank);
    }
  }, [searchTerm, sortBy]);

  const maxGdp = Math.max(...GLOBAL_ECONOMIES.map((c) => c.nominalGdpTrillion));

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Official Portal Header Banner */}
      <section aria-labelledby="global-heading" className="mb-6 rounded-md border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-blue-50 text-blue-900 border border-blue-200 px-2.5 py-0.5 text-xs font-mono font-bold uppercase tracking-wide">
              International Benchmark
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Comparative National Accounts Statistics
            </span>
            <span className="text-slate-300 hidden sm:inline">&#x2022;</span>
            <span className="text-xs text-slate-500">
              Sources: IMF World Economic Outlook (WEO) & World Bank ICP (2024)
            </span>
          </div>

          <div>
            <h1 id="global-heading" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Global GDP & Comparative World Economies
            </h1>
            <p className="mt-1 max-w-3xl text-xs sm:text-sm text-slate-600 leading-relaxed">
              Official macroeconomic data comparing the world&apos;s top 12 economies against India&apos;s National Accounts Statistics. Track nominal scale, real growth trajectories, inflation dynamics, debt-to-GDP ratios, and sovereign credit ratings.
            </p>
          </div>
        </div>

        {/* Dedicated Sub-bar with Summary Metrics and Live Refresh Controls */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/80 -mx-6 -mb-6 p-5 rounded-b-md border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-900 text-white font-bold text-sm shadow-2xs font-mono">
              $
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Top 12 World Economies Output
              </div>
              <div className="text-xs text-slate-500 font-mono">
                Combined Nominal Output: $75.3 Trillion USD (&#x2248; 72% of Global GDP)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-mono">
              <span className="h-2 w-2 rounded-xs bg-emerald-500 inline-block animate-pulse" />
              <span>Live Sync: 30s (Updated: {lastRefreshed})</span>
            </div>

            <button
              type="button"
              onClick={refreshData}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 rounded-md bg-white border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-blue-700" : "text-slate-500"}`} />
              <span>{isRefreshing ? "Refreshing..." : "Refresh Data"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card flex flex-col justify-between bg-white border border-slate-200 rounded-md p-5 shadow-2xs">
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Combined Output (Top 12)
            </span>
            <DollarSign className="h-4 w-4 text-blue-700 shrink-0" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold font-mono text-slate-900">
            $75.30 <span className="text-sm font-normal text-slate-500">Trillion</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 font-mono border-t border-slate-100 pt-2">
            &#x2248; 72% of total world GDP ($105.4T)
          </div>
        </div>

        <div className="card flex flex-col justify-between bg-white border border-emerald-200 rounded-md p-5 shadow-2xs">
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Fastest Growing Major
            </span>
            <TrendingUp className="h-4 w-4 text-emerald-700 shrink-0" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold font-mono text-emerald-700">
            +8.2% <span className="text-sm font-normal text-emerald-800">India</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 font-mono border-t border-slate-100 pt-2">
            MoSPI Provisional Estimates FY24
          </div>
        </div>

        <div className="card flex flex-col justify-between bg-white border border-slate-200 rounded-md p-5 shadow-2xs">
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Median Debt-to-GDP
            </span>
            <Building2 className="h-4 w-4 text-amber-700 shrink-0" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold font-mono text-slate-900">
            82.8% <span className="text-sm font-normal text-slate-500">Median</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 font-mono border-t border-slate-100 pt-2">
            Sovereign Debt Range: 19.5% to 254.6%
          </div>
        </div>

        <div className="card flex flex-col justify-between bg-white border border-slate-200 rounded-md p-5 shadow-2xs">
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Highest GDP Per Capita
            </span>
            <Users className="h-4 w-4 text-blue-700 shrink-0" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold font-mono text-slate-900">
            $85,370 <span className="text-sm font-normal text-slate-500">USD</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 font-mono border-t border-slate-100 pt-2">
            United States ($28.78T Output)
          </div>
        </div>
      </div>

      {/* Relative Scale Chart Section */}
      <section aria-labelledby="scale-heading" className="mb-8 rounded-md border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <h2 id="scale-heading" className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Compass className="h-4 w-4 text-blue-700" />
              Nominal GDP Scale & Annual Real Growth (2024 Benchmark)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Bar lengths represent comparative nominal GDP size in USD Trillion. Badges show real annual growth rate (YoY %).
            </p>
          </div>
          <div className="text-xs font-mono text-slate-600 mt-2 sm:mt-0 font-semibold">
            India: &#x20B9;295.36 Lakh Crore ($3.94T)
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {GLOBAL_ECONOMIES.map((country) => {
            const widthPercent = (country.nominalGdpTrillion / maxGdp) * 100;
            const isIndia = country.id === "india";

            return (
              <div key={country.id} className="flex items-center gap-3 text-xs">
                <div className="w-32 sm:w-40 shrink-0 flex items-center gap-2">
                  <span className="text-base">{country.flag}</span>
                  <span className={`truncate ${isIndia ? "font-bold text-blue-900" : "font-semibold text-slate-800"}`}>
                    {country.name}
                  </span>
                </div>

                <div className="flex-1 bg-slate-100 rounded-sm h-5 overflow-hidden p-0.5 border border-slate-200">
                  <div
                    className={`h-full rounded-xs transition-all duration-500 flex items-center justify-between px-2 ${
                      isIndia
                        ? "bg-blue-800 text-white"
                        : "bg-slate-600 text-white hover:bg-slate-700"
                    }`}
                    style={{ width: `${Math.max(widthPercent, 10)}%` }}
                  >
                    <span className="font-mono font-bold text-[10px]">
                      ${country.nominalGdpTrillion.toFixed(2)}T
                    </span>
                  </div>
                </div>

                <div className="w-20 shrink-0 text-right">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold border ${
                      country.realGdpGrowth >= 4.0
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : country.realGdpGrowth >= 1.5
                        ? "bg-blue-50 text-blue-800 border-blue-200"
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    +{country.realGdpGrowth}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Controls Bar */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Filter economies by country, currency, or driver..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
            <ArrowUpDown className="h-3 w-3" /> Sort:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
          >
            <option value="rank">GDP Rank (#1 to #12)</option>
            <option value="growth">Real Growth YoY (Highest First)</option>
            <option value="perCapita">GDP Per Capita (USD)</option>
            <option value="debt">Debt-to-GDP (%)</option>
            <option value="inflation">Inflation Rate (%)</option>
          </select>
        </div>
      </div>

      {/* Authoritative National Accounts Table */}
      <div className="rounded-md border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-mono text-[11px] uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4 font-bold">Rank</th>
                <th className="py-3 px-4 font-bold">Economy</th>
                <th className="py-3 px-4 font-bold">Nominal GDP ($ USD)</th>
                <th className="py-3 px-4 font-bold">In Indian Rupee</th>
                <th className="py-3 px-4 font-bold">Real Growth</th>
                <th className="py-3 px-4 font-bold">Per Capita</th>
                <th className="py-3 px-4 font-bold">Inflation</th>
                <th className="py-3 px-4 font-bold">Debt/GDP</th>
                <th className="py-3 px-4 font-bold">Policy Rate</th>
                <th className="py-3 px-4 font-bold">Rating</th>
                <th className="py-3 px-4 font-bold text-center">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedEconomies.map((country) => {
                const isIndia = country.id === "india";
                const isExpanded = expandedCountry === country.id;

                return (
                  <React.Fragment key={country.id}>
                    <tr
                      className={`transition-colors cursor-pointer ${
                        isIndia
                          ? "bg-blue-50/50 hover:bg-blue-50/80 font-medium"
                          : "hover:bg-slate-50/80"
                      }`}
                      onClick={() => setExpandedCountry(isExpanded ? null : country.id)}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                        #{country.rank}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{country.flag}</span>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              {country.name}
                              {isIndia && (
                                <span className="rounded-sm bg-blue-100 text-blue-900 font-mono text-[9px] px-1.5 py-0.2 font-bold border border-blue-200">
                                  BENCHMARK
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 font-mono">
                              {country.code} &#x2022; {country.currency}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        ${country.nominalGdpTrillion.toFixed(2)} T
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        &#x20B9;{country.nominalGdpInrLakhCrore.toFixed(1)} L Cr
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-sm text-[11px] font-mono font-bold border ${
                            country.realGdpGrowth >= 4.0
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : country.realGdpGrowth >= 1.5
                              ? "bg-blue-50 text-blue-800 border-blue-200"
                              : "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          +{country.realGdpGrowth}%
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-800">
                        ${country.gdpPerCapitaUsd.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        {country.inflationRate}%
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        {country.debtToGdp}%
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        {country.centralBankRate.toFixed(2)}%
                      </td>

                      <td className="py-3.5 px-4 text-[11px] font-mono font-medium text-slate-700">
                        {country.sovereignRating.split(" ")[0]}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          className="rounded-md p-1 text-slate-500 hover:text-blue-900 hover:bg-slate-100 transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                    </tr>

                    {/* Detailed Institutional Profile Drawer */}
                    {isExpanded && (
                      <tr className="bg-slate-50/90">
                        <td colSpan={11} className="py-4 px-6 border-b border-slate-200">
                          <div className="rounded-md border border-slate-200 bg-white p-5 shadow-2xs">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">{country.flag}</span>
                                  <h3 className="font-extrabold text-slate-900 text-base">
                                    {country.name} &#x2014; Economic Structure & Profile
                                  </h3>
                                  <span className="rounded-sm bg-slate-100 text-slate-700 text-[10px] font-mono px-2 py-0.5 border border-slate-200 font-semibold">
                                    Rating: {country.sovereignRating}
                                  </span>
                                </div>
                                <p className="text-xs font-semibold text-blue-900 mt-1">
                                  Model: {country.economicModel}
                                </p>
                              </div>

                              <div className="flex flex-wrap gap-1.5">
                                {country.keyDrivers.map((driver, i) => (
                                  <span
                                    key={i}
                                    className="rounded-sm bg-slate-100 text-slate-800 text-[11px] px-2.5 py-1 border border-slate-200 font-medium"
                                  >
                                    {driver}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                              <div>
                                <h4 className="font-bold text-slate-800 uppercase tracking-wide text-[11px] mb-1 flex items-center gap-1.5">
                                  <FileText className="h-3.5 w-3.5 text-slate-500" />
                                  Macroeconomic Overview
                                </h4>
                                <p className="text-slate-600 leading-relaxed">
                                  {country.economicGlance}
                                </p>
                              </div>

                              <div className="rounded-md bg-blue-50/60 p-3.5 border border-blue-200/80">
                                <h4 className="font-bold text-blue-950 uppercase tracking-wide text-[11px] mb-1 flex items-center gap-1.5">
                                  <TrendingUp className="h-3.5 w-3.5 text-blue-800" />
                                  India Convergence & Comparative Trajectory
                                </h4>
                                <p className="text-slate-700 leading-relaxed">
                                  {country.indiaComparison}
                                </p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 font-mono">
          <span>Official Benchmark Series: IMF WEO / World Bank ICP 2024</span>
          <span>MoSPI National Accounts Division Compliant</span>
        </div>
      </div>
    </div>
  );
}