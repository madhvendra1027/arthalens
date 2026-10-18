import { NextRequest } from "next/server";
import { getSession } from "@/lib/redis";

export async function resolveUserId(req: NextRequest): Promise<{ userId: string; isAuthenticated: boolean }> {
  try {
    const sessionToken = req.cookies.get("arthalens_session")?.value;
    if (sessionToken) {
      const session = await getSession(sessionToken);
      if (session && session.userId) {
        return { userId: session.userId, isAuthenticated: true };
      }
    }
  } catch {
    // Continue to guest fallback
  }

  // Guest visitor identification via cookie
  const visitorId = req.cookies.get("arthalens_visitor_id")?.value;
  if (visitorId) {
    return { userId: visitorId, isAuthenticated: false };
  }

  return { userId: "visitor_default", isAuthenticated: false };
}
