"use client";

import React, { useState } from "react";
import { Check, Sparkles, ArrowRight, ShieldCheck, Terminal, Bot } from "lucide-react";
import Link from "next/link";

export function TelemetrySpotlight() {
  const [approved1, setApproved1] = useState(false);
  const [approved2, setApproved2] = useState(false);
  const [copilotQuery, setCopilotQuery] = useState("");
  const [copilotAnswer, setCopilotAnswer] = useState<string | null>(null);

  const handleCopilotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotQuery.trim()) return;
    setCopilotAnswer(
      `ArthaLens Engine Analysis: Query "${copilotQuery}" indicates real output acceleration (+8.2% FY24) propelled by manufacturing (+9.9%) and mining (+7.1%). The implicit deflator of 1.4% reflects divergence between consumer inflation (CPI 4.83%) and wholesale input costs (WPI 1.26%).`
    );
  };

  return (
    <section className="relative my-24 sm:my-32 overflow-hidden rounded-2xl bg-[#0D0E11] text-[#ECEBE5] p-6 sm:p-12 border border-white/10 shadow-2xl">
      {/* Background Starry Dust / Ambient Subtle Aurora */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#10B981]">
              SOVEREIGN RUNTIME // ACTIVE SESSION
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-normal text-white">
            Good evening, Sovereign Researcher
          </h2>
          <p className="text-xs text-white/60 font-mono mt-1">
            Autonomous models monitored 1,842 state series today • 2 action proposals await review
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-white/80">
            BASE 2022-23 ACTIVE
          </span>
          <Link
            href="/gdp"
            className="btn-realistic bg-white text-[#0D0E11] hover:bg-white/90 text-xs px-4 py-2 font-bold rounded-full"
          >
            Launch Full Workspace
          </Link>
        </div>
      </div>

      {/* 4 Metric Telemetry Cards */}
      <div className="relative z-10 grid gap-4 grid-cols-2 lg:grid-cols-4 my-8">
        {[
          { label: "REAL GDP GROWTH", value: "+8.2%", sub: "+120 bps vs FY23", color: "#10B981" },
          { label: "NOMINAL SIZE", value: "₹295.36L Cr", sub: "May 2024 Release", color: "#E5A83B" },
          { label: "DATA INTEGRITY", value: "99.98%", sub: "36 States / UTs Clean", color: "#60A5FA" },
          { label: "GDP DEFLATOR", value: "1.40%", sub: "Implied Economy Inflation", color: "#D94E34" },
        ].map((m, i) => (
          <div key={i} className="rounded-lg bg-white/[0.04] border border-white/10 p-4">
            <div className="font-mono text-[10px] uppercase tracking-wider text-white/50">
              {m.label}
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-black text-white my-1" style={{ color: m.color }}>
              {m.value}
            </div>
            <div className="font-mono text-[10px] text-white/40">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Main Split: Action Proposals on Left, AI Copilot on Right */}
      <div className="relative z-10 grid gap-8 lg:grid-cols-12 items-start">
        {/* Left (7 cols): Action Proposals Stream */}
        <div className="lg:col-span-7 space-y-4">
          <div className="font-mono text-xs uppercase tracking-wider text-white/60 mb-2 flex items-center justify-between">
            <span>ACTION PROPOSALS FOR REVIEW</span>
            <span>2 PENDING</span>
          </div>

          {/* Proposal 1 */}
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-[#E5A83B] bg-[#E5A83B]/10 px-2 py-0.5 rounded">
                  GVA RECONCILIATION
                </span>
                <h4 className="font-serif text-lg text-white mt-1">
                  Reconcile MCA-21 services discrepancy on Trade & Hotels (+1.2% delta)
                </h4>
                <p className="text-xs text-white/70 mt-1 leading-relaxed">
                  Autonomous Triage detected divergence between GSTN e-way bill volume and NSO provisional estimates. Proposed fix aligns state gross value-added across Karnataka and Maharashtra.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setApproved1(true)}
                disabled={approved1}
                className={`btn-realistic text-xs px-4 py-1.5 font-bold rounded-full ${
                  approved1
                    ? "bg-[#10B981] text-black"
                    : "bg-white text-black hover:bg-white/90"
                }`}
              >
                {approved1 ? "✓ Plan Approved & Reconciled" : "Approve Plan"}
              </button>
              <Link
                href="/consistency"
                className="text-xs font-mono text-white/70 hover:text-white underline underline-offset-4"
              >
                Inspect Statistical Diff →
              </Link>
            </div>
          </div>

          {/* Proposal 2 */}
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-[#60A5FA] bg-[#60A5FA]/10 px-2 py-0.5 rounded">
                  DOUBLE DEFLATION
                </span>
                <h4 className="font-serif text-lg text-white mt-1">
                  Recalibrate WPI deflator weightings for FY25 advance simulation
                </h4>
                <p className="text-xs text-white/70 mt-1 leading-relaxed">
                  Manufacturing input cost indices reflect single-deflation bias. Apply double-deflation matrix according to UN SNA 2008 standard.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setApproved2(true)}
                disabled={approved2}
                className={`btn-realistic text-xs px-4 py-1.5 font-bold rounded-full ${
                  approved2
                    ? "bg-[#10B981] text-black"
                    : "bg-white text-black hover:bg-white/90"
                }`}
              >
                {approved2 ? "✓ Recalibration Queued" : "Run Calibration"}
              </button>
              <Link
                href="/deflator"
                className="text-xs font-mono text-white/70 hover:text-white underline underline-offset-4"
              >
                Open Deflator Simulator →
              </Link>
            </div>
          </div>
        </div>

        {/* Right (5 cols): AI Copilot Terminal */}
        <div className="lg:col-span-5 rounded-lg border border-white/10 bg-white/[0.04] p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-[#E5A83B]" />
            <h3 className="font-mono text-xs uppercase tracking-wider text-white font-bold">
              ArthaLens Sovereign Copilot
            </h3>
          </div>

          <p className="font-serif text-sm text-white/80">
            Ask anything about official releases, deflators, or state economic balances:
          </p>

          <form onSubmit={handleCopilotSubmit} className="space-y-2">
            <div className="relative">
              <input
                type="text"
                value={copilotQuery}
                onChange={(e) => setCopilotQuery(e.target.value)}
                placeholder="e.g. What explains the 8.2% growth rate?"
                className="w-full rounded-md border border-white/20 bg-black/50 px-3 py-2 text-xs text-white placeholder-white/40 focus:border-[#E5A83B] focus:outline-hidden font-mono"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 text-[#E5A83B] hover:text-white font-mono text-xs font-bold"
              >
                ASK
              </button>
            </div>
          </form>

          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              "Why is deflator only 1.4%?",
              "State GVA ranking",
              "Sovereign rating outlook",
            ].map((prompt) => (
              <button
                key={prompt}
                onClick={() => {
                  setCopilotQuery(prompt);
                  setCopilotAnswer(
                    `ArthaLens Analysis [${prompt}]: Citing official MoSPI Provisional Estimates May 2024 and RBI DBIE. Macro aggregates remain anchored by robust capital expenditure (GFCF 33.5% of GDP) and resilient domestic consumption.`
                  );
                }}
                className="rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-[10px] font-mono text-white/70 hover:bg-white/10 hover:text-white"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* AI Response Display */}
          {copilotAnswer && (
            <div className="rounded-md border border-[#E5A83B]/30 bg-[#E5A83B]/5 p-3 text-xs text-white/90 leading-relaxed font-mono">
              <span className="text-[#E5A83B] font-bold">▶ RESP: </span>
              {copilotAnswer}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
