import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Source Viewer",
  description: "View source document metadata and provenance for ArthaLens economic data.",
};

export default async function SourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Source Document</h1>
      <p className="mb-6 text-sm" style={{ color: "var(--color-text-secondary)" }}>
        Provenance metadata for source ID: <code className="font-mono text-xs">{id}</code>
      </p>
      <div className="card flex min-h-[200px] items-center justify-center text-[--color-text-muted]">
        <p className="text-sm">Source metadata loads from the API.</p>
      </div>
    </div>
  );
}