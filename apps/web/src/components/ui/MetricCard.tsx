import { clsx } from "clsx";
import type { MetricCard as MetricCardType } from "@/lib/api";

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  official:    { label: "Official (MoSPI)", bg: "#ecfdf5", text: "#047857", border: "#a7f3d0" },
  provisional: { label: "Provisional",     bg: "#fffbeb", text: "#b45309", border: "#fde68a" },
  revised:     { label: "Revised",         bg: "#fffbeb", text: "#b45309", border: "#fde68a" },
  derived:     { label: "Derived Metric",  bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
  forecast:    { label: "ML Forecast",     bg: "#f5f3ff", text: "#6d28d9", border: "#ddd6fe" },
  unavailable: { label: "No Data",         bg: "#f8fafc", text: "#64748b", border: "#e2e8f0" },
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
      className="card flex flex-col justify-between bg-white border border-slate-200 rounded-lg p-5 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all"
      role="figure"
      aria-label={card.label}
    >
      <div>
        {/* Header with Metric Label and Verification Status Badge */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 leading-snug">
            {card.label}
          </span>
          <span
            className="shrink-0 rounded px-2 py-0.5 text-[10px] font-mono font-bold border tracking-wide"
            style={{ background: cfg.bg, color: cfg.text, borderColor: cfg.border }}
          >
            {cfg.label}
          </span>
        </div>

        {/* Primary Numerical Observation */}
        {isAvailable ? (
          <div className="my-1.5 flex items-baseline gap-1.5">
            <span
              className={clsx(
                large ? "text-4xl" : "text-2xl sm:text-3xl",
                "font-black tracking-tight font-mono text-slate-900"
              )}
            >
              {card.value?.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-bold text-slate-600 font-mono">
              {card.unit}
            </span>
          </div>
        ) : (
          <div className="my-2 text-2xl font-bold font-mono text-slate-400" aria-label="Data not available">
            -
          </div>
        )}
      </div>

      {/* Period & Provenance Attribution Footer */}
      <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="font-mono text-slate-800 font-bold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
          {card.period}
        </span>
        {card.provenance?.sourceName ? (
          <span className="truncate max-w-[160px] font-medium text-slate-600 text-right" title={card.provenance.sourceName}>
            {card.provenance.sourceName.split(" ")[0]} NAS (Gov of India)
          </span>
        ) : (
          <span className="font-medium text-slate-600">Official NAS</span>
        )}
      </div>
    </div>
  );
}
