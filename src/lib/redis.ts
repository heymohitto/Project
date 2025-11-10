import { Redis } from "redis";

// Create Redis client
const redis = new Redis({
  url: process.env.REDIS_URL!,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
});

redis.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

redis.on("connect", () => {
  console.log("Connected to Redis");
});

export { redis };

// Session management utilities
export interface SessionData {
  userId: string;
  email: string;
  role: string;
  isPremium: boolean;
  expiresAt: number;
}

export const sessionUtils = {
  // Store session with TTL (15 minutes for access token)
  setSession: async (sessionId: string, data: SessionData): Promise<void> => {
    await redis.setex(`session:${sessionId}`, 900, JSON.stringify(data));
  },

  // Get session data
  getSession: async (sessionId: string): Promise<SessionData | null> => {
    const data = await redis.get(`session:${sessionId}`);
    return data ? JSON.parse(data) : null;
  },

  // Delete session
  deleteSession: async (sessionId: string): Promise<void> => {
    await redis.del(`session:${sessionId}`);
  },

  // Refresh token storage (7 days)
  setRefreshToken: async (tokenId: string, userId: string): Promise<void> => {
    await redis.setex(`refresh:${tokenId}`, 604800, userId);
  },

  // Validate refresh token
  validateRefreshToken: async (tokenId: string): Promise<string | null> => {
    return await redis.get(`refresh:${tokenId}`);
  },

  // Revoke refresh token
  revokeRefreshToken: async (tokenId: string): Promise<void> => {
    await redis.del(`refresh:${tokenId}`);
  },

  // Rate limiting
  checkRateLimit: async (key: string, limit: number, window: number): Promise<boolean> => {
    const current = await redis.incr(key);
    if (current === 1) {
      await redis.expire(key, window);
    }
    return current <= limit;
  },

  // Cache profile views
  trackProfileView: async (profileId: string): Promise<void> => {
    await redis.incr(`views:${profileId}`);
    await redis.incr(`views:${profileId}:${new Date().toISOString().split('T')[0]}`);
  },

  // Get profile view count
  getProfileViews: async (profileId: string): Promise<number> => {
    const views = await redis.get(`views:${profileId}`);
    return parseInt(views || "0");
  },

  // Cache template data
  cacheTemplate: async (templateId: string, data: any, ttl: number = 3600): Promise<void> => {
    await redis.setex(`template:${templateId}`, ttl, JSON.stringify(data));
  },

  // Get cached template
  getCachedTemplate: async (templateId: string): Promise<any | null> => {
    const data = await redis.get(`template:${templateId}`);
    return data ? JSON.parse(data) : null;
  },
};