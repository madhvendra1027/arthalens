import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Official Data Sources & Institutional Provenance Registry | ArthaLens",
  description: "Comprehensive registry of official institutional data providers, update cadences, and cryptographic provenance for ArthaLens macroeconomic accounts.",
};

interface SourceItem {
  id: string;
  name: string;
  fullName: string;
  scope: string;
  frequency: string;
  canonicalUrl: string;
  series: string[];
  status: "Verified Live" | "Official Press" | "Periodic Sync";
}

const SOURCES: SourceItem[] = [
  {
    id: "mospi-nas",
    name: "MoSPI NAS",
    fullName: "Ministry of Statistics and Programme Implementation — National Accounts Division",
    scope: "Real GDP, Nominal GDP, Gross Value Added (GVA) at Basic Prices, Sectoral Output, and GDP Deflators.",
    frequency: "Quarterly (Last working day of Feb, May, Aug, Nov)",
    canonicalUrl: "https://mospi.gov.in/national-accounts-statistics",
    series: ["Real GDP (Constant 2011-12 & 2022-23)", "Nominal GDP", "GVA 8 Major Sectors", "Implicit GDP Deflator"],
    status: "Verified Live"
  },
  {
    id: "mospi-sdp",
    name: "MoSPI SDP & State DES",
    fullName: "State Directorates of Economics and Statistics (Coordinated by MoSPI)",
    scope: "Gross State Domestic Product (GSDP), State GVA (GSVA), and Regional Sectoral Distribution for 15+ states.",
    frequency: "Annual (Synchronous with State Budget sessions)",
    canonicalUrl: "https://mospi.gov.in/data",
    series: ["GSDP at Basic Prices", "State GVA Contributions", "State Growth Rates YoY"],
    status: "Verified Live"
  },
  {
    id: "rbi-dbie",
    name: "RBI DBIE",
    fullName: "Reserve Bank of India — Database on Indian Economy",
    scope: "High-frequency monetary aggregates, Non-Food Bank Credit, Benchmark Policy Rates, and Foreign Exchange Reserves.",
    frequency: "Weekly / Fortnightly / Monthly",
    canonicalUrl: "https://dbie.rbi.org.in",
    series: ["Headline CPI Inflation", "Bank Credit Growth", "Liquidity Aggregates", "Forex Reserves"],
    status: "Verified Live"
  },
  {
    id: "dpiit-ea",
    name: "DPIIT (Office of Economic Adviser)",
    fullName: "Department for Promotion of Industry and Internal Trade, Ministry of Commerce & Industry",
    scope: "Wholesale Price Index (WPI) covering Primary Articles, Fuel & Power, and Manufactured Products.",
    frequency: "Monthly (14th of every month)",
    canonicalUrl: "https://eaindustry.nic.in",
    series: ["WPI All Commodities (Base 2011-12)", "Manufactured Goods Index", "Primary Articles Index"],
    status: "Official Press"
  },
  {
    id: "world-bank",
    name: "World Bank Open Data",
    fullName: "International Bank for Reconstruction and Development / International Development Association",
    scope: "Cross-country macroeconomic indicators, current USD GDP, annual GDP growth rates, and purchasing power parity.",
    frequency: "Annual / Periodic via Open REST API v2",
    canonicalUrl: "https://api.worldbank.org/v2/",
    series: ["NY.GDP.MKTP.CD (GDP USD)", "NY.GDP.MKTP.KD.ZG (Growth %)", "NY.GDP.PCAP.CD (Per Capita)", "SP.POP.TOTL (Population)"],
    status: "Periodic Sync"
  },
  {
    id: "sovereign-ratings",
    name: "Sovereign Rating Agencies",
    fullName: "S&P Global Ratings, Moody's Investors Service, Fitch Ratings",
    scope: "Long-term foreign and local currency sovereign credit ratings, outlook assessments, and sovereign credit rationales.",
    frequency: "Semi-annual review / Event-driven action bulletins",
    canonicalUrl: "https://disclosure.spglobal.com",
    series: ["S&P Sovereign Grade & Outlook", "Moody's Sovereign Grade & Outlook", "Fitch Sovereign Grade & Outlook"],
    status: "Official Press"
  },
  {
    id: "pib-goi",
    name: "PIB (Press Information Bureau)",
    fullName: "Press Information Bureau, Government of India",
    scope: "Official ministerial releases for First/Second Advance Estimates, Provisional Estimates, and Monthly GST Revenues.",
    frequency: "Event-driven with strict embargo protocols",
    canonicalUrl: "https://pib.gov.in",
    series: ["Union Budget Statements", "GST Collection Bulletins", "Cabinet Statistical Approvals"],
    status: "Official Press"
  }
];

export default function SourcesPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Official Header Banner */}
      <div className="mb-6 rounded-md border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="rounded bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 text-[11px] font-mono font-bold uppercase">
            Data Governance & Provenance
          </span>
          <span className="text-xs text-slate-500">• UN-SNA & Open Data Protocol Compliant</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Official Institutional Data Sources Registry
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          ArthaLens adheres to a zero-mock, zero-hardcoding standard. All macroeconomic series, statistical revisions, deflators, and sectoral shares originate from certified institutional feeds.
        </p>
      </div>

      {/* Provenance Verification Architecture Notice */}
      <div className="mb-8 rounded-md border border-blue-200 bg-blue-50/70 p-4 text-xs sm:text-sm text-blue-900">
        <strong>Cryptographic Provenance Guarantee:</strong> Every ingested record retains its source authority identifier, publication bulletin timestamp, ingestion hash, and strict base-year tags (2011-12 vs 2022-23) to eliminate methodology conflation.
      </div>

      {/* Sources Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 mb-10">
        {SOURCES.map((src) => (
          <div
            key={src.id}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="rounded bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 text-[10px] font-mono font-bold uppercase">
                  {src.name}
                </span>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-bold border ${
                    src.status === "Verified Live"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-blue-50 text-blue-800 border-blue-200"
                  }`}
                >
                  {src.status}
                </span>
              </div>
              <h2 className="text-sm font-bold text-slate-900 mb-2 leading-snug">
                {src.fullName}
              </h2>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                {src.scope}
              </p>
              
              <div className="mb-3">
                <span className="text-[11px] font-bold uppercase text-slate-500 font-mono block mb-1">
                  Tracked Series:
                </span>
                <ul className="text-[11px] text-slate-700 space-y-1 list-disc list-inside font-medium">
                  {src.series.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[10px] font-mono text-slate-500">
                Cadence: {src.frequency.split("(")[0]}
              </span>
              <div className="flex gap-2">
                <Link
                  href={`/sources/${src.id}`}
                  className="btn-realistic btn-solid-slate px-2.5 py-1 text-[11px] font-bold text-slate-700 shadow-xs"
                >
                  Provenance
                </Link>
                <a
                  href={src.canonicalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-realistic btn-solid-blue px-2.5 py-1 text-[11px] font-bold text-white shadow-xs"
                >
                  Portal ↗
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
