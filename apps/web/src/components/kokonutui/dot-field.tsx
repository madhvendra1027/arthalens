// biome-ignore-all lint/suspicious/noBitwiseOperators: the noise hash is bit arithmetic.
"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ShieldCheck,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

export interface JourneyStage {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  detail: string;
  sourceDoc: string;
  auditStandard: string;
  link: string;
  linkText: string;
  color: string;
}

export const DATA_JOURNEY_STAGES: JourneyStage[] = [
  {
    id: "stage-1",
    step: "PHASE 01 // RAW INGESTION",
    title: "Primary Administrative Feeds",
    subtitle: "Census-Level Corporate & Tax Invoices",
    detail:
      "Enterprise records from MCA-21 (>1.4 million corporate entities), monthly GSTN gross tax flows (₹1.73L Cr/mo), and ASI manufacturing censuses.",
    sourceDoc: "MCA-21 XBRL Ledger • GSTN Tax Registry • ASI Surveys",
    auditStandard: "Automated API Ingestion with SHA-256 Hashing",
    link: "/sources",
    linkText: "Inspect Data Pipeline Sources",
    color: "#059669",
  },
  {
    id: "stage-2",
    step: "PHASE 02 // HARMONIZATION",
    title: "UN SNA 2008 & Base Splicing",
    subtitle: "Constant Price Valuation & Splicing",
    detail:
      "Alignment to UN System of National Accounts (UN SNA 2008 §15), benchmark base year 2022-23 re-weighting, and single/double deflation reconciliation.",
    sourceDoc: "MoSPI Advisory Committee Guidelines (ACNAS 2024)",
    auditStandard: "UN SNA 2008 Harmonization Protocol",
    link: "/methodology",
    linkText: "Review Deflation Methodology",
    color: "#D97706",
  },
  {
    id: "stage-3",
    step: "PHASE 03 // RECONCILIATION",
    title: "Forensic Cross-Auditing",
    subtitle: "Budget Actuals & Balance Sheets",
    detail:
      "Triangulating Controller General of Accounts (CGA) audited fiscal actuals, RBI DBIE commercial banking returns, and 36 State Directorate statements.",
    sourceDoc: "CGA Ministry of Finance • RBI DBIE Table 4",
    auditStandard: "Discrepancy Spread Audit (<0.15% threshold)",
    link: "/deflator",
    linkText: "Analyze Forensic Deflator Wedge",
    color: "#D94E34",
  },
  {
    id: "stage-4",
    step: "PHASE 04 // OBSERVATION",
    title: "Verified Macroeconomic Signal",
    subtitle: "Cryptographic Provenance Publication",
    detail:
      "Final synthesized national income aggregates: Real GDP (+8.2%), Nominal Output (₹295.4L Cr), and Implicit Deflator (1.40%) published with gazette citations.",
    sourceDoc: "MoSPI Provisional Estimates 2024 (Statement 1.1)",
    auditStandard: "Official Gazette Release with Cryptographic Seal",
    link: "/gdp",
    linkText: "Explore Macro Accounts Workspace",
    color: "#141416",
  },
];

export interface DotFieldProps {
  className?: string;
  /** Content shown over the field. Pass `null` for a bare background. */
  children?: ReactNode;
  /** Distance between dots, in px. */
  spacing?: number;
  /** Let a swipe push the dots and a click send a shockwave. */
  interactive?: boolean;
  /** Seed for the halftone pattern, so a page always opens on the same one. */
  seed?: number;
  /** Whether to show the ArthaLens Economic Data Journey telemetry overlay */
  showJourney?: boolean;
}

// Width of a light or dark patch in the idle halftone, in px.
const NOISE_SCALE = 240;
const NOISE_SPEED = 0.07;
const TONE_STEP = 3;
const POINTER_RADIUS = 76;
const POINTER_GAIN = 14;
const POINTER_MAX_SPEED = 2600;
const POINTER_PART = 0.45;
const SHOCK_LIFE = 1.3;

interface Shock {
  x: number;
  y: number;
  age: number;
}

interface Pointer {
  x: number;
  y: number;
  lastX: number;
  lastY: number;
  inside: boolean;
}

interface StreamParticle {
  x: number;
  y: number;
  speed: number;
  size: number;
  stageIdx: number;
  alpha: number;
}

/** Seeded 3D gradient noise */
function createNoise(seed: number) {
  const p = Array.from({ length: 256 }, (_, i) => i);
  let state = seed >>> 0 || 1;
  const random = () => {
    state = (state * 1_664_525 + 1_013_904_223) >>> 0;
    return state / 4_294_967_296;
  };
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  const perm = new Uint8Array(512);
  for (let i = 0; i < 512; i++) {
    perm[i] = p[i & 255];
  }
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const grad = (hash: number, x: number, y: number, z: number) => {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    let v = z;
    if (h < 4) {
      v = y;
    } else if (h === 12 || h === 14) {
      v = x;
    }
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  };

  return (x: number, y: number, z: number) => {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;
    const fx = x - Math.floor(x);
    const fy = y - Math.floor(y);
    const fz = z - Math.floor(z);
    const u = fade(fx);
    const v = fade(fy);
    const w = fade(fz);
    const A = perm[X] + Y;
    const AA = perm[A] + Z;
    const AB = perm[A + 1] + Z;
    const B = perm[X + 1] + Y;
    const BA = perm[B] + Z;
    const BB = perm[B + 1] + Z;

    return lerp(
      lerp(
        lerp(grad(perm[AA], fx, fy, fz), grad(perm[BA], fx - 1, fy, fz), u),
        lerp(grad(perm[AB], fx, fy - 1, fz), grad(perm[BB], fx - 1, fy - 1, fz), u),
        v
      ),
      lerp(
        lerp(grad(perm[AA + 1], fx, fy, fz - 1), grad(perm[BA + 1], fx - 1, fy, fz - 1), u),
        lerp(grad(perm[AB + 1], fx, fy - 1, fz - 1), grad(perm[BB + 1], fx - 1, fy - 1, fz - 1), u),
        v
      ),
      w
    );
  };
}

interface Field {
  cols: number;
  rows: number;
  spacing: number;
  x0: number;
  y0: number;
  total: number;
  ox: Float32Array;
  oy: Float32Array;
  vx: Float32Array;
  vy: Float32Array;
  tone: Float32Array;
}

function createField(width: number, height: number, spacing: number): Field {
  const safeW = Math.max(width, 320);
  const safeH = Math.max(height, 240);
  const cols = Math.max(2, Math.floor(safeW / spacing) + 1);
  const rows = Math.max(2, Math.floor(safeH / spacing) + 1);
  const total = cols * rows;
  const x0 = (safeW - (cols - 1) * spacing) / 2;
  const y0 = (safeH - (rows - 1) * spacing) / 2;
  return {
    cols,
    rows,
    spacing,
    x0,
    y0,
    total,
    ox: new Float32Array(total),
    oy: new Float32Array(total),
    vx: new Float32Array(total),
    vy: new Float32Array(total),
    tone: new Float32Array(total),
  };
}

