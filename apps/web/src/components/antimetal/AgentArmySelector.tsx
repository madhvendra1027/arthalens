"use client";

import React, { useState, useRef, useEffect } from "react";
import { ShieldAlert, Compass, Globe, Wrench } from "lucide-react";

interface AgentDef {
  id: string;
  tag: string;
  title: string;
  description: string;
  sphereDensity: number;
  rotationSpeed: number;
  highlightColor: string;
}

const AGENTS: AgentDef[] = [
  {
    id: "patrol",
    tag: "MONITOR",
    title: "Patrol",
    description:
      "Continuously watches for operational risks, statistical regressions, and sovereign deflator drift across 36 states and ministries.",
    sphereDensity: 90,
    rotationSpeed: 0.008,
    highlightColor: "#D94E34",
  },
  {
    id: "triage",
    tag: "INVESTIGATION",
    title: "Triage",
    description:
      "Turns noisy high-frequency production signals into structured, reconciled national accounts without manual spreadsheet splicing.",
    sphereDensity: 140,
    rotationSpeed: 0.015,
    highlightColor: "#E5A83B",
  },
  {
    id: "world-model",
    tag: "REAL-TIME REASONING",
    title: "World Model",
    description:
      "Continuously learns how state sectoral linkages, double-deflation indices, and fiscal deficits interact and evolve over quarters.",
    sphereDensity: 180,
    rotationSpeed: 0.005,
    highlightColor: "#141416",
  },
  {
    id: "builder",
    tag: "PLATFORM",
    title: "Agent Builder",
    description:
      "Create custom econometric agents via natural language or Python SDK to monitor specific sovereign sub-sectors and trade corridors.",
    sphereDensity: 110,
    rotationSpeed: 0.012,
    highlightColor: "#059669",
  },
];

export function AgentArmySelector() {
  const [activeAgentId, setActiveAgentId] = useState<string>("world-model");
  const activeAgent = AGENTS.find((a) => a.id === activeAgentId) || AGENTS[2];

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    // Generate 3D sphere points
    const pointCount = activeAgent.sphereDensity;
    const points: { x: number; y: number; z: number }[] = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden ratio angle

    for (let i = 0; i < pointCount; i++) {
      const y = 1 - (i / (pointCount - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      points.push({ x, y, z });
    }

    let angleX = 0;
    let angleY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      angleX += activeAgent.rotationSpeed * 0.4;
      angleY += activeAgent.rotationSpeed;

      const sphereRadius = Math.min(width, height) * 0.38;
      const centerX = width / 2;
      const centerY = height / 2;

      // Project 3D points to 2D
      const projected = points.map((p) => {
        // Rotate around Y
        let x1 = p.x * Math.cos(angleY) + p.z * Math.sin(angleY);
        let z1 = -p.x * Math.sin(angleY) + p.z * Math.cos(angleY);

        // Rotate around X
        let y2 = p.y * Math.cos(angleX) - z1 * Math.sin(angleX);
        let z2 = p.y * Math.sin(angleX) + z1 * Math.cos(angleX);

        // Perspective
        const fov = 400;
        const scale = fov / (fov + z2 * sphereRadius);
        const x2d = centerX + x1 * sphereRadius * scale;
        const y2d = centerY + y2 * sphereRadius * scale;

        return { x: x2d, y: y2d, z: z2, scale };
      });

      // Sort points by z for depth
      projected.sort((a, b) => a.z - b.z);

      // Draw connection lines between nearby points
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].x - projected[j].x;
          const dy = projected[i].y - projected[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 45) {
            const alpha = (1 - dist / 45) * 0.25;
            ctx.strokeStyle = `rgba(20, 21, 23, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particle dots
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const dotRadius = Math.max(1, (p.z + 1) * 2.2 * p.scale);
        const alpha = Math.max(0.15, (p.z + 1.2) * 0.45);

        ctx.beginPath();
        ctx.arc(p.x, p.y, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = i % 8 === 0 ? activeAgent.highlightColor : `rgba(20, 21, 23, ${alpha})`;
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activeAgent]);

  return (
    <section className="relative my-24 sm:my-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-[rgba(20,21,23,0.12)]">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#828387]">
              03 / HOW IT WORKS
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#141416] mt-2 tracking-tight">
              One platform. An army of agents.
            </h2>
          </div>
          <p className="max-w-md font-sans text-xs sm:text-sm text-[#57585C] leading-relaxed">
            Specialized models that own different slices of macroeconomic intelligence. Composable, customizable, and fully auditable.
          </p>
        </div>

        {/* Two Column Layout: Tabs on Left, Morphing 3D Sphere on Right */}
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          {/* Left Column (5 cols): Interactive Agent Tabs */}
          <div className="lg:col-span-5 space-y-3">
            {AGENTS.map((agent) => {
              const isActive = agent.id === activeAgentId;
              return (
                <div
                  key={agent.id}
                  onClick={() => setActiveAgentId(agent.id)}
                  className={`cursor-pointer rounded-lg p-5 transition-all duration-200 border ${
                    isActive
                      ? "bg-[#141416] text-[#ECEBE5] border-[#141416] shadow-xl scale-[1.02]"
                      : "bg-[#ECEBE5] text-[#141416] border-[rgba(20,21,23,0.12)] hover:border-[rgba(20,21,23,0.25)] hover:bg-[#E8E7E1]"
                  }`}
                >
                  <span
                    className={`font-mono text-[10px] font-bold tracking-widest uppercase block mb-1 ${
                      isActive ? "text-[#E5A83B]" : "text-[#828387]"
                    }`}
                  >
                    {agent.tag}
                  </span>
                  <h3
                    className={`font-serif text-2xl font-normal mb-1.5 ${
                      isActive ? "text-white" : "text-[#141416]"
                    }`}
                  >
                    {agent.title}
                  </h3>
                  <p
                    className={`text-xs leading-relaxed ${
                      isActive ? "text-[#A2A3A6]" : "text-[#57585C]"
                    }`}
                  >
                    {agent.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column (7 cols): Dynamic Morphing 3D Sphere Canvas */}
          <div className="lg:col-span-7 relative flex items-center justify-center">
            <div className="relative w-full h-[400px] sm:h-[480px]">
              <canvas ref={canvasRef} className="w-full h-full cursor-grab" />
              <div className="absolute bottom-4 right-4 font-mono text-[10px] text-[#828387]">
                [DYNAMIC 3D TENSOR: {activeAgent.title.toUpperCase()} // {activeAgent.sphereDensity} VERTICES]
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
