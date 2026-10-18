"use client";

import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Layers,
  Network,
  RotateCcw,
  SlidersHorizontal,
  X,
  ExternalLink,
} from "lucide-react";

export interface MacroNode {
  id: string;
  code: string;
  label: string;
  value: string;
  period: string;
  category: "growth" | "prices" | "fiscal" | "external" | "registry";
  source: string;
  description: string;
  connectedIds: string[];
  link: string;
  linkText: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  color: string;
  highlightColor: string;
}

export const MACRO_NODES_DATA: Omit<MacroNode, "x" | "y" | "vx" | "vy">[] = [
  {
    id: "1",
    code: "01 / REAL GDP",
    label: "Real GDP Growth",
    value: "+8.2% YoY",
    period: "FY 2023-24 (Provisional)",
    category: "growth",
    source: "MoSPI NSO National Income Statement 1.1",
    description:
      "Core macroeconomic constant-price aggregate evaluated using 2022-23 benchmark weights and single-deflation industrial adjustments.",
    connectedIds: ["2", "3", "4", "7", "11", "12", "13", "14"],
    link: "/gdp",
    linkText: "Inspect Real GDP Accounts",
    baseRadius: 9,
    color: "#141416",
    highlightColor: "#059669",
  },
  {
    id: "2",
    code: "02 / GVA SERVICES",
    label: "Services Sector GVA",
    value: "+7.9% YoY",
    period: "FY 2023-24",
    category: "growth",
    source: "National Accounts Statistics Statement 2.1",
    description:
      "Represents 54.2% of Indian economic output, driven by financial intermediation, enterprise software exports, and formal transport logistics.",
    connectedIds: ["1", "3", "11"],
    link: "/gdp",
    linkText: "View Services Decomposition",
    baseRadius: 7,
    color: "#141416",
    highlightColor: "#E5A83B",
  },
  {
    id: "3",
    code: "03 / NOMINAL GDP",
    label: "Nominal Output Aggregate",
    value: "₹295.36L Cr",
    period: "FY 2023-24",
    category: "growth",
    source: "MoSPI Current Price Release",
    description:
      "Absolute macroeconomic valuation at current market prices (~$3.55 Trillion USD), establishing the fiscal denominator for sovereign debt.",
    connectedIds: ["1", "4", "7", "12", "15"],
    link: "/gdp/why",
    linkText: "Explore Nominal vs Real Dynamics",
    baseRadius: 8,
    color: "#141416",
    highlightColor: "#141416",
  },
  {
    id: "4",
    code: "04 / IMPLICIT DEFLATOR",
    label: "GDP Implicit Price Deflator",
    value: "1.40%",
    period: "FY 2023-24",
    category: "prices",
    source: "UN SNA 2008 Standard Formulation",
    description:
      "Comprehensive price index covering all domestically produced goods and services; subdued deflator reflects wholesale commodity cost drops.",
    connectedIds: ["1", "3", "5", "6"],
    link: "/deflator",
    linkText: "Launch Deflator Simulator",
    baseRadius: 7.5,
    color: "#D94E34",
    highlightColor: "#D94E34",
  },
  {
    id: "5",
    code: "05 / CPI INFLATION",
    label: "Retail Consumer Price Index",
    value: "4.83%",
    period: "FY 2023-24 Average",
    category: "prices",
    source: "MoSPI Consumer Price Index Statistics",
    description:
      "Household basket inflation weighted heavily toward food (39.06%) and fuel, creating a 343 bps wedge above the economy-wide GDP deflator.",
    connectedIds: ["4", "6", "8"],
    link: "/deflator",
    linkText: "Analyze CPI Wedge Spread",
    baseRadius: 6.5,
    color: "#E5A83B",
    highlightColor: "#E5A83B",
  },
  {
    id: "6",
    code: "06 / WPI COMMODITIES",
    label: "Wholesale Price Index",
    value: "1.26%",
    period: "FY 2023-24 Average",
    category: "prices",
    source: "DPIIT Office of Economic Adviser",
    description:
      "Wholesale factory and import prices; manufactured items deflation (-1.2%) widened corporate gross margins under single-deflation rules.",
    connectedIds: ["4", "5", "13"],
    link: "/deflator",
    linkText: "Examine WPI Input Spread",
    baseRadius: 6,
    color: "#141416",
    highlightColor: "#059669",
  },
  {
    id: "7",
    code: "07 / GFCF CAPITAL",
    label: "Gross Fixed Capital Formation",
    value: "33.5% GDP",
    period: "FY 2023-24",
    category: "fiscal",
    source: "National Expenditure Aggregates",
    description:
      "Productive fixed capital investment led by public infrastructure capex across transport highways, renewable energy, and power grids.",
    connectedIds: ["1", "3", "13", "15"],
    link: "/gdp",
    linkText: "Review Capital Formation Trends",
    baseRadius: 7,
    color: "#141416",
    highlightColor: "#E5A83B",
  },
  {
    id: "8",
    code: "08 / REPO RATE",
    label: "RBI Policy Benchmark Rate",
    value: "6.50%",
    period: "MPC Resolution",
    category: "fiscal",
    source: "Reserve Bank of India Monetary Policy",
    description:
      "Headline monetary rate anchoring interbank liquidity and government borrowing yields while monitoring headline retail inflation.",
    connectedIds: ["5", "9", "10", "15"],
    link: "/ratings",
    linkText: "Inspect Monetary Surveillance",
    baseRadius: 7,
    color: "#D94E34",
    highlightColor: "#D94E34",
  },
  {
    id: "9",
    code: "09 / CAD SPREAD",
    label: "Current Account Deficit",
    value: "-0.7% GDP",
    period: "FY 2023-24",
    category: "external",
    source: "RBI Balance of Payments Bulletins",
    description:
      "External balance of payments deficit comfortably contained due to resilient remittance inflows ($120B) and robust software receipts.",
    connectedIds: ["8", "10"],
    link: "/ratings",
    linkText: "Examine Balance of Payments",
    baseRadius: 6,
    color: "#141416",
    highlightColor: "#059669",
  },
  {
    id: "10",
    code: "10 / FOREX RESERVE",
    label: "Foreign Exchange Buffer",
    value: "$652.89 Billion",
    period: "Weekly Statistical Supplement",
    category: "external",
    source: "Reserve Bank of India DBIE",
    description:
      "All-time record sovereign currency buffer providing roughly 11.2 months of goods import cover, insulating against global financial volatility.",
    connectedIds: ["8", "9", "15"],
    link: "/ratings",
    linkText: "View Sovereign Forex Telemetry",
    baseRadius: 7.5,
    color: "#059669",
    highlightColor: "#059669",
  },
  {
    id: "11",
    code: "11 / MCA-21 FEED",
    label: "Corporate Registry Ledger",
    value: ">1.4M Filings",
    period: "Ministry of Corporate Affairs",
    category: "registry",
    source: "MCA-21 Electronic Portal",
    description:
      "Census-based administrative reporting replacing sample surveys, capturing real-time balance sheets and profit/loss statements of private firms.",
    connectedIds: ["1", "2", "12", "13"],
    link: "/sources",
    linkText: "Inspect MCA-21 Data Pipeline",
    baseRadius: 6,
    color: "#141416",
    highlightColor: "#E5A83B",
  },
  {
    id: "12",
    code: "12 / GSTN ENGINE",
    label: "Goods & Services Tax Network",
    value: "₹1.73L Cr/mo",
    period: "Monthly Average FY 2023-24",
    category: "registry",
    source: "GSTN API & Department of Revenue",
    description:
      "High-frequency transaction ledger measuring formalized inter-state goods movement and consumer sales across state borders.",
    connectedIds: ["1", "3", "11", "15"],
    link: "/sources",
    linkText: "Inspect GSTN Ledger Feeds",
    baseRadius: 7,
    color: "#059669",
    highlightColor: "#059669",
  },
  {
    id: "13",
    code: "13 / MFG GVA",
    label: "Manufacturing Output GVA",
    value: "+9.9% YoY",
    period: "FY 2023-24",
    category: "growth",
    source: "Annual Survey of Industries & IIP",
    description:
      "Factory value-added accelerated via gross margin expansion, aided by lower wholesale raw material prices under single-deflation rules.",
    connectedIds: ["1", "6", "7", "11"],
    link: "/gdp",
    linkText: "Analyze Manufacturing Margins",
    baseRadius: 6.5,
    color: "#141416",
    highlightColor: "#D94E34",
  },
  {
    id: "14",
    code: "14 / AGRI GVA",
    label: "Agriculture & Allied GVA",
    value: "+1.4% YoY",
    period: "FY 2023-24",
    category: "growth",
    source: "DES Ministry of Agriculture",
    description:
      "Primary sector output affected by uneven monsoon distribution, offset by strong horticulture, livestock, and fishery contributions.",
    connectedIds: ["1"],
    link: "/gdp",
    linkText: "View Primary Sector Accounts",
    baseRadius: 5.5,
    color: "#141416",
    highlightColor: "#059669",
  },
  {
    id: "15",
    code: "15 / FISCAL DEFICIT",
    label: "Central Fiscal Deficit",
    value: "5.63% GDP",
    period: "FY 2023-24 Actuals",
    category: "fiscal",
    source: "Controller General of Accounts (CGA)",
    description:
      "Beating the revised target of 5.8%, driven by robust direct tax collections and buoyant GST receipts alongside targeted capex discipline.",
    connectedIds: ["3", "7", "8", "10", "12"],
    link: "/ratings",
    linkText: "Review Fiscal Consolidation",
    baseRadius: 6.5,
    color: "#D94E34",
    highlightColor: "#D94E34",
  },
];

