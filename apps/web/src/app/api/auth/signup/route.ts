import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getUserByEmail, saveUser, setSession, SessionData, UserRecord } from "@/lib/redis";
import { generateSessionToken, hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, organization } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Name must be at least 2 characters long." }, { status: 400 });
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "A valid official or research email address is required." }, { status: 400 });
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists. Please sign in." }, { status: 409 });
    }

    const userId = "usr_" + crypto.randomUUID().slice(0, 8);
    const newUser: UserRecord = {
      id: userId,
      email: email.trim().toLowerCase(),
      name: name.trim(),
      passwordHash: hashPassword(password),
      role: "analyst",
      organization: organization?.trim() || "Independent Macroeconomic Researcher",
      createdAt: new Date().toISOString(),
    };

    // Store user in Redis
    await saveUser(newUser);

    // Create session token and store in Redis (24 hour TTL)
    const token = generateSessionToken();
    const expiresAt = new Date(Date.now() + 86400 * 1000).toISOString();
    const sessionData: SessionData = {
      token,
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      organization: newUser.organization,
      createdAt: new Date().toISOString(),
      expiresAt,
    };

    await setSession(token, sessionData, 86400);

    const response = NextResponse.json({
      success: true,
      message: "Account created and authorized successfully via Redis.",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        organization: newUser.organization,
      },
    }, { status: 201 });

    // Set secure HTTP-only cookie
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
    console.error("[Auth API] Error in signup:", err);
    return NextResponse.json({ error: "Registration service error: " + (err?.message || "Unknown") }, { status: 500 });
  }
}
