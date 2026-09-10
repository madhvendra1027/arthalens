import { clsx } from "clsx";

interface ErrorStateProps {
  message?: string;
  retry?: () => void;
}

export function ErrorState({ message, retry }: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-md border border-amber-200 bg-amber-50/70 p-8 text-center"
      role="alert"
      aria-live="polite"
    >
      <p className="mb-1 font-bold text-amber-900 text-sm">
        Statistical Record Unavailable
      </p>
      <p className="mb-4 max-w-md text-xs text-slate-600">
        {message ?? "The requested official data point could not be loaded from the primary store."}
      </p>
      {retry && (
        <button
          onClick={retry}
          className="rounded border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-50 transition-colors"
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
      className="flex flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center"
    >
      <p className="text-xs text-slate-500 font-medium">
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
        <div key={i} className="card bg-white border border-slate-200">
          <div className="skeleton mb-3 h-3 w-24" />
          <div className="skeleton mb-2 h-8 w-32" />
          <div className="skeleton h-3 w-20" />
        </div>
      ))}
    </div>
  );
}

export function InlineLoader() {
  return (
    <div className="flex items-center gap-2 py-2 text-xs text-slate-500">
      <div
        className="h-3 w-3 rounded-full border-2 border-slate-300 border-t-blue-600 animate-spin"
        aria-hidden="true"
      />
      <span>Fetching official series...</span>
    </div>
  );
}
