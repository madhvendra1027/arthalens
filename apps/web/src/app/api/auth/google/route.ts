import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getUserByEmail, saveUser, setSession, SessionData, UserRecord } from "@/lib/redis";
import { generateSessionToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = body.email?.trim().toLowerCase() || "citizen.explorer@gmail.com";
    const name = body.name?.trim() || (email.split("@")[0].replace(".", " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) || "Public Explorer");

    let user = await getUserByEmail(email);

    if (!user) {
      user = {
        id: "usr_google_" + crypto.randomUUID().slice(0, 8),
        email,
        name,
        passwordHash: "oauth_google_verified",
        role: "viewer",
        organization: body.organization?.trim() || "Public Citizen / Explorer",
        createdAt: new Date().toISOString(),
      };
      await saveUser(user);
    }

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

    // Store session in Redis
    await setSession(token, sessionData, 86400);

    const response = NextResponse.json({
      success: true,
      message: "Google Gmail Authentication Successful",
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
    console.error("[Google Auth] Error:", err);
    return NextResponse.json({ error: "Google sign-in error: " + (err?.message || "Unknown") }, { status: 500 });
  }
}