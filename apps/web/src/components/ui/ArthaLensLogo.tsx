"use client";

import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;

}

export function ArthaLensLogo({ size = "md", className = "", showText = false }: LogoProps) {
  const dimensions = {
    sm: { box: 28, text: "text-base", sub: "text-[9px]" },
    md: { box: 40, text: "text-lg", sub: "text-[10px]" },
    lg: { box: 52, text: "text-2xl", sub: "text-xs" },
    xl: { box: 64, text: "text-3xl", sub: "text-sm" },
  }[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Precision Magnifying Glass with Magnified Rupee (₹) Lens */}
      <div
        className="relative flex items-center justify-center rounded-lg bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 shadow-sm border border-slate-700/80 overflow-hidden group hover:border-blue-500 transition-all duration-200"
        style={{ width: dimensions.box, height: dimensions.box }}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1.5"
        >
          {/* Subtle Precision Optics Crosshairs */}
          <line x1="21" y1="9" x2="21" y2="33" stroke="#60a5fa" strokeWidth="0.7" strokeDasharray="2 2" opacity="0.4" />
          <line x1="9" y1="21" x2="33" y2="21" stroke="#60a5fa" strokeWidth="0.7" strokeDasharray="2 2" opacity="0.4" />

          {/* Optical Magnifying Glass Lens Body */}
          <circle
            cx="21"
            cy="21"
            r="12.5"
            fill="url(#lensGlassGrad)"
            stroke="url(#lensRimGrad)"
            strokeWidth="2.5"
          />

          {/* Optical Glare Arc */}
          <path
            d="M12 16 A 10.5 10.5 0 0 1 25 10.5"
            stroke="#bae6fd"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Magnified Indian Rupee Symbol (₹) Centered Under Lens */}
          <g
            stroke="url(#rupeeGrad)"
            strokeWidth="2.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Top horizontal bar */}
            <path d="M15 15.5 h11" />
            {/* Middle horizontal bar */}
            <path d="M15 19.5 h8.5" />
            {/* Stem and upper curved bowl */}
            <path d="M15 15.5 v9.5 c2.2 0 4.8 -.3 6 -2 1.3 -1.6 1.1 -4.8 -.2 -6.2" />
            {/* Diagonal downward leg */}
            <path d="M18.5 25 l6 7" />
          </g>

          {/* Magnifying Glass Bracket Connection */}
          <path
            d="M30 30 L32.5 32.5"
            stroke="#93c5fd"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Magnifying Glass Handle */}
          <path
            d="M32.5 32.5 L41.5 41.5"
            stroke="url(#handleGrad)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Handle Brass End-Cap */}
          <circle cx="41.5" cy="41.5" r="1.5" fill="#f59e0b" />

          {/* Gradients */}
          <defs>
            <radialGradient id="lensGlassGrad" cx="38%" cy="38%" r="62%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#1e3a8a" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.7" />
            </radialGradient>

            <linearGradient id="lensRimGrad" x1="9" y1="9" x2="33" y2="33" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>

            <linearGradient id="rupeeGrad" x1="15" y1="14" x2="26" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>

            <linearGradient id="handleGrad" x1="32" y1="32" x2="41" y2="41" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="40%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`font-extrabold tracking-tight text-slate-900 leading-none ${dimensions.text}`}>
              Artha<span className="text-blue-700">Lens</span>
            </span>
            <span className="rounded bg-blue-50 text-blue-900 border border-blue-200 px-1.5 py-0.5 text-[10px] font-bold uppercase font-mono tracking-wider">
              NSO • MoSPI
            </span>
          </div>
          <span className={`font-medium text-slate-500 tracking-normal mt-0.5 ${dimensions.sub}`}>
            National Accounts Statistics Portal
          </span>
        </div>
      )}
    </div>
  );
}
