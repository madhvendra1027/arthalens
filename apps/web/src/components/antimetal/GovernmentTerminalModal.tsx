"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ShinyButton } from "@/components/ui/shiny-button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function GovernmentTerminalModal({ isOpen, onClose }: Props) {
  const [inputVal, setInputVal] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "INITIALIZING SOVEREIGN SECURE GATEWAY...",
    "HANDSHAKE: MOSPI CLOUD PROTOCOL 4.2",
    "ENCRYPTION: AES-256-GCM / SOC-2 CERTIFIED",
    "ENTER SOVEREIGN AUTHORIZATION KEY (OR PRESS ENTER FOR GUEST CLEARANCE):",
  ]);
  const [cleared, setCleared] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Starburst particle canvas animation
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const particles: { angle: number; dist: number; speed: number; size: number }[] = [];
    for (let i = 0; i < 120; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        dist: Math.random() * Math.max(width, height) * 0.45,
        speed: 0.15 + Math.random() * 0.35,
        size: Math.random() * 2 + 0.8,
      });
    }

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Draw faint rays from center
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.dist += p.speed;
        if (p.dist > Math.max(width, height) * 0.5) {
          p.dist = 10;
        }

        const x = cx + Math.cos(p.angle) * p.dist;
        const y = cy + Math.sin(p.angle) * p.dist;

        // Draw radial ray
        if (i % 3 === 0) {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(x, y);
          ctx.stroke();
        }

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = i % 5 === 0 ? "#E5A83B" : "rgba(255, 255, 255, 0.5)";
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (cmd.toLowerCase() === "exit") {
      onClose();
      return;
    }

    setTerminalLogs((prev) => [
      ...prev,
      `$ gov ${inputVal}`,
      "AUTHENTICATING CERTIFICATE...",
      "CLEARANCE CONFIRMED: SOVEREIGN REPOSITORIES UNLOCKED (LEVEL 4 ACCESS).",
      "ALL 36 STATE & UT REGISTRIES MOUNTED TO VIRTUAL FS.",
    ]);
    setCleared(true);
    setInputVal("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C0D0E]/95 p-6 backdrop-blur-md">
      {/* Background Starburst Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Crosshairs in 4 corners */}
      <div className="absolute top-6 left-6 font-mono text-xs text-white/30">+</div>
      <div className="absolute top-6 right-6 font-mono text-xs text-white/30">+</div>
      <div className="absolute bottom-6 left-6 font-mono text-xs text-white/30">+</div>
      <div className="absolute bottom-6 right-6 font-mono text-xs text-white/30">+</div>

      {/* Floating Terminal Box (Replicating antimetal-3.mp4 frames 00:39 - 00:44) */}
      <div className="relative z-10 w-full max-w-xl rounded-lg border border-white/20 bg-[#141517] shadow-2xl overflow-hidden font-mono text-xs">
        {/* Title Bar */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#1D1E22] px-4 py-2.5 text-white/70">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />
          </div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-white/80">
            ENTER PASSWORD
          </span>
          <button
            onClick={onClose}
            className="hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Terminal Screen Content */}
        <div className="p-6 space-y-3 min-h-[260px] max-h-[380px] overflow-y-auto text-white/90">
          {terminalLogs.map((log, i) => (
            <div
              key={i}
              className={
                log.includes("CLEARANCE CONFIRMED")
                  ? "text-[#10B981] font-bold"
                  : log.startsWith("$")
                  ? "text-[#E5A83B]"
                  : "text-white/70"
              }
            >
              {log}
            </div>
          ))}

          {!cleared ? (
            <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-2">
              <span className="text-[#E5A83B] font-bold">$ gov</span>
              <input
                ref={inputRef}
                type="password"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="type secret key or press Enter"
                className="flex-1 bg-transparent border-none text-white focus:outline-hidden font-mono caret-[#E5A83B]"
                autoFocus
              />
            </form>
          ) : (
            <div className="pt-4 border-t border-white/10 flex flex-wrap gap-3 items-center">
              <Link href="/gdp" onClick={onClose}>
                <ShinyButton
                  icon={<ShieldCheck className="h-4 w-4 text-[#10B981]" />}
                  highlightColor="#10B981"
                  highlightSubtleColor="#E5A83B"
                  className="!py-2 !px-4 !text-xs !font-bold"
                >
                  <span>Enter Classified State GVA Vault</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </ShinyButton>
              </Link>
              <button
                onClick={onClose}
                className="btn-realistic bg-white/10 hover:bg-white/20 text-white px-4 py-2 text-xs font-bold rounded-full"
              >
                Exit Terminal
              </button>
            </div>
          )}
        </div>

        <div className="px-6 py-2.5 border-t border-white/10 bg-[#0F1012] flex items-center justify-between text-[10px] text-white/40">
          <span>SECURE CLEARANCE PROTOCOL // MOSPI-CLASSIFIED</span>
          <span>PRESS ESC TO DISMISS</span>
        </div>
      </div>
    </div>
  );
}
