import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("arthalens_session")?.value;
    if (token) {
      // Remove session from Redis
      await deleteSession(token);
    }

    const response = NextResponse.json({
      success: true,
      message: "Logged out and Redis session revoked successfully.",
    });

    // Clear cookie
    response.cookies.set({
      name: "arthalens_session",
      value: "",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("[Auth API] Error in logout:", err);
    return NextResponse.json({ error: "Logout error: " + (err?.message || "Unknown") }, { status: 500 });
  }
}
