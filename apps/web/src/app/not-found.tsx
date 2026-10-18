import Link from "next/link";
import {
  Compass,
  ArrowLeft,
  TrendingUp,
  SlidersHorizontal,
  BookOpen,
  Database,
  Award,
  Globe2,
  ShieldAlert,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | ArthaLens Macroeconomic Intelligence",
  description:
    "The requested economic dataset, statistical series, or page coordinate could not be located in the ArthaLens repository.",
  robots: {
    index: false,
    follow: true,
  },
};

const SUGGESTED_ROUTES = [
  {
    title: "Macro Accounts Workspace",
    description: "Explore official GDP, sectoral GVA, and sub-national state accounts.",
    href: "/gdp",
    icon: TrendingUp,
    badge: "Flagship",
  },
  {
    title: "Deflator Simulator",
    description: "Simulate CPI, WPI, and Implicit GDP Deflator under commodity price shocks.",
    href: "/deflator",
    icon: SlidersHorizontal,
    badge: "Interactive",
  },
  {
    title: "UN SNA 2008 Methodology",
    description: "Review double deflation formulas and 2011-12 vs 2022-23 base year documentation.",
    href: "/methodology",
    icon: BookOpen,
  },
  {
    title: "Official Data Sources & Registry",
    description: "Cryptographic SHA-256 provenance archives for MoSPI and RBI releases.",
    href: "/sources",
    icon: Database,
  },
  {
    title: "Sovereign Credit Ratings",
    description: "Fitch, Moody's, and S&P historical sovereign ratings and fiscal trajectory.",
    href: "/ratings",
    icon: Award,
  },
  {
    title: "Global Macroeconomic Nexus",
    description: "Compare India's economic indicators against global peers via World Bank data.",
    href: "/global",
    icon: Globe2,
  },
];

export default function NotFound() {
  return (
    <div className="relative min-h-[85vh] bg-[#E6E5DF] text-[#141416] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24 selection:bg-[#141416] selection:text-[#E6E5DF]">
      {/* Precision Editorial Background Crosshairs */}
      <div className="absolute top-8 left-8 font-mono text-xs text-[#828387] select-none pointer-events-none hidden sm:block">
        + 404.00_OBSERVATORY_INDEX_MISS
      </div>
      <div className="absolute top-8 right-8 font-mono text-xs text-[#828387] select-none pointer-events-none hidden sm:block">
        STATUS_404_NOT_FOUND +
      </div>

      <div className="w-full max-w-3xl mx-auto space-y-10">
        {/* Main Status Header Card */}
        <div className="rounded-3xl border border-[rgba(20,21,23,0.14)] bg-[#ECEBE5] p-8 sm:p-12 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(20,21,23,0.18)] bg-[#E6E5DF] px-3.5 py-1 font-mono text-[11px] font-bold text-[#D94E34]">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>ERROR 404 • UNINDEXED SERIES COORDINATE</span>
            </div>
            <span className="font-mono text-xs text-[#828387]">HTTP 404 NOT FOUND</span>
          </div>

          <div className="space-y-3">
            <h1 className="font-heading text-4xl sm:text-6xl font-extrabold tracking-tight text-[#141416]">
              Series coordinate not found.
            </h1>
            <p className="font-sans text-base sm:text-lg text-[#57585C] leading-relaxed max-w-2xl">
              The national account release, statistical series, or page coordinate you requested does
              not exist or has been relocated within the official MoSPI/RBI catalog.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-4 border-t border-[rgba(20,21,23,0.12)]">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-[#141416] px-6 py-3 font-mono text-xs font-semibold tracking-wide text-[#ECEBE5] shadow-xs hover:bg-[#D94E34] transition-colors focus-visible:ring-2 focus-visible:ring-[#D94E34] focus:outline-hidden"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Return to Observatory Home</span>
            </Link>

            <Link
              href="/gdp"
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(20,21,23,0.2)] bg-[#E6E5DF] px-5 py-3 font-mono text-xs font-semibold tracking-wide text-[#141416] hover:bg-[#DFDED8] transition-colors focus-visible:ring-2 focus-visible:ring-[#141416] focus:outline-hidden"
            >
              <Compass className="h-3.5 w-3.5 text-[#D94E34]" />
              <span>Launch Macro Accounts</span>
            </Link>
          </div>
        </div>

        {/* Suggested Directory Navigation Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#828387]">
              Available Public Statistical Engines
            </span>
            <span className="font-mono text-[11px] text-[#828387]">6 Active Portals</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SUGGESTED_ROUTES.map((route, idx) => {
              const Icon = route.icon;
              return (
                <Link
                  key={idx}
                  href={route.href}
                  className="group block rounded-2xl border border-[rgba(20,21,23,0.12)] bg-[#ECEBE5] p-5 hover:border-[rgba(20,21,23,0.24)] hover:bg-[#DFDED8] transition-colors focus-visible:ring-2 focus-visible:ring-[#D94E34] focus:outline-hidden"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="inline-flex p-2 rounded-xl bg-[#E6E5DF] border border-[rgba(20,21,23,0.08)] text-[#141416] group-hover:text-[#D94E34] transition-colors">
                      <Icon className="h-4 w-4" />
                    </div>
                    {route.badge && (
                      <span className="rounded-full bg-[rgba(20,21,23,0.06)] px-2 py-0.5 font-mono text-[10px] font-bold text-[#141416]">
                        {route.badge}
                      </span>
                    )}
                  </div>
                  <h2 className="mt-3 font-heading text-sm font-bold text-[#141416] group-hover:text-[#D94E34] transition-colors">
                    {route.title}
                  </h2>
                  <p className="mt-1 font-sans text-xs text-[#57585C] line-clamp-2 leading-relaxed">
                    {route.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
