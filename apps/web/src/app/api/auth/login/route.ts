import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, setSession, SessionData } from "@/lib/redis";
import { ensureDemoUserExists, generateSessionToken, verifyPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, isDemo } = body;

    // Ensure default demo user exists in Redis for zero-friction evaluation
    await ensureDemoUserExists();

    let targetEmail = email;
    let targetPassword = password;

    if (isDemo) {
      targetEmail = "analyst@arthalens.gov.in";
      targetPassword = "ArthaLens@2026";
    }

    if (!targetEmail || !targetPassword) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const user = await getUserByEmail(targetEmail);
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials. Account not found." }, { status: 401 });
    }

    const isValid = verifyPassword(targetPassword, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials. Password incorrect." }, { status: 401 });
    }

    // Generate Redis session token
    const token = generateSessionToken();
    const expiresAt = new Date(Date.now() + 86400 * 1000).toISOString();
    const sessionData: SessionData = {
      token,
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organization: user.organization,
      createdAt: new Date().toISOString(),
      expiresAt,
    };

    // Store in Redis with 24 hour TTL (EX 86400)
    await setSession(token, sessionData, 86400);

    const response = NextResponse.json({
      success: true,
      message: "Authenticated successfully with Redis session cache.",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organization: user.organization,
      },
    });

    response.cookies.set({
      name: "arthalens_session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400,
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("[Auth API] Error in login:", err);
    return NextResponse.json({ error: "Authentication service error: " + (err?.message || "Unknown") }, { status: 500 });
  }
}
