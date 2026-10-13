"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

interface MacroNode {
  id: string;
  code: string;
  label: string;
  value: string;
  category: "growth" | "prices" | "fiscal" | "external" | "registry";
  source: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  color: string;
  highlightColor: string;
}

const INITIAL_NODES: Omit<MacroNode, "x" | "y" | "vx" | "vy">[] = [
  { id: "1", code: "01 / REAL GDP", label: "Real GDP YoY", value: "+8.2%", category: "growth", source: "MoSPI NSO (May 2024)", baseRadius: 8, color: "#141416", highlightColor: "#D94E34" },
  { id: "2", code: "02 / GVA SERVICES", label: "Services GVA", value: "+7.9%", category: "growth", source: "National Accounts Statistics", baseRadius: 6, color: "#141416", highlightColor: "#D97706" },
  { id: "3", code: "03 / NOMINAL GDP", label: "Nominal Output", value: "₹295.36L Cr", category: "growth", source: "Advance Release", baseRadius: 7, color: "#141416", highlightColor: "#141416" },
  { id: "4", code: "04 / IMPLICIT DEFLATOR", label: "GDP Deflator", value: "1.40%", category: "prices", source: "SNA 2008 Standard", baseRadius: 6.5, color: "#D97706", highlightColor: "#D94E34" },
  { id: "5", code: "05 / CPI INFLATION", label: "CPI Combined", value: "4.83%", category: "prices", source: "MoSPI Price Statistics", baseRadius: 6, color: "#E5A83B", highlightColor: "#E5A83B" },
  { id: "6", code: "06 / WPI COMMODITIES", label: "WPI Headline", value: "1.26%", category: "prices", source: "DPIIT Office of Economic Adviser", baseRadius: 5, color: "#141416", highlightColor: "#141416" },
  { id: "7", code: "07 / GFCF SHARE", label: "Capital Formation", value: "33.5% GDP", category: "fiscal", source: "Expenditure Aggregates", baseRadius: 6, color: "#141416", highlightColor: "#D97706" },
  { id: "8", code: "08 / REPO RATE", label: "RBI Policy Rate", value: "6.50%", category: "fiscal", source: "RBI Monetary Policy Committee", baseRadius: 6, color: "#D94E34", highlightColor: "#D94E34" },
  { id: "9", code: "09 / CAD SPREAD", label: "Current Account", value: "-0.7% GDP", category: "external", source: "RBI BoP Bulletins", baseRadius: 5, color: "#141416", highlightColor: "#D97706" },
  { id: "10", code: "10 / FOREX RESERVE", label: "Foreign Reserves", value: "$652.89 Billion", category: "external", source: "RBI Weekly Statistical Supp.", baseRadius: 6.5, color: "#E5A83B", highlightColor: "#D94E34" },
  { id: "11", code: "11 / MCA-21 FEED", label: "Company Registry", value: "1.4M Filings", category: "registry", source: "Ministry of Corporate Affairs", baseRadius: 5.5, color: "#141416", highlightColor: "#141416" },
  { id: "12", code: "12 / GSTN ENGINE", label: "GST Gross Flows", value: "₹1.73L Cr/mo", category: "registry", source: "GST Network & Dept of Revenue", baseRadius: 6, color: "#D97706", highlightColor: "#E5A83B" },
  { id: "13", code: "13 / MFG GVA", label: "Manufacturing GVA", value: "+9.9%", category: "growth", source: "ASI & IIP Index", baseRadius: 5.5, color: "#141416", highlightColor: "#D94E34" },
  { id: "14", code: "14 / AGRI GVA", label: "Agriculture GVA", value: "+1.4%", category: "growth", source: "Dept of Agriculture & Farmers", baseRadius: 4.5, color: "#141416", highlightColor: "#D97706" },
  { id: "15", code: "15 / FISCAL DEFICIT", label: "Govt Deficit Target", value: "5.63% GDP", category: "fiscal", source: "CGA Ministry of Finance", baseRadius: 5, color: "#D94E34", highlightColor: "#D94E34" },
];

