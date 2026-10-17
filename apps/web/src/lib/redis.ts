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
  var _redisAvailable: boolean | undefined;
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
        connectTimeout: 800,
        enableOfflineQueue: false,
        retryStrategy: () => null, // Do not block if Redis is offline locally
        lazyConnect: true,
      });

      global._redisInstance.on("connect", () => {
        global._redisAvailable = true;
        console.log("[Redis] Connected successfully to Redis server at " + REDIS_URL);
      });

      global._redisInstance.on("error", (err) => {
        global._redisAvailable = false;
        // Resilient fallback silently handles this
      });
    } catch (err) {
      global._redisAvailable = false;
      global._redisInstance = null;
    }
  }
  return global._redisInstance;
}

export const redis = getRedisClient();

// Session Management Functions
export async function setSession(token: string, sessionData: SessionData, ttlSeconds: number = 86400): Promise<void> {
  const client = getRedisClient();
  if (client && global._redisAvailable) {
    try {
      await client.set(`session:${token}`, JSON.stringify(sessionData), "EX", ttlSeconds);
    } catch (err) {
      global._redisAvailable = false;
    }
  }

  // Always maintain in-memory fallback for instant zero-downtime resiliency
  global._inMemoryFallbackSessions!.set(token, {
    data: sessionData,
    exp: Date.now() + ttlSeconds * 1000,
  });
}

export async function getSession(token: string): Promise<SessionData | null> {
  const client = getRedisClient();
  if (client && global._redisAvailable) {
    try {
      const raw = await client.get(`session:${token}`);
      if (raw) {
        return JSON.parse(raw) as SessionData;
      }
    } catch (err) {
      global._redisAvailable = false;
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
  if (client && global._redisAvailable) {
    try {
      await client.del(`session:${token}`);
    } catch (err) {
      global._redisAvailable = false;
    }
  }
  global._inMemoryFallbackSessions!.delete(token);
}

// User Record Storage Functions
export async function saveUser(user: UserRecord): Promise<void> {
  const client = getRedisClient();
  if (client && global._redisAvailable) {
    try {
      await client.set(`user:${user.email.toLowerCase()}`, JSON.stringify(user));
      await client.sadd("users:all", user.email.toLowerCase());
    } catch (err) {
      global._redisAvailable = false;
    }
  }
  global._inMemoryFallbackUsers!.set(user.email.toLowerCase(), user);
}

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const normalized = email.toLowerCase().trim();
  const client = getRedisClient();
  if (client && global._redisAvailable) {
    try {
      const raw = await client.get(`user:${normalized}`);
      if (raw) {
        return JSON.parse(raw) as UserRecord;
      }
    } catch (err) {
      global._redisAvailable = false;
    }
  }

  return global._inMemoryFallbackUsers!.get(normalized) || null;
}

