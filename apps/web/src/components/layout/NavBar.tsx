"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  SlidersHorizontal,
  FileSpreadsheet,
  CheckCircle2,
  Award,
  Globe2,
  Bot,
  Compass,
  ShieldCheck,
  ArrowRight,
  Database,
  BarChart3,
  BookOpen,
} from "lucide-react";

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

const NAVIGATION_SECTIONS: NavSection[] = [
  {
    category: "National Accounts & Macro",
    items: [
      {
        title: "Macro Analytics Terminal",
        description: "Full-viewport executive dashboard, sectoral shares, state rankings & discrepancy telemetry.",
        href: "/analytics",
        icon: BarChart3,
        badge: "New",
      },
      {
        title: "GDP Explorer & State GVA",
        description: "Official real & nominal series, sectoral decomposition, and 28 state accounts.",
        href: "/gdp",
        icon: TrendingUp,
        badge: "MoSPI",
      },
      {
        title: "Deflator Simulator",
        description: "Interactive CPI vs WPI vs GDP Deflator modeling under commodity shocks.",
        href: "/deflator",
        icon: SlidersHorizontal,
        badge: "Simulator",
      },
      {
        title: "Growth Drivers & Discrepancies",
        description: "Deconstruct PFCE, GFCE, GFCF expenditure drivers and statistical anomalies.",
        href: "/gdp/why",
        icon: Compass,
      },
    ],
  },
  {
    category: "Sovereign Intelligence",
    items: [
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
        title: "3D Particle Observatory",
        description: "WebGPU / TSL 26,000 instanced particle sovereign ledger in living motion.",
        href: "/#observatory",
        icon: Globe2,
        badge: "WebGPU",
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close hamburger menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

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
      {/* Antimetal Floating Capsule Navigation Bar */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 py-3 sm:py-4 px-4 sm:px-6 ${
          scrolled ? "backdrop-blur-md bg-[#E6E5DF]/85 shadow-xs" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
          {/* Left: Aligned Hamburger Menu Button & Telemetry Ticker */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 rounded-full border border-[rgba(20,21,23,0.18)] bg-[#ECEBE5] px-3.5 py-1.5 text-[13px] font-sans font-medium text-[#141416] hover:bg-black/5 hover:border-[rgba(20,21,23,0.35)] transition-all shadow-2xs cursor-pointer active:scale-95"
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
            >
              <Menu className="h-3.5 w-3.5 text-[#141416]" />
              <span className="leading-none">Menu</span>
            </button>

            <Link
              href="/how-it-works"
              className={`hidden sm:inline-flex items-center rounded-full px-3 py-1.5 text-[13px] font-sans font-medium transition-colors ${
                pathname === "/how-it-works"
                  ? "bg-[#141416] text-[#ECEBE5]"
                  : "text-[#57585C] hover:text-[#141416] hover:bg-black/5"
              }`}
            >
              How It Works
            </Link>

            {/* Live Telemetry Dynamic Text Ticker (Desktop) */}
            <div className="hidden lg:flex items-center rounded-full border border-[rgba(20,21,23,0.1)] bg-[#ECEBE5]/60 px-3 py-1">
              <DynamicText
                words={[
                  { text: "MoSPI National Accounts • FY24" },
                  { text: "Double Deflation Matrix Active" },
                  { text: "Real GDP: ₹173.8L Cr (Base 2011-12)" },
                  { text: "State GVA • 28 States & 3 UTs" },
                  { text: "RBI High-Frequency Indicators" },
                ]}
                interval={2600}
                loop={true}
                className="!min-h-0"
                containerClassName="!h-4 !min-w-[210px]"
                textClassName="!text-[11px] !font-mono !text-[#57585C]"
                dotClassName="!h-1.5 !w-1.5 bg-[#059669]"
              />
            </div>
          </div>

          {/* Center Brand Capsule Badge */}
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-full border border-[rgba(20,21,23,0.15)] bg-[#ECEBE5] px-4 py-1.5 shadow-2xs hover:border-[rgba(20,21,23,0.3)] transition-all"
          >
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#141416]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#D94E34]" />
            </div>
            <span className="font-heading text-lg font-bold tracking-tight text-[#141416]">
              Artha<span className="font-sans font-light text-xs text-[#57585C] ml-1">LENS</span>
            </span>
          </Link>

          {/* Right Action Group */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ShinyButton
              onClick={() => setGovModalOpen(true)}
              className="!py-1.5 !px-3 sm:!px-3.5 !text-xs !font-sans !font-medium"
              icon={<Lock className="h-3 w-3 text-[#D94E34]" />}
            >
              Government
            </ShinyButton>

            <Link
              href="/gdp"
              className="btn-realistic btn-solid-black text-xs px-3.5 py-1.5 font-sans font-semibold shadow-xs"
            >
              GDP Explorer
            </Link>

            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2 pl-1">
                <span className="font-sans text-xs text-[#57585C]">
                  {user?.name || "Researcher"}
                </span>
                <button
                  onClick={logout}
                  className="rounded-full px-2.5 py-1 text-xs font-sans text-[#828387] hover:text-[#141416]"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex rounded-full px-3 py-1.5 text-xs font-sans font-medium text-[#57585C] hover:text-[#141416] transition-colors"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Aligned Full-Screen / Modal Hamburger Menu */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center">
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
              className="relative z-10 w-full max-w-5xl mx-4 mt-4 sm:mt-8 max-h-[88vh] overflow-y-auto rounded-3xl border border-[rgba(20,21,23,0.18)] bg-[#ECEBE5] p-6 sm:p-8 shadow-2xl"
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-6 border-b border-[rgba(20,21,23,0.12)]">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 rounded-full border border-[rgba(20,21,23,0.15)] bg-white/60 px-3 py-1">
                    <span className="h-2 w-2 rounded-full bg-[#D94E34]" />
                    <span className="font-mono text-xs font-bold text-[#141416] uppercase tracking-wider">
                      ArthaLens Navigation Hub
                    </span>
                  </div>

                  <div className="hidden md:flex items-center">
                    <DynamicText
                      words={[
                        { text: "Autonomous Macro Intelligence Engine" },
                        { text: "UN SNA 2008 Double Deflation" },
                        { text: "28 States & 3 UTs Macro Accounts" },
                        { text: "MoSPI & RBI Cryptographic Provenance" },
                      ]}
                      interval={2400}
                      loop={true}
                      className="!min-h-0"
                      containerClassName="!h-5 !min-w-[240px]"
                      textClassName="!text-xs !font-mono !text-[#57585C]"
                      dotClassName="!h-1.5 !w-1.5 bg-[#059669]"
                    />
                  </div>
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

              {/* Categorized Options Grid */}
              <div className="grid gap-8 py-8 md:grid-cols-3">
                {NAVIGATION_SECTIONS.map((section) => (
                  <div key={section.category} className="space-y-4">
                    <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider text-[#828387]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#141416]" />
                      <span>{section.category}</span>
                    </div>

                    <div className="space-y-2">
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

              {/* Footer Quick Actions */}
              <div className="pt-6 border-t border-[rgba(20,21,23,0.12)] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-xs font-mono text-[#828387]">
                  <span className="h-2 w-2 rounded-full bg-[#059669]" />
                  <span>DATA PIPELINES SYNCHRONIZED: OFFICIAL MOSPI & RBI RELEASES</span>
                </div>

                <div className="flex items-center gap-3">
                  <ShinyButton
                    onClick={() => {
                      setMenuOpen(false);
                      setGovModalOpen(true);
                    }}
                    className="!py-1.5 !px-3.5 !text-xs !font-medium"
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
                      className="btn-realistic btn-outline-pill px-4 py-1.5 text-xs font-semibold"
                    >
                      Logout ({user?.name || "User"})
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="btn-realistic btn-outline-pill px-4 py-1.5 text-xs font-semibold"
                    >
                      Sign in
                    </Link>
                  )}

                  <Link
                    href="/gdp"
                    onClick={() => setMenuOpen(false)}
                    className="btn-realistic btn-solid-black px-5 py-1.5 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <span>Launch Explorer</span>
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