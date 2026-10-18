import React from "react";

export default function GDPLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-pulse"
    >
      <span className="sr-only">Loading GDP and Sectoral GVA workspace...</span>
      <div className="h-8 w-64 rounded-xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.08)]" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 rounded-3xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.1)] p-5" />
        ))}
      </div>
      <div className="h-96 rounded-3xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.1)]" />
    </div>
  );
}
