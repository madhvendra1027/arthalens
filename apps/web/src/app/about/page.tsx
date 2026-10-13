import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About ArthaLens - Sources & Governance",
  description: "Official data policies, source provenance, and series isolation guidelines for ArthaLens macroeconomic platform.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      {/* Official Header */}
      <div className="mb-8 rounded-lg border border-[rgba(20,21,23,0.12)] bg-[#ECEBE5] p-6 shadow-2xs">
        <div className="flex items-center gap-2 mb-2">
          <span className="rounded-full bg-[#141416] text-[#ECEBE5] px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider">
            GOVERNANCE FRAMEWORK
          </span>
          <span className="font-mono text-xs text-[#828387]">• Open Data Protocol</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#141416]">
          Provenance, Policies & Institutional Authorities
        </h1>
        <p className="text-xs sm:text-sm text-[#57585C] mt-2 leading-relaxed">
          ArthaLens is an open, transparent macroeconomic statistics repository for India. It reproduces official government datasets with cryptographic provenance, source timestamps, and strict base-year isolation according to UN SNA 2008 protocols.
        </p>
      </div>

      {/* Primary Data Sources */}
      <section className="mb-10">
        <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#57585C] mb-4 border-b border-[rgba(20,21,23,0.1)] pb-2">
          Official Institutional Authorities & Data Feeds
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
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
            <div
              key={src.name}
              className="card rounded-lg border border-[rgba(20,21,23,0.12)] bg-[#ECEBE5] p-5 shadow-2xs flex flex-col justify-between hover:border-[rgba(20,21,23,0.25)] transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-serif text-xl font-normal text-[#141416]">{src.name}</h3>
                  <span className="text-[9px] font-mono text-[#059669] font-bold bg-[#059669]/10 px-2 py-0.5 rounded-full">
                    VERIFIED FEED
                  </span>
                </div>
                <p className="text-[11px] text-[#828387] font-mono mb-2">{src.full}</p>
                <p className="text-xs text-[#57585C] leading-relaxed">{src.data}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[rgba(20,21,23,0.08)] text-right font-mono text-xs">
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#141416] hover:text-[#D94E34] underline underline-offset-4"
                >
                  Official Portal ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Data Governance & Disclaimers */}
      <section className="rounded-lg border border-[rgba(20,21,23,0.12)] bg-[#ECEBE5] p-6 shadow-2xs mb-8 space-y-4">
        <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#57585C] border-b border-[rgba(20,21,23,0.1)] pb-2">
          Regulatory Classification & Non-Fungibility Protocol
        </h2>
        <div className="space-y-3 text-xs text-[#57585C]">
          <div className="rounded-lg border border-[rgba(20,21,23,0.1)] bg-[#E8E7E0] p-4">
            <span className="font-bold text-[#141416] block mb-1 font-mono">1. Official Statistics:</span>
            <span>Reproduced verbatim with source document identification, publication timestamps, and revision status.</span>
          </div>
          <div className="rounded-lg border border-[rgba(20,21,23,0.1)] bg-[#E8E7E0] p-4">
            <span className="font-bold text-[#141416] block mb-1 font-mono">2. Series Isolation Safeguard:</span>
            <span>2011-12 and 2022-23 base year series are segregated at database level to eliminate silent splicing and invalid mathematical concatenations.</span>
          </div>
          <div className="rounded-lg border border-[rgba(20,21,23,0.1)] bg-[#E8E7E0] p-4">
            <span className="font-bold text-[#141416] block mb-1 font-mono">3. Derived & Forecast Analytics:</span>
            <span>All secondary indices (growth rates, weighted contributions, deflator simulations) are explicitly tagged as model-derived and segregated from primary government filings.</span>
          </div>
          <div className="rounded-lg border border-[rgba(20,21,23,0.1)] bg-[#E8E7E0] p-4">
            <span className="font-bold text-[#141416] block mb-1 font-mono">4. No Investment Advice:</span>
            <span>Data is published strictly for public informational, educational, and statistical research purposes.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
