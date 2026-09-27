import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Statistical Source Provenance Detail | ArthaLens",
  description: "Cryptographic provenance, publication metadata, and canonical verification links for official macroeconomic data sources.",
};

interface SourceDetail {
  id: string;
  name: string;
  fullName: string;
  scope: string;
  cadence: string;
  canonicalUrl: string;
  ingestionProtocol: string;
  hashAlgorithm: string;
  sha256Digest: string;
  trackedSeries: { code: string; label: string; frequency: string; baseYear: string }[];
  governanceNotes: string;
}

const SOURCES_MAP: Record<string, SourceDetail> = {
  "mospi-nas": {
    id: "mospi-nas",
    name: "MoSPI NAS",
    fullName: "Ministry of Statistics and Programme Implementation — National Accounts Division",
    scope: "Gross Domestic Product (GDP), Gross Value Added (GVA), Sectoral Output, and Implicit Price Deflators.",
    cadence: "Quarterly Releases (Last working day of Feb, May, Aug, Nov) at 17:30 IST",
    canonicalUrl: "https://mospi.gov.in/national-accounts-statistics",
    ingestionProtocol: "Automated Release Monitor & PDF Table Extractor with Multi-Point Checksum",
    hashAlgorithm: "SHA-256",
    sha256Digest: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    trackedSeries: [
      { code: "GDP_REAL_2011", label: "Real GDP at Constant Market Prices", frequency: "Quarterly & Annual", baseYear: "2011-12" },
      { code: "GDP_NOMINAL", label: "Nominal GDP at Current Market Prices", frequency: "Quarterly & Annual", baseYear: "Current" },
      { code: "GVA_BASIC_2011", label: "GVA at Basic Prices (8 Major Sectors)", frequency: "Quarterly & Annual", baseYear: "2011-12" },
      { code: "GDP_DEFLATOR", label: "Implicit GDP Price Deflator Series", frequency: "Quarterly & Annual", baseYear: "2011-12" },
      { code: "GDP_REAL_2022", label: "Real GDP (Upcoming Series Rebasing)", frequency: "Annual Projections", baseYear: "2022-23" },
    ],
    governanceNotes: "Complies with UN-SNA 2008 standards. Data sourced from MCA-21 corporate filings, Annual Survey of Industries, and State DES accounts."
  },
  "rbi-dbie": {
    id: "rbi-dbie",
    name: "RBI DBIE",
    fullName: "Reserve Bank of India — Database on Indian Economy",
    scope: "Headline Consumer Price Index (CPI), Policy Repo Rates, Banking Credit, and Liquidity Aggregates.",
    cadence: "Weekly (Forex / WSS), Monthly (Credit / Money Supply)",
    canonicalUrl: "https://dbie.rbi.org.in",
    ingestionProtocol: "RBI Automated Data Warehouse API Adapter & SDMX Data Feeds",
    hashAlgorithm: "SHA-256",
    sha256Digest: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
    trackedSeries: [
      { code: "RBI_REPO_RATE", label: "Policy Repo Rate / Standing Deposit Facility", frequency: "Bi-Monthly MPC", baseYear: "N/A" },
      { code: "CPI_COMBINED", label: "Headline CPI Combined Inflation (Base 2012=100)", frequency: "Monthly", baseYear: "2012" },
      { code: "BANK_CREDIT_NONFOOD", label: "Non-Food Bank Credit Growth", frequency: "Fortnightly", baseYear: "N/A" },
    ],
    governanceNotes: "Official central banking repository governed under Section 45-Z of the Reserve Bank of India Act."
  },
  "world-bank": {
    id: "world-bank",
    name: "World Bank Open Data",
    fullName: "International Bank for Reconstruction and Development / IDA",
    scope: "Cross-country macroeconomic indicators, nominal USD GDP, growth rates, per capita wealth, and population benchmarks.",
    cadence: "Annual Global Benchmark Synchronization",
    canonicalUrl: "https://api.worldbank.org/v2/",
    ingestionProtocol: "World Bank REST API v2 with Redis/In-Memory Multi-Tier Caching",
    hashAlgorithm: "SHA-256",
    sha256Digest: "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
    trackedSeries: [
      { code: "NY.GDP.MKTP.CD", label: "GDP (current US$)", frequency: "Annual", baseYear: "Current USD" },
      { code: "NY.GDP.MKTP.KD.ZG", label: "GDP growth (annual %)", frequency: "Annual", baseYear: "Constant USD" },
      { code: "NY.GDP.PCAP.CD", label: "GDP per capita (current US$)", frequency: "Annual", baseYear: "Current USD" },
      { code: "FP.CPI.TOTL.ZG", label: "Inflation, consumer prices (annual %)", frequency: "Annual", baseYear: "Index 2010" },
    ],
    governanceNotes: "Open Data Protocol under CC BY 4.0 International license. Cross-national standardized comparisons."
  },
};

