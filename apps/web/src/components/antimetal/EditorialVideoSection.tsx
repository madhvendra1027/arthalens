"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  FastForward,
  Rewind,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  Database,
  SlidersHorizontal,
} from "lucide-react";

interface Phase {
  id: number;
  startTime: number;
  endTime: number;
  title: string;
  shortTitle: string;
  source: string;
  description: string;
}

const PHASES: Phase[] = [
  {
    id: 1,
    startTime: 0,
    endTime: 40,
    title: "Official Ingestion & Gazette SHA-256 Hash Verification",
    shortTitle: "01. Ingestion & Provenance",
    source: "MoSPI National Accounts Statistics (NAS) • Statement 1.1",
    description: "Ingesting quarterly Press Notes, CSO releases, and RBI DBIE tables with cryptographic integrity verification.",
  },
  {
    id: 2,
    startTime: 40,
    endTime: 80,
    title: "UN SNA 2008 Double-Deflation Matrix Pipeline",
    shortTitle: "02. Double Deflation",
    source: "UN System of National Accounts 2008 • Chapter 15 (§15.111 - 15.120)",
    description: "Decoupling gross output price deflators from intermediate input price indices to remove single-deflation bias.",
  },
  {
    id: 3,
    startTime: 80,
    endTime: 120,
    title: "28 States & 3 UTs Sub-National GVA Synthesis",
    shortTitle: "03. State Accounts",
    source: "Directorate of Economics & Statistics (DES) & CSO SDP Guidelines",
    description: "Harmonizing Gross State Domestic Product (GSDP) reporting across 31 state economies against Central GVA.",
  },
  {
    id: 4,
    startTime: 120,
    endTime: 160,
    title: "Expenditure Discrepancy Triage & Macro Copilot Audit",
    shortTitle: "04. Discrepancy Triage",
    source: "MoSPI GDP by Expenditure (Statement 2.1) & RBI Bulletin Table 4",
    description: "Reconciling statistical discrepancies between production GVA and expenditure components (PFCE, GFCE, GFCF).",
  },
];

const TOTAL_DURATION = 160; // 2 minutes 40 seconds