export function HeroConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<MacroNode[]>([]);
  const hoveredNodeRef = useRef<MacroNode | null>(null);

  const [activeSelectedNode, setActiveSelectedNode] = useState<MacroNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<MacroNode | null>(null);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const animFrameRef = useRef<number | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Initialize node layout with safe boundary dimensions
  const initNodes = useCallback((width: number, height: number): MacroNode[] => {
    const safeW = Math.max(width, 400);
    const safeH = Math.max(height, 350);
    const centerX = safeW * 0.5;
    const centerY = safeH * 0.48;
    const radiusVariation = Math.min(safeW, safeH) * 0.38;

    return MACRO_NODES_DATA.map((n, i) => {
      const angle = (i / MACRO_NODES_DATA.length) * Math.PI * 2 + 0.15;
      const ring = 0.22 + (i % 3) * 0.26;
      const dist = ring * radiusVariation;

      return {
        ...n,
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      };
    });
  }, []);

  // Main canvas animation and layout effect
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = container.clientWidth || 600;
    let height = container.clientHeight || 560;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    nodesRef.current = initNodes(width, height);
    if (!activeSelectedNode) {
      setActiveSelectedNode(nodesRef.current[0]);
    }

    const handleResize = () => {
      if (!container || !canvas) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth === 0 || newHeight === 0) return;

      width = newWidth;
      height = newHeight;
      const currentDpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * currentDpr;
      canvas.height = height * currentDpr;
      ctx.scale(currentDpr, currentDpr);

      // Re-center nodes proportionally
      const oldNodes = nodesRef.current;
      nodesRef.current = initNodes(width, height);

      // Preserve existing velocities and selected state
      if (oldNodes.length === nodesRef.current.length) {
        for (let i = 0; i < oldNodes.length; i++) {
          nodesRef.current[i].vx = oldNodes[i].vx;
          nodesRef.current[i].vy = oldNodes[i].vy;
        }
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    resizeObserverRef.current = resizeObserver;

    // Check user motion preferences
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let tick = 0;

    const render = () => {
      tick += 0.012;
      ctx.clearRect(0, 0, width, height);

      const nodes = nodesRef.current;
      const mouse = mousePosRef.current;
      const activeHovered = hoveredNodeRef.current;
      const activePinned = activeSelectedNode;

      const currentFocus = activeHovered || activePinned;

      // 1. Draw Connection Filaments
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeA = nodes[i];
          const nodeB = nodes[j];

          // Check if nodes have an explicit economic linkage
          const hasDirectLink =
            nodeA.connectedIds.includes(nodeB.id) || nodeB.connectedIds.includes(nodeA.id);

          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const maxDist = hasDirectLink ? 260 : 130;

          if (dist < maxDist) {
            const isConnectedToFocus =
              currentFocus &&
              (currentFocus.id === nodeA.id || currentFocus.id === nodeB.id) &&
              (hasDirectLink || dist < 120);

            let strokeColor = "rgba(20, 21, 23, 0.08)";
            let lineWidth = 0.6;

            if (isConnectedToFocus) {
              strokeColor =
                currentFocus.category === "growth"
                  ? "rgba(5, 150, 105, 0.65)"
                  : currentFocus.category === "prices"
                  ? "rgba(217, 78, 52, 0.65)"
                  : "rgba(229, 168, 59, 0.65)";
              lineWidth = 1.4;
            } else if (hasDirectLink) {
              strokeColor = "rgba(20, 21, 23, 0.16)";
              lineWidth = 0.8;
            }

            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.stroke();

            // Traveling signal dot along focus filaments
            if (isConnectedToFocus && !prefersReducedMotion) {
              const pulseT = (tick * 1.5 + i * 0.2) % 1;
              const px = nodeA.x + (nodeB.x - nodeA.x) * pulseT;
              const py = nodeA.y + (nodeB.y - nodeA.y) * pulseT;

              ctx.beginPath();
              ctx.arc(px, py, 1.8, 0, Math.PI * 2);
              ctx.fillStyle = currentFocus.highlightColor;
              ctx.fill();
            }
          }
        }
      }

      // 2. Update Node Positions & Draw Bodies
      const centerX = width * 0.5;
      const centerY = height * 0.48;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        if (!prefersReducedMotion) {
          // Physics movement
          node.x += node.vx;
          node.y += node.vy;

          // Gentle center tethering
          const distFromCenter = Math.sqrt((node.x - centerX) ** 2 + (node.y - centerY) ** 2);
          if (distFromCenter > width * 0.42) {
            node.vx += (centerX - node.x) * 0.00035;
            node.vy += (centerY - node.y) * 0.00035;
          }

          // Gentle mouse repel/attract
          const dmx = mouse.x - node.x;
          const dmy = mouse.y - node.y;
          const distMouse = Math.sqrt(dmx * dmx + dmy * dmy);
          if (distMouse < 110 && distMouse > 4) {
            node.vx += (dmx / distMouse) * 0.035;
            node.vy += (dmy / distMouse) * 0.035;
          }

          // Friction damping
          node.vx *= 0.982;
          node.vy *= 0.982;
        }

        const isHovered = activeHovered?.id === node.id;
        const isPinned = activePinned?.id === node.id;
        const isFocus = isHovered || isPinned;

        const radius = node.baseRadius + (isFocus ? 4 : 0);

        // Halo ring around focused node
        if (isFocus) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle =
            node.category === "growth"
              ? "rgba(5, 150, 105, 0.12)"
              : node.category === "prices"
              ? "rgba(217, 78, 52, 0.12)"
              : "rgba(229, 168, 59, 0.12)";
          ctx.fill();

          ctx.beginPath();
          ctx.arc(node.x, node.y, radius * 1.5, 0, Math.PI * 2);
          ctx.strokeStyle = node.highlightColor;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        // Main Node Body
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = isFocus ? node.highlightColor : node.color;
        ctx.fill();

        // Inner luminous core dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, Math.max(1.8, radius * 0.35), 0, Math.PI * 2);
        ctx.fillStyle = isFocus ? "#ffffff" : "rgba(230, 229, 223, 0.9)";
        ctx.fill();

        // Node technical label
        ctx.font = isFocus ? "bold 10px 'IBM Plex Mono', monospace" : "9px 'IBM Plex Mono', monospace";
        ctx.fillStyle = isFocus ? "#141416" : "rgba(20, 21, 23, 0.5)";
        ctx.fillText(node.code, node.x + radius + 7, node.y + 3);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      resizeObserver.disconnect();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [initNodes, activeSelectedNode]);

  // Pointer interactions
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
      if (dist < node.baseRadius * 2.5 + 8) {
        found = node;
        break;
      }
    }
    hoveredNodeRef.current = found;
    setHoveredNode(found);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (const node of nodesRef.current) {
      const dist = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
      if (dist < node.baseRadius * 3 + 10) {
        setActiveSelectedNode(node);
        return;
      }
    }
  };

  const handleMouseLeave = () => {
    mousePosRef.current = { x: -1000, y: -1000 };
    hoveredNodeRef.current = null;
    setHoveredNode(null);
  };

  const activeDisplayNode = hoveredNode || activeSelectedNode;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[480px] sm:h-[540px] lg:h-[580px] select-none overflow-hidden rounded-3xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.15)] shadow-xs"
    >
      {/* Top Header Badge */}
      <div className="absolute top-4 inset-x-4 z-20 flex items-center justify-between font-mono text-[10px] text-[#828387]">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#059669] animate-pulse" />
          <span className="font-bold text-[#141416]">MACRO CONSTELLATION GRAPH</span>
          <span>• 15 INTERCONNECTED SOVEREIGN NODES</span>
        </div>
        <div className="hidden sm:inline-flex items-center gap-1.5 text-[9px]">
          <span>CLICK ANY NODE TO PIN DEEP-LINK</span>
        </div>
      </div>

      {/* Main Canvas */}
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onMouseLeave={handleMouseLeave}
        role="img"
        aria-label="Interactive macro constellation diagram displaying connections between Indian macroeconomic variables"
        className="w-full h-full cursor-crosshair touch-none"
      />

      {/* Persistent / Hovered Inspection Card (Bottom Overlay) */}
      {activeDisplayNode && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:left-4 z-30 sm:max-w-md rounded-2xl border border-[rgba(20,21,23,0.18)] bg-[#ECEBE5]/95 p-4 sm:p-5 shadow-xl backdrop-blur-md transition-all">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#141416]/5 px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-[#141416]">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: activeDisplayNode.highlightColor }}
                />
                <span>{activeDisplayNode.code}</span>
                <span className="text-[#828387]">•</span>
                <span className="uppercase">{activeDisplayNode.category}</span>
              </div>
              <h4 className="font-heading text-sm sm:text-base font-bold text-[#141416]">
                {activeDisplayNode.label}
              </h4>
            </div>

            <div className="text-right">
              <div className="font-heading text-xl sm:text-2xl font-extrabold text-[#141416]">
                {activeDisplayNode.value}
              </div>
              <div className="font-mono text-[9px] text-[#57585C]">
                {activeDisplayNode.period}
              </div>
            </div>
          </div>

          <p className="font-sans text-xs text-[#57585C] leading-relaxed my-2.5">
            {activeDisplayNode.description}
          </p>

          {/* Connected Economic Indicators */}
          <div className="space-y-1.5 pt-2 border-t border-[rgba(20,21,23,0.1)]">
            <div className="font-mono text-[9px] font-bold uppercase text-[#828387]">
              ECONOMIC LINKAGES:
            </div>
            <div className="flex flex-wrap gap-1">
              {activeDisplayNode.connectedIds.map((cId) => {
                const targetNode = MACRO_NODES_DATA.find((n) => n.id === cId);
                if (!targetNode) return null;
                return (
                  <button
                    key={cId}
                    onClick={() => {
                      const fullNode = nodesRef.current.find((n) => n.id === cId);
                      if (fullNode) setActiveSelectedNode(fullNode);
                    }}
                    className="rounded-full bg-black/5 hover:bg-black/10 px-2 py-0.5 font-mono text-[9px] text-[#141416] transition-colors cursor-pointer"
                  >
                    {targetNode.code.split("/")[1]?.trim() || targetNode.code}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Provenance & Direct Navigation */}
          <div className="flex items-center justify-between gap-3 pt-3 mt-2 border-t border-[rgba(20,21,23,0.1)]">
            <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#828387] truncate">
              <ShieldCheck className="h-3.5 w-3.5 text-[#059669] shrink-0" />
              <span className="truncate">{activeDisplayNode.source}</span>
            </div>
            <Link
              href={activeDisplayNode.link}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#141416] px-3 py-1 font-mono text-[10px] font-bold text-[#ECEBE5] hover:bg-[#D94E34] transition-colors shrink-0 shadow-xs cursor-pointer"
            >
              <span>{activeDisplayNode.linkText}</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
