import { clsx } from "clsx";

interface ErrorStateProps {
  message?: string;
  retry?: () => void;
}

export function ErrorState({ message, retry }: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-lg border border-[#D94E34]/30 bg-[#ECEBE5] p-8 text-center"
      role="alert"
      aria-live="polite"
    >
      <span className="font-mono text-[10px] uppercase font-bold text-[#D94E34] tracking-widest mb-1">
        TELEMETRY ERROR // MOSPI DATASTORE
      </span>
      <p className="mb-1 font-serif text-lg font-bold text-[#141416]">
        Statistical Record Unavailable
      </p>
      <p className="mb-4 max-w-md font-mono text-xs text-[#57585C]">
        {message ?? "The requested official data point could not be loaded from the primary store."}
      </p>
      {retry && (
        <button
          onClick={retry}
          className="btn-realistic btn-solid-black px-4 py-1.5 text-xs font-mono font-bold"
        >
          Retry Retrieval
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message }: { message?: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[rgba(20,21,23,0.2)] bg-[#ECEBE5]/60 p-8 text-center"
    >
      <p className="font-mono text-xs text-[#57585C]">
        {message ?? "No historical records found for the selected base series or period."}
      </p>
    </div>
  );
}

interface LoadingGridProps {
  count?: number;
  cols?: number;
}

export function LoadingGrid({ count = 8, cols = 4 }: LoadingGridProps) {
  return (
    <div
      className={clsx(
        "grid gap-4",
        cols === 4 && "sm:grid-cols-2 lg:grid-cols-4",
        cols === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        cols === 2 && "sm:grid-cols-2"
      )}
      aria-label="Loading..."
      aria-busy="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card bg-[#ECEBE5] border border-[rgba(20,21,23,0.12)] p-5 animate-pulse rounded-lg">
          <div className="h-3 w-24 bg-black/10 rounded mb-4" />
          <div className="h-8 w-32 bg-black/15 rounded mb-3" />
          <div className="h-3 w-20 bg-black/10 rounded" />
        </div>
      ))}
    </div>
  );
}

export function InlineLoader() {
  return (
    <div className="flex items-center gap-2 py-2 font-mono text-xs text-[#57585C]">
      <div
        className="h-3 w-3 rounded-full border-2 border-[rgba(20,21,23,0.2)] border-t-[#141416] animate-spin"
        aria-hidden="true"
      />
      <span>Querying official sovereign series...</span>
    </div>
  );
}
