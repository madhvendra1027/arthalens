"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { GovernmentTerminalModal } from "@/components/antimetal/GovernmentTerminalModal";
import { ShinyButton } from "@/components/ui/shiny-button";
import { DynamicText } from "@/components/kokonutui/dynamic-text";
import { AnimatePresence, motion } from "motion/react";
import {
  Menu,
  X,
  Lock,
  TrendingUp,
  Layers,
  Network,
  SlidersHorizontal,
  CheckCircle2,
  Award,
  Globe2,
  Bot,
  Compass,
  ArrowRight,
  Database,
  BarChart3,
  BookOpen,
  Mail,
  Radio,
  ChevronDown,
} from "lucide-react";
import { NotificationCenter } from "@/components/intelligence/NotificationCenter";

interface NavOption {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavSection {
  category: string;
  items: NavOption[];
}

export interface VisualizationEntry {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  badge: string;
  viewParam?: string;
}

export const VISUALIZATION_ENTRIES: VisualizationEntry[] = [
  {
    title: "The Living Economy",
    description: "Interactive isometric exploration of India's 5 interconnected macroeconomic sectors.",
    href: "/#living-economy",
    icon: Layers,
    badge: "Isometric",
  },
  {
    title: "Sovereign Observatory",
    description: "Sovereign macro telemetry deck across central economic desks.",
    href: "/observatory?view=observatory",
    icon: Compass,
    badge: "Telemetry",
    viewParam: "observatory",
  },
  {
    title: "Macro Constellation",
    description: "Interactive 16-node physics simulation tracing sovereign indicator relationships.",
    href: "/observatory?view=constellation",
    icon: Network,
    badge: "Physics",
    viewParam: "constellation",
  },
  {
    title: "Interactive 3D Globe",
    description: "3D particle Fibonacci sphere with 7 global sovereign anchors and flight corridors.",
    href: "/observatory?view=globe",
    icon: Globe2,
    badge: "3D Globe",
    viewParam: "globe",
  },
];

const PRIMARY_DESTINATIONS = [
  {
    title: "Macro Accounts",
    href: "/gdp",
    matchPath: "/gdp",
    icon: TrendingUp,
    description: "National accounts, sectoral GVA across 8 industries, and 28 state accounts.",
  },
  {
    title: "Intelligence",
    href: "/intelligence",
    matchPath: "/intelligence",
    icon: Radio,
    description: "Global stock markets, sovereign alerts, and multi-country briefing feeds.",
  },
  {
    title: "How It Works",
    href: "/how-it-works",
    matchPath: "/how-it-works",
    icon: BookOpen,
    description: "UN SNA 2008 double deflation, sub-national synthesis, and official methodology.",
  },
];

const NAVIGATION_SECTIONS: NavSection[] = [
  {
    category: "National Accounts & Macro",
    items: [
      {
        title: "Macro Accounts Workspace",
        description: "Unified national accounts, sectoral GVA across 8 industries, 28 state accounts, and time series.",
        href: "/gdp",
        icon: TrendingUp,
        badge: "Flagship",
      },
      {
        title: "Deflator Simulator",
        description: "Interactive CPI vs WPI vs GDP Deflator modeling under commodity shocks.",
        href: "/deflator",
        icon: SlidersHorizontal,
        badge: "Simulator",
      },
      {
        title: "MoSPI Release Revisions",
        description: "1st AE -> 2nd AE -> Provisional Estimates lifecycle variance tracker.",
        href: "/revisions",
        icon: BarChart3,
      },
      {
        title: "Sector & State Composition",
        description: "Deconstruct 28 states & 3 UTs economic output and industry weights.",
        href: "/gdp?view=composition",
        icon: Compass,
      },
    ],
  },
  {
    category: "Sovereign Intelligence",
    items: [
      {
        title: "Global Market & Macro Intelligence",
        description: "Worldwide stock markets, economic news, country-focused briefings, and personalized alerts.",
        href: "/intelligence",
        icon: Radio,
        badge: "Live Feed",
      },
      {
        title: "Sovereign Credit Ratings",
        description: "Historical credit trajectories from Fitch, Moody's, and S&P alongside fiscal metrics.",
        href: "/ratings",
        icon: Award,
      },
      {
        title: "Consistency Index",
        description: "Cross-dataset forensic reconciliation between MoSPI, RBI, and CAG reports.",
        href: "/consistency",
        icon: CheckCircle2,
      },
      {
        title: "Global Macro Nexus",
        description: "Live World Bank multi-country indicators, debt-to-GDP, and balance of payments.",
        href: "/global",
        icon: Globe2,
        badge: "Live",
      },
      {
        title: "Sovereign AI Copilot",
        description: "Autonomous econometric reasoning assistant grounded in official gazettes.",
        href: "/ai",
        icon: Bot,
        badge: "AI",
      },
    ],
  },
  {
    category: "Standards & Verification",
    items: [
      {
        title: "How It Works (Architecture & Sources)",
        description: "UN SNA 2008 double deflation, sub-national synthesis, and official MoSPI citations.",
        href: "/how-it-works",
        icon: Compass,
        badge: "Guide",
      },
      {
        title: "National Accounts Methodology",
        description: "Mathematical formulation of double deflation and 2011-12 / 2022-23 base year documentation.",
        href: "/methodology",
        icon: BookOpen,
      },
      {
        title: "Data Sources & Provenance",
        description: "Cryptographic SHA-256 verification and official statistical gazette archives.",
        href: "/sources",
        icon: Database,
      },
      {
        title: "Contact & Institutional Desk",
        description: "Direct communications channel for data licensing, research collaborations, and SLA feeds.",
        href: "/contact",
        icon: Mail,
      },
    ],
  },
];

export function NavBar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  const [govModalOpen, setGovModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 3D Observatory Dropdown states
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const [visDropdownOpen, setVisDropdownOpen] = useState(false);
  const [drawerVisOpen, setDrawerVisOpen] = useState(false);
  const [searchParamView, setSearchParamView] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setSearchParamView(params.get("view"));
    }
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setVisDropdownOpen(false);
    setDrawerVisOpen(false);
  }, [pathname]);

  // Click outside and Escape handling for desktop dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(e.target as Node)
      ) {
        setVisDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setVisDropdownOpen(false);
      }
    };

    if (visDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [visDropdownOpen]);

  // Lock background scroll when drawer is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 py-3 sm:py-3.5 px-4 sm:px-6 lg:px-8 ${
          scrolled ? "backdrop-blur-md bg-[#E6E5DF]/90 shadow-xs" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
          {/* ========================================================= */}
          {/* ZONE 1 — LEFT: Brand identity & navigation menu launcher  */}
          {/* ========================================================= */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
            {/* ArthaLens Brand Emblem / Wordmark */}
            <Link
              href="/"
              className="inline-flex items-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D94E34] rounded-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
              aria-label="ArthaLens — Macroeconomic Intelligence Home"
            >
              {/* Mobile Viewport: Compact Emblem */}
              <div className="block sm:hidden shrink-0">
                <div className="relative h-8 w-8 rounded-lg overflow-hidden border border-[rgba(20,21,23,0.18)] bg-[#070B12] shadow-xs">
                  <Image
                    src="/brand/arthalens-symbol.png"
                    alt="ArthaLens"
                    width={32}
                    height={32}
                    priority
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Desktop Viewport: Official Brand Lockup */}
              <div className="hidden sm:block shrink-0">
                <div className="relative rounded-lg overflow-hidden border border-[rgba(20,21,23,0.18)] bg-[#070B12] shadow-xs px-2.5 py-1">
                  <Image
                    src="/brand/arthalens-logo-horizontal.png"
                    alt="ArthaLens — Macroeconomic Intelligence"
                    width={116}
                    height={36}
                    priority
                    className="h-7 w-auto object-contain"
                  />
                </div>
              </div>
            </Link>

            {/* Navigation Menu Trigger (Launcher) */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-[rgba(20,21,23,0.18)] bg-[#ECEBE5] px-2.5 sm:px-3 py-1.5 text-[12px] sm:text-[13px] font-sans font-medium text-[#141416] hover:bg-black/5 hover:border-[rgba(20,21,23,0.35)] transition-all shadow-2xs cursor-pointer active:scale-95 shrink-0"
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
            >
              <Menu className="h-3.5 w-3.5 text-[#141416]" />
              <span className="leading-none hidden xs:inline">Menu</span>
            </button>
          </div>

          {/* ========================================================= */}
          {/* ZONE 2 — CENTER: Primary navigation with 3D Observatory   */}
          {/* ========================================================= */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center justify-center gap-1 xl:gap-2 rounded-full border border-[rgba(20,21,23,0.1)] bg-[#ECEBE5]/70 p-1 backdrop-blur-xs shadow-2xs"
          >
            {/* 3D Observatory Collapsible Dropdown */}
            <div className="relative" ref={desktopDropdownRef}>
              <button
                type="button"
                onClick={() => setVisDropdownOpen((prev) => !prev)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown" && !visDropdownOpen) {
                    e.preventDefault();
                    setVisDropdownOpen(true);
                  }
                }}
                aria-haspopup="true"
                aria-expanded={visDropdownOpen}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-sans font-medium transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141416] ${
                  pathname === "/observatory" || (typeof window !== "undefined" && window.location.hash === "#living-economy")
                    ? "bg-[#141416] text-[#ECEBE5] shadow-xs font-semibold"
                    : "text-[#57585C] hover:text-[#141416] hover:bg-black/5"
                }`}
              >
                <Compass
                  className={`h-3.5 w-3.5 ${
                    pathname === "/observatory" || (typeof window !== "undefined" && window.location.hash === "#living-economy")
                      ? "text-[#059669]"
                      : "text-[#57585C]"
                  }`}
                />
                <span>3D Observatory</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    visDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {visDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute left-0 mt-2 w-80 sm:w-96 rounded-2xl border border-[rgba(20,21,23,0.18)] bg-[#ECEBE5] p-2.5 shadow-2xl z-50 backdrop-blur-md"
                    role="menu"
                    aria-label="3D Observatory Experiences"
                  >
                    <div className="flex items-center justify-between px-3 py-1.5 mb-1 border-b border-[rgba(20,21,23,0.1)]">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#828387]">
                        VISUALIZATION SUITE // 4 EXPERIENCES
                      </span>
                      <span className="flex h-1.5 w-1.5 rounded-full bg-[#059669] animate-pulse" />
                    </div>

                    <div className="space-y-1">
                      {VISUALIZATION_ENTRIES.map((vis) => {
                        const Icon = vis.icon;
                        const isEntryActive =
                          vis.href === "/#living-economy"
                            ? typeof window !== "undefined" && window.location.hash === "#living-economy"
                            : pathname === "/observatory" &&
                              (vis.viewParam === "observatory"
                                ? !searchParamView || searchParamView === "observatory"
                                : searchParamView === vis.viewParam);

                        return (
                          <Link
                            key={vis.title}
                            href={vis.href}
                            onClick={() => setVisDropdownOpen(false)}
                            role="menuitem"
                            className={`group flex items-start gap-3 p-2.5 rounded-xl border transition-all ${
                              isEntryActive
                                ? "bg-white border-[#141416]/25 shadow-xs"
                                : "bg-transparent border-transparent hover:bg-white/70 hover:border-[rgba(20,21,23,0.1)]"
                            }`}
                          >
                            <div className="p-2 rounded-lg bg-black/5 text-[#141416] group-hover:bg-[#141416] group-hover:text-[#ECEBE5] transition-colors shrink-0 mt-0.5">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <span className="font-heading text-xs sm:text-sm font-semibold text-[#141416] group-hover:text-[#D94E34] transition-colors truncate">
                                  {vis.title}
                                </span>
                                <span className="font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-black/5 text-[#57585C] shrink-0">
                                  {vis.badge}
                                </span>
                              </div>
                              <p className="font-sans text-[11px] text-[#57585C] leading-snug line-clamp-2">
                                {vis.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Top Destinations */}
            {PRIMARY_DESTINATIONS.map((dest) => {
              const isActive =
                pathname === dest.matchPath || pathname?.startsWith(dest.matchPath + "/");

              return (
                <Link
                  key={dest.title}
                  href={dest.href}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-sans font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-[#141416] text-[#ECEBE5] shadow-xs font-semibold"
                      : "text-[#57585C] hover:text-[#141416] hover:bg-black/5"
                  }`}
                >
                  <span>{dest.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* ========================================================= */}
          {/* ZONE 3 — RIGHT: Status, operational tools, user utilities */}
          {/* ========================================================= */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Compact Double Deflation Matrix Status Indicator with Accessible Tooltip */}
            <div className="relative group">
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-full border border-[rgba(20,21,23,0.14)] bg-[#ECEBE5] px-2.5 py-1 text-[11px] font-mono font-medium text-[#141416] hover:bg-[#DFDED8] transition-colors focus:outline-none focus:ring-1 focus:ring-[#059669] cursor-pointer"
                aria-label="Double Deflation Matrix Status Details"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#059669] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#059669]" />
                </span>
                <span className="hidden xl:inline text-[#141416] font-semibold">Matrix Active</span>
                <span className="xl:hidden font-bold text-[#059669]">SNA</span>
              </button>

              {/* Accessible Hover / Focus Popover Tooltip */}
              <div
                role="tooltip"
                className="pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto absolute right-0 top-full mt-2 hidden group-hover:block group-focus-within:block z-50 w-72 rounded-xl border border-[rgba(20,21,23,0.18)] bg-[#ECEBE5] p-3.5 shadow-xl backdrop-blur-md transition-all duration-200"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[rgba(20,21,23,0.1)]">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#059669] uppercase">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                    <span>UN SNA 2008 MATRIX</span>
                  </div>
                  <span className="font-mono text-[9px] text-[#828387]">Active Pipeline</span>
                </div>
                <div className="py-2 space-y-1 text-left">
                  <div className="font-heading text-xs font-bold text-[#141416]">
                    Double Deflation Benchmark Active
                  </div>
                  <p className="font-sans text-[11px] text-[#57585C] leading-snug">
                    Decouples gross output deflators from intermediate input indices to eradicate single-deflation bias under commodity volatility.
                  </p>
                </div>
                <div className="pt-2 border-t border-[rgba(20,21,23,0.1)] font-mono text-[9px] text-[#57585C] space-y-1 text-left">
                  <div className="flex justify-between">
                    <span>Benchmark:</span>
                    <span className="text-[#141416] font-bold">MoSPI Base 2022-23</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Standard:</span>
                    <span className="text-[#141416] font-bold">UN SNA 2008 §15</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Provenance:</span>
                    <span className="text-emerald-700 font-bold">SHA-256 Gazette Verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Center Trigger */}
            <NotificationCenter />

            {/* Government Terminal Launcher */}
            <div className="hidden sm:inline-flex">
              <ShinyButton
                onClick={() => setGovModalOpen(true)}
                className="!py-1.5 !px-3 sm:!px-3.5 !text-xs !font-sans !font-medium"
                icon={<Lock className="h-3 w-3 text-[#D94E34]" />}
              >
                Government
              </ShinyButton>
            </div>

            {/* User Profile / Auth Controls */}
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2 pl-1">
                <span className="font-sans text-xs text-[#57585C] font-medium">
                  {user?.name || "Researcher"}
                </span>
                <button
                  onClick={logout}
                  className="rounded-full px-2.5 py-1 text-xs font-sans text-[#828387] hover:text-[#141416] hover:bg-black/5 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex rounded-full px-3 py-1.5 text-xs font-sans font-medium text-[#57585C] hover:text-[#141416] hover:bg-black/5 transition-colors"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* FULL NAVIGATION DRAWER (Opened via Menu Button)           */}
      {/* ========================================================= */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-2 sm:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-[#141416]/50 backdrop-blur-xs"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="relative z-10 w-[calc(100vw-1rem)] sm:w-full max-w-5xl my-auto max-h-[92vh] overflow-y-auto rounded-2xl sm:rounded-3xl border border-[rgba(20,21,23,0.18)] bg-[#ECEBE5] p-4 sm:p-6 md:p-8 shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-6 border-b border-[rgba(20,21,23,0.12)]">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-xl border border-[rgba(20,21,23,0.15)] bg-[#070B12] p-1 shadow-xs">
                    <Image
                      src="/brand/arthalens-symbol.png"
                      alt="ArthaLens Symbol"
                      width={28}
                      height={28}
                      className="rounded-md"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono text-xs font-bold text-[#141416] uppercase tracking-wider">
                      ArthaLens Navigation Hub
                    </span>
                    <span className="font-mono text-[10px] text-[#828387]">
                      India Macroeconomic Intelligence Platform
                    </span>
                  </div>
                </div>

                <div className="hidden md:flex items-center">
                  <DynamicText
                    words={[
                      { text: "Autonomous Macro Intelligence Engine" },
                      { text: "UN SNA 2008 Double Deflation Pipeline" },
                      { text: "28 States & 3 UTs Macro Accounts" },
                      { text: "MoSPI & RBI Cryptographic Provenance" },
                    ]}
                    interval={2400}
                    loop={true}
                    className="!min-h-0"
                    containerClassName="!h-5 !min-w-[250px]"
                    textClassName="!text-xs !font-mono !text-[#57585C]"
                    dotClassName="!h-1.5 !w-1.5 bg-[#059669]"
                  />
                </div>

                <button
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-1.5 rounded-full border border-[rgba(20,21,23,0.15)] bg-white/70 px-3 py-1.5 text-xs font-mono font-medium text-[#141416] hover:bg-black/10 transition-all cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="h-3.5 w-3.5 text-[#141416]" />
                  <span>Close</span>
                </button>
              </div>

              {/* Top Section: Primary Core Destinations Partition */}
              <div className="py-6 border-b border-[rgba(20,21,23,0.12)]">
                <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider text-[#828387] mb-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                  <span>PRIMARY EXPERIENCES & DESTINATIONS</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  <Link
                    href="/observatory"
                    onClick={() => setMenuOpen(false)}
                    className={`group rounded-xl p-3 border transition-all ${
                      pathname === "/observatory"
                        ? "bg-[#141416] text-[#ECEBE5] border-[#141416] shadow-xs"
                        : "bg-white/80 border-[rgba(20,21,23,0.1)] hover:bg-[#141416] hover:text-[#ECEBE5]"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Compass className={`h-4 w-4 ${pathname === "/observatory" ? "text-[#059669]" : "text-[#D94E34] group-hover:text-emerald-400"}`} />
                      <span className="font-heading text-xs font-bold truncate">
                        3D Observatory
                      </span>
                    </div>
                    <p className={`text-[10px] leading-snug line-clamp-2 ${pathname === "/observatory" ? "text-[#ECEBE5]/80" : "text-[#57585C] group-hover:text-white/70"}`}>
                      All 4 macroeconomic visualization lenses: Living Economy, Telemetry, Constellation & 3D Globe.
                    </p>
                  </Link>

                  {PRIMARY_DESTINATIONS.map((dest) => {
                    const Icon = dest.icon;
                    const isActive = pathname === dest.matchPath;
                    return (
                      <Link
                        key={dest.title}
                        href={dest.href}
                        onClick={() => setMenuOpen(false)}
                        className={`group rounded-xl p-3 border transition-all ${
                          isActive
                            ? "bg-[#141416] text-[#ECEBE5] border-[#141416] shadow-xs"
                            : "bg-white/80 border-[rgba(20,21,23,0.1)] hover:bg-[#141416] hover:text-[#ECEBE5]"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className={`h-4 w-4 ${isActive ? "text-[#059669]" : "text-[#D94E34] group-hover:text-emerald-400"}`} />
                          <span className="font-heading text-xs font-bold truncate">
                            {dest.title}
                          </span>
                        </div>
                        <p className={`text-[10px] leading-snug line-clamp-2 ${isActive ? "text-[#ECEBE5]/80" : "text-[#57585C] group-hover:text-white/70"}`}>
                          {dest.description}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Categorized Options Grid */}
              <div className="grid gap-8 py-8 md:grid-cols-3">
                {NAVIGATION_SECTIONS.map((section) => (
                  <div key={section.category} className="space-y-4">
                    <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider text-[#828387]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#141416]" />
                      <span>{section.category}</span>
                    </div>

                    <div className="space-y-2">
                      {/* Collapsible 3D Observatory Group in Sovereign Intelligence */}
                      {section.category === "Sovereign Intelligence" && (
                        <div className="rounded-xl border border-[rgba(20,21,23,0.14)] bg-white/70 overflow-hidden transition-all">
                          <button
                            type="button"
                            onClick={() => setDrawerVisOpen((prev) => !prev)}
                            aria-expanded={drawerVisOpen}
                            className="w-full flex items-center justify-between p-3 hover:bg-white transition-all cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141416]"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="p-1.5 rounded-lg bg-[#141416] text-[#ECEBE5]">
                                <Compass className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-heading text-sm font-semibold text-[#141416]">
                                    3D Observatory
                                  </span>
                                  <span className="font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                                    4 Views
                                  </span>
                                </div>
                                <p className="font-sans text-[11px] text-[#57585C]">
                                  Living Economy, Telemetry, Constellation & Globe
                                </p>
                              </div>
                            </div>
                            <ChevronDown
                              className={`h-4 w-4 text-[#57585C] transition-transform duration-200 shrink-0 ${
                                drawerVisOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          <AnimatePresence>
                            {drawerVisOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="border-t border-[rgba(20,21,23,0.1)] p-2 space-y-1 bg-white/50"
                              >
                                {VISUALIZATION_ENTRIES.map((vis) => {
                                  const Icon = vis.icon;
                                  const isEntryActive =
                                    vis.href === "/#living-economy"
                                      ? typeof window !== "undefined" && window.location.hash === "#living-economy"
                                      : pathname === "/observatory" &&
                                        (vis.viewParam === "observatory"
                                          ? !searchParamView || searchParamView === "observatory"
                                          : searchParamView === vis.viewParam);

                                  return (
                                    <Link
                                      key={vis.title}
                                      href={vis.href}
                                      onClick={() => {
                                        setDrawerVisOpen(false);
                                        setMenuOpen(false);
                                      }}
                                      className={`group block rounded-lg p-2.5 border transition-all ${
                                        isEntryActive
                                          ? "bg-white border-[#141416]/25 shadow-xs"
                                          : "bg-transparent border-transparent hover:bg-white hover:border-[rgba(20,21,23,0.1)]"
                                      }`}
                                    >
                                      <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                          <div className="p-1 rounded-md bg-black/5 text-[#141416] group-hover:bg-[#141416] group-hover:text-[#ECEBE5] transition-colors">
                                            <Icon className="h-3.5 w-3.5" />
                                          </div>
                                          <span className="font-heading text-xs font-semibold text-[#141416] group-hover:text-[#D94E34] transition-colors">
                                            {vis.title}
                                          </span>
                                        </div>
                                        <span className="font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-black/5 text-[#57585C]">
                                          {vis.badge}
                                        </span>
                                      </div>
                                      <p className="font-sans text-[11px] text-[#57585C] leading-snug pl-6">
                                        {vis.description}
                                      </p>
                                    </Link>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.title}
                            href={item.href}
                            onClick={() => setMenuOpen(false)}
                            className={`group block rounded-xl p-3 border transition-all ${
                              isActive
                                ? "bg-white border-[#141416]/20 shadow-xs"
                                : "bg-transparent border-transparent hover:bg-white/60 hover:border-[rgba(20,21,23,0.1)]"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-black/5 text-[#141416] group-hover:bg-[#141416] group-hover:text-[#ECEBE5] transition-colors">
                                  <Icon className="h-4 w-4" />
                                </div>
                                <span className="font-heading text-sm font-semibold text-[#141416] group-hover:text-[#D94E34] transition-colors">
                                  {item.title}
                                </span>
                              </div>
                              {item.badge && (
                                <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-black/5 text-[#57585C]">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="font-sans text-xs text-[#57585C] leading-snug pl-8">
                              {item.description}
                            </p>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Quick Actions & System Status */}
              <div className="pt-6 border-t border-[rgba(20,21,23,0.12)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-mono text-[#828387]">
                  <span className="h-2 w-2 rounded-full bg-[#059669] shrink-0 animate-pulse" />
                  <span>UN SNA 2008 DOUBLE DEFLATION MATRIX ACTIVE • BASE 2022-23</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <ShinyButton
                    onClick={() => {
                      setMenuOpen(false);
                      setGovModalOpen(true);
                    }}
                    className="!py-1.5 !px-3 sm:!px-3.5 !text-xs !font-medium"
                    icon={<Lock className="h-3 w-3 text-[#D94E34]" />}
                  >
                    Government Terminal
                  </ShinyButton>

                  {isAuthenticated ? (
                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                      className="btn-realistic btn-outline-pill px-3.5 py-1.5 text-xs font-semibold"
                    >
                      Logout ({user?.name || "User"})
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="btn-realistic btn-outline-pill px-3.5 py-1.5 text-xs font-semibold"
                    >
                      Sign in
                    </Link>
                  )}

                  <Link
                    href="/gdp"
                    onClick={() => setMenuOpen(false)}
                    className="btn-realistic btn-solid-black px-4 py-1.5 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <span>Launch Macro Workspace</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Secret Government Terminal Modal */}
      <GovernmentTerminalModal
        isOpen={govModalOpen}
        onClose={() => setGovModalOpen(false)}
      />
    </>
  );
}
