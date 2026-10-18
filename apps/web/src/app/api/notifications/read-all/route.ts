import { NextRequest, NextResponse } from "next/server";
import { resolveUserId } from "@/lib/intelligence/auth-helper";
import { markAllNotificationsAsRead } from "@/lib/intelligence/notification-service";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await resolveUserId(req);
    const count = await markAllNotificationsAsRead(userId);

    return NextResponse.json({
      success: true,
      markedCount: count,
      message: `${count} notifications marked as read.`,
    });
  } catch (err: any) {
    console.error("[Notifications Read All POST] Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to mark all as read: " + (err?.message || "Unknown") },
      { status: 500 }
    );
  }
}
