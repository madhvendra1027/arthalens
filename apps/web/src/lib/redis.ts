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

const REDIS_URL = process.env.REDIS_URL;

// Preserve singleton Redis across Next.js Turbopack / HMR reloads
declare global {
  var _redisInstance: Redis | null | undefined;
  var _inMemoryFallbackSessions: Map<string, { data: SessionData; exp: number }> | undefined;
  var _inMemoryFallbackUsers: Map<string, UserRecord> | undefined;
}

if (!global._inMemoryFallbackSessions) {
  global._inMemoryFallbackSessions = new Map();
}
if (!global._inMemoryFallbackUsers) {
  global._inMemoryFallbackUsers = new Map();
}

function getRedisClient(): Redis | null {
  if (!REDIS_URL) {
    return null;
  }
  if (global._redisInstance === undefined) {
    try {
      global._redisInstance = new Redis(REDIS_URL, {
        maxRetriesPerRequest: 1,
        connectTimeout: 1500,
        retryStrategy: (times) => {
          if (times > 2) return null;
          return 500;
        },
        lazyConnect: true,
      });

      global._redisInstance.on("connect", () => {
        console.log("[Redis] Connected successfully to Redis server at " + REDIS_URL);
      });

      global._redisInstance.on("error", (err) => {
        console.warn("[Redis] Client error (operating with resilient fallback):", err.message);
      });
    } catch (err) {
      console.warn("[Redis] Failed to initialize Redis client, using memory fallback:", err);
      global._redisInstance = null;
    }
  }
  return global._redisInstance;
}

export const redis = getRedisClient();

// Session Management Functions
export async function setSession(token: string, sessionData: SessionData, ttlSeconds: number = 86400): Promise<void> {
  const client = getRedisClient();
  if (client) {
    try {
      await client.set(`session:${token}`, JSON.stringify(sessionData), "EX", ttlSeconds);
    } catch (err) {
      console.warn("[Redis] Falling back to memory for setSession:", err);
    }
  }

  // Also maintain in-memory fallback for instant zero-downtime resiliency
  global._inMemoryFallbackSessions!.set(token, {
    data: sessionData,
    exp: Date.now() + ttlSeconds * 1000,
  });
}

export async function getSession(token: string): Promise<SessionData | null> {
  const client = getRedisClient();
  if (client) {
    try {
      const raw = await client.get(`session:${token}`);
      if (raw) {
        return JSON.parse(raw) as SessionData;
      }
    } catch (err) {
      console.warn("[Redis] Falling back to memory for getSession:", err);
    }
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
  const client = getRedisClient();
  if (client) {
    try {
      await client.del(`session:${token}`);
    } catch (err) {
      console.warn("[Redis] Error deleting session from Redis:", err);
    }
  }
  global._inMemoryFallbackSessions!.delete(token);
}

// User Record Storage Functions
export async function saveUser(user: UserRecord): Promise<void> {
  const client = getRedisClient();
  if (client) {
    try {
      await client.set(`user:${user.email.toLowerCase()}`, JSON.stringify(user));
      await client.sadd("users:all", user.email.toLowerCase());
    } catch (err) {
      console.warn("[Redis] Falling back to memory for saveUser:", err);
    }
  }
  global._inMemoryFallbackUsers!.set(user.email.toLowerCase(), user);
}

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const normalized = email.toLowerCase().trim();
  const client = getRedisClient();
  if (client) {
    try {
      const raw = await client.get(`user:${normalized}`);
      if (raw) {
        return JSON.parse(raw) as UserRecord;
      }
    } catch (err) {
      console.warn("[Redis] Falling back to memory for getUserByEmail:", err);
    }
  }

  return global._inMemoryFallbackUsers!.get(normalized) || null;
}
