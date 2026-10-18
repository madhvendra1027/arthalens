"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { ArthaLensLogo } from "@/components/ui/ArthaLensLogo";
import { ShieldCheck, ExternalLink, Mail } from "lucide-react";

export interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
    badge?: string;
  }[];
}

export interface StatusItem {
  text: string;
  subtext: string;
}

export interface FooterSectionProps {
  aboutTitle?: string;
  aboutText?: string;
  status?: StatusItem[];
  menuItems?: MenuItem[];
  bottomLinks?: { text: string; url: string }[];
  showSystemStatus?: boolean;
  className?: string;
}

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    title: "Analytical Engines",
    links: [
      { text: "Macro Accounts Workspace", url: "/gdp", badge: "Flagship" },
      { text: "Global Market & Macro Intelligence", url: "/intelligence", badge: "New" },
      { text: "Deflator & Inflation Simulator", url: "/deflator", badge: "Live" },
      { text: "GDP Growth & Expenditure Drivers", url: "/gdp/why" },
      { text: "Sovereign AI Copilot", url: "/ai", badge: "Grounded" },
      { text: "Global Macroeconomic Nexus", url: "/global", badge: "World Bank" },
    ],
  },
  {
    title: "Institutions & Feeds",
    links: [
      { text: "Official Sources & Registry", url: "/sources", badge: "SHA-256" },
      { text: "Sovereign Credit Ratings", url: "/ratings" },
      { text: "MoSPI NAS Releases", url: "/sources" },
      { text: "RBI DBIE Data Feeds", url: "/sources" },
      { text: "State DES Surveys", url: "/sources" },
    ],
  },
  {
    title: "Methodology & Audit",
    links: [
      { text: "How It Works & Architecture", url: "/how-it-works", badge: "Guide" },
      { text: "UN SNA 2008 Double Deflation", url: "/methodology" },
      { text: "Multi-Source Consistency Audit", url: "/consistency" },
      { text: "MoSPI Revision Calendar", url: "/revisions" },
      { text: "Base Year Harmonization", url: "/methodology" },
    ],
  },
  {
    title: "Legal & Governance",
    links: [
      { text: "Privacy Policy", url: "/privacy", badge: "Updated" },
      { text: "Terms & Conditions", url: "/terms" },
      { text: "Institutional Inquiries", url: "/contact", badge: "Direct" },
      { text: "Governance & About", url: "/about" },
      { text: "Institutional Login", url: "/login" },
    ],
  },
];

const DEFAULT_BOTTOM_LINKS = [
  { text: "Privacy Policy", url: "/privacy" },
  { text: "Terms & Conditions", url: "/terms" },
  { text: "Institutional Contact", url: "/contact" },
  { text: "UN SNA 2008 Methodology", url: "/how-it-works" },
  { text: "Official Data Sources", url: "/sources" },
  { text: "Governance & About", url: "/about" },
];