export function HeroConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<MacroNode[]>([]);
  const hoveredNodeRef = useRef<MacroNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<MacroNode | null>(null);
  const [scale, setScale] = useState<number>(1);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const animFrameRef = useRef<number | null>(null);

  // Initialize nodes with positions
  const initNodes = useCallback((width: number, height: number) => {
    const centerX = width * 0.52;
    const centerY = height * 0.5;
    const radiusVariation = Math.min(width, height) * 0.38;

    return INITIAL_NODES.map((n, i) => {
      const angle = (i / INITIAL_NODES.length) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
      const dist = (0.2 + (i % 3) * 0.28 + Math.random() * 0.2) * radiusVariation;
      return {
        ...n,
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      };
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 550);

    nodesRef.current = initNodes(width, height);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
      nodesRef.current = initNodes(width, height);
    };

    window.addEventListener("resize", handleResize);

    const maxConnectionDist = 160;

    let tick = 0;

    const render = () => {
      tick += 0.01;
      ctx.clearRect(0, 0, width, height);

      const nodes = nodesRef.current;
      const mouse = mousePosRef.current;
      const activeHovered = hoveredNodeRef.current;

      // Draw connection filaments
      ctx.lineWidth = 0.75;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectionDist) {
            const isConnectedToHovered =
              activeHovered && (activeHovered.id === nodes[i].id || activeHovered.id === nodes[j].id);
            const alpha = (1 - dist / maxConnectionDist) * (isConnectedToHovered ? 0.65 : 0.18);

            ctx.strokeStyle = isConnectedToHovered ? "rgba(217, 78, 52, 0.6)" : "rgba(20, 21, 23, 0.12)";
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Update positions & draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Soft physics drift
        node.x += node.vx;
        node.y += node.vy;

        // Subtle boundary attraction to center
        const centerX = width * 0.52;
        const centerY = height * 0.5;
        const distFromCenter = Math.sqrt((node.x - centerX) ** 2 + (node.y - centerY) ** 2);
        if (distFromCenter > width * 0.45) {
          node.vx += (centerX - node.x) * 0.0003;
          node.vy += (centerY - node.y) * 0.0003;
        }

        // Mouse repelling/attracting influence
        const dmx = mouse.x - node.x;
        const dmy = mouse.y - node.y;
        const distMouse = Math.sqrt(dmx * dmx + dmy * dmy);
        if (distMouse < 120 && distMouse > 5) {
          node.vx += (dmx / distMouse) * 0.04;
          node.vy += (dmy / distMouse) * 0.04;
        }

        // Dampen velocity
        node.vx *= 0.985;
        node.vy *= 0.985;

        const isHovered = activeHovered?.id === node.id;
        const radius = (node.baseRadius + (isHovered ? 3.5 : Math.sin(tick + i) * 0.6)) * scale;

        // Draw pulsing halo around hovered node
        if (isHovered) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius * 2.4, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(217, 78, 52, 0.12)";
          ctx.fill();

          ctx.beginPath();
          ctx.arc(node.x, node.y, radius * 1.6, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(217, 78, 52, 0.4)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Draw node body
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = isHovered ? node.highlightColor : node.color;
        ctx.fill();

        // Secondary inner core dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, Math.max(1.5, radius * 0.35), 0, Math.PI * 2);
        ctx.fillStyle = isHovered ? "#ffffff" : "rgba(230, 229, 223, 0.9)";
        ctx.fill();

        // Hairline technical label for significant nodes
        if (isHovered || i % 4 === 0) {
          ctx.font = "9px 'IBM Plex Mono', monospace";
          ctx.fillStyle = isHovered ? "#141416" : "rgba(20, 21, 23, 0.45)";
          ctx.fillText(node.code, node.x + radius + 6, node.y + 3);
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [initNodes, scale]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mousePosRef.current = { x, y };

    let found: MacroNode | null = null;
    for (const node of nodesRef.current) {
      const dist = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
      if (dist < node.baseRadius * 2.8 + 8) {
        found = node;
        break;
      }
    }
    hoveredNodeRef.current = found;
    setHoveredNode(found);
  };

  const handleMouseLeave = () => {
    mousePosRef.current = { x: -1000, y: -1000 };
    hoveredNodeRef.current = null;
    setHoveredNode(null);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[480px] sm:h-[580px] lg:h-[640px] select-none overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full h-full cursor-crosshair"
      />

      {/* Floating Active Node Telemetry Badge on Hover */}
      {hoveredNode && (
        <div
          className="pointer-events-none absolute z-20 rounded-md border border-[rgba(20,21,23,0.18)] bg-[#ECEBE5]/95 p-3 shadow-lg backdrop-blur-md transition-all duration-150"
          style={{
            left: Math.min(Math.max(hoveredNode.x - 70, 20), (containerRef.current?.clientWidth || 500) - 240),
            top: Math.max(hoveredNode.y - 75, 20),
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D94E34] animate-pulse" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#141416]">
              {hoveredNode.code}
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-xs text-[#57585C] font-medium">{hoveredNode.label}</span>
            <span className="font-mono text-sm font-black text-[#141416]">{hoveredNode.value}</span>
          </div>
          <div className="mt-1 pt-1 border-t border-[rgba(20,21,23,0.08)] text-[9px] font-mono text-[#828387]">
            PROVENANCE: {hoveredNode.source}
          </div>
        </div>
      )}

      {/* Subtle Antimetal Zoom & Reset Control Pill at bottom right */}
      <div className="absolute bottom-5 right-5 z-10 flex items-center gap-1 rounded-full border border-[rgba(20,21,23,0.15)] bg-[#ECEBE5]/80 px-2.5 py-1 text-xs backdrop-blur-xs shadow-2xs">
        <button
          onClick={() => setScale((s) => Math.min(s + 0.15, 1.6))}
          className="h-6 w-6 rounded-full hover:bg-[rgba(20,21,23,0.08)] flex items-center justify-center font-mono font-bold text-[#141416]"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={() => setScale((s) => Math.max(s - 0.15, 0.7))}
          className="h-6 w-6 rounded-full hover:bg-[rgba(20,21,23,0.08)] flex items-center justify-center font-mono font-bold text-[#141416]"
          title="Zoom Out"
        >
          -
        </button>
        <button
          onClick={() => {
            setScale(1);
            if (canvasRef.current) {
              nodesRef.current = initNodes(canvasRef.current.width, canvasRef.current.height);
            }
          }}
          className="h-6 w-6 rounded-full hover:bg-[rgba(20,21,23,0.08)] flex items-center justify-center font-mono text-[11px] text-[#57585C]"
          title="Reset Constellation"
        >
          ⊙
        </button>
      </div>

      {/* Live Constellation State Micro Ticker */}
      <div className="absolute bottom-5 left-5 z-10 hidden sm:flex items-center gap-2 font-mono text-[10px] text-[#828387]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
        <span>15 SOVEREIGN NODES ACTIVE • 2022-23 BENCHMARK</span>
      </div>
    </div>
  );
}
