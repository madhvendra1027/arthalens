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
  const [drawerVisOpen, setDrawerVisOpen] = useState(true); // default expanded on mobile drawer for easy discovery
  const [searchParamView, setSearchParamView] = useState<string | null>(null);

  // Matrix status tooltip toggle for touch devices
  const statusPopoverRef = useRef<HTMLDivElement>(null);
  const [statusPopoverOpen, setStatusPopoverOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setSearchParamView(params.get("view"));
    }
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setVisDropdownOpen(false);
    setStatusPopoverOpen(false);
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
      if (
        statusPopoverRef.current &&
        !statusPopoverRef.current.contains(e.target as Node)
      ) {
        setStatusPopoverOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setVisDropdownOpen(false);
        setStatusPopoverOpen(false);
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, { passive: true });
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Lock background scroll when drawer is open
  useEffect(() => {
    if (menuOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isObservatoryActive =
    pathname === "/observatory" ||
    (typeof window !== "undefined" && window.location.hash === "#living-economy");

  const getActiveVisState = (vis: VisualizationEntry) => {
    if (vis.href === "/#living-economy") {
      return (
        typeof window !== "undefined" && window.location.hash === "#living-economy"
      );
    }
    return (
      pathname === "/observatory" &&
      (vis.viewParam === "observatory"
        ? !searchParamView || searchParamView === "observatory"
        : searchParamView === vis.viewParam)
    );
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 py-2.5 sm:py-3.5 px-3 sm:px-6 lg:px-8 pt-safe ${
          scrolled ? "backdrop-blur-md bg-[#E6E5DF]/95 shadow-xs border-b border-[rgba(20,21,23,0.08)]" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-2 sm:gap-4">
          {/* ========================================================= */}
          {/* ZONE 1 — LEFT: Brand identity & navigation menu launcher  */}
          {/* ========================================================= */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* ArthaLens Brand Link */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D94E34] rounded-lg transition-transform hover:scale-[1.02] active:scale-[0.98] min-h-[44px] min-w-[44px] py-1"
              aria-label="ArthaLens — Macroeconomic Intelligence Home"
            >
              <div className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-lg overflow-hidden border border-[rgba(20,21,23,0.18)] bg-[#070B12] shadow-xs shrink-0 flex items-center justify-center">
                <Image
                  src="/brand/arthalens-symbol.png"
                  alt="ArthaLens"
                  width={36}
                  height={36}
                  priority
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Wordmark visible on tablet & desktop */}
              <div className="hidden xs:flex flex-col">
                <span className="font-heading text-sm sm:text-base font-extrabold tracking-tight text-[#141416] leading-none">
                  ArthaLens
                </span>
                <span className="font-mono text-[9px] text-[#828387] tracking-wider uppercase leading-tight mt-0.5">
                  Macro Intelligence
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Menu Launcher */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="hidden lg:flex items-center gap-1.5 rounded-full border border-[rgba(20,21,23,0.18)] bg-[#ECEBE5] px-3 py-1.5 text-[13px] font-sans font-medium text-[#141416] hover:bg-black/5 hover:border-[rgba(20,21,23,0.35)] transition-all shadow-2xs cursor-pointer active:scale-95 shrink-0 min-h-[36px]"
              aria-label="Open complete navigation index"
              aria-expanded={menuOpen}
            >
              <Menu className="h-3.5 w-3.5 text-[#141416]" />
              <span className="leading-none">Index</span>
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
                  isObservatoryActive
                    ? "bg-[#141416] text-[#ECEBE5] shadow-xs font-semibold"
                    : "text-[#57585C] hover:text-[#141416] hover:bg-black/5"
                }`}
              >
                <Compass
                  className={`h-3.5 w-3.5 ${
                    isObservatoryActive ? "text-[#059669]" : "text-[#57585C]"
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
                        const isEntryActive = getActiveVisState(vis);

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
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Double Deflation Matrix Status Indicator (Click-toggle popover on touch & hover on desktop) */}
            <div className="relative" ref={statusPopoverRef}>
              <button
                type="button"
                onClick={() => setStatusPopoverOpen((prev) => !prev)}
                className="flex items-center gap-1.5 rounded-full border border-[rgba(20,21,23,0.14)] bg-[#ECEBE5] px-2.5 py-1.5 sm:py-1 text-[11px] font-mono font-medium text-[#141416] hover:bg-[#DFDED8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#059669] cursor-pointer min-h-[38px] sm:min-h-0"
                aria-label="Double Deflation Matrix Status Details"
                aria-expanded={statusPopoverOpen}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#059669] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#059669]" />
                </span>
                <span className="hidden xl:inline text-[#141416] font-semibold">Matrix Active</span>
                <span className="xl:hidden font-bold text-[#059669]">SNA</span>
              </button>

              {/* Accessible Popover */}
              <AnimatePresence>
                {statusPopoverOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    role="tooltip"
                    className="absolute right-0 top-full mt-2 z-50 w-72 sm:w-80 rounded-2xl border border-[rgba(20,21,23,0.18)] bg-[#ECEBE5] p-3.5 shadow-2xl backdrop-blur-md"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[rgba(20,21,23,0.1)]">
                      <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#059669] uppercase">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                        <span>UN SNA 2008 MATRIX</span>
                      </div>
                      <button
                        onClick={() => setStatusPopoverOpen(false)}
                        className="text-[#828387] hover:text-[#141416] p-0.5 rounded cursor-pointer"
                        aria-label="Close status popover"
                      >
                        <X className="h-3 w-3" />
                      </button>
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notification Center Trigger */}
            <NotificationCenter />

            {/* Government Terminal Launcher (Desktop) */}
            <div className="hidden sm:inline-flex">
              <ShinyButton
                onClick={() => setGovModalOpen(true)}
                className="!py-1.5 !px-3 sm:!px-3.5 !text-xs !font-sans !font-medium"
                icon={<Lock className="h-3 w-3 text-[#D94E34]" />}
              >
                Government
              </ShinyButton>
            </div>

            {/* Desktop Auth Controls */}
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2 pl-1">
                <span className="font-sans text-xs text-[#57585C] font-medium truncate max-w-[100px]">
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

            {/* Mobile Touch-Friendly Menu Trigger Button (min 44x44px target) */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden flex items-center justify-center gap-1.5 rounded-full border border-[rgba(20,21,23,0.18)] bg-[#ECEBE5] p-2 text-xs font-sans font-semibold text-[#141416] hover:bg-black/5 hover:border-[rgba(20,21,23,0.35)] transition-all shadow-2xs cursor-pointer active:scale-95 min-h-[44px] min-w-[44px] shrink-0"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <X className="h-4 w-4 text-[#141416]" />
              ) : (
                <>
                  <Menu className="h-4 w-4 text-[#141416]" />
                  <span className="text-[11px] font-mono pr-0.5">Menu</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* MOBILE-FIRST NAVIGATION DRAWER & DIALOG                   */}
      {/* ========================================================= */}
      <AnimatePresence>
        {menuOpen && (
          <div
            className="fixed inset-0 z-50 flex items-start justify-end"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-[#141416]/60 backdrop-blur-xs"
              aria-hidden="true"
            />

            {/* Drawer Panel: Slide-in sheet on mobile, spacious modal on desktop */}
            <motion.div
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 28 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="relative z-10 w-full sm:max-w-md md:max-w-lg lg:max-w-xl h-full max-h-[100dvh] bg-[#ECEBE5] border-l border-[rgba(20,21,23,0.18)] shadow-2xl flex flex-col justify-between overflow-hidden"
            >
              {/* Drawer Sticky Top Header */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[rgba(20,21,23,0.12)] bg-[#ECEBE5]/95 backdrop-blur-md pt-safe shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-xl border border-[rgba(20,21,23,0.15)] bg-[#070B12] p-1.5 shadow-xs">
                    <Image
                      src="/brand/arthalens-symbol.png"
                      alt="ArthaLens Symbol"
                      width={28}
                      height={28}
                      className="rounded-md"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-heading text-sm font-bold text-[#141416]">
                      ArthaLens Navigation
                    </span>
                    <span className="font-mono text-[10px] text-[#828387]">
                      Macroeconomic Intelligence Suite
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center rounded-full border border-[rgba(20,21,23,0.15)] bg-white/80 p-2.5 text-xs font-mono font-medium text-[#141416] hover:bg-black/10 transition-all cursor-pointer min-h-[44px] min-w-[44px]"
                  aria-label="Close navigation menu"
                >
                  <X className="h-4 w-4 text-[#141416]" />
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-5 [scrollbar-width:thin] overscroll-contain">
                {/* 1. 3D OBSERVATORY NESTED DROPDOWN (Primary Feature Group) */}
                <div className="rounded-2xl border-2 border-[rgba(20,21,23,0.16)] bg-white/70 overflow-hidden shadow-xs">
                  {/* Expand / Collapse Row (min 48px height, easy tap) */}
                  <button
                    type="button"
                    onClick={() => setDrawerVisOpen((prev) => !prev)}
                    aria-expanded={drawerVisOpen}
                    className={`w-full flex items-center justify-between p-3.5 transition-all cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141416] min-h-[52px] ${
                      isObservatoryActive ? "bg-[#141416]/5" : "hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-[#141416] text-[#ECEBE5] shrink-0">
                        <Compass className="h-4 w-4 text-[#059669]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-heading text-sm font-bold text-[#141416]">
                            3D Observatory
                          </span>
                          <span className="font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                            4 Views
                          </span>
                          {isObservatoryActive && (
                            <span className="h-1.5 w-1.5 rounded-full bg-[#059669] animate-pulse" />
                          )}
                        </div>
                        <p className="font-sans text-[11px] text-[#57585C] leading-snug">
                          Living Economy, Telemetry, Constellation & Globe
                        </p>
                      </div>
                    </div>
                    <div className="p-1.5 rounded-full bg-black/5 shrink-0">
                      <ChevronDown
                        className={`h-4 w-4 text-[#141416] transition-transform duration-200 ${
                          drawerVisOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* Nested 4 Experiences List */}
                  <AnimatePresence initial={false}>
                    {drawerVisOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-[rgba(20,21,23,0.1)] p-2 space-y-1.5 bg-white/40"
                      >
                        {VISUALIZATION_ENTRIES.map((vis) => {
                          const Icon = vis.icon;
                          const isEntryActive = getActiveVisState(vis);

                          return (
                            <Link
                              key={vis.title}
                              href={vis.href}
                              onClick={() => {
                                setMenuOpen(false);
                              }}
                              className={`group flex items-start gap-3 p-3 rounded-xl border transition-all min-h-[48px] ${
                                isEntryActive
                                  ? "bg-white border-[#059669] ring-1 ring-[#059669]/50 shadow-xs"
                                  : "bg-transparent border-transparent hover:bg-white hover:border-[rgba(20,21,23,0.1)]"
                              }`}
                            >
                              <div className="p-2 rounded-lg bg-black/5 text-[#141416] group-hover:bg-[#141416] group-hover:text-[#ECEBE5] transition-colors shrink-0 mt-0.5">
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1 mb-0.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-heading text-xs font-bold text-[#141416] group-hover:text-[#D94E34] transition-colors truncate">
                                      {vis.title}
                                    </span>
                                    {isEntryActive && (
                                      <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                                    )}
                                  </div>
                                  <span className="font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-black/5 text-[#57585C] shrink-0">
                                    {vis.badge}
                                  </span>
                                </div>
                                <p className="font-sans text-[11px] text-[#57585C] leading-snug">
                                  {vis.description}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 2. PRIMARY DESTINATIONS TILES */}
                <div className="space-y-2">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#828387] block px-1">
                    PRIMARY DESTINATIONS
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {PRIMARY_DESTINATIONS.map((dest) => {
                      const Icon = dest.icon;
                      const isActive =
                        pathname === dest.matchPath || pathname?.startsWith(dest.matchPath + "/");

                      return (
                        <Link
                          key={dest.title}
                          href={dest.href}
                          onClick={() => setMenuOpen(false)}
                          className={`group flex items-start gap-3 p-3 rounded-xl border transition-all min-h-[48px] ${
                            isActive
                              ? "bg-white border-[#141416] shadow-xs"
                              : "bg-white/70 border-[rgba(20,21,23,0.1)] hover:bg-white"
                          }`}
                        >
                          <div className="p-2 rounded-lg bg-black/5 text-[#141416] group-hover:bg-[#141416] group-hover:text-[#ECEBE5] transition-colors shrink-0 mt-0.5">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="font-heading text-xs font-bold text-[#141416] group-hover:text-[#D94E34] transition-colors">
                                {dest.title}
                              </span>
                              {isActive && (
                                <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#141416] text-[#ECEBE5]">
                                  Active
                                </span>
                              )}
                            </div>
                            <p className="font-sans text-[11px] text-[#57585C] leading-snug">
                              {dest.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* 3. CATEGORIZED NAVIGATION SECTIONS (Structured & accessible) */}
                <div className="space-y-4 pt-2 border-t border-[rgba(20,21,23,0.1)]">
                  {NAVIGATION_SECTIONS.map((section) => (
                    <div key={section.category} className="space-y-2">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#828387] block px-1">
                        {section.category}
                      </span>
                      <div className="space-y-1">
                        {section.items.map((item) => {
                          const Icon = item.icon;
                          const isActive = pathname === item.href;
                          return (
                            <Link
                              key={item.title}
                              href={item.href}
                              onClick={() => setMenuOpen(false)}
                              className={`group flex items-start gap-2.5 p-2.5 rounded-xl border transition-all min-h-[44px] ${
                                isActive
                                  ? "bg-white border-[#141416]/20 shadow-xs"
                                  : "bg-transparent border-transparent hover:bg-white/60 hover:border-[rgba(20,21,23,0.1)]"
                              }`}
                            >
                              <div className="p-1.5 rounded-lg bg-black/5 text-[#141416] group-hover:bg-[#141416] group-hover:text-[#ECEBE5] transition-colors shrink-0 mt-0.5">
                                <Icon className="h-3.5 w-3.5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                  <span className="font-heading text-xs font-semibold text-[#141416] group-hover:text-[#D94E34] transition-colors truncate">
                                    {item.title}
                                  </span>
                                  {item.badge && (
                                    <span className="font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-black/5 text-[#57585C] shrink-0">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="font-sans text-[11px] text-[#57585C] leading-snug line-clamp-1">
                                  {item.description}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Drawer Bottom Actions & Status */}
              <div className="p-4 sm:p-5 border-t border-[rgba(20,21,23,0.12)] bg-[#E6E5DF]/90 backdrop-blur-md pb-safe space-y-3 shrink-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#828387]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#059669] shrink-0 animate-pulse" />
                    <span className="truncate">UN SNA 2008 • BASE 2022-23</span>
                  </div>

                  {isAuthenticated ? (
                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                      className="font-mono text-xs text-[#828387] hover:text-[#141416] px-2 py-1 rounded cursor-pointer"
                    >
                      Sign Out ({user?.name?.split(" ")[0] || "User"})
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="font-mono text-xs font-bold text-[#141416] hover:text-[#D94E34] px-2 py-1"
                    >
                      Sign In &rarr;
                    </Link>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setGovModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-[rgba(20,21,23,0.2)] bg-white/80 p-2.5 font-mono text-xs font-semibold text-[#141416] hover:bg-white transition-colors cursor-pointer min-h-[44px]"
                  >
                    <Lock className="h-3.5 w-3.5 text-[#D94E34]" />
                    <span>Terminal</span>
                  </button>

                  <Link
                    href="/gdp"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-[#141416] p-2.5 font-mono text-xs font-bold text-[#ECEBE5] hover:bg-[#D94E34] transition-colors min-h-[44px]"
                  >
                    <span>Macro Desk</span>
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
