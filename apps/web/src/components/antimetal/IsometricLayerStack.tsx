"use client";

import React, { useState } from "react";
import { Layers, ShieldCheck, Activity, Cpu } from "lucide-react";

interface StackItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  layerIndex: number;
}

const STACK_CARDS: StackItem[] = [
  {
    id: "horizon",
    tag: "THE HORIZON",
    title: "Economic modeling should run itself.",
    description:
      "Macroeconomic governance is too multifaceted to run manually. Economists and leadership should set strategic direction, fiscal allocations, and approve policy shifts. The mathematical reconciliation must run autonomously.",
    layerIndex: 0,
  },
  {
    id: "model",
    tag: "THE WORLD MODEL",
    title: "A layer that owns the sovereign runtime.",
    description:
      "ArthaLens acts as a live world model: a continuous, mathematical understanding of how sovereign sectors interact. On top, an army of specialized econometric agents operates across state GVA to diagnose, fix, and explain anomalies.",
    layerIndex: 1,
  },
  {
    id: "autonomous",
    tag: "THE AUTONOMOUS LAYER",
    title: "Everyone else watches. We operate.",
    description:
      "Most analytical software stops at static charts and laggy reports. ArthaLens is designed to continuously investigate, reconcile, and improve sovereign accuracy before ministerial releases occur.",
    layerIndex: 2,
  },
];

