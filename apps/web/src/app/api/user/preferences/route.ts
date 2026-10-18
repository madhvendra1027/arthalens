import { NextRequest, NextResponse } from "next/server";
import { resolveUserId } from "@/lib/intelligence/auth-helper";
import { getUserPreferences, updateUserPreferences } from "@/lib/intelligence/notification-service";

export async function GET(req: NextRequest) {
  try {
    const { userId, isAuthenticated } = await resolveUserId(req);
    const prefs = await getUserPreferences(userId);

    const res = NextResponse.json({
      success: true,
      preferences: prefs,
      isAuthenticated,
    });

    // If guest visitor without visitor ID, set visitor cookie
    if (!req.cookies.get("arthalens_visitor_id") && !isAuthenticated) {
      res.cookies.set("arthalens_visitor_id", userId, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
    }

    return res;
  } catch (err: any) {
    console.error("[User Preferences GET] Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch preferences: " + (err?.message || "Unknown") },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await resolveUserId(req);
    const body = await req.json();

    const allowedUpdates = {
      ...(body.homeCountry && { homeCountry: String(body.homeCountry).toUpperCase().slice(0, 2) }),
      ...(typeof body.enableGlobalMarkets === "boolean" && { enableGlobalMarkets: body.enableGlobalMarkets }),
      ...(typeof body.enableDomesticEconomy === "boolean" && { enableDomesticEconomy: body.enableDomesticEconomy }),
      ...(typeof body.enableSpillovers === "boolean" && { enableSpillovers: body.enableSpillovers }),
      ...(Array.isArray(body.selectedRegions) && { selectedRegions: body.selectedRegions }),
      ...(Array.isArray(body.selectedTopics) && { selectedTopics: body.selectedTopics }),
      ...(body.severityThreshold && { severityThreshold: body.severityThreshold }),
      ...(typeof body.quietHoursEnabled === "boolean" && { quietHoursEnabled: body.quietHoursEnabled }),
      ...(body.quietHoursStart && { quietHoursStart: body.quietHoursStart }),
      ...(body.quietHoursEnd && { quietHoursEnd: body.quietHoursEnd }),
      ...(body.timezone && { timezone: body.timezone }),
    };

    const updated = await updateUserPreferences(userId, allowedUpdates);

    return NextResponse.json({
      success: true,
      preferences: updated,
    });
  } catch (err: any) {
    console.error("[User Preferences PATCH] Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update preferences: " + (err?.message || "Unknown") },
      { status: 500 }
    );
  }
}
