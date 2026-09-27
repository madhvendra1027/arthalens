"use client";
import { useState } from "react";
import { useRatings } from "@/hooks/useApi";
import { ErrorState, LoadingGrid, EmptyState } from "@/components/ui/StateComponents";

const OUTLOOK_BADGES: Record<string, { label: string; bg: string; text: string; border: string }> = {
  Positive: { label: "Positive", bg: "#ecfdf5", text: "#065f46", border: "#a7f3d0" },
  Stable:   { label: "Stable",   bg: "#eff6ff", text: "#1e40af", border: "#bfdbfe" },
  Negative: { label: "Negative", bg: "#fffbeb", text: "#92400e", border: "#fde68a" },
  Watch:    { label: "Watch",    bg: "#f5f3ff", text: "#5b21b6", border: "#ddd6fe" },
};

const AGENCIES = [
  { key: "all",    label: "All Agencies" },
  { key: "moodys", label: "Moody's" },
  { key: "sp",     label: "S&P Global" },
  { key: "fitch",  label: "Fitch Ratings" },
];

export default function RatingsPage() {
  const [agency, setAgency] = useState("all");
  const { data, isLoading, isError, error, refetch } = useRatings(agency);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Official Header Banner */}
      <div className="mb-6 rounded-md border border-slate-200 bg-white p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="rounded bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 text-[11px] font-mono font-bold uppercase">
              Official Sovereign Debt Intelligence
            </span>
            <span className="text-xs text-slate-500">• Verification: Official Press Bulletins</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            India Sovereign Credit Ratings Monitor
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Official credit evaluations and outlook determinations published by Moody''s Investors Service, S&P Global Ratings, and Fitch Ratings.
          </p>
        </div>

        {/* Agency Filter Tabs */}
        <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-300 shadow-inner gap-1.5">
          {AGENCIES.map((a) => (
            <button
              key={a.key}
              onClick={() => setAgency(a.key)}
              className={`btn-realistic rounded-md px-3.5 py-1 text-xs transition-all ${
                agency === a.key
                  ? "btn-solid-blue font-extrabold"
                  : "btn-solid-slate font-bold text-slate-700"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <LoadingGrid count={3} cols={3} />}
      {isError && <ErrorState message={(error as Error)?.message} retry={refetch} />}

      {!isLoading && !isError && (
        !data?.data?.length ? (
          <EmptyState message="No rating records available." />
        ) : (
          <>
            {/* Primary Rating Cards */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
              {data.data.map((rating, i) => {
                const badge = OUTLOOK_BADGES[rating.outlook] ?? OUTLOOK_BADGES.Stable;
                return (
                  <div key={i} className="rounded-md border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
                    <div>
                      {/* Top Row: Agency and Outlook */}
                      <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                            {rating.agency}
                          </span>
                          <span className="text-[11px] text-slate-500 font-sans">
                            Long-Term Foreign & Local Currency
                          </span>
                        </div>
                        <span
                          className="rounded px-2 py-0.5 text-[11px] font-bold border"
                          style={{ background: badge.bg, color: badge.text, borderColor: badge.border }}
                        >
                          {rating.outlook} Outlook
                        </span>
                      </div>

                      {/* Main Rating Grade */}
                      <div className="my-2 flex items-baseline gap-3">
                        <span className="text-4xl font-extrabold tracking-tight font-mono text-slate-900">
                          {rating.rating}
                        </span>
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded px-2 py-0.5 font-sans">
                          Investment Grade (Lowest Tier)
                        </span>
                      </div>
                    </div>

                    {/* Metadata Specs */}
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Effective Rating Date:</span>
                        <span className="font-mono text-slate-800 font-semibold">{rating.ratingDate}</span>
                      </div>
                      {rating.previousRating && (
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-medium">Previous Rating:</span>
                          <span className="font-mono text-slate-600 font-medium">{rating.previousRating}</span>
                        </div>
                      )}
                      {rating.actionType && (
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-medium">Rating Action:</span>
                          <span className="font-mono font-bold text-blue-800">{rating.actionType.replace("_", " ")}</span>
                        </div>
                      )}
                      {rating.provenance?.sourceUrl && (
                        <div className="pt-2 flex justify-between items-center text-[11px]">
                          <span className="text-slate-500">Official Bulletin:</span>
                          <a
                            href={rating.provenance.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-blue-700 hover:text-blue-900 underline"
                          >
                            View Press Release ↗
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Scale Comparison Reference Matrix */}
            <div className="rounded-md border border-slate-200 bg-white p-5 shadow-xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 border-b border-slate-200 pb-2">
                Sovereign Rating Scale Classification Reference
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs gov-table">
                  <thead>
                    <tr className="text-slate-600">
                      <th className="p-2.5">Credit Tier</th>
                      <th className="p-2.5">Moody''s Scale</th>
                      <th className="p-2.5">S&P Global Scale</th>
                      <th className="p-2.5">Fitch Scale</th>
                      <th className="p-2.5">India''s Assigned Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="p-2.5 font-semibold text-slate-900">Prime & High Grade</td>
                      <td className="p-2.5 font-mono">Aaa — Aa3</td>
                      <td className="p-2.5 font-mono">AAA — AA-</td>
                      <td className="p-2.5 font-mono">AAA — AA-</td>
                      <td className="p-2.5 text-slate-400">—</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-slate-900">Upper Medium Grade</td>
                      <td className="p-2.5 font-mono">A1 — A3</td>
                      <td className="p-2.5 font-mono">A+ — A-</td>
                      <td className="p-2.5 font-mono">A+ — A-</td>
                      <td className="p-2.5 text-slate-400">—</td>
                    </tr>
                    <tr className="bg-blue-50/70 font-semibold text-slate-900">
                      <td className="p-2.5 text-blue-900 font-bold">Lower Medium Grade (Investment Tier)</td>
                      <td className="p-2.5 font-mono text-emerald-800 font-bold">Baa3 (Active)</td>
                      <td className="p-2.5 font-mono text-emerald-800 font-bold">BBB- (Active)</td>
                      <td className="p-2.5 font-mono text-emerald-800 font-bold">BBB- (Active)</td>
                      <td className="p-2.5 text-emerald-800 font-bold">✓ S&P Outlook Positive (May 2024)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-red-700">Speculative / Non-Investment Grade</td>
                      <td className="p-2.5 font-mono">Ba1 and below</td>
                      <td className="p-2.5 font-mono">BB+ and below</td>
                      <td className="p-2.5 font-mono">BB+ and below</td>
                      <td className="p-2.5 text-slate-400">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
}
