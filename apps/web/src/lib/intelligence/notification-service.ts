import { InAppNotification, SeverityLevel, UserPreferences } from "./types";
import { getIntelligenceStories } from "./news-service";
import crypto from "crypto";

// Persistent global fallback storage (preserved across HMR and Next.js Turbopack reloads)
declare global {
  var _inMemoryUserPreferences: Map<string, UserPreferences> | undefined;
  var _inMemoryNotifications: Map<string, InAppNotification[]> | undefined;
}

if (!global._inMemoryUserPreferences) {
  global._inMemoryUserPreferences = new Map();
}
if (!global._inMemoryNotifications) {
  global._inMemoryNotifications = new Map();
}

export function getDefaultPreferences(userId: string, country = "IN"): UserPreferences {
  return {
    userId,
    homeCountry: country.toUpperCase(),
    preferredLanguage: "en",
    enableGlobalMarkets: true,
    enableDomesticEconomy: true,
    enableSpillovers: true,
    selectedRegions: ["global", "south_asia", "north_america", "europe"],
    selectedTopics: ["central_banking_rates", "gdp_growth", "inflation_cpi", "fiscal_budgets"],
    severityThreshold: "standard",
    quietHoursEnabled: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "07:00",
    timezone: "Asia/Kolkata",
    notificationChannels: {
      inApp: true,
      browserPush: false,
      emailDigest: false,
    },
    updatedAt: new Date().toISOString(),
  };
}

export async function getUserPreferences(userId: string): Promise<UserPreferences> {
  const prefs = global._inMemoryUserPreferences!.get(userId);
  if (prefs) {
    return prefs;
  }
  const defaultPrefs = getDefaultPreferences(userId, "IN");
  global._inMemoryUserPreferences!.set(userId, defaultPrefs);
  return defaultPrefs;
}

export async function updateUserPreferences(
  userId: string,
  updates: Partial<UserPreferences>
): Promise<UserPreferences> {
  const current = await getUserPreferences(userId);
  const updated: UserPreferences = {
    ...current,
    ...updates,
    userId, // Prevent spoofing
    updatedAt: new Date().toISOString(),
  };
  global._inMemoryUserPreferences!.set(userId, updated);

  // If user changed their home country, ensure we refresh / re-evaluate pending notifications
  if (updates.homeCountry && updates.homeCountry !== current.homeCountry) {
    await seedNotificationsForUser(userId, updated.homeCountry);
  }

  return updated;
}

export const SEVERITY_RANK: Record<SeverityLevel, number> = {
  critical: 4,
  high: 3,
  standard: 2,
  info: 1,
};

export async function getUserNotifications(userId: string): Promise<{
  notifications: InAppNotification[];
  unreadCount: number;
}> {
  let list = global._inMemoryNotifications!.get(userId);
  if (!list || list.length === 0) {
    // Generate contextually accurate seed notifications for this user based on their home country
    const prefs = await getUserPreferences(userId);
    await seedNotificationsForUser(userId, prefs.homeCountry);
    list = global._inMemoryNotifications!.get(userId) || [];
  }

  // Sort descending by creation date
  const sorted = [...list].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const unreadCount = sorted.filter((n) => !n.read).length;
  return { notifications: sorted, unreadCount };
}

export async function markNotificationAsRead(userId: string, notificationId: string): Promise<boolean> {
  const list = global._inMemoryNotifications!.get(userId);
  if (!list) return false;

  const target = list.find((n) => n.id === notificationId);
  if (target) {
    target.read = true;
    return true;
  }
  return false;
}

export async function markAllNotificationsAsRead(userId: string): Promise<number> {
  const list = global._inMemoryNotifications!.get(userId);
  if (!list) return 0;

  let count = 0;
  for (const n of list) {
    if (!n.read) {
      n.read = true;
      count++;
    }
  }
  return count;
}

export async function seedNotificationsForUser(userId: string, homeCountry = "IN"): Promise<void> {
  const allStories = (await getIntelligenceStories({ limit: 50 })).stories;
  const notifications: InAppNotification[] = [];

  for (const story of allStories) {
    const isDomestic = story.primaryCountry === homeCountry;
    const isSpillover = story.isSpillover && story.affectedCountries.includes(homeCountry);
    const isMajorGlobalMarket = story.storyType === "market" && story.severity !== "info";

    if (isDomestic && story.severity === "critical") {
      notifications.push({
        id: `notif-${crypto.randomUUID().slice(0, 8)}`,
        userId,
        storyId: story.id,
        type: "home_economic",
        categoryLabel: `${homeCountry} Macro Alert`,
        title: story.headline,
        message: story.summary.slice(0, 160) + "...",
        severity: story.severity,
        read: false,
        createdAt: story.publishedAt,
        link: `/intelligence?storyId=${story.id}`,
      });
    } else if (isSpillover && (story.severity === "critical" || story.severity === "high")) {
      notifications.push({
        id: `notif-${crypto.randomUUID().slice(0, 8)}`,
        userId,
        storyId: story.id,
        type: "spillover",
        categoryLabel: "International Spillover",
        title: `Spillover Impact: ${story.headline}`,
        message: (story.spilloverDetails || story.summary).slice(0, 160) + "...",
        severity: story.severity,
        read: false,
        createdAt: story.publishedAt,
        link: `/intelligence?storyId=${story.id}`,
      });
    } else if (isMajorGlobalMarket) {
      notifications.push({
        id: `notif-${crypto.randomUUID().slice(0, 8)}`,
        userId,
        storyId: story.id,
        type: "global_market",
        categoryLabel: "Global Market Intelligence",
        title: story.headline,
        message: story.summary.slice(0, 160) + "...",
        severity: story.severity,
        read: true, // Marked as read by default so only high-priority domestic/spillover alerts stand out as unread
        createdAt: story.publishedAt,
        link: `/intelligence?storyId=${story.id}`,
      });
    }
  }

  // Ensure user has at least 3 notifications
  if (notifications.length === 0) {
    notifications.push({
      id: `notif-${crypto.randomUUID().slice(0, 8)}`,
      userId,
      type: "system",
      categoryLabel: "System Briefing",
      title: `Global Macro & Market Stream Active for ${homeCountry}`,
      message: "Personalized intelligence feed synchronized with official statistical gazettes and real-time market calendars.",
      severity: "info",
      read: false,
      createdAt: new Date().toISOString(),
      link: "/intelligence",
    });
  }

  global._inMemoryNotifications!.set(userId, notifications);
}