export function EditorialVideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Playback timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= TOTAL_DURATION) {
            setIsPlaying(false);
            return TOTAL_DURATION;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed]);

  const activePhase =
    PHASES.find((p) => currentTime >= p.startTime && currentTime < p.endTime) ||
    PHASES[PHASES.length - 1];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const jumpToPhase = (phase: Phase) => {
    setCurrentTime(phase.startTime);
    setIsPlaying(true);
  };

  return (
    <section className="relative py-10 sm:py-14 border-t border-b border-[rgba(20,21,23,0.12)]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          {/* Left Column: Interactive Playable Video Engine Card */}
          <div className="lg:col-span-5 relative group">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-[rgba(20,21,23,0.18)] bg-[#141416] p-5 shadow-xl text-white flex flex-col justify-between">
              {/* Top Meta Bar */}
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-2 text-[#E5A83B] bg-white/10 px-2.5 py-1 rounded-full">
                  <span className={`h-2 w-2 rounded-full ${isPlaying ? "bg-[#059669] animate-pulse" : "bg-[#D94E34]"}`} />
                  <span>{isPlaying ? "LIVE PLAYBACK" : "ENGINE READY"}</span>
                </span>
                <span className="text-white/60 text-[11px]">AL-RUN-2024</span>
              </div>

              {/* Center Content Preview */}
              <div className="my-auto text-center space-y-2 py-4">
                <div className="font-heading text-xl font-bold tracking-tight text-white">
                  ArthaLens Macro Engine Architecture
                </div>
                <p className="font-mono text-xs text-white/70 max-w-xs mx-auto">
                  Interactive real-time demonstration of the MoSPI SNA 2008 pipeline, double deflation module, and divergence triage.
                </p>

                {/* Central Play Trigger Button */}
                <button
                  onClick={() => setIsPlaying(true)}
                  className="mt-3 inline-flex items-center gap-2 rounded-full bg-white text-[#141416] px-5 py-2 text-xs font-bold font-mono shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Play className="h-4 w-4 fill-current text-[#D94E34]" />
                  <span>Launch Interactive Player (2:40)</span>
                </button>
              </div>

              {/* Bottom Tags */}
              <div className="flex items-center justify-between font-mono text-[10px] text-white/50 pt-2 border-t border-white/10">
                <span>MOSPI & RBI VERIFIED DATA</span>
                <span>DOUBLE DEFLATION MATRIX</span>
              </div>
            </div>
          </div>

          {/* Right Column: Pull-quote & Editorial Thesis */}
          <div className="lg:col-span-7 space-y-8">
            <blockquote className="space-y-4">
              <p className="font-heading text-2xl sm:text-3xl lg:text-4xl leading-tight text-[#141416] tracking-tight font-normal">
                “You may be able to build policy models rapidly, but if decision-makers cannot depend on sovereign macroeconomic integrity, every forecast breaks.”
              </p>
              <div className="flex items-center gap-4 pt-2">
                <div>
                  <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#141416]">
                    Dr. Arvind Subramanian
                  </div>
                  <div className="text-xs text-[#57585C]">
                    Senior Fellow & Former Chief Economic Adviser to the Government of India
                  </div>
                </div>
                <div className="ml-auto font-mono text-xs font-bold text-[#828387] border border-[rgba(20,21,23,0.15)] rounded-md px-2.5 py-1">
                  MoSPI NAS 2024
                </div>
              </div>
            </blockquote>

            {/* Editorial Paragraph with Drop Cap & Marginal Sparkline */}
            <div className="pt-6 border-t border-[rgba(20,21,23,0.1)] grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Margin Micro-chart (4 cols) */}
              <div className="md:col-span-4 rounded-xl border border-[rgba(20,21,23,0.12)] bg-[#E3E2DC] p-3 text-[11px] font-mono">
                <div className="text-[10px] uppercase text-[#828387] mb-1 font-bold">REAL GDP TRAJECTORY</div>
                <div className="text-sm font-bold text-[#141416] tabular-nums">+8.2% FY24 (PE)</div>
                <svg className="w-full h-12 mt-2" viewBox="0 0 100 40" fill="none">
                  <path
                    d="M 5,35 Q 25,32 45,28 T 75,18 T 95,8"
                    stroke="#D94E34"
                    strokeWidth="2.5"
                    fill="none"
                  />
                  <circle cx="95" cy="8" r="3.5" fill="#D94E34" />
                </svg>
                <div className="flex justify-between text-[9px] text-[#828387] mt-1">
                  <span>FY21 (Pandemic)</span>
                  <span>FY24 Official</span>
                </div>
              </div>

              {/* Editorial Prose Column (8 cols) */}
              <div className="md:col-span-8 text-xs sm:text-sm text-[#3E3F43] leading-relaxed">
                <span className="editorial-dropcap">M</span>
                acroeconomic governance, as practiced today, suffers from acute statistical latency. Sovereign data pipelines have grown too vast for human economists to manually reconcile across thirty-six states and union territories, changing base-year deflators, and input price divergence.
                <p className="mt-3">
                  ArthaLens provides a verified mathematical layer: automatically ingesting official Ministry of Statistics and Programme Implementation (MoSPI) and Reserve Bank of India (RBI) accounts, computing true double deflation under UN SNA 2008 standards, and highlighting discrepancies before policies are finalized.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FULLY PLAYABLE INTERACTIVE DEMONSTRATION PLAYER MODAL */}
      {isPlaying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6 backdrop-blur-md">
          <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-[#141416] border border-white/15 text-white shadow-2xl flex flex-col max-h-[92vh]">
            {/* Player Top Navigation Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#1B1D22]">
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#059669] animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-wider text-[#E5A83B] font-bold">
                  ArthaLens Autonomous Engine • Demonstration Walkthrough
                </span>
                <span className="hidden sm:inline-block font-mono text-[10px] text-white/50 border border-white/20 rounded px-2 py-0.5">
                  PRORES 1080P TELEMETRY
                </span>
              </div>

              <button
                onClick={() => setIsPlaying(false)}
                className="flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 px-3 py-1 text-xs font-mono text-white/80 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
                <span>Exit Demo</span>
              </button>
            </div>

            {/* Interactive Stage Canvas (Phase Dependent) */}
            <div className="relative flex-1 p-6 overflow-y-auto bg-gradient-to-b from-[#141416] to-[#0D0E10] min-h-[380px]">
              {/* Phase Banner */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-white/10 bg-white/5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#D94E34] uppercase tracking-wider">
                      PHASE {activePhase.id} OF 4
                    </span>
                    <span className="text-white/40">•</span>
                    <span className="font-mono text-xs text-white/70">
                      {activePhase.source}
                    </span>
                  </div>
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-white mt-1">
                    {activePhase.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-white/70 mt-1 max-w-3xl">
                    {activePhase.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs text-white/60">
                  <span className="rounded bg-white/10 px-2.5 py-1 text-white">
                    {formatTime(currentTime)} / {formatTime(TOTAL_DURATION)}
                  </span>
                </div>
              </div>

              {/* Dynamic Phase Stage Content */}
              {activePhase.id === 1 && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                      <div className="flex items-center justify-between text-xs font-mono text-white/60 mb-2">
                        <span>DATASET 01</span>
                        <CheckCircle2 className="h-4 w-4 text-[#059669]" />
                      </div>
                      <div className="font-mono text-sm font-bold text-white">MoSPI NAS Statement 1.1</div>
                      <div className="font-mono text-[11px] text-[#828387] mt-1 truncate">
                        SHA-256: 8f3a9b1c7e...4d2a
                      </div>
                      <div className="mt-3 text-xs text-[#059669] font-mono">✓ 1,482 observations parsed</div>
                    </div>

                    <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                      <div className="flex items-center justify-between text-xs font-mono text-white/60 mb-2">
                        <span>DATASET 02</span>
                        <CheckCircle2 className="h-4 w-4 text-[#059669]" />
                      </div>
                      <div className="font-mono text-sm font-bold text-white">RBI DBIE State GSDP Series</div>
                      <div className="font-mono text-[11px] text-[#828387] mt-1 truncate">
                        SHA-256: c47b2a9e81...9a10
                      </div>
                      <div className="mt-3 text-xs text-[#059669] font-mono">✓ 28 States & 3 UTs synced</div>
                    </div>

                    <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                      <div className="flex items-center justify-between text-xs font-mono text-white/60 mb-2">
                        <span>DATASET 03</span>
                        <CheckCircle2 className="h-4 w-4 text-[#059669]" />
                      </div>
                      <div className="font-mono text-sm font-bold text-white">DPIIT WPI & CPI Series</div>
                      <div className="font-mono text-[11px] text-[#828387] mt-1 truncate">
                        SHA-256: 7d1e8c4b22...33f1
                      </div>
                      <div className="mt-3 text-xs text-[#059669] font-mono">✓ 697 Commodity Weights OK</div>
                    </div>
                  </div>

                  {/* Terminal Log Stream */}
                  <div className="p-4 rounded-xl border border-white/10 bg-black/60 font-mono text-xs space-y-1 text-[#828387]">
                    <div className="text-white/40">// REAL-TIME STREAM INGESTION LOG:</div>
                    <div className="text-[#059669]">[INFO] 2024-10-13T22:40:01Z - Ingested Press Note 'Provisional Estimates of GDP 2023-24'</div>
                    <div className="text-white/80">[INFO] 2024-10-13T22:40:02Z - Computed cryptographic signature on official Gazette PDF (Govt of India Open Data License)</div>
                    <div className="text-[#E5A83B]">[VALIDATION] 0 schema anomalies detected across 42 econometric tables. Ready for double deflation.</div>
                  </div>
                </div>
              )}

              {activePhase.id === 2 && (
                <div className="space-y-4">
                  {/* Double Deflation Comparative Matrix */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="p-5 rounded-xl border border-red-500/30 bg-red-950/20">
                      <div className="flex items-center justify-between text-xs font-mono text-red-400 font-bold mb-2">
                        <span>CONVENTIONAL SINGLE DEFLATION</span>
                        <span className="px-2 py-0.5 rounded bg-red-500/20 text-[10px]">BIASED</span>
                      </div>
                      <div className="text-2xl font-bold font-mono text-white tabular-nums">+10.4% YoY Real GVA</div>
                      <p className="text-xs text-white/70 mt-2 leading-relaxed">
                        Deflates Gross Value Added solely by the Gross Output Price Index (WPI Manufacturing). When crude oil and import prices drop, single deflation artificially inflates measured real manufacturing growth.
                      </p>
                      <div className="mt-3 pt-3 border-t border-red-500/20 font-mono text-xs text-red-300">
                        Input Price Bias: +2.6% over-estimation
                      </div>
                    </div>

                    <div className="p-5 rounded-xl border border-emerald-500/40 bg-emerald-950/20">
                      <div className="flex items-center justify-between text-xs font-mono text-emerald-400 font-bold mb-2">
                        <span>UN SNA 2008 DOUBLE DEFLATION</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-[10px]">ARTHALENS RIGOR</span>
                      </div>
                      <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">+7.8% YoY Real GVA</div>
                      <p className="text-xs text-white/70 mt-2 leading-relaxed">
                        Separately deflates gross output with output indices ($P_{"{out}"}$) and intermediate inputs with input indices ($P_{"{in}"}$). Compliant with UN SNA 2008 Chapter 15 (§15.112).
                      </p>
                      <div className="mt-3 pt-3 border-t border-emerald-500/20 font-mono text-xs text-emerald-300">
                        Mathematical Formula: Real GVA = (Output / P_out) - (Input / P_in)
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-white/10 bg-white/5 font-mono text-xs text-white/80 flex items-center justify-between">
                    <span>Manufacturing Deflator Spread: WPI (+2.1%) vs Input Import Index (-8.4%)</span>
                    <span className="text-[#E5A83B] font-bold">Divergence Alert Reconciled</span>
                  </div>
                </div>
              )}

              {activePhase.id === 3 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                    <div className="flex items-center justify-between mb-3 text-xs font-mono">
                      <span className="font-bold text-white uppercase">State-Level GSDP & Central GVA Alignment</span>
                      <span className="text-[#059669]">28 States & 3 UTs Reconciled</span>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-5 font-mono text-xs">
                      <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                        <div className="text-white/60 text-[10px]">MAHARASHTRA</div>
                        <div className="text-sm font-bold text-white mt-1 tabular-nums">₹38.79L Cr</div>
                        <div className="text-[10px] text-[#059669] mt-0.5">+8.1% GSDP</div>
                      </div>
                      <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                        <div className="text-white/60 text-[10px]">TAMIL NADU</div>
                        <div className="text-sm font-bold text-white mt-1 tabular-nums">₹27.53L Cr</div>
                        <div className="text-[10px] text-[#059669] mt-0.5">+8.3% GSDP</div>
                      </div>
                      <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                        <div className="text-white/60 text-[10px]">GUJARAT</div>
                        <div className="text-sm font-bold text-white mt-1 tabular-nums">₹25.62L Cr</div>
                        <div className="text-[10px] text-[#059669] mt-0.5">+8.5% GSDP</div>
                      </div>
                      <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                        <div className="text-white/60 text-[10px]">KARNATAKA</div>
                        <div className="text-sm font-bold text-white mt-1 tabular-nums">₹25.01L Cr</div>
                        <div className="text-[10px] text-[#059669] mt-0.5">+7.9% GSDP</div>
                      </div>
                      <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                        <div className="text-white/60 text-[10px]">UTTAR PRADESH</div>
                        <div className="text-sm font-bold text-white mt-1 tabular-nums">₹24.39L Cr</div>
                        <div className="text-[10px] text-[#059669] mt-0.5">+8.2% GSDP</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-white/10 bg-black/50 font-mono text-xs text-white/70">
                    <span className="text-[#059669] font-bold">Sub-National Synthesis:</span> Aggregated state GSDP equals ₹286.4 Lakh Cr, within 0.14% calibration tolerance of MoSPI All-India Nominal GVA.
                  </div>
                </div>
              )}

              {activePhase.id === 4 && (
                <div className="space-y-4">
                  <div className="p-5 rounded-xl border border-white/10 bg-white/5 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-[#E5A83B] font-bold">
                      <span>OFFICIAL DISCREPANCY RECONCILIATION</span>
                      <span>MOSPI STATEMENT 1.1 AUDIT</span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-4 font-mono text-xs">
                      <div className="p-3 rounded-lg bg-black/40">
                        <div className="text-white/50 text-[10px]">REAL GVA (BASIC PRICES)</div>
                        <div className="text-sm font-bold text-white tabular-nums">₹160.71 Lakh Cr</div>
                      </div>
                      <div className="p-3 rounded-lg bg-black/40">
                        <div className="text-white/50 text-[10px]">NET INDIRECT TAXES (NIT)</div>
                        <div className="text-sm font-bold text-white tabular-nums">₹13.09 Lakh Cr</div>
                      </div>
                      <div className="p-3 rounded-lg bg-black/40">
                        <div className="text-white/50 text-[10px]">IMPLIED REAL GDP</div>
                        <div className="text-sm font-bold text-emerald-400 tabular-nums">₹173.80 Lakh Cr</div>
                      </div>
                      <div className="p-3 rounded-lg bg-black/40">
                        <div className="text-white/50 text-[10px]">STATISTICAL DISCREPANCY</div>
                        <div className="text-sm font-bold text-[#E5A83B] tabular-nums">+₹3.81L Cr (2.2%)</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-[#059669]/10 border border-[#059669]/30 text-xs font-mono text-[#059669]">
                      ✓ Discrepancy triaged: Attributable to uncollected GST timing intervals in Q4. Documented in MoSPI NAS 2024 Sources & Methods.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Scrubber & Playback Controls Bar */}
            <div className="px-6 py-4 border-t border-white/10 bg-[#1B1D22] space-y-3">
              {/* Scrub Track with 4 Segments */}
              <div className="space-y-1.5">
                <div className="relative h-2 w-full bg-white/15 rounded-full overflow-hidden cursor-pointer"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const ratio = (e.clientX - rect.left) / rect.width;
                    setCurrentTime(Math.floor(ratio * TOTAL_DURATION));
                  }}
                >
                  <div
                    className="h-full bg-[#D94E34] transition-all duration-150"
                    style={{ width: `${(currentTime / TOTAL_DURATION) * 100}%` }}
                  />
                </div>

                {/* Phase Pill Buttons for Scrubbing */}
                <div className="grid grid-cols-4 gap-2 pt-1 font-mono text-[10px]">
                  {PHASES.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => jumpToPhase(p)}
                      className={`text-left p-1.5 rounded transition-all cursor-pointer ${
                        activePhase.id === p.id
                          ? "bg-white/15 text-white font-bold border-l-2 border-[#D94E34]"
                          : "text-white/50 hover:text-white/80"
                      }`}
                    >
                      <div className="truncate">{p.shortTitle}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Controls Row */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#141416] hover:bg-white/90 active:scale-95 transition-all cursor-pointer"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current ml-0.5 text-[#D94E34]" />}
                  </button>

                  <button
                    onClick={() => setCurrentTime((t) => Math.max(0, t - 10))}
                    className="p-2 text-white/70 hover:text-white transition-colors cursor-pointer"
                    aria-label="Rewind 10 seconds"
                  >
                    <Rewind className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => setCurrentTime((t) => Math.min(TOTAL_DURATION, t + 10))}
                    className="p-2 text-white/70 hover:text-white transition-colors cursor-pointer"
                    aria-label="Forward 10 seconds"
                  >
                    <FastForward className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => {
                      setCurrentTime(0);
                      setIsPlaying(true);
                    }}
                    className="p-2 text-white/70 hover:text-white transition-colors cursor-pointer"
                    aria-label="Restart playback"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>

                  <span className="font-mono text-xs text-white/80 tabular-nums ml-2">
                    {formatTime(currentTime)} / {formatTime(TOTAL_DURATION)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Playback speed selector */}
                  <div className="flex items-center rounded-lg bg-white/10 p-0.5 font-mono text-[11px]">
                    {[1, 1.5, 2].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => setPlaybackSpeed(speed)}
                        className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                          playbackSpeed === speed ? "bg-white text-[#141416] font-bold" : "text-white/60 hover:text-white"
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 text-white/70 hover:text-white transition-colors cursor-pointer"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