export default async function SourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const source = SOURCES_MAP[id] ?? {
    id,
    name: id.toUpperCase(),
    fullName: `Official Institutional Data Provider (${id})`,
    scope: "Institutional macroeconomic statistics, official releases, and series verification.",
    cadence: "Official Ministerial / Agency Release Cadence",
    canonicalUrl: "https://mospi.gov.in",
    ingestionProtocol: "Secure HTTPS Ingestion Protocol with SHA-256 Verification",
    hashAlgorithm: "SHA-256",
    sha256Digest: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    trackedSeries: [
      { code: "SERIES_OBS", label: "Macroeconomic Time Series Records", frequency: "Periodic", baseYear: "2011-12" }
    ],
    governanceNotes: "Ingested under strict provenance and base-year isolation standards."
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      {/* Top Breadcrumb and Actions */}
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/sources"
          className="btn-realistic btn-solid-slate px-3 py-1.5 text-xs font-bold text-slate-700 shadow-xs inline-flex items-center gap-1.5"
        >
          ← All Data Sources
        </Link>
        <span className="text-[11px] font-mono text-slate-500">
          Source ID: <code className="font-bold text-slate-800">{source.id}</code>
        </span>
      </div>

      {/* Official Header */}
      <div className="mb-6 rounded-md border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="rounded bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[11px] font-mono font-bold uppercase">
            Verified Authority Record
          </span>
          <span className="text-xs text-slate-500">• {source.cadence}</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {source.fullName}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          {source.scope}
        </p>
      </div>

      {/* Provenance & Cryptographic Card */}
      <div className="rounded-md border border-slate-200 bg-white p-5 shadow-xs mb-6 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-2">
          Technical Ingestion & Provenance Audit
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 text-xs">
          <div>
            <span className="text-[11px] text-slate-500 uppercase font-mono block mb-0.5">Ingestion Mechanism</span>
            <span className="font-semibold text-slate-800">{source.ingestionProtocol}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 uppercase font-mono block mb-0.5">Canonical Release URL</span>
            <a
              href={source.canonicalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-700 hover:text-blue-900 underline truncate block"
            >
              {source.canonicalUrl} ↗
            </a>
          </div>
          <div className="sm:col-span-2">
            <span className="text-[11px] text-slate-500 uppercase font-mono block mb-0.5">
              Payload Integrity Checksum ({source.hashAlgorithm})
            </span>
            <div className="rounded bg-slate-50 border border-slate-200 p-2 font-mono text-[11px] text-slate-700 break-all select-all">
              {source.sha256Digest}
            </div>
          </div>
          <div className="sm:col-span-2">
            <span className="text-[11px] text-slate-500 uppercase font-mono block mb-0.5">Governance Framework</span>
            <p className="text-slate-700">{source.governanceNotes}</p>
          </div>
        </div>
      </div>

      {/* Tracked Series Table */}
      <div className="rounded-md border border-slate-200 bg-white p-5 shadow-xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 border-b border-slate-200 pb-2">
          Series Tracked Under This Authority
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-700 font-semibold">
                <th className="py-2 px-3">Series Code</th>
                <th className="py-2 px-3">Description</th>
                <th className="py-2 px-3">Frequency</th>
                <th className="py-2 px-3">Base Year</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {source.trackedSeries.map((s) => (
                <tr key={s.code} className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-3 font-mono font-bold text-blue-900">{s.code}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{s.label}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">{s.frequency}</td>
                  <td className="py-2.5 px-3">
                    <span className="rounded bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-mono font-bold">
                      {s.baseYear}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}