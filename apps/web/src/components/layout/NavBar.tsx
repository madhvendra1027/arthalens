"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";

const NAV_ITEMS = [
  { href: "/",            label: "Macro Dashboard" },
  { href: "/gdp",         label: "GDP Explorer" },
  { href: "/global",      label: "Global GDP & Economies" },
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
  const { user, logout, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Official Government/Authority Stripe */}
      <div className="bg-slate-900 text-slate-200 px-6 py-1.5 text-xs hidden md:flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="h-2 w-2 rounded-xs bg-emerald-400 inline-block animate-pulse"></span>
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
          <span className="bg-blue-950 text-blue-200 px-2 py-0.5 rounded-md font-bold border border-blue-800 flex items-center gap-1">
            <span className="text-amber-400 font-black">&#x20B9;</span> 2022-23 ACTIVE BENCHMARK
          </span>
          <span className="text-slate-400">MoSPI &#x2022; RBI VERIFIED</span>
        </div>
      </div>

      {/* Main Official Header Navigation */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Brand with Rupee Symbol Under Magnifying Glass Logo */}
        <Link
          href="/"
          className="flex items-center gap-3.5 group"
          onClick={() => setMobileOpen(false)}
        >
          {/* Rupee Under Magnifying Glass Insignia */}
          <div className="relative h-10 w-10 rounded-md bg-slate-900 p-1 shadow-sm border border-slate-700 flex items-center justify-center overflow-hidden group-hover:border-blue-500 transition-all">
            <svg viewBox="0 0 36 36" className="h-8 w-8" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Magnifying Glass Lens Body */}
              <circle cx="15.5" cy="15.5" r="10" fill="#1e3a8a" fillOpacity="0.35" stroke="#38bdf8" strokeWidth="1.8" />
              
              {/* Lens Glare Highlight Arc */}
              <path d="M8.5 13 A 8 8 0 0 1 18.5 8" stroke="#bae6fd" strokeWidth="1" strokeLinecap="round" opacity="0.8" />

              {/* Magnified Rupee Symbol (₹) Centered Under Lens */}
              <g stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 11.5 h9" />
                <path d="M11 14.8 h7" />
                <path d="M11 11.5 v8 c1.8 0 3.8 -.2 4.8 -1.5 1.1 -1.4 1.1 -4 -.2 -5.2" />
                <path d="M13.5 19.5 l4.5 5.5" />
              </g>

              {/* Magnifying Glass Bracket Connection */}
              <path d="M23 23 L25 25" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round" />

              {/* Magnifying Glass Handle */}
              <path d="M25 25 L31.5 31.5" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
              <circle cx="31.5" cy="31.5" r="1" fill="#f59e0b" />
            </svg>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none group-hover:text-blue-700 transition-colors">
                Artha<span className="text-blue-700">Lens</span>
              </span>
              <span className="rounded-md bg-slate-100 text-slate-800 border border-slate-300 px-1.5 py-0.5 text-[10px] font-bold uppercase font-mono tracking-wider flex items-center gap-1">
                <span className="text-amber-600 font-black">&#x20B9;</span>
                <span className="text-slate-400">/</span>
                <span className="text-blue-700 font-black">$</span>
                <span className="text-slate-700 font-semibold ml-0.5">Macro Portal</span>
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-500 tracking-normal mt-0.5">
              National Macroeconomic Accounts & Global Monetary Intelligence
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav aria-label="Main navigation" className="hidden xl:flex items-center gap-2">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = path === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
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

          {/* User Session Status */}
          <div className="ml-2 pl-3 border-l border-slate-200 flex items-center">
            {loading ? (
              <span className="text-xs text-slate-400 font-mono">...</span>
            ) : user ? (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800">
                <div className="flex flex-col text-left leading-tight">
                  <span className="font-bold text-slate-900 truncate max-w-[140px]">{user.name}</span>
                  <span className="text-[10px] text-slate-500 truncate max-w-[140px]">{user.organization || "Analyst"}</span>
                </div>
                <button
                  type="button"
                  onClick={() => logout()}
                  title="Sign Out"
                  className="text-slate-400 hover:text-red-600 hover:bg-red-50 ml-1.5 p-1 rounded-md transition-colors cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-md bg-blue-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-800 shadow-2xs transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile menu button */}
        <button
          className="flex items-center justify-center rounded-md p-2 xl:hidden text-slate-700 hover:bg-slate-100 border border-slate-300"
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
      <div className="hidden lg:flex xl:hidden border-t border-slate-100 bg-slate-50 px-6 py-2 overflow-x-auto items-center justify-between">
        <ul className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const active = path === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
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

        {/* Tablet session indicator */}
        {user ? (
          <div className="flex items-center gap-2 text-xs text-slate-700 ml-4 shrink-0 font-medium">
            <span className="font-bold text-slate-900 truncate max-w-[120px]">{user.name}</span>
            <button type="button" onClick={() => logout()} className="text-red-600 hover:underline text-xs">
              Sign Out
            </button>
          </div>
        ) : (
          <Link href="/login" className="text-xs font-bold text-blue-900 ml-4 shrink-0 hover:underline">
            Sign In
          </Link>
        )}
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="border-t border-slate-200 bg-white lg:hidden shadow-lg"
        >
          {user ? (
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">{user.name}</div>
                <div className="text-[11px] text-slate-500">{user.organization || "Analyst"}</div>
              </div>
              <button type="button" onClick={() => { logout(); setMobileOpen(false); }} className="text-xs text-red-600 font-semibold hover:underline">
                Sign Out
              </button>
            </div>
          ) : (
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200">
              <Link href="/login" onClick={() => setMobileOpen(false)} className="text-xs font-bold text-blue-900">
                Sign In to Platform
              </Link>
            </div>
          )}

          <ul className="flex flex-col px-4 py-3 gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-md px-3 py-2 text-sm font-medium ${
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