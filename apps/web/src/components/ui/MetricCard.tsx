import { clsx } from "clsx";
import type { MetricCard as MetricCardType } from "@/lib/api";

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  official:    { label: "Official (MoSPI)", bg: "#141416", text: "#ECEBE5", border: "#141416" },
  provisional: { label: "Provisional",     bg: "#fffbeb", text: "#b45309", border: "#fde68a" },
  revised:     { label: "Revised",         bg: "#fffbeb", text: "#b45309", border: "#fde68a" },
  derived:     { label: "Derived Metric",  bg: "#141416", text: "#E5A83B", border: "#E5A83B" },
  forecast:    { label: "ML Forecast",     bg: "#f5f3ff", text: "#6d28d9", border: "#ddd6fe" },
  unavailable: { label: "No Data",         bg: "#DFDED8", text: "#828387", border: "rgba(20, 21, 23, 0.12)" },
};

interface Props {
  card: MetricCardType;
  large?: boolean;
}

export function MetricCardDisplay({ card, large }: Props) {
  const isAvailable = card.status !== "unavailable" && card.value !== null;
  const cfg = STATUS_CONFIG[card.status] ?? STATUS_CONFIG.unavailable;

  return (
    <div
      className="card group flex flex-col justify-between rounded-lg bg-[#ECEBE5] border border-[rgba(20,21,23,0.12)] p-5 transition-all duration-200 hover:border-[rgba(20,21,23,0.25)] hover:bg-[#E8E7E0] hover:shadow-md"
      role="figure"
      aria-label={card.label}
    >
      <div>
        {/* Header with Metric Label and Verification Status Badge */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#57585C] leading-snug">
            {card.label}
          </span>
          <span
            className="shrink-0 rounded-full px-2.5 py-0.5 text-[9px] font-mono font-bold border tracking-wide"
            style={{ background: cfg.bg, color: cfg.text, borderColor: cfg.border }}
          >
            {cfg.label}
          </span>
        </div>

        {/* Primary Numerical Observation */}
        {isAvailable ? (
          <div className="my-2 flex items-baseline gap-1.5">
            <span
              className={clsx(
                large ? "text-4xl" : "text-2xl sm:text-3xl",
                "font-black tracking-tight font-mono text-[#141416]"
              )}
            >
              {card.value?.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-bold text-[#57585C] font-mono">
              {card.unit}
            </span>
          </div>
        ) : (
          <div className="my-2 text-2xl font-bold font-mono text-[#828387]" aria-label="Data not available">
            -
          </div>
        )}
      </div>

      {/* Period & Provenance Attribution Footer */}
      <div className="mt-4 pt-3 border-t border-[rgba(20,21,23,0.08)] flex items-center justify-between text-[10px] font-mono text-[#828387]">
        <span className="font-bold text-[#141416] bg-[rgba(20,21,23,0.05)] px-1.5 py-0.5 rounded">
          {card.period}
        </span>
        {card.provenance?.sourceName ? (
          <span className="truncate max-w-[160px] font-medium text-[#57585C] text-right" title={card.provenance.sourceName}>
            {card.provenance.sourceName.split(" ")[0]} NAS (Gov of India)
          </span>
        ) : (
          <span className="font-medium text-[#57585C]">Official NAS</span>
        )}
      </div>
    </div>
  );
}
