"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  TrendingUp,
  Globe2,
  SlidersHorizontal,
  Compass,
  FileSpreadsheet,
  History,
  CheckCircle2,
  Award,
  Bot,
  ShieldCheck,
  Search,
  ExternalLink,
} from "lucide-react";

interface NavModule {
  href: string;
  label: string;
  description: string;
  category: "accounts" | "methodology" | "intelligence";
  icon: typeof LayoutDashboard;
  badge?: string;
}

const ALL_MODULES: NavModule[] = [
  // 1. Accounts & Growth
  {
    href: "/",
    label: "Macro Dashboard",
    description: "National Real & Nominal accounts, headline growth, key indicators",
    category: "accounts",
    icon: LayoutDashboard,
  },
  {
    href: "/gdp",
    label: "GDP Explorer",
    description: "Historical time series, sectoral breakdown & State-level GSDP",
    category: "accounts",
    icon: TrendingUp,
    badge: "Includes State GVA",
  },
  {
    href: "/deflator",
    label: "Deflator Simulator",
    description: "Implicit price deflator analysis and inflation-vs-growth modeling",
    category: "accounts",
    icon: SlidersHorizontal,
  },
  {
    href: "/gdp/why",
    label: "Growth Drivers",
    description: "Demand-side components (PFCE, GFCE, GFCF) and sectoral contribution",
    category: "accounts",
    icon: Compass,
  },

  // 2. Methodology & Revisions
  {
    href: "/methodology",
    label: "Methodology & Base Years",
    description: "2011-12 vs 2022-23 base year isolation safeguards & rebasing guide",
    category: "methodology",
    icon: FileSpreadsheet,
  },
  {
    href: "/revisions",
    label: "Revisions Monitor",
    description: "Sequential MoSPI release tracker (FAE → SAE → PE → FRE revisions)",
    category: "methodology",
    icon: History,
  },
  {
    href: "/consistency",
    label: "Consistency Index",
    description: "Statistical divergence detection and cross-source integrity scoring",
    category: "methodology",
    icon: CheckCircle2,
  },

  // 3. Global & Intelligence
  {
    href: "/global",
    label: "Global GDP & Economies",
    description: "Live World Bank comparative metrics across top 10 world economies",
    category: "intelligence",
    icon: Globe2,
    badge: "World Bank Live",
  },
  {
    href: "/ratings",
    label: "Sovereign Ratings",
    description: "Moody's, S&P, and Fitch ratings trajectories and criteria evaluation",
    category: "intelligence",
    icon: Award,
  },
  {
    href: "/ai",
    label: "Research Assistant",
    description: "Domain-grounded macroeconomic intelligence RAG assistant",
    category: "intelligence",
    icon: Bot,
    badge: "AI Powered",
  },
  {
    href: "/about",
    label: "Sources & Governance",
    description: "Authoritative data registries, MoSPI/RBI documentation & compliance",
    category: "intelligence",
    icon: ShieldCheck,
  },
];

// Primary top navigation items shown on desktop
const PRIMARY_NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/gdp", label: "GDP Explorer" },
  { href: "/global", label: "Global Economies" },
  { href: "/deflator", label: "Deflator Simulator" },
];