export function IsometricLayerStack() {
  const [activeCard, setActiveCard] = useState<number>(1);

  return (
    <section className="relative my-24 sm:my-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-[rgba(20,21,23,0.12)]">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#828387]">
              01 / WHERE WE FIT
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#141416] mt-2 tracking-tight">
              A new layer of the stack
            </h2>
          </div>
          <p className="max-w-md font-sans text-xs sm:text-sm text-[#57585C] leading-relaxed">
            ArthaLens is the autonomous layer between your economic leadership and the thirty-six sovereign data authorities.
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          {/* Left Column: Interactive Cards */}
          <div className="lg:col-span-5 space-y-4">
            {STACK_CARDS.map((card, idx) => {
              const isActive = activeCard === idx;
              return (
                <div
                  key={card.id}
                  onClick={() => setActiveCard(idx)}
                  className={`cursor-pointer rounded-lg p-6 transition-all duration-200 border ${
                    isActive
                      ? "bg-[#141416] text-[#ECEBE5] border-[#141416] shadow-xl scale-[1.02]"
                      : "bg-[#ECEBE5] text-[#141416] border-[rgba(20,21,23,0.12)] hover:border-[rgba(20,21,23,0.25)] hover:bg-[#E8E7E1]"
                  }`}
                >
                  <span
                    className={`font-mono text-[10px] font-bold tracking-widest uppercase block mb-2 ${
                      isActive ? "text-[#E5A83B]" : "text-[#828387]"
                    }`}
                  >
                    {card.tag}
                  </span>
                  <h3
                    className={`font-serif text-xl sm:text-2xl font-normal leading-snug mb-2 ${
                      isActive ? "text-white" : "text-[#141416]"
                    }`}
                  >
                    {card.title}
                  </h3>
                  <p
                    className={`text-xs leading-relaxed ${
                      isActive ? "text-[#A2A3A6]" : "text-[#57585C]"
                    }`}
                  >
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column: 3D Isometric Layer Diagram */}
          <div className="lg:col-span-7 relative">
            <div className="relative mx-auto max-w-lg p-4 sm:p-8">
              {/* Isometric Perspective Canvas / Layers */}
              <div
                className="relative space-y-6 sm:space-y-8"
                style={{
                  transform: "perspective(1000px) rotateX(24deg) rotateZ(-12deg) skewX(8deg)",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Layer 1: Your Economic Leadership */}
                <div
                  className={`rounded-lg p-5 border transition-all duration-300 shadow-lg ${
                    activeCard === 0
                      ? "bg-[#141416] text-white border-[#E5A83B] translate-y-[-8px] shadow-2xl"
                      : "bg-[#ECEBE5]/90 text-[#141416] border-[rgba(20,21,23,0.2)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#828387]">
                        LAYER 01 // STRATEGY
                      </div>
                      <div className="font-serif text-lg font-bold">Your Economic Leadership</div>
                      <div className="text-[11px] opacity-70">Defines priorities, direction, and fiscal allocations</div>
                    </div>
                    <Cpu className={`h-6 w-6 ${activeCard === 0 ? "text-[#E5A83B]" : "text-[#141416]"}`} />
                  </div>
                </div>

                {/* Projection Filaments */}
                <div className="h-4 border-l-2 border-dashed border-[rgba(20,21,23,0.2)] ml-8" />

                {/* Layer 2: ArthaLens Autonomous Agents */}
                <div
                  className={`rounded-lg p-5 border transition-all duration-300 shadow-lg ${
                    activeCard === 1
                      ? "bg-[#141416] text-white border-[#D94E34] translate-y-[-8px] shadow-2xl ring-2 ring-[#D94E34]/30"
                      : "bg-[#ECEBE5]/90 text-[#141416] border-[rgba(20,21,23,0.2)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#D94E34]">
                        LAYER 02 // AUTONOMOUS AGENTS
                      </div>
                      <div className="font-serif text-lg font-bold">ArthaLens Macro Agents</div>
                      <div className="text-[11px] opacity-70">
                        Army of specialized econometric agents running on sovereign feeds
                      </div>
                    </div>
                    {/* Constellation Mini Mark */}
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-[#D94E34] animate-ping" />
                      <span className="h-3 w-3 rounded-full bg-[#141416]" />
                    </div>
                  </div>
                </div>

                {/* Projection Filaments */}
                <div className="h-4 border-l-2 border-dashed border-[rgba(20,21,23,0.2)] ml-8" />

                {/* Layer 3: Sovereign World Model & Integrations */}
                <div
                  className={`rounded-lg p-5 border transition-all duration-300 shadow-lg ${
                    activeCard === 2
                      ? "bg-[#141416] text-white border-[#059669] translate-y-[-8px] shadow-2xl"
                      : "bg-[#ECEBE5]/90 text-[#141416] border-[rgba(20,21,23,0.2)]"
                  }`}
                >
                  <div>
                    <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#059669]">
                      LAYER 03 // WORLD MODEL
                    </div>
                    <div className="font-serif text-lg font-bold">Sovereign Macro World Model</div>
                    <div className="text-[11px] opacity-70 mb-3">
                      A live mathematical model of how India's thirty-six state economies actually interact
                    </div>

                    {/* Integrated Authorities Strip */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-[rgba(20,21,23,0.1)]">
                      {["MoSPI NSO", "RBI DBIE", "MCA-21", "GSTN", "DPIIT", "World Bank", "IMF"].map((src) => (
                        <span
                          key={src}
                          className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/10 text-[#141416]"
                        >
                          {src}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Projection Filaments */}
                <div className="h-4 border-l-2 border-dashed border-[rgba(20,21,23,0.2)] ml-8" />

                {/* Layer 4: Production Telemetry */}
                <div className="rounded-lg p-4 border border-[rgba(20,21,23,0.15)] bg-[#DFDED8]/80 text-[#141416] shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#828387]">
                        LAYER 04 // PRODUCTION RUNTIME
                      </div>
                      <div className="font-serif text-base font-bold">State GSDP & Ingestion Runtime</div>
                      <div className="text-[10px] opacity-70">
                        High frequency tax receipts, power demand, freight volume, price surveys
                      </div>
                    </div>
                    <Activity className="h-5 w-5 text-[#828387]" />
                  </div>
                </div>
              </div>

              {/* Technical Projection Border Guides */}
              <div className="absolute top-0 right-4 font-mono text-[10px] text-[#828387]">
                [ISOMETRIC PROJECTION — 24° AXONOMETRIC]
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
