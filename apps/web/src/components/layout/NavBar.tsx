"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/",            label: "Macro Dashboard" },
  { href: "/gdp",         label: "GDP Explorer" },
  { href: "/methodology", label: "Methodology & Base Years" },
  { href: "/deflator",    label: "Deflator Simulator" },
  { href: "/revisions",   label: "Revisions Monitor" },
  { href: "/consistency", label: "Consistency Index" },
  { href: "/ratings",     label: "Sovereign Ratings" },
  { href: "/ai",          label: "Research Assistant" },
  { href: "/about",       label: "Sources & Governance" },
];

export function NavBar() {
  const path = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Official Government/Authority Stripe */}
      <div className="bg-slate-900 text-slate-200 px-6 py-1.5 text-xs hidden md:flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
            <span className="text-white font-bold">MoSPI NAS:</span> FY 2023-24 (Provisional Estimates Released)
          </span>
          <span className="text-slate-600">|</span>
          <span>RBI Repo: <strong className="text-white font-semibold">6.50%</strong></span>
          <span className="text-slate-600">|</span>
          <span>CPI: <strong className="text-white font-semibold">4.83%</strong></span>
          <span className="text-slate-600">|</span>
          <span>WPI: <strong className="text-white font-semibold">1.26%</strong></span>
          <span className="text-slate-600">|</span>
          <span>FX Reserves: <strong className="text-emerald-300 font-semibold">$651.5 Bn</strong></span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="bg-blue-950 text-blue-200 px-2 py-0.5 rounded font-bold border border-blue-800 flex items-center gap-1">
            <span className="text-amber-400 font-black">₹</span> 2022-23 ACTIVE BENCHMARK
          </span>
          <span className="text-slate-400">MoSPI • RBI VERIFIED</span>
        </div>
      </div>

      {/* Main Official Header Navigation */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Brand & Authority Crest with Dollar ($) & Rupee (₹) Signs */}
        <Link
          href="/"
          className="flex items-center gap-3.5 group"
          onClick={() => setMobileOpen(false)}
        >
          {/* Dual Currency Insignia */}
          <div className="relative h-10 w-10 rounded-lg bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-1 shadow-sm border border-slate-700/80 flex items-center justify-center overflow-hidden group-hover:border-blue-500 transition-all">
            <svg viewBox="0 0 36 36" className="h-8 w-8" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Outer orbit / lens ring */}
              <circle cx="18" cy="18" r="15" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 2" opacity="0.45" />
              <ellipse cx="18" cy="18" rx="16" ry="6" stroke="#60a5fa" strokeWidth="0.8" transform="rotate(-25 18 18)" opacity="0.35" />
              
              {/* Rupee Symbol ₹ (Left, Warm Saffron Gold) */}
              <g stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7.5 10.5h8" />
                <path d="M7.5 14h6.5" />
                <path d="M7.5 10.5v8.5c1.8 0 4-.3 5.2-1.8 1.3-1.6 1.3-4.5 0-6.2" />
                <path d="M10.5 19l5 7" />
              </g>

              {/* Dollar Symbol $ (Right, Crisp Emerald Green) */}
              <g stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M27.5 14.5c-.6-1.4-2-2.2-3.6-2.2-2 0-3.3 1.1-3.3 2.4 0 2 2.2 2.6 4 3.2 1.9.6 3.4 1.5 3.4 3.5 0 2-1.7 3.3-3.8 3.3-1.8 0-3.3-.8-4-2.1" />
                <path d="M24.2 10.5v15" />
              </g>
            </svg>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none group-hover:text-blue-700 transition-colors">
                Artha<span className="text-blue-700">Lens</span>
              </span>
              <span className="rounded bg-slate-100 text-slate-800 border border-slate-300 px-1.5 py-0.5 text-[10px] font-bold uppercase font-mono tracking-wider flex items-center gap-1">
                <span className="text-amber-600 font-black">₹</span>
                <span className="text-slate-400">/</span>
                <span className="text-emerald-600 font-black">$</span>
                <span className="text-slate-700 font-semibold ml-0.5">Macro Portal</span>
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-500 tracking-normal mt-0.5">
              National Macroeconomic Accounts & Global Monetary Intelligence
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav aria-label="Main navigation" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = path === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`rounded px-3 py-1.5 text-xs font-semibold transition-all ${
                      active
                        ? "bg-blue-50 text-blue-900 border border-blue-200 shadow-xs font-bold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile menu button */}
        <button
          className="flex items-center justify-center rounded p-2 xl:hidden text-slate-700 hover:bg-slate-100 border border-slate-300"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {/* Sub-nav for tablet / compact desktop */}
      <div className="hidden lg:flex xl:hidden border-t border-slate-100 bg-slate-50 px-6 py-2 overflow-x-auto">
        <ul className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const active = path === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`whitespace-nowrap rounded px-2.5 py-1 text-xs font-medium transition-all ${
                    active
                      ? "bg-white text-blue-900 font-bold border border-slate-200 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="border-t border-slate-200 bg-white lg:hidden shadow-lg"
        >
          <ul className="flex flex-col px-4 py-3 gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded px-3 py-2 text-sm font-medium ${
                    path === item.href
                      ? "bg-blue-50 text-blue-900 font-bold border border-blue-200"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
