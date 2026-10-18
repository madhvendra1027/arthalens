import { NextRequest, NextResponse } from "next/server";
import { getIntelligenceStories } from "@/lib/intelligence/news-service";
import { EconomicTopic, GeographicRegion, SeverityLevel, StoryType } from "@/lib/intelligence/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") as "all" | StoryType | null;
    const country = searchParams.get("country");
    const region = searchParams.get("region") as GeographicRegion | null;
    const topic = searchParams.get("topic") as EconomicTopic | null;
    const severity = searchParams.get("severity") as SeverityLevel | null;
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);

    const result = await getIntelligenceStories({
      category: category || "all",
      country: country || undefined,
      region: region || undefined,
      topic: topic || undefined,
      severity: severity || undefined,
      search: search || undefined,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: result.stories,
      pagination: {
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        totalPages: Math.ceil(result.total / result.pageSize),
      },
      metadata: {
        freshnessTimestamp: result.freshnessTimestamp,
        isStale: result.isStale,
        authorizedSources: ["Reserve Bank of India", "MoSPI", "US Federal Reserve", "ECB", "Bank of Japan", "IEA/OPEC", "NSE/BSE"],
      },
    });
  } catch (err: any) {
    console.error("[Intelligence News API] Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve intelligence stories: " + (err?.message || "Unknown") },
      { status: 500 }
    );
  }
}
