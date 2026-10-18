import { NextRequest, NextResponse } from "next/server";
import { resolveUserId } from "@/lib/intelligence/auth-helper";
import { getUserNotifications, seedNotificationsForUser } from "@/lib/intelligence/notification-service";

export async function GET(req: NextRequest) {
  try {
    const { userId, isAuthenticated } = await resolveUserId(req);
    const { notifications, unreadCount } = await getUserNotifications(userId);

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
      isAuthenticated,
    });
  } catch (err: any) {
    console.error("[Notifications GET] Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications: " + (err?.message || "Unknown") },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await resolveUserId(req);
    const body = await req.json();
    const homeCountry = body.homeCountry || "IN";

    // Reseed notifications for the user
    await seedNotificationsForUser(userId, homeCountry);
    const { notifications, unreadCount } = await getUserNotifications(userId);

    return NextResponse.json({
      success: true,
      message: "Notifications refreshed successfully.",
      notifications,
      unreadCount,
    });
  } catch (err: any) {
    console.error("[Notifications POST] Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to reset notifications: " + (err?.message || "Unknown") },
      { status: 500 }
    );
  }
}
