"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  TrendingUp,
  SlidersHorizontal,
  Compass,
  Award,
  Bot,
  Database,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface Pathway {
  code: string;
  title: string;
  href: string;
  description: string;
  actionText: string;
  icon: React.ElementType;
  badge: string;
}

const PATHWAYS: Pathway[] = [
  {
    code: "01 // NATIONAL ACCOUNTS",
    title: "GDP Accounts & State GSDP",
    href: "/gdp",
    description: "Drill down into Real (+8.2%) vs Nominal (+9.6%) time series, 8 primary sectoral GVA shares, and 28 state domestic product accounts.",
    actionText: "Launch GDP Explorer",
    icon: TrendingUp,
    badge: "Official MoSPI",
  },
  {
    code: "02 // DEFLATOR ENGINE",
    title: "Deflator & Inflation Modeling",
    href: "/deflator",
    description: "Simulate how shifts in headline CPI (4.83%) and wholesale WPI (1.26%) distort implicit price deflators under global commodity swings.",
    actionText: "Open Simulator",
    icon: SlidersHorizontal,
    badge: "Interactive",
  },
  {
    code: "03 // DRIVERS & DISCREPANCIES",
    title: "Expenditure & Demand Decomposition",
    href: "/gdp/why",
    description: "Deconstruct Private Consumption (PFCE), Government Outlays (GFCE), and Capital Formation (GFCF) to isolate statistical discrepancies.",
    actionText: "Analyze Drivers",
    icon: Compass,
    badge: "Discrepancy Triage",
  },
  {
    code: "04 // SOVEREIGN RATINGS",
    title: "Credit Ratings & Consistency Audit",
    href: "/ratings",
    description: "Examine Fitch, Moody's, and S&P ratings alongside fiscal deficit data and audit multi-agency reconciliation across MoSPI, RBI, and CAG.",
    actionText: "Audit Ratings",
    icon: Award,
    badge: "Triangulation",
  },
  {
    code: "05 // SOVEREIGN COPILOT",
    title: "MoSPI-Grounded Research AI",
    href: "/ai",
    description: "Query complex national accounts via natural language with exact gazette statement citations and strict provenance boundaries.",
    actionText: "Query Copilot",
    icon: Bot,
    badge: "Grounded AI",
  },
  {
    code: "06 // METHODOLOGY & PROVENANCE",
    title: "UN SNA 2008 & Cryptographic Logs",
    href: "/how-it-works",
    description: "Inspect mathematical proofs, base year 2022-23 conversion formulas, MoSPI Sources & Methods, and SHA-256 gazette hashes.",
    actionText: "View Methodology",
    icon: Database,
    badge: "Zero Synthetic",
  },
];

export function ContinueInvestigationSection() {
  return (
    <section className="relative py-20 sm:py-28 bg-[#ECEBE5] border-t border-[rgba(20,21,23,0.14)] overflow-hidden">
      {/* Precision Top Crosshairs */}
      <div className="absolute top-0 left-6 sm:left-12 font-mono text-xs text-[#828387] -translate-y-1/2 pointer-events-none select-none">
        +
      </div>
      <div className="absolute top-0 right-6 sm:right-12 font-mono text-xs text-[#828387] -translate-y-1/2 pointer-events-none select-none">
        +
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-[#141416]">
            <span className="h-2 w-2 rounded-full bg-[#059669]" />
            <span>CHAPTER 06 // CONTINUING RESEARCH</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-6xl font-extrabold tracking-tight text-[#141416] leading-[1.05]">
            The economy is a living record.
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#57585C] leading-relaxed pt-2">
            Choose an analytical portal below to begin interrogating India's macroeconomic architecture:
          </p>
        </div>

        {/* 6 Exploratory Pathways Directory (Clean Architectural Grid with Varied Visual Rhythm) */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PATHWAYS.map((pathway) => {
            const Icon = pathway.icon;
            return (
              <Link
                key={pathway.code}
                href={pathway.href}
                className="group relative flex flex-col justify-between p-5 sm:p-7 rounded-2xl bg-[#E6E5DF] border border-[rgba(20,21,23,0.12)] hover:border-[#141416] hover:bg-[#DFDED8] transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-4">
                    <span className="text-[#828387] font-semibold">{pathway.code}</span>
                    <span className="rounded-sm bg-[rgba(20,21,23,0.06)] px-2 py-0.5 text-[10px] font-bold text-[#141416]">
                      {pathway.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-2.5">
                    <div className="h-9 w-9 rounded-xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.1)] flex items-center justify-center text-[#141416] group-hover:bg-[#141416] group-hover:text-white transition-colors shrink-0">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-[#141416] group-hover:text-[#D94E34] transition-colors">
                      {pathway.title}
                    </h3>
                  </div>

                  <p className="font-sans text-xs text-[#57585C] leading-relaxed mb-6">
                    {pathway.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[rgba(20,21,23,0.08)] flex items-center justify-between text-xs font-mono font-bold text-[#141416]">
                  <span>{pathway.actionText}</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform text-[#D94E34]" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Sovereign Open Data Guarantee & Official Brand Charter */}
        <div className="mt-10 sm:mt-14 p-6 sm:p-8 rounded-3xl bg-[#070B12] border border-[rgba(255,255,255,0.12)] text-[#ECEBE5] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 text-center sm:text-left">
            <div className="shrink-0 p-1.5 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
              <Image
                src="/brand/arthalens-logo.png"
                alt="ArthaLens — Macroeconomics. Clearer."
                width={118}
                height={140}
                className="rounded-xl object-contain"
              />
            </div>
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 font-mono text-[11px] font-bold text-[#D94E34] uppercase tracking-wider">
                <span className="h-2 w-2 rounded-full bg-[#D94E34]" />
                <span>OFFICIAL BRAND CHARTER & PROVENANCE GUARANTEE</span>
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-white tracking-tight">
                Macroeconomics. Clearer.
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#94A3B8] max-w-xl leading-relaxed">
                ArthaLens is India&apos;s sovereign macroeconomic intelligence observatory. All series are synthesized directly from official MoSPI and RBI gazettes with cryptographic SHA-256 provenance.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
            <Link
              href="/sources"
              className="text-[#ECEBE5] hover:text-[#D94E34] underline underline-offset-4 font-semibold transition-colors"
            >
              Sources &amp; Methods
            </Link>
            <span className="text-white/30">•</span>
            <Link
              href="/about"
              className="text-[#ECEBE5] hover:text-[#D94E34] underline underline-offset-4 font-semibold transition-colors"
            >
              Open Data Policy
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
