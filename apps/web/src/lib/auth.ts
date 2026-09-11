import crypto from "crypto";
import { getUserByEmail, saveUser, UserRecord } from "./redis";

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

export function verifyPassword(password: string, combinedHash: string): boolean {
  try {
    const [salt, key] = combinedHash.split(":");
    if (!salt || !key) return false;
    const derivedKey = crypto.scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(key, "hex");
    return crypto.timingSafeEqual(derivedKey, keyBuffer);
  } catch {
    return false;
  }
}

export function generateSessionToken(): string {
  return crypto.randomUUID() + "-" + crypto.randomBytes(16).toString("hex");
}

export async function ensureDemoUserExists(): Promise<UserRecord> {
  const demoEmail = "analyst@arthalens.gov.in";
  let user = await getUserByEmail(demoEmail);
  if (!user) {
    user = {
      id: "usr_demo_analyst_001",
      email: demoEmail,
      name: "Dr. Vikram Sengupta",
      passwordHash: hashPassword("ArthaLens@2026"),
      role: "analyst",
      organization: "MoSPI National Accounts Division",
      createdAt: new Date().toISOString(),
    };
    await saveUser(user);
    console.log("[Auth] Initialized default demo analyst credentials in Redis");
  }
  return user;
}