function sampleTone(field: Field, noise: (x: number, y: number, z: number) => number, time: number) {
  const { cols, rows, spacing, x0, y0, tone } = field;
  const nz = time * NOISE_SPEED;
  for (let r = 0; r < rows; r += TONE_STEP) {
    const y = y0 + r * spacing;
    for (let c = 0; c < cols; c += TONE_STEP) {
      const x = x0 + c * spacing;
      tone[r * cols + c] = noise(x / NOISE_SCALE, y / NOISE_SCALE, nz);
    }
  }
  for (let r = 0; r < rows; r++) {
    const r0 = Math.floor(r / TONE_STEP) * TONE_STEP;
    const r1 = Math.min(r0 + TONE_STEP, rows - 1);
    const tr = r0 === r1 ? 0 : (r - r0) / (r1 - r0);
    for (let c = 0; c < cols; c++) {
      const c0 = Math.floor(c / TONE_STEP) * TONE_STEP;
      const c1 = Math.min(c0 + TONE_STEP, cols - 1);
      const tc = c0 === c1 ? 0 : (c - c0) / (c1 - c0);
      const tl = tone[r0 * cols + c0];
      const trVal = tone[r0 * cols + c1];
      const bl = tone[r1 * cols + c0];
      const br = tone[r1 * cols + c1];
      const top = tl + (trVal - tl) * tc;
      const bottom = bl + (br - bl) * tc;
      tone[r * cols + c] = top + (bottom - top) * tr;
    }
  }
}

function applyPointer(field: Field, pointer: Pointer, dt: number): boolean {
  if (!pointer.inside) return false;
  const dx = pointer.x - pointer.lastX;
  const dy = pointer.y - pointer.lastY;
  const speed = Math.hypot(dx, dy) / Math.max(dt, 1 / 240);
  pointer.lastX = pointer.x;
  pointer.lastY = pointer.y;
  if (speed < 10) return false;

  const clampSpeed = Math.min(speed, POINTER_MAX_SPEED);
  const nx = dx / (speed || 1);
  const ny = dy / (speed || 1);
  const px = -ny;
  const py = nx;
  const { cols, rows, spacing, x0, y0, ox, oy, vx, vy } = field;
  const rMin = Math.max(0, Math.floor((pointer.y - POINTER_RADIUS - y0) / spacing));
  const rMax = Math.min(rows - 1, Math.ceil((pointer.y + POINTER_RADIUS - y0) / spacing));
  const cMin = Math.max(0, Math.floor((pointer.x - POINTER_RADIUS - x0) / spacing));
  const cMax = Math.min(cols - 1, Math.ceil((pointer.x + POINTER_RADIUS - x0) / spacing));
  const r2 = POINTER_RADIUS * POINTER_RADIUS;
  let pushed = false;

  for (let r = rMin; r <= rMax; r++) {
    const py0 = y0 + r * spacing;
    for (let c = cMin; c <= cMax; c++) {
      const i = r * cols + c;
      const dotX = x0 + c * spacing + ox[i];
      const dotY = py0 + oy[i];
      const d2 = (dotX - pointer.x) ** 2 + (dotY - pointer.y) ** 2;
      if (d2 >= r2) continue;

      const f = 1 - Math.sqrt(d2) / POINTER_RADIUS;
      const falloff = f * f;
      const side = (dotX - pointer.x) * px + (dotY - pointer.y) * py;
      const pushX = (nx + px * (side > 0 ? 1 : -1) * POINTER_PART) * clampSpeed * POINTER_GAIN;
      const pushY = (ny + py * (side > 0 ? 1 : -1) * POINTER_PART) * clampSpeed * POINTER_GAIN;
      vx[i] += pushX * falloff * dt;
      vy[i] += pushY * falloff * dt;
      pushed = true;
    }
  }
  return pushed;
}

