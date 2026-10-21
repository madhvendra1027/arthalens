"use client";

import React, { Suspense, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { RubberSegment } from "@/components/ui/RubberSegment";
import { HeroConstellation } from "@/components/antimetal/HeroConstellation";
import { SovereignParticleGlobe } from "@/components/antimetal/SovereignParticleGlobe";
import { SovereignMacroObservatory } from "@/components/observatory/SovereignMacroObservatory";
import { LivingEconomyLandscape } from "@/components/living-economy";
import {
  Globe2,
  Network,
  Layers,
  ArrowRight,
  ShieldCheck,
  Compass,
  Info,
} from "lucide-react";

type ObservatoryView = "observatory" | "constellation" | "globe" | "living-economy";

function ObservatoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeView = (searchParams?.get("view") ?? "observatory") as ObservatoryView;

  const setView = useCallback(
    (view: ObservatoryView) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      params.set("view", view);
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const viewLabels: Record<ObservatoryView, string> = {
    observatory: "Observatory",
    constellation: "Constellation",
    globe: "3D Globe",
    "living-economy": "Living Economy",
  };

  const currentLabel = viewLabels[activeView] ?? "Observatory";

  return (
    <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 py-5 sm:py-12 space-y-6 sm:space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 pb-5 sm:pb-6 border-b border-[rgba(20,21,23,0.14)]">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(20,21,23,0.18)] bg-[#ECEBE5] px-3 py-1 font-mono text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-[#141416]">
            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#059669] animate-pulse" />
            <span className="truncate">ARTHALENS VISUAL OBSERVATORY SUITE // 4 EXPERIENCES</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl font-black text-[#141416] tracking-tight">
            Sovereign Economic Observatories
          </h1>

          <p className="font-sans text-xs sm:text-sm text-[#57585C] leading-relaxed max-w-2xl">
            Explore India's macroeconomic architecture through four complementary lenses: the <strong>Sovereign Macro Observatory</strong>, the physical <strong>Macro Constellation</strong>, the 26,000-particle <strong>Interactive 3D Globe</strong>, and the newly crafted <strong>Isometric Living Economy</strong>.
          </p>
        </div>

        {/* Back Link to Homepage & Macro Workspace */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-1 sm:pt-0">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 border border-[rgba(20,21,23,0.18)] bg-[#ECEBE5] font-mono text-xs font-semibold text-[#141416] hover:bg-[#DFDED8] transition-colors min-h-[40px]"
          >
            <span>&larr; Return to Home</span>
          </Link>
          <Link
            href="/gdp"
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 bg-[#141416] font-mono text-xs font-semibold text-[#ECEBE5] hover:bg-[#D94E34] transition-colors min-h-[40px]"
          >
            <span>Macro Workspace</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Mode Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="w-full sm:max-w-full overflow-x-auto touch-pan-x [scrollbar-width:none] pb-1">
          <RubberSegment
            items={[
              "Observatory",
              "Constellation",
              "3D Globe",
              "Living Economy",
            ]}
            defaultValue="Observatory"
            value={currentLabel}
            onChange={(val) => {
              if (val === "Observatory") setView("observatory");
              else if (val === "Constellation") setView("constellation");
              else if (val === "3D Globe") setView("globe");
              else if (val === "Living Economy") setView("living-economy");
            }}
            trackColor="#ECEBE5"
            thumbColor="#141416"
            textColor="#57585C"
            activeTextColor="#ECEBE5"
            size="md"
            radius={9999}
            inset={3}
            equalSlots={false}
            stretch={70}
            squash={3}
            speed={1}
            glide={75}
            preset="observatory-suite-tabs"
          />
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] text-[#828387]">
          <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0" />
          <span className="truncate">REAL-TIME MACRO DATA & INTERACTIVE VISUALIZATIONS</span>
        </div>
      </div>

      {/* Main Visual Stage Container */}
      <div className="relative rounded-3xl overflow-hidden border border-[rgba(20,21,23,0.18)] bg-[#ECEBE5] shadow-xs">
        {activeView === "observatory" && (
          <div className="p-3 sm:p-6 space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-[#141416]">
                <Compass className="h-4 w-4 text-[#059669]" />
                <span>EXPERIENCE A // SOVEREIGN MACRO OBSERVATORY & TELEMETRY BENCHMARK</span>
              </div>
              <span className="font-mono text-[10px] text-[#828387]">
                Official Statistical Feeds • 3 Macro Desks
              </span>
            </div>
            <SovereignMacroObservatory />
          </div>
        )}

        {activeView === "constellation" && (
          <div className="p-3 sm:p-6 space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-[#141416]">
                <Network className="h-4 w-4 text-[#059669]" />
                <span>EXPERIENCE B // MACRO CONSTELLATION (16-NODE PHYSICS SIMULATION)</span>
              </div>
              <span className="font-mono text-[10px] text-[#828387]">
                Interactive HTML5 Physics Canvas • Click & Drag Nodes
              </span>
            </div>
            <div className="rounded-2xl overflow-hidden border border-[rgba(20,21,23,0.12)] bg-[#E6E5DF]">
              <HeroConstellation />
            </div>
          </div>
        )}

        {activeView === "globe" && (
          <div className="p-3 sm:p-6 space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-[#141416]">
                <Globe2 className="h-4 w-4 text-[#2563EB]" />
                <span>EXPERIENCE C // INTERACTIVE 3D FIBONACCI SPHERE & SOVEREIGN ANCHORS</span>
              </div>
              <span className="font-mono text-[10px] text-[#828387]">
                Delhi, Mumbai, Bengaluru, Gujarat, DC, London, Tokyo
              </span>
            </div>
            <SovereignParticleGlobe
              stageHeight="h-[520px] sm:h-[620px] lg:h-[700px]"
              showEditorialCard={false}
            />
          </div>
        )}

        {activeView === "living-economy" && (
          <div className="p-3 sm:p-6 space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-[#141416]">
                <Layers className="h-4 w-4 text-[#7C3AED]" />
                <span>EXPERIENCE D // ISOMETRIC LIVING ECONOMY (5 INTERCONNECTED SECTORS)</span>
              </div>
              <span className="font-mono text-[10px] text-[#828387]">
                Geometric Isometric Projection • 4-Tone Lighting • Conduits
              </span>
            </div>
            <LivingEconomyLandscape />
          </div>
        )}
      </div>

      {/* Explanatory Deep-Dive Cards for the Active Experience */}
      <div className="grid gap-6 md:grid-cols-3 pt-2">
        <div className="p-6 rounded-2xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.14)] space-y-2 shadow-xs">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#141416]">
            <Info className="h-4 w-4 text-[#57585C]" />
            <span>Analytical Objective</span>
          </div>
          <p className="font-sans text-xs text-[#57585C] leading-relaxed">
            {activeView === "observatory" &&
              "Sovereign telemetry deck navigating India's central macroeconomic desks: MoSPI national benchmarks, global trade routings, and RBI monetary reserves."}
            {activeView === "constellation" &&
              "Visualizes the gravitational pull between headline metrics—revealing how GDP deflator shifts correlate with retail CPI and industrial input costs."}
            {activeView === "globe" &&
              "Tracks global capital corridors, bilateral currency swaps, and sovereign debt maturities across 7 worldwide financial anchor nodes."}
            {activeView === "living-economy" &&
              "Synthesizes India's real physical production engine against household demand, banking credit, and sovereign fiscal capex outlays."}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.14)] space-y-2 shadow-xs">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#141416]">
            <ShieldCheck className="h-4 w-4 text-emerald-700" />
            <span>Data Provenance</span>
          </div>
          <p className="font-sans text-xs text-[#57585C] leading-relaxed">
            Anchored directly in official MoSPI National Accounts Statistics (Statement 1.1), RBI Database on Indian Economy Table 4, and Controller General of Accounts fiscal bulletins.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.14)] space-y-2 shadow-xs flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#141416]">
              <Compass className="h-4 w-4 text-[#D94E34]" />
              <span>Next Investigation Step</span>
            </div>
            <p className="font-sans text-xs text-[#57585C] leading-relaxed">
              Drill down into subnational state accounts, historical revisions, or simulate inflation shocks.
            </p>
          </div>
          <Link
            href="/gdp"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#141416] hover:text-[#D94E34] transition-colors pt-2"
          >
            <span>Launch Macro Accounts &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ObservatoryPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-6 py-20 text-center font-mono text-xs text-[#828387]">
          Loading Sovereign Visual Observatories...
        </div>
      }
    >
      <ObservatoryContent />
    </Suspense>
  );
}
