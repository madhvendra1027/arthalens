import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/redis";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("arthalens_session")?.value;
    if (!token) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const session = await getSession(token);
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.userId,
        email: session.email,
        name: session.name,
        role: session.role,
        organization: session.organization,
        createdAt: session.createdAt,
      },
    });
  } catch (err: any) {
    console.error("[Auth API] Error in /api/auth/me:", err);
    return NextResponse.json({ error: "Session verification error: " + (err?.message || "Unknown") }, { status: 500 });
  }
}