export default function DotField({
  className,
  children,
  spacing = 20,
  interactive = true,
  seed = 42,
  showJourney = true,
}: DotFieldProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeStageId, setActiveStageId] = useState<string>("stage-1");

  const activeStage =
    DATA_JOURNEY_STAGES.find((s) => s.id === activeStageId) || DATA_JOURNEY_STAGES[0];

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!(root && canvas && ctx)) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const noise = createNoise(seed);
    const gap = Math.max(12, spacing);
    const size = { width: 0, height: 0 };
    let field = createField(root.clientWidth || 800, root.clientHeight || 500, gap);

    // Initialize streamline particles for the Economic Data Journey
    const streamlines: StreamParticle[] = [];
    const streamCount = 28;
    for (let s = 0; s < streamCount; s++) {
      streamlines.push({
        x: Math.random() * (root.clientWidth || 800),
        y: Math.random() * (root.clientHeight || 500),
        speed: 0.8 + Math.random() * 1.4,
        size: 1.5 + Math.random() * 1.5,
        stageIdx: Math.floor(Math.random() * 4),
        alpha: 0.2 + Math.random() * 0.45,
      });
    }

    const pointer: Pointer = { x: 0, y: 0, lastX: 0, lastY: 0, inside: false };
    const shocks: Shock[] = [];
    let time = 0;
    let last = 0;
    let raf = 0;
    let isVisible = true;

    const onVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const resize = () => {
      const rect = root.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size.width = Math.max(rect.width, 320);
      size.height = Math.max(rect.height, 240);

      canvas.width = Math.round(size.width * dpr);
      canvas.height = Math.round(size.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      field = createField(size.width, size.height, gap);
      sampleTone(field, noise, time);
    };

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(root);

    // Pointer events
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      if (!pointer.inside) {
        pointer.lastX = pointer.x;
        pointer.lastY = pointer.y;
        pointer.inside = true;
      }
    };

    const onLeave = () => {
      pointer.inside = false;
    };

    const onDown = (e: PointerEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      shocks.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        age: 0,
      });
    };

    if (interactive) {
      root.addEventListener("pointermove", onMove);
      root.addEventListener("pointerleave", onLeave);
      root.addEventListener("pointerdown", onDown);
    }

    // Animation render loop
    const frame = (now: number) => {
      if (!isVisible) {
        raf = requestAnimationFrame(frame);
        return;
      }

      if (!last) last = now;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      time += dt;

      ctx.clearRect(0, 0, size.width, size.height);

      if (!reduceMotion) {
        applyPointer(field, pointer, dt);

        // Advance shocks
        for (let s = shocks.length - 1; s >= 0; s--) {
          shocks[s].age += dt;
          if (shocks[s].age >= SHOCK_LIFE) {
            shocks.splice(s, 1);
          }
        }

        // Halftone slow drift update
        sampleTone(field, noise, time);
      }

      // 1. Draw Halftone dots
      const { cols, rows, spacing: sp, x0, y0, ox, oy, tone } = field;
      const baseColor = "#141416";
      ctx.fillStyle = baseColor;

      for (let r = 0; r < rows; r++) {
        const py = y0 + r * sp;
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const x = x0 + c * sp + ox[i];
          const y = py + oy[i];

          const t = (tone[i] + 1) * 0.5; // [0, 1]
          const radius = 0.8 + t * 1.8;

          ctx.globalAlpha = 0.08 + t * 0.16;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 2. Draw Economic Data Journey Streamlines
      if (showJourney && !reduceMotion) {
        ctx.lineWidth = 1;
        for (let s = 0; s < streamlines.length; s++) {
          const st = streamlines[s];
          st.x += st.speed;
          if (st.x > size.width + 20) {
            st.x = -20;
            st.y = Math.random() * size.height;
          }

          // Stage illumination color
          const stageCol =
            st.stageIdx === 0
              ? "rgba(5, 150, 105, "
              : st.stageIdx === 1
              ? "rgba(217, 119, 6, "
              : st.stageIdx === 2
              ? "rgba(217, 78, 52, "
              : "rgba(20, 21, 23, ";

          ctx.strokeStyle = `${stageCol}${st.alpha * 0.45})`;
          ctx.beginPath();
          ctx.moveTo(st.x - 14, st.y);
          ctx.lineTo(st.x, st.y);
          ctx.stroke();

          ctx.fillStyle = `${stageCol}${st.alpha})`;
          ctx.beginPath();
          ctx.arc(st.x, st.y, st.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (interactive) {
        root.removeEventListener("pointermove", onMove);
        root.removeEventListener("pointerleave", onLeave);
        root.removeEventListener("pointerdown", onDown);
      }
    };
  }, [spacing, interactive, seed, showJourney]);

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative w-full overflow-hidden rounded-3xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.14)] select-none",
        className
      )}
    >
      {/* 1. Underlying Canvas Membrane */}
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Economic data journey particle canvas illustrating verified flow from raw administrative records to sovereign macro accounts"
        className="absolute inset-0 w-full h-full block"
      />

      {/* 2. Interactive Economic Data Journey Stage Header & Navigation */}
      {showJourney && (
        <div className="relative z-10 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(20,21,23,0.12)] pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-[#059669]">
                <span className="h-2 w-2 rounded-full bg-[#059669] animate-pulse" />
                <span>SOVEREIGN DATA JOURNEY // UN SNA 2008 PIPELINE</span>
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-[#141416] tracking-tight">
                From Raw Administrative Records to Sovereign Macro Signal
              </h3>
            </div>

            <div className="flex items-center gap-2 font-mono text-[10px] text-[#828387]">
              <span>HOVER / CLICK STAGES TO INSPECT PROVENANCE</span>
            </div>
          </div>

          {/* 4 Interactive Journey Stage Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {DATA_JOURNEY_STAGES.map((stage, idx) => {
              const isSelected = activeStageId === stage.id;
              return (
                <div
                  key={stage.id}
                  onClick={() => setActiveStageId(stage.id)}
                  onMouseEnter={() => setActiveStageId(stage.id)}
                  className={`group relative rounded-2xl border p-4 sm:p-5 transition-all cursor-pointer backdrop-blur-xs ${
                    isSelected
                      ? "border-[#141416] bg-[#E6E5DF]/95 shadow-md -translate-y-0.5"
                      : "border-[rgba(20,21,23,0.12)] bg-[#ECEBE5]/80 hover:bg-[#E6E5DF]/60"
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px] mb-2">
                    <span
                      className="font-bold tracking-wider"
                      style={{ color: stage.color }}
                    >
                      {stage.step}
                    </span>
                    <span className="text-[#828387]">0{idx + 1}</span>
                  </div>

                  <h4 className="font-heading text-sm sm:text-base font-bold text-[#141416] mb-1">
                    {stage.title}
                  </h4>

                  <p className="font-mono text-[11px] text-[#57585C] mb-3">
                    {stage.subtitle}
                  </p>

                  <p className="font-sans text-xs text-[#57585C] leading-relaxed line-clamp-3">
                    {stage.detail}
                  </p>

                  <div className="mt-4 pt-3 border-t border-[rgba(20,21,23,0.08)] flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#828387] truncate max-w-[140px]">
                      {stage.auditStandard}
                    </span>
                    <ChevronRight
                      className={`h-3.5 w-3.5 transition-transform ${
                        isSelected ? "translate-x-1 text-[#141416]" : "text-[#828387]"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Stage Provenance Ledger Card */}
          {activeStage && (
            <div className="rounded-2xl border border-[rgba(20,21,23,0.16)] bg-[#ECEBE5]/95 p-5 shadow-sm backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 max-w-3xl">
                <div className="flex items-center gap-2 font-mono text-[10px] text-[#828387]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#059669]" />
                  <span className="font-bold text-[#141416]">ACTIVE AUDIT TRAIL:</span>
                  <span>{activeStage.sourceDoc}</span>
                </div>
                <p className="font-sans text-xs sm:text-sm text-[#57585C]">
                  {activeStage.detail}
                </p>
              </div>

              <Link
                href={activeStage.link}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#141416] px-4 py-2 font-mono text-xs font-bold text-[#ECEBE5] hover:bg-[#D94E34] transition-colors shrink-0 shadow-xs cursor-pointer"
              >
                <span>{activeStage.linkText}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Optional custom children */}
      {children}
    </div>
  );
}
