import { NextRequest, NextResponse } from "next/server";
import { resolveUserId } from "@/lib/intelligence/auth-helper";
import { markNotificationAsRead } from "@/lib/intelligence/notification-service";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await resolveUserId(req);
    const { id } = await context.params;

    const success = await markNotificationAsRead(userId, id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: "Notification not found or access denied." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Notification marked as read.",
      notificationId: id,
    });
  } catch (err: any) {
    console.error("[Notification Read PATCH] Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to mark notification as read: " + (err?.message || "Unknown") },
      { status: 500 }
    );
  }
}
