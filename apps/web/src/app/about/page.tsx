import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About ArthaLens - Sources & Governance",
  description: "Official data policies, source provenance, and series isolation guidelines for ArthaLens macroeconomic platform.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      {/* Official Header */}
      <div className="mb-6 rounded-md border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="rounded bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 text-[11px] font-mono font-bold uppercase">
            Data Governance Framework
          </span>
          <span className="text-xs text-slate-500">• Open Data Protocol</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          About ArthaLens: Provenance, Policies & Authorities
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          ArthaLens is an open, transparent macroeconomic statistics repository for India. It reproduces official government datasets with cryptographic provenance, source timestamps, and strict base-year isolation.
        </p>
      </div>

      {/* Primary Data Sources */}
      <section className="mb-8">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 border-b border-slate-200 pb-2">
          Official Institutional Authorities & Data Feeds
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              name: "MoSPI NAS",
              full: "Ministry of Statistics & Programme Implementation",
              data: "Gross Domestic Product (GDP), Gross Value Added (GVA), Implicit Price Deflators, and Annual Survey of Industries (ASI).",
              url: "https://mospi.gov.in"
            },
            {
              name: "RBI DBIE",
              full: "Reserve Bank of India — Database on Indian Economy",
              data: "Headline Consumer Price Index (CPI), Wholesale Price Index (WPI), Monetary Aggregates, and Bank Credit Growth.",
              url: "https://dbie.rbi.org.in"
            },
            {
              name: "PIB GoI",
              full: "Press Information Bureau, Government of India",
              data: "Official ministerial releases, Union Budget accounts, and monthly Goods & Services Tax (GST) collection reports.",
              url: "https://pib.gov.in"
            },
            {
              name: "Sovereign Rating Agencies",
              full: "Moody's Investors Service, S&P Global, Fitch Ratings",
              data: "Official sovereign credit rating determinations, outlook evaluations, and primary research bulletins.",
              url: "https://disclosure.spglobal.com"
            },
          ].map((src) => (
            <div key={src.name} className="rounded-md border border-slate-200 bg-white p-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-sm text-slate-900">{src.name}</h3>
                  <span className="text-[10px] font-mono text-blue-700 font-bold bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded">VERIFIED FEED</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mb-2">{src.full}</p>
                <p className="text-xs text-slate-700 leading-relaxed">{src.data}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-right">
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-blue-700 hover:text-blue-900 underline"
                >
                  Official Portal ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Data Governance & Disclaimers */}
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-xs mb-8 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-2">
          Regulatory Classification & Non-Fungibility Protocol
        </h2>
        <div className="space-y-3 text-xs text-slate-700">
          <div className="rounded border border-slate-200 bg-slate-50/70 p-3">
            <span className="font-bold text-slate-900 block mb-0.5">1. Official Statistics:</span>
            <span>Reproduced verbatim with source document identification, publication timestamps, and revision status.</span>
          </div>
          <div className="rounded border border-slate-200 bg-slate-50/70 p-3">
            <span className="font-bold text-slate-900 block mb-0.5">2. Series Isolation Safeguard:</span>
            <span>2011-12 and 2022-23 base year series are segregated at database level to eliminate silent splicing and invalid mathematical concatenations.</span>
          </div>
          <div className="rounded border border-slate-200 bg-slate-50/70 p-3">
            <span className="font-bold text-slate-900 block mb-0.5">3. Derived & Forecast Analytics:</span>
            <span>All secondary indices (growth rates, weighted contributions, deflator simulations) are explicitly tagged as model-derived and segregated from primary government filings.</span>
          </div>
          <div className="rounded border border-slate-200 bg-slate-50/70 p-3">
            <span className="font-bold text-slate-900 block mb-0.5">4. No Investment Advice:</span>
            <span>Data is published strictly for public informational, educational, and statistical research purposes.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
