import { NextRequest, NextResponse } from "next/server";
import { getGlobalMarketIndices } from "@/lib/intelligence/market-service";
import { GeographicRegion } from "@/lib/intelligence/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const region = searchParams.get("region") as GeographicRegion | null;

    const indices = await getGlobalMarketIndices(region || undefined);

    // Group by region for structured frontend display
    const regionsSummary = {
      south_asia: indices.filter((i) => i.region === "south_asia"),
      north_america: indices.filter((i) => i.region === "north_america"),
      europe: indices.filter((i) => i.region === "europe"),
      east_asia: indices.filter((i) => i.region === "east_asia"),
      southeast_asia: indices.filter((i) => i.region === "southeast_asia"),
      middle_east_africa: indices.filter((i) => i.region === "middle_east_africa"),
      latin_america: indices.filter((i) => i.region === "latin_america"),
      oceania: indices.filter((i) => i.region === "oceania"),
    };

    return NextResponse.json({
      success: true,
      indices,
      byRegion: regionsSummary,
      timestamp: new Date().toISOString(),
      disclaimer: "Quotes indicative and delayed by a minimum of 15-20 mins per exchange data licensing terms. For institutional analytical purposes only.",
    });
  } catch (err: any) {
    console.error("[Intelligence Markets API] Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve market indices: " + (err?.message || "Unknown") },
      { status: 500 }
    );
  }
}
