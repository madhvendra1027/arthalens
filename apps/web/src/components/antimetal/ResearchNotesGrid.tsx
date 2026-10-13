"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface ResearchNote {
  id: string;
  category: "RESEARCH" | "METHODOLOGY" | "ENGINEERING" | "POLICY";
  date: string;
  readTime: string;
  title: string;
  abstract: string;
  author: string;
  svgType: "mesh" | "lattice" | "waves" | "blueprint" | "tensor" | "rings";
}

const NOTES: ResearchNote[] = [
  {
    id: "1",
    category: "RESEARCH",
    date: "05/18/2024",
    readTime: "7 MIN",
    title: "Compressing Production Telemetry for Econometric Agents",
    abstract: "How we fit 10 to 12 state accounts simultaneously into single context windows and what changes when sovereign agents can see live cross-state tax flows.",
    author: "Thibaut Roy & ArthaLens Labs",
    svgType: "mesh",
  },
  {
    id: "2",
    category: "METHODOLOGY",
    date: "04/29/2024",
    readTime: "11 MIN",
    title: "We used ArthaLens to resolve 76% of state GVA discrepancies in one day",
    abstract: "Field postmortem on our production deployment with state finance departments: discovering hidden deflator mismatches across 14 manufacturing sub-sectors.",
    author: "ArthaLens National Accounts Group",
    svgType: "lattice",
  },
  {
    id: "3",
    category: "ENGINEERING",
    date: "04/02/2024",
    readTime: "9 MIN",
    title: "How we automated double-deflation technical implementation",
    abstract: "Single deflation produces persistent biases when input import prices collapse. Here is our mathematical matrix pipeline compliant with UN SNA 2008.",
    author: "Econometric Systems Architecture",
    svgType: "waves",
  },
  {
    id: "4",
    category: "RESEARCH",
    date: "03/14/2024",
    readTime: "6 MIN",
    title: "Introducing ArthaLens MCP for Econometric Coding Agents",
    abstract: "A single unified Model Context Protocol for runtime sovereign national accounts: query GDP, GVA, and inflation directly from AI agents.",
    author: "DevOps & Core Infrastructure",
    svgType: "blueprint",
  },
  {
    id: "5",
    category: "METHODOLOGY",
    date: "02/20/2024",
    readTime: "14 MIN",
    title: "Building a Unified Model of Sovereign Economic Systems",
    abstract: "A concrete approach to representing dynamic inter-state input-output matrices and high-frequency GSTN data for machine reasoning.",
    author: "Dr. Arvind Subramanian & Research Staff",
    svgType: "tensor",
  },
  {
    id: "6",
    category: "POLICY",
    date: "01/18/2024",
    readTime: "8 MIN",
    title: "The Future of Macroeconomic Infrastructure is Invisible",
    abstract: "Writing spreadsheets is no longer the hard part. It is ensuring that when national accounts are revised, sovereign decisions automatically adapt.",
    author: "Sovereign Policy Directorate",
    svgType: "rings",
  },
];

function BlueprintVisual({ type }: { type: ResearchNote["svgType"] }) {
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-[rgba(20,21,23,0.12)] bg-[#E1E0DA] flex items-center justify-center p-4">
      {/* Background blueprint grid */}
      <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={`bp-${type}`} width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M 12 0 L 0 0 0 12" fill="none" stroke="#2563EB" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#bp-${type})`} />
      </svg>

      {/* Distinctive CAD isometric wireframe sketches for each article */}
      {type === "mesh" && (
        <svg viewBox="0 0 160 80" className="w-4/5 h-4/5 text-blue-600">
          <path d="M10,70 L80,10 L150,70 Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M80,10 L80,70 M10,70 L150,70" fill="none" stroke="currentColor" strokeWidth="0.75" />
          <ellipse cx="80" cy="40" rx="45" ry="15" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />
        </svg>
      )}

      {type === "lattice" && (
        <svg viewBox="0 0 160 80" className="w-4/5 h-4/5 text-blue-600">
          <rect x="25" y="15" width="110" height="50" fill="none" stroke="currentColor" strokeWidth="1" />
          <line x1="25" y1="40" x2="135" y2="40" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 2" />
          <line x1="80" y1="15" x2="80" y2="65" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 2" />
          <circle cx="80" cy="40" r="18" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      )}

      {type === "waves" && (
        <svg viewBox="0 0 160 80" className="w-4/5 h-4/5 text-blue-600">
          <path d="M10,40 Q45,10 80,40 T150,40" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path d="M10,50 Q45,20 80,50 T150,50" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <path d="M10,30 Q45,0 80,30 T150,30" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        </svg>
      )}

      {type === "blueprint" && (
        <svg viewBox="0 0 160 80" className="w-4/5 h-4/5 text-blue-600">
          <polygon points="80,15 130,40 80,65 30,40" fill="none" stroke="currentColor" strokeWidth="1" />
          <line x1="80" y1="15" x2="80" y2="65" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 2" />
        </svg>
      )}

      {type === "tensor" && (
        <svg viewBox="0 0 160 80" className="w-4/5 h-4/5 text-blue-600">
          <circle cx="45" cy="40" r="22" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="115" cy="40" r="22" fill="none" stroke="currentColor" strokeWidth="1" />
          <line x1="45" y1="40" x2="115" y2="40" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="80" cy="40" r="3" fill="currentColor" />
        </svg>
      )}

      {type === "rings" && (
        <svg viewBox="0 0 160 80" className="w-4/5 h-4/5 text-blue-600">
          <circle cx="80" cy="40" r="30" fill="none" stroke="currentColor" strokeWidth="0.75" />
          <circle cx="80" cy="40" r="20" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="80" cy="40" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )}
    </div>
  );
}

export function ResearchNotesGrid() {
  return (
    <section className="relative my-24 sm:my-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-[rgba(20,21,23,0.12)]">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#828387]">
              NOTES FROM THE AUTONOMOUS FRONTIER
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#141416] mt-2 tracking-tight">
              Research, methodology & field notes
            </h2>
          </div>
          <p className="max-w-md font-sans text-xs sm:text-sm text-[#57585C] leading-relaxed">
            Written by the econometrics and systems teams building software that understands, models, and forecasts sovereign accounts.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {NOTES.map((note) => (
            <Link
              key={note.id}
              href="/methodology"
              className="group flex flex-col justify-between overflow-hidden rounded-lg border border-[rgba(20,21,23,0.12)] bg-[#ECEBE5] transition-all duration-200 hover:border-[rgba(20,21,23,0.25)] hover:shadow-lg"
            >
              <div>
                {/* Blueprint Header Graphic */}
                <BlueprintVisual type={note.svgType} />

                {/* Card Content */}
                <div className="p-6">
                  {/* Category & Meta */}
                  <div className="flex items-center justify-between mb-3 text-[10px] font-mono text-[#828387]">
                    <span className="rounded bg-black/5 px-2 py-0.5 font-bold uppercase tracking-wider text-[#141416]">
                      {note.category}
                    </span>
                    <span>{note.date}</span>
                  </div>

                  <h3 className="font-serif text-xl font-normal leading-snug text-[#141416] group-hover:text-[#D94E34] transition-colors mb-2">
                    {note.title}
                  </h3>

                  <p className="text-xs text-[#57585C] leading-relaxed line-clamp-3">
                    {note.abstract}
                  </p>
                </div>
              </div>

              {/* Author Footer */}
              <div className="px-6 pb-6 pt-3 border-t border-[rgba(20,21,23,0.08)] flex items-center justify-between text-[11px] font-mono text-[#828387]">
                <span className="truncate max-w-[200px]">{note.author}</span>
                <span className="flex items-center gap-1 font-bold text-[#141416] group-hover:translate-x-1 transition-transform">
                  {note.readTime} <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
