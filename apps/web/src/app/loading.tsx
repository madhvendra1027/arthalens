import React from "react";

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto max-w-7xl px-6 sm:px-8 py-12 sm:py-16 space-y-10 animate-pulse selection:bg-[#141416] selection:text-[#E6E5DF]"
    >
      <span className="sr-only">Loading macroeconomic observatory data...</span>

      {/* Top Status & Telemetry Skeleton */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(20,21,23,0.12)] bg-[#ECEBE5] px-4 py-1.5 w-64 h-7" />
        <div className="h-12 sm:h-16 w-3/4 max-w-xl rounded-2xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.08)]" />
        <div className="h-5 w-1/2 max-w-md rounded-lg bg-[#ECEBE5]" />
      </div>

      {/* Metric Cards Skeleton Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-3xl border border-[rgba(20,21,23,0.12)] bg-[#ECEBE5] p-6 space-y-4 shadow-xs"
          >
            <div className="flex justify-between items-center">
              <div className="h-3 w-28 rounded-md bg-[rgba(20,21,23,0.08)]" />
              <div className="h-4 w-12 rounded-full bg-[rgba(20,21,23,0.06)]" />
            </div>
            <div className="h-10 w-24 rounded-xl bg-[rgba(20,21,23,0.1)]" />
            <div className="h-3 w-36 rounded-md bg-[rgba(20,21,23,0.06)]" />
          </div>
        ))}
      </div>

      {/* Primary Chart Stage Skeleton */}
      <div className="rounded-3xl border border-[rgba(20,21,23,0.12)] bg-[#ECEBE5] p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex justify-between items-center border-b border-[rgba(20,21,23,0.08)] pb-4">
          <div className="space-y-1.5">
            <div className="h-4 w-48 rounded-md bg-[rgba(20,21,23,0.1)]" />
            <div className="h-3 w-32 rounded-md bg-[rgba(20,21,23,0.06)]" />
          </div>
          <div className="h-8 w-28 rounded-full bg-[rgba(20,21,23,0.08)]" />
        </div>
        <div className="h-72 sm:h-96 w-full rounded-2xl bg-[rgba(20,21,23,0.04)] border border-[rgba(20,21,23,0.06)] flex items-center justify-center">
          <div className="font-mono text-xs text-[#828387] tracking-wider uppercase">
            CALIBRATING OBSERVATORY SERIES...
          </div>
        </div>
      </div>
    </div>
  );
}