export default function FooterSection({
  aboutTitle = "About ArthaLens Observatory",
  aboutText = "ArthaLens is India's sovereign macroeconomic intelligence observatory. We synthesize official National Accounts, model double-deflation under UN SNA 2008 standards, and audit state economic accounts with cryptographic SHA-256 provenance.",
  status = [
    { text: "1.4B+", subtext: "Demographic Coverage" },
    { text: "31", subtext: "States & UTs Modelled" },
    { text: "2022-23", subtext: "Active Benchmark" },
    { text: "SHA-256", subtext: "Cryptographic Seal" },
  ],
  menuItems = DEFAULT_MENU_ITEMS,
  bottomLinks = DEFAULT_BOTTOM_LINKS,
  showSystemStatus = true,
  className = "",
}: FooterSectionProps) {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer
      className={`relative mt-16 sm:mt-24 border-t border-[rgba(20,21,23,0.14)] bg-[#E6E5DF] text-[#141416] select-none ${className}`}
      role="contentinfo"
      aria-label="ArthaLens Site Footer"
    >
      {/* Precision Top Editorial Crosshairs */}
      <div className="absolute top-0 left-6 sm:left-10 font-mono text-xs text-[#828387] -translate-y-1/2 pointer-events-none select-none">
        +
      </div>
      <div className="absolute top-0 right-6 sm:right-10 font-mono text-xs text-[#828387] -translate-y-1/2 pointer-events-none select-none">
        +
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* --- Top Row: Identity, About, Provenance Telemetry & Nav Links --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 pb-10 border-b border-[rgba(20,21,23,0.12)]">
          {/* Identity & About Column (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <Link
              href="/"
              className="inline-flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-[#D94E34] focus:outline-hidden rounded-lg p-1"
              aria-label="ArthaLens National Accounts Observatory Home"
            >
              <ArthaLensLogo size="md" />
              <div>
                <span className="font-heading font-bold text-lg tracking-tight text-[#141416] block group-hover:text-[#D94E34] transition-colors">
                  ArthaLens
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#828387]">
                  National Accounts Observatory
                </span>
              </div>
            </Link>

            <div className="space-y-2">
              <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-[#141416]">
                {aboutTitle}
              </h3>
              <p className="font-sans text-[13px] text-[#57585C] leading-relaxed">
                {aboutText}
              </p>
            </div>

            {/* Observatory Telemetry Status Pills */}
            {status && status.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#828387] block">
                  Observatory Telemetry &amp; Scope
                </span>
                <div className="flex flex-wrap gap-2">
                  {status.map((item, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-1.5 rounded-md border border-[rgba(20,21,23,0.12)] bg-[#ECEBE5] px-2.5 py-1 shadow-2xs"
                    >
                      <span className="font-mono text-[11px] font-bold text-[#141416]">
                        {item.text}
                      </span>
                      <span className="font-sans text-[10px] text-[#57585C]">
                        {item.subtext}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact / Inquiries Box */}
            <div className="pt-2 text-xs font-mono text-[#57585C] flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-[#D94E34]" />
              <span>Inquiries: <a href="mailto:governance@arthalens.org" className="underline hover:text-[#141416]">governance@arthalens.org</a></span>
            </div>
          </div>

          {/* Navigation Columns (8 cols: 4 sub-columns) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {menuItems.map((section, sectionIdx) => (
              <div key={sectionIdx} className="space-y-3.5">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#141416] block border-b border-[rgba(20,21,23,0.1)] pb-1.5">
                  {section.title}
                </span>
                <ul className="space-y-2 font-sans text-[13px]">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link
                        href={link.url}
                        className="group flex items-center justify-between text-[#57585C] hover:text-[#141416] transition-colors py-0.5 leading-snug focus-visible:ring-2 focus-visible:ring-[#D94E34] focus:outline-hidden rounded-sm"
                      >
                        <span className="group-hover:translate-x-0.5 transition-transform">
                          {link.text}
                        </span>
                        {link.badge && (
                          <span className="shrink-0 ml-1 rounded-sm bg-[rgba(20,21,23,0.06)] px-1.5 py-0.2 font-mono text-[9px] font-bold uppercase text-[#141416]">
                            {link.badge}
                          </span>
                        )}
                        {link.url.startsWith("http") && (
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* --- Middle Row: Verification Badges & Provenance Guarantee --- */}
        {showSystemStatus && (
          <div className="py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[rgba(20,21,23,0.08)] text-xs font-mono text-[#57585C]">
            <div className="flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(20,21,23,0.15)] bg-[#ECEBE5] px-3 py-1 font-mono text-[11px] font-semibold text-[#141416]">
                <span className="h-2 w-2 rounded-full bg-[#059669] animate-pulse" />
                <span>OBSERVATORY FEED: ACTIVE</span>
              </div>
              <div className="flex items-center gap-2 text-[#828387]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#059669]" />
                <span>SHA-256 GAZETTE PROVENANCE ENGINE</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-[#828387]">
              <span>STANDARDS: UN SNA 2008 §15</span>
              <span>•</span>
              <span>BENCHMARK: 2022-23</span>
              <span>•</span>
              <span>MOSPI PRESS NOTE Q4/FY24</span>
            </div>
          </div>
        )}

        {/* --- Bottom Row: Dynamic Copyright, Attribution, & Legal Links --- */}
        <div className="pt-6 flex flex-col lg:flex-row justify-between items-start lg:items-center text-[11px] font-mono text-[#828387] gap-4">
          <p className="max-w-xl leading-relaxed">
            &copy; {currentYear} ArthaLens Macroeconomic Intelligence. Official MoSPI, RBI, and UN SNA 2008 statistics verified with cryptographic provenance. Published under the Open Government Data Platform India (OGD) Framework.
          </p>
          <ul className="flex flex-wrap items-center gap-4 sm:gap-5 font-sans text-xs">
            {bottomLinks.map((link, linkIdx) => (
              <li key={linkIdx}>
                <Link
                  href={link.url}
                  className="text-[#57585C] hover:text-[#D94E34] transition-colors underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-[#D94E34] focus:outline-hidden rounded-xs"
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
