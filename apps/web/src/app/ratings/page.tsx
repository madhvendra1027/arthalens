"use client";
import { useState } from "react";
import { useRatings } from "@/hooks/useApi";
import { ErrorState, LoadingGrid, EmptyState } from "@/components/ui/StateComponents";

const OUTLOOK_BADGES: Record<string, { label: string; bg: string; text: string; border: string }> = {
  Positive: { label: "Positive", bg: "#10B981", text: "#000000", border: "#10B981" },
  Stable:   { label: "Stable",   bg: "#141416", text: "#ECEBE5", border: "#141416" },
  Negative: { label: "Negative", bg: "#D94E34", text: "#FFFFFF", border: "#D94E34" },
  Watch:    { label: "Watch",    bg: "#E5A83B", text: "#000000", border: "#E5A83B" },
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
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Official Antimetal Header Banner */}
      <div className="mb-8 rounded-lg border border-[rgba(20,21,23,0.12)] bg-[#ECEBE5] p-6 shadow-2xs flex flex-wrap items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="rounded-full bg-[#141416] text-[#ECEBE5] px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider">
              SOVEREIGN DEBT INTELLIGENCE
            </span>
            <span className="font-mono text-xs text-[#828387]">• Moody's • S&P • Fitch</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#141416]">
            India Sovereign Credit Ratings Monitor
          </h1>
          <p className="text-xs sm:text-sm text-[#57585C] mt-2 max-w-2xl leading-relaxed">
            Official credit evaluations and sovereign outlook determinations published by global rating institutions with primary press bulletin provenance.
          </p>
        </div>

        {/* Agency Filter Tabs */}
        <div className="flex rounded-full border border-[rgba(20,21,23,0.15)] bg-[#E3E2DC] p-1 shadow-2xs gap-1">
          {AGENCIES.map((a) => (
            <button
              key={a.key}
              onClick={() => setAgency(a.key)}
              className={`btn-realistic rounded-full px-4 py-1.5 text-xs transition-all ${
                agency === a.key
                  ? "btn-solid-black text-white font-bold"
                  : "text-[#57585C] hover:text-[#141416]"
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
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
              {data.data.map((rating, i) => {
                const badge = OUTLOOK_BADGES[rating.outlook] ?? OUTLOOK_BADGES.Stable;
                return (
                  <div
                    key={i}
                    className="card rounded-lg border border-[rgba(20,21,23,0.12)] bg-[#ECEBE5] p-6 shadow-2xs flex flex-col justify-between hover:border-[rgba(20,21,23,0.25)] hover:shadow-md transition-all"
                  >
                    <div>
                      {/* Top Row: Agency and Outlook */}
                      <div className="mb-4 flex items-center justify-between border-b border-[rgba(20,21,23,0.08)] pb-3">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#141416] font-mono">
                            {rating.agency}
                          </span>
                          <span className="text-[10px] text-[#828387] font-mono">
                            Long-Term Sovereign Debt
                          </span>
                        </div>
                        <span
                          className="rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold"
                          style={{ background: badge.bg, color: badge.text }}
                        >
                          {rating.outlook} Outlook
                        </span>
                      </div>

                      {/* Main Rating Grade */}
                      <div className="my-3 flex items-baseline gap-3">
                        <span className="text-4xl font-black tracking-tight font-mono text-[#141416]">
                          {rating.rating}
                        </span>
                        <span className="text-xs font-bold text-[#059669] bg-[#059669]/10 rounded-full px-2.5 py-0.5 font-mono">
                          Investment Grade Tier
                        </span>
                      </div>
                    </div>

                    {/* Metadata Specs */}
                    <div className="mt-5 pt-3 border-t border-[rgba(20,21,23,0.08)] space-y-2 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-[#828387]">Effective Date:</span>
                        <span className="text-[#141416] font-bold">{rating.ratingDate}</span>
                      </div>
                      {rating.previousRating && (
                        <div className="flex justify-between">
                          <span className="text-[#828387]">Previous Rating:</span>
                          <span className="text-[#57585C]">{rating.previousRating}</span>
                        </div>
                      )}
                      {rating.actionType && (
                        <div className="flex justify-between">
                          <span className="text-[#828387]">Rating Action:</span>
                          <span className="text-[#141416] font-bold">{rating.actionType.replace("_", " ")}</span>
                        </div>
                      )}
                      {rating.provenance?.sourceUrl && (
                        <div className="pt-2 flex justify-between items-center text-[11px]">
                          <span className="text-[#828387]">Official Bulletin:</span>
                          <a
                            href={rating.provenance.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-[#141416] hover:text-[#D94E34] underline"
                          >
                            View Bulletin ↗
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Scale Comparison Reference Matrix */}
            <div className="rounded-lg border border-[rgba(20,21,23,0.12)] bg-[#ECEBE5] p-6 shadow-2xs">
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#57585C] mb-4 border-b border-[rgba(20,21,23,0.1)] pb-2">
                Sovereign Rating Scale Classification Reference
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="text-[#828387] border-b border-[rgba(20,21,23,0.1)]">
                      <th className="p-3">Credit Tier</th>
                      <th className="p-3">Moody's Scale</th>
                      <th className="p-3">S&P Global Scale</th>
                      <th className="p-3">Fitch Scale</th>
                      <th className="p-3">India's Assigned Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(20,21,23,0.06)] text-[#57585C]">
                    <tr>
                      <td className="p-3 font-semibold text-[#141416]">Prime & High Grade</td>
                      <td className="p-3">Aaa — Aa3</td>
                      <td className="p-3">AAA — AA-</td>
                      <td className="p-3">AAA — AA-</td>
                      <td className="p-3 text-[#828387]">—</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#141416]">Upper Medium Grade</td>
                      <td className="p-3">A1 — A3</td>
                      <td className="p-3">A+ — A-</td>
                      <td className="p-3">A+ — A-</td>
                      <td className="p-3 text-[#828387]">—</td>
                    </tr>
                    <tr className="bg-black/5 font-semibold text-[#141416]">
                      <td className="p-3 font-bold text-[#141416]">Lower Medium Grade (Investment Tier)</td>
                      <td className="p-3 font-bold">Baa3 (Active)</td>
                      <td className="p-3 font-bold">BBB- (Active)</td>
                      <td className="p-3 font-bold">BBB- (Active)</td>
                      <td className="p-3 font-bold text-[#059669]">✓ S&P Outlook Positive (May 2024)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#D94E34]">Speculative / Non-Investment Grade</td>
                      <td className="p-3">Ba1 and below</td>
                      <td className="p-3">BB+ and below</td>
                      <td className="p-3">BB+ and below</td>
                      <td className="p-3 text-[#828387]">—</td>
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
