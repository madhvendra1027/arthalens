"use client";

import { useGdpRevisions } from "@/hooks/useApi";

export default function RevisionsPage() {
  const { data: revData } = useGdpRevisions("2022-23");
  const revisions = revData?.revisions ?? [];

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Official Header Banner */}
      <div className="mb-6 rounded-md border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="rounded bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 text-[11px] font-mono font-bold uppercase">
            National Accounts Revisions Cadence
          </span>
          <span className="text-xs text-slate-500">• Release Authority: MoSPI NSO</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          GDP Estimate Revision Cycle & Provenance Tracker
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          MoSPI releases national accounts estimates in defined evolutionary tiers (First Advance, Second Advance, Provisional, First Revised, Second Revised) as wider survey and audited balance sheet data (MCA-21) become available.
        </p>
      </div>

      <div
        className="mb-8 rounded-md border border-slate-200 bg-slate-50 p-4 text-xs sm:text-sm text-slate-700"
        role="alert"
      >
        <strong>International Standards Compliance:</strong> Revisions are a mandatory component of the UN System of National Accounts (UN-SNA) to ensure statistical accuracy increases over time as actual tax filings and enterprise surveys replace early indicators.
      </div>

      {/* Revision Milestones Progression Cards */}
      <div className="rounded-md border border-slate-200 bg-white p-5 shadow-xs mb-8">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4 border-b border-slate-200 pb-2">
          Chronological Release Lifecycle: FY 2022-23 Real GDP
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {revisions.map((rev, idx) => (
            <div key={idx} className="rounded border border-slate-200 bg-slate-50/60 p-4 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-blue-800 font-mono mb-1">
                  Tier Stage {idx + 1}
                </div>
                <h3 className="font-bold text-xs text-slate-900 mb-2 leading-snug">{rev.releaseLabel}</h3>
                <div className="mb-2">
                  <span className="text-3xl font-extrabold text-slate-900 font-mono">{rev.toValue}%</span>
                  <span className="text-xs text-slate-500 ml-1.5 font-medium">YoY Real Growth</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 flex justify-between border-t border-slate-200 pt-2 font-mono">
                <span>Date: {rev.revisionDate}</span>
                <span className="capitalize text-slate-700 font-bold">{rev.toStatus}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revision Analysis Table */}
      <div className="rounded-md border border-slate-200 bg-white p-5 shadow-xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 border-b border-slate-200 pb-2">
          MoSPI Release Revisions Audit Log
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs gov-table">
            <thead>
              <tr className="text-slate-700">
                <th className="p-2.5">Release Tier Milestone</th>
                <th className="p-2.5">Publication Date</th>
                <th className="p-2.5">Preceding Estimate</th>
                <th className="p-2.5">Updated Estimate</th>
                <th className="p-2.5">Delta Variance</th>
                <th className="p-2.5">Classification Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {revisions.map((rev, idx) => {
                const delta = (idx > 0 && rev.fromValue > 0) ? (rev.toValue - rev.fromValue).toFixed(2) : "0.00";
                const deltaNum = Number(delta);
                return (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="p-2.5 font-semibold text-slate-900">{rev.releaseLabel}</td>
                    <td className="p-2.5 font-mono text-slate-600">{rev.revisionDate}</td>
                    <td className="p-2.5 font-mono">{idx === 0 ? "—" : `${rev.fromValue.toFixed(1)}%`}</td>
                    <td className="p-2.5 font-mono font-bold text-slate-900">{rev.toValue.toFixed(1)}%</td>
                    <td className="p-2.5 font-mono font-bold">
                      {idx === 0 ? <span className="text-slate-500">Baseline</span> : (
                        <span style={{ color: deltaNum > 0 ? "#059669" : deltaNum < 0 ? "#d97706" : "#64748b" }}>
                          {deltaNum > 0 ? `+${delta}` : delta}%
                        </span>
                      )}
                    </td>
                    <td className="p-2.5">
                      <span className="rounded bg-slate-100 border border-slate-200 px-2 py-0.5 text-[11px] font-mono font-semibold uppercase text-slate-700">
                        {rev.toStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
