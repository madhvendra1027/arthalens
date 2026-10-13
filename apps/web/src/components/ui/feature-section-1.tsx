"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Activity, ShieldCheck, ExternalLink } from "lucide-react";

export interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
  }[];
}

export interface StatusItem {
  text: string;
  subtext: string;
}

export interface FooterSectionProps {
  tagline?: string;
  aboutTitle?: string;
  aboutText?: string;
  logoSrc?: string;
  status?: StatusItem[];
  menuItems?: MenuItem[];
  copyright?: string;
  bottomLinks?: { text: string; url: string }[];
  showSystemStatus?: boolean;
  className?: string;
}

export default function FooterSection({
  tagline = "Sovereign Macroeconomic Analytics & National Accounts Platform.",
  aboutTitle = "About ArthaLens",
  aboutText = "ArthaLens provides institutional-grade transparency for Indian National Accounts, offering real-time GDP decomposition, double-deflation analysis, and cryptographic provenance directly from MoSPI and RBI releases.",
  logoSrc = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80",
  status = [
    { text: "1.4B+", subtext: "Demographic Coverage" },
    { text: "36", subtext: "States & UTs Modelled" },
    { text: "99.99%", subtext: "Feed Uptime" },
  ],
  menuItems = [
    {
      title: "Product",
      links: [
        { text: "GDP Explorer", url: "/gdp" },
        { text: "Deflator Simulator", url: "/deflator" },
        { text: "Growth Drivers", url: "/gdp/why" },
        { text: "Sovereign Copilot", url: "/ai" },
      ],
    },
    {
      title: "Institutions",
      links: [
        { text: "MoSPI NAS 2024", url: "/sources" },
        { text: "Sovereign Ratings", url: "/ratings" },
        { text: "World Bank Feeds", url: "/global" },
        { text: "RBI Database (DBIE)", url: "/sources" },
      ],
    },
    {
      title: "Methodology",
      links: [
        { text: "How It Works", url: "/how-it-works" },
        { text: "Base Year Isolation", url: "/methodology" },
        { text: "Consistency Scoring", url: "/consistency" },
        { text: "UN SNA 2008 Standard", url: "/how-it-works" },
      ],
    },
    {
      title: "Compliance",
      links: [
        { text: "Terms of Service", url: "/about" },
        { text: "Data Governance", url: "/about" },
        { text: "Open Data Framework", url: "/about" },
        { text: "Splicing Standards", url: "/about" },
      ],
    },
  ],
  copyright = "© 2026 ArthaLens Macro. Official MoSPI & RBI releases reproduced with cryptographic integrity.",
  bottomLinks = [
    { text: "Terms", url: "/about" },
    { text: "Privacy", url: "/about" },
    { text: "Security", url: "/about" },
    { text: "SNA 2008 Spec", url: "/how-it-works" },
  ],
  showSystemStatus = true,
  className = "",
}: FooterSectionProps) {
  return (
    <footer
      className={`relative mt-12 sm:mt-16 border-t border-[rgba(20,21,23,0.12)] bg-[#E6E5DF] text-[#141416] select-none ${className}`}
    >
      {/* Precision Top Crosshairs */}
      <div className="absolute top-0 left-6 font-mono text-xs text-[#828387] -translate-y-1/2 pointer-events-none">
        +
      </div>
      <div className="absolute top-0 right-6 font-mono text-xs text-[#828387] -translate-y-1/2 pointer-events-none">
        +
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10 sm:py-12">
        {/* --- Branding, Description, Multi-Column Navigation, & Status --- */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-10 pb-8 border-b border-[rgba(20,21,23,0.1)]">
          {/* Logo, About & Telemetry Status Badges */}
          <div className="max-w-sm text-left space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-9 w-9 rounded-lg overflow-hidden border border-[rgba(20,21,23,0.15)] bg-[#ECEBE5] flex items-center justify-center shadow-sm">
                <Image
                  src={logoSrc}
                  alt="ArthaLens logo"
                  width={36}
                  height={36}
                  className="object-cover h-full w-full"
                />
              </div>
              <div>
                <span className="font-heading font-bold text-base tracking-tight text-[#141416] block">
                  ArthaLens
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#828387]">
                  National Accounts
                </span>
              </div>
            </div>

            <div>
              <h3 className="mb-1.5 font-heading text-sm font-semibold text-[#141416]">
                {aboutTitle}
              </h3>
              <p className="font-sans text-[13px] text-[#57585C] leading-relaxed">
                {aboutText}
              </p>
            </div>

            {/* Telemetry Status Pills */}
            {status && status.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {status.map((item, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded border border-[rgba(20,21,23,0.1)] bg-[#ECEBE5] px-2 py-0.5"
                  >
                    <span className="font-mono text-[11px] font-bold text-[#141416]">
                      {item.text}
                    </span>
                    <span className="font-sans text-[10px] text-[#828387]">
                      {item.subtext}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* --- Menu Links (Four-Column Structure: Product, Institutions, Methodology, Compliance) --- */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 flex-1">
            {menuItems.map((section, sectionIdx) => (
              <div key={sectionIdx} className="space-y-3">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#828387] block">
                  {section.title}
                </span>
                <ul className="space-y-2.5 font-sans text-[14px] sm:text-[15px] font-normal leading-[1.45]">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link
                        href={link.url}
                        className="text-[#141416] hover:text-[#D94E34] transition-colors inline-flex items-center gap-1 group"
                      >
                        <span>{link.text}</span>
                        {link.url.startsWith("http") && (
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* --- Subdued System Status & Compliance Identifiers --- */}
          {showSystemStatus && (
            <div className="lg:max-w-[180px] flex flex-col justify-between space-y-4 pt-2 lg:pt-0 border-t lg:border-t-0 border-[rgba(20,21,23,0.08)]">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(20,21,23,0.15)] bg-[#ECEBE5] px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider text-[#141416]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#059669] animate-pulse" />
                  <span>SYSTEM ACTIVE</span>
                </div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-[#828387] pl-1">
                  SOC-2 TYPE II • ISO-27001
                </div>
              </div>

              <div className="flex items-center gap-1.5 pt-2">
                <ShieldCheck className="h-3.5 w-3.5 text-[#059669]" />
                <span className="font-mono text-[10px] text-[#828387] uppercase tracking-wider">
                  CRYPTOGRAPHIC LOGS
                </span>
              </div>
            </div>
          )}
        </div>

        {/* --- Bottom Bar --- */}
        <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center text-[11px] font-mono text-[#828387] gap-4">
          <p>{copyright}</p>
          <ul className="flex flex-wrap gap-4 font-sans text-xs">
            {bottomLinks.map((link, linkIdx) => (
              <li key={linkIdx}>
                <Link
                  href={link.url}
                  className="hover:text-[#D94E34] underline underline-offset-4 transition-colors"
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