export function NavBar() {
  const path = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout, loading } = useAuth();

  // Close drawer on escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  // Filter modules based on search input inside hamburger
  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return ALL_MODULES;
    const q = searchQuery.toLowerCase();
    return ALL_MODULES.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const accountModules = filteredModules.filter((m) => m.category === "accounts");
  const methodologyModules = filteredModules.filter((m) => m.category === "methodology");
  const intelligenceModules = filteredModules.filter((m) => m.category === "intelligence");

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
        {/* Top Official Government/Authority Stripe */}
        <div className="bg-slate-900 text-slate-200 px-4 sm:px-6 py-1.5 text-xs hidden md:flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3 lg:gap-4 overflow-hidden">
            <span className="flex items-center gap-1.5 font-medium shrink-0">
              <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
              <span className="text-white font-bold">MoSPI NAS:</span> FY 2023-24 (Provisional Estimates)
            </span>
            <span className="text-slate-600">|</span>
            <span className="shrink-0">
              RBI Repo: <strong className="text-white font-semibold">6.50%</strong>
            </span>
            <span className="text-slate-600">|</span>
            <span className="shrink-0">
              CPI: <strong className="text-white font-semibold">4.83%</strong>
            </span>
            <span className="text-slate-600">|</span>
            <span className="shrink-0">
              WPI: <strong className="text-white font-semibold">1.26%</strong>
            </span>
            <span className="text-slate-600">|</span>
            <span className="shrink-0">
              FX Reserves: <strong className="text-emerald-300 font-semibold">$651.5 Bn</strong>
            </span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] shrink-0">
            <span className="bg-blue-950 text-blue-200 px-2 py-0.5 rounded-md font-bold border border-blue-800 flex items-center gap-1">
              <span className="text-amber-400 font-black">&#x20B9;</span> 2022-23 ACTIVE BENCHMARK
            </span>
            <span className="text-slate-400 hidden lg:inline">MoSPI &#x2022; RBI VERIFIED</span>
          </div>
        </div>

        {/* Main Official Header Navigation */}
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-2.5">
          {/* Brand with Rupee Symbol Under Magnifying Glass Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group shrink-0"
            onClick={() => setMenuOpen(false)}
          >
            {/* Rupee Under Magnifying Glass Insignia */}
            <div className="relative h-10 w-10 rounded-lg bg-slate-900 p-1 shadow-sm border border-slate-700 flex items-center justify-center overflow-hidden group-hover:border-blue-500 transition-all">
              <svg viewBox="0 0 36 36" className="h-8 w-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="15.5" cy="15.5" r="10" fill="#1e3a8a" fillOpacity="0.35" stroke="#38bdf8" strokeWidth="1.8" />
                <path d="M8.5 13 A 8 8 0 0 1 18.5 8" stroke="#bae6fd" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
                <g stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 11.5 h9" />
                  <path d="M11 14.8 h7" />
                  <path d="M11 11.5 v8 c1.8 0 3.8 -.2 4.8 -1.5 1.1 -1.4 1.1 -4 -.2 -5.2" />
                  <path d="M13.5 19.5 l4.5 5.5" />
                </g>
                <path d="M23 23 L25 25" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M25 25 L31.5 31.5" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
                <circle cx="31.5" cy="31.5" r="1" fill="#f59e0b" />
              </svg>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 leading-none group-hover:text-blue-700 transition-colors">
                  Artha<span className="text-blue-700">Lens</span>
                </span>
                <span className="rounded-md bg-slate-100 text-slate-800 border border-slate-300 px-1.5 py-0.5 text-[10px] font-bold uppercase font-mono tracking-wider flex items-center gap-1">
                  <span className="text-amber-600 font-black">&#x20B9;</span>
                  <span className="text-slate-400">/</span>
                  <span className="text-blue-700 font-black">$</span>
                  <span className="text-slate-700 font-semibold ml-0.5">Macro</span>
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 tracking-normal mt-0.5 hidden xs:inline">
                National Macroeconomic Accounts & Global Monetary Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Primary Nav (Clean, Uncluttered 4 Core Links) */}
          <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-1.5 xl:gap-2">
            {PRIMARY_NAV.map((item) => {
              const active = path === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`btn-realistic px-3.5 py-1.5 text-xs whitespace-nowrap transition-all ${
                    active
                      ? "btn-solid-blue font-extrabold"
                      : "btn-solid-slate font-semibold text-slate-700"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Area: Hamburger Menu Button + User Profile */}
          <div className="flex items-center gap-2.5">
            {/* Sleek Realistic Solid Hamburger / All Modules Button */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="btn-realistic btn-solid-navy px-3.5 py-1.5 text-xs font-bold gap-2 group shadow-sm"
              aria-label="Open all modules menu"
              title="Explore all 10 macroeconomic modules"
            >
              <Menu className="h-4 w-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="font-extrabold tracking-wide">All Modules</span>
              <span className="rounded bg-blue-600 text-white text-[10px] font-mono font-bold px-1.5 py-0.2 shadow-inner border border-blue-400/40">
                10
              </span>
            </button>

            {/* User Session Profile Badge */}
            <div className="hidden sm:flex items-center">
              {loading ? (
                <span className="text-xs text-slate-400 font-mono">...</span>
              ) : user ? (
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 shadow-2xs">
                  <div className="flex flex-col text-left leading-tight">
                    <span className="font-bold text-slate-900 truncate max-w-[130px]">{user.name}</span>
                    <span className="text-[10px] text-slate-500 truncate max-w-[130px]">{user.organization || "Analyst"}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => logout()}
                    title="Sign Out"
                    className="text-slate-400 hover:text-red-600 hover:bg-red-50 ml-1 p-1 rounded-md transition-colors cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="btn-realistic btn-solid-blue px-4 py-1.5 text-xs font-bold whitespace-nowrap shadow-sm"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hamburger Slide-Over Drawer / Backdrop */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop Overlay with Smooth Blur */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-out Navigation Drawer */}
          <aside
            className="relative z-50 w-full max-w-md bg-white shadow-2xl flex flex-col h-full border-l border-slate-200 animate-in slide-in-from-right duration-300"
            aria-label="All platform modules"
          >
            {/* Drawer Header */}
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-blue-950 flex items-center justify-center text-amber-400 font-bold border border-blue-800">
                  &#x20B9;
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">Platform Navigation</h2>
                  <p className="text-[11px] text-slate-500 font-medium">10 Core Macroeconomic Intelligence Modules</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="btn-realistic btn-solid-slate p-1.5 text-slate-700 hover:text-slate-950"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Search Filter */}
            <div className="p-4 border-b border-slate-100 bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter modules (e.g. GDP, State GVA, Deflator, Ratings)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable Module List */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-5">
              {/* Category 1: Accounts & Output */}
              {accountModules.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5 font-mono">
                    <TrendingUp className="h-3 w-3 text-blue-600" />
                    <span>National Accounts & Production</span>
                  </div>
                  <div className="space-y-1">
                    {accountModules.map((item) => {
                      const Icon = item.icon;
                      const active = path === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all ${
                            active
                              ? "bg-blue-50/80 border-blue-300 shadow-2xs"
                              : "border-transparent hover:border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <div
                            className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                              active
                                ? "bg-blue-600 text-white shadow-2xs"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs font-bold leading-tight ${
                                  active ? "text-blue-950 font-black" : "text-slate-900"
                                }`}
                              >
                                {item.label}
                              </span>
                              {item.badge && (
                                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded-md">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Category 2: Methodology & Quality */}
              {methodologyModules.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5 font-mono">
                    <FileSpreadsheet className="h-3 w-3 text-purple-600" />
                    <span>Methodology & Data Integrity</span>
                  </div>
                  <div className="space-y-1">
                    {methodologyModules.map((item) => {
                      const Icon = item.icon;
                      const active = path === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all ${
                            active
                              ? "bg-purple-50/80 border-purple-300 shadow-2xs"
                              : "border-transparent hover:border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <div
                            className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                              active
                                ? "bg-purple-600 text-white shadow-2xs"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs font-bold leading-tight ${
                                  active ? "text-purple-950 font-black" : "text-slate-900"
                                }`}
                              >
                                {item.label}
                              </span>
                              {item.badge && (
                                <span className="bg-purple-100 text-purple-800 text-[9px] font-bold px-1.5 py-0.2 rounded-md">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Category 3: Global & Research */}
              {intelligenceModules.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5 font-mono">
                    <Globe2 className="h-3 w-3 text-teal-600" />
                    <span>Global Benchmarks & Intelligence</span>
                  </div>
                  <div className="space-y-1">
                    {intelligenceModules.map((item) => {
                      const Icon = item.icon;
                      const active = path === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all ${
                            active
                              ? "bg-teal-50/80 border-teal-300 shadow-2xs"
                              : "border-transparent hover:border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <div
                            className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                              active
                                ? "bg-teal-600 text-white shadow-2xs"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs font-bold leading-tight ${
                                  active ? "text-teal-950 font-black" : "text-slate-900"
                                }`}
                              >
                                {item.label}
                              </span>
                              {item.badge && (
                                <span className="bg-teal-100 text-teal-800 text-[9px] font-bold px-1.5 py-0.2 rounded-md">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {filteredModules.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No modules match &quot;{searchQuery}&quot;
                </div>
              )}
            </div>

            {/* Drawer Footer: User Profile & Official Sovereign Badge */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
              {/* User Identity inside drawer */}
              {user ? (
                <div className="flex items-center justify-between bg-white border border-slate-300 rounded-lg p-3 shadow-2xs">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900">{user.name}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{user.organization || "Public Citizen Explorer"}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="btn-realistic btn-solid-slate px-2.5 py-1 text-xs text-red-700 font-bold border-red-200 hover:bg-red-50 hover:border-red-300 gap-1.5"
                  >
                    <LogOut className="h-3 w-3" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="btn-realistic btn-solid-blue w-full py-2.5 text-xs font-bold text-center block shadow-sm"
                >
                  Sign In to ArthaLens
                </Link>
              )}

              {/* Verified Authority Provenance */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>MoSPI &#x2022; RBI &#x2022; World Bank Verified</span>
                <span className="text-blue-700 font-bold">Base 2022-23</span>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}