"use client";

import { useSeriesComparison } from "@/hooks/useApi";

export default function MethodologyPage() {
  const { data: compData } = useSeriesComparison();
  const seriesList = compData?.series ?? [];

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Official Header Banner */}
      <div className="mb-6 rounded-md border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="rounded bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 text-[11px] font-mono font-bold uppercase">
            MoSPI National Accounts Methodology
          </span>
          <span className="text-xs text-slate-500">• Statistical Classification & SNA Standards</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          GDP Base Year Series Methodology Comparison
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Technical specifications comparing the <strong>2011-12</strong> and <strong>2022-23</strong> national accounts series in terms of deflation methods, administrative data coverage, and sectoral classifications.
        </p>
      </div>

      <div
        className="mb-8 rounded-md border border-amber-200 bg-amber-50/70 p-4 text-xs sm:text-sm text-amber-900"
        role="alert"
      >
        <strong>Statistical Incomparability Notice:</strong> The 2011-12 and 2022-23 series use different base price weights, deflation mechanics (single vs. double deflation), and administrative registries. They cannot be spliced or mixed into continuous mathematical growth series without explicit methodological conversion.
      </div>

      {/* Series Cards Side-by-Side */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {seriesList.map((s) => {
          const isCurrent = s.baseYear === "2022-23";
          return (
            <div
              key={s.baseYear}
              className={`rounded-md border p-5 shadow-xs bg-white flex flex-col justify-between ${
                isCurrent ? "border-blue-300 ring-1 ring-blue-100" : "border-slate-200"
              }`}
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-slate-900 font-mono">{s.baseYear} Series</span>
                    <span className="text-xs font-semibold text-slate-500">({s.methodologyVersion})</span>
                  </div>
                  <span
                    className={`rounded px-2 py-0.5 text-[11px] font-bold uppercase font-mono border ${
                      isCurrent
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {isCurrent ? "Active Standard" : "Legacy Series"}
                  </span>
                </div>

                <p className="text-xs text-slate-700 mb-4 leading-relaxed">{s.baseYearDescription}</p>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">Deflation Mechanism:</span>
                    <span className="text-slate-600 bg-slate-50 border border-slate-200 rounded px-2 py-1 block">{s.deflationMethod}</span>
                  </div>

                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">Primary Administrative Data Sources:</span>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5 pl-1">
                      {s.primaryDataSources?.map((src, idx) => (
                        <li key={idx}>{src}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">Key Methodological Reforms:</span>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5 pl-1">
                      {s.keyChanges?.map((chg, idx) => (
                        <li key={idx}>{chg}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex justify-between text-[11px] text-slate-500 font-mono">
                <span>Coverage: {s.coveragePeriodFrom} ➔ {s.coveragePeriodTo}</span>
                <span>MoSPI / UN-SNA 2008</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Key Concepts Reference Table */}
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4 border-b border-slate-200 pb-2">
          Methodological Glossary & Key Conceptual Definitions
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { term: "Real vs. Nominal GDP", def: "Real GDP removes price fluctuations by measuring output at fixed base-year prices. Nominal GDP reflects production valued at current prevailing market transaction prices." },
            { term: "Double Deflation", def: "A rigorous international accounting method where gross output and intermediate consumption are deflated separately using sector-specific output and input price indices." },
            { term: "Single Deflation (Legacy)", def: "Output is deflated with a single price index and assumed to represent intermediate input movements proportionally. Replaced in 2022-23 base series for manufacturing." },
            { term: "MCA-21 Database", def: "Electronic financial filing repository maintained by the Ministry of Corporate Affairs covering active enterprise balance sheets and profit & loss accounts." },
          ].map((item) => (
            <div key={item.term} className="rounded border border-slate-200 bg-slate-50/50 p-3.5">
              <h3 className="text-xs font-bold text-slate-900 mb-1">{item.term}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.def}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
