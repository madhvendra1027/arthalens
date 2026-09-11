import Redis from "ioredis";

export interface SessionData {
  token: string;
  userId: string;
  email: string;
  name: string;
  role: "analyst" | "researcher" | "admin" | "viewer";
  organization?: string;
  createdAt: string;
  expiresAt: string;
}

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: "analyst" | "researcher" | "admin" | "viewer";
  organization?: string;
  createdAt: string;
}

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

// Preserve singleton Redis across Next.js Turbopack / HMR reloads
declare global {
  
  var _redisInstance: Redis | undefined;
  
  var _inMemoryFallbackSessions: Map<string, { data: SessionData; exp: number }> | undefined;
  
  var _inMemoryFallbackUsers: Map<string, UserRecord> | undefined;
}

if (!global._inMemoryFallbackSessions) {
  global._inMemoryFallbackSessions = new Map();
}
if (!global._inMemoryFallbackUsers) {
  global._inMemoryFallbackUsers = new Map();
}

function getRedisClient(): Redis {
  if (!global._redisInstance) {
    global._redisInstance = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 5) return null;
        return Math.min(times * 100, 2000);
      },
      lazyConnect: false,
    });

    global._redisInstance.on("connect", () => {
      console.log("[Redis] Connected successfully to Redis 8 server at " + REDIS_URL);
    });

    global._redisInstance.on("error", (err) => {
      console.warn("[Redis] Client error (operating with resilient fallback):", err.message);
    });
  }
  return global._redisInstance;
}

export const redis = getRedisClient();

// Session Management Functions
export async function setSession(token: string, sessionData: SessionData, ttlSeconds: number = 86400): Promise<void> {
  const key = `session:${token}`;
  const serialized = JSON.stringify(sessionData);

  try {
    await redis.set(key, serialized, "EX", ttlSeconds);
  } catch (err) {
    console.warn("[Redis] Falling back to memory for setSession:", err);
  }

  // Also maintain in-memory fallback for instant zero-downtime resiliency
  global._inMemoryFallbackSessions!.set(token, {
    data: sessionData,
    exp: Date.now() + ttlSeconds * 1000,
  });
}

export async function getSession(token: string): Promise<SessionData | null> {
  const key = `session:${token}`;
  try {
    const raw = await redis.get(key);
    if (raw) {
      return JSON.parse(raw) as SessionData;
    }
  } catch (err) {
    console.warn("[Redis] Falling back to memory for getSession:", err);
  }

  const inMem = global._inMemoryFallbackSessions!.get(token);
  if (inMem) {
    if (Date.now() > inMem.exp) {
      global._inMemoryFallbackSessions!.delete(token);
      return null;
    }
    return inMem.data;
  }
  return null;
}

export async function deleteSession(token: string): Promise<void> {
  const key = `session:${token}`;
  try {
    await redis.del(key);
  } catch (err) {
    console.warn("[Redis] Error deleting session from Redis:", err);
  }
  global._inMemoryFallbackSessions!.delete(token);
}

// User Record Storage Functions
export async function saveUser(user: UserRecord): Promise<void> {
  const key = `user:${user.email.toLowerCase()}`;
  const serialized = JSON.stringify(user);
  try {
    await redis.set(key, serialized);
    await redis.sadd("users:all", user.email.toLowerCase());
  } catch (err) {
    console.warn("[Redis] Falling back to memory for saveUser:", err);
  }
  global._inMemoryFallbackUsers!.set(user.email.toLowerCase(), user);
}

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const normalized = email.toLowerCase().trim();
  const key = `user:${normalized}`;
  try {
    const raw = await redis.get(key);
    if (raw) {
      return JSON.parse(raw) as UserRecord;
    }
  } catch (err) {
    console.warn("[Redis] Falling back to memory for getUserByEmail:", err);
  }

  return global._inMemoryFallbackUsers!.get(normalized) || null;
}
