import Redis from 'ioredis';
import { logger } from './logger.js';

// Redis configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
};

// Create Redis client
export const redis = new Redis(redisConfig);

// Connection event handlers
redis.on('connect', () => {
  logger.info('[Redis] Connected to Redis', {
    host: redisConfig.host,
    port: redisConfig.port,
  });
});

redis.on('error', (err) => {
  logger.error('[Redis] Redis error', { error: err.message });
});

redis.on('close', () => {
  logger.warn('[Redis] Redis connection closed');
});

redis.on('reconnecting', (delay) => {
  logger.info('[Redis] Reconnecting to Redis', { delay });
});

// Session store functions
export const sessionStore = {
  async get(sessionId) {
    try {
      const data = await redis.get(`session:${sessionId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error('[Redis] Session get error', { sessionId, error: error.message });
      return null;
    }
  },

  async set(sessionId, sessionData, ttl = 604800) {
    try {
      await redis.setex(`session:${sessionId}`, ttl, JSON.stringify(sessionData));
      return true;
    } catch (error) {
      logger.error('[Redis] Session set error', { sessionId, error: error.message });
      return false;
    }
  },

  async delete(sessionId) {
    try {
      await redis.del(`session:${sessionId}`);
      return true;
    } catch (error) {
      logger.error('[Redis] Session delete error', { sessionId, error: error.message });
      return false;
    }
  },

  async touch(sessionId, ttl = 604800) {
    try {
      await redis.expire(`session:${sessionId}`, ttl);
      return true;
    } catch (error) {
      logger.error('[Redis] Session touch error', { sessionId, error: error.message });
      return false;
    }
  },
};

// Cache functions
export const cache = {
  async get(key) {
    try {
      const data = await redis.get(`cache:${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error('[Redis] Cache get error', { key, error: error.message });
      return null;
    }
  },

  async set(key, value, ttl = 3600) {
    try {
      await redis.setex(`cache:${key}`, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      logger.error('[Redis] Cache set error', { key, error: error.message });
      return false;
    }
  },

  async delete(key) {
    try {
      await redis.del(`cache:${key}`);
      return true;
    } catch (error) {
      logger.error('[Redis] Cache delete error', { key, error: error.message });
      return false;
    }
  },

  async invalidate(pattern) {
    try {
      const keys = await redis.keys(`cache:${pattern}`);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
      return true;
    } catch (error) {
      logger.error('[Redis] Cache invalidate error', { pattern, error: error.message });
      return false;
    }
  },
};

// Rate limiting functions
export const rateLimitStore = {
  async get(identifier) {
    try {
      const data = await redis.get(`ratelimit:${identifier}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error('[Redis] Rate limit get error', { identifier, error: error.message });
      return null;
    }
  },

  async set(identifier, data, ttl) {
    try {
      await redis.setex(`ratelimit:${identifier}`, ttl, JSON.stringify(data));
      return true;
    } catch (error) {
      logger.error('[Redis] Rate limit set error', { identifier, error: error.message });
      return false;
    }
  },

  async increment(identifier, windowMs) {
    try {
      const key = `ratelimit:${identifier}`;
      const current = await redis.get(key);
      
      if (current) {
        const data = JSON.parse(current);
        data.count++;
        await redis.setex(key, windowMs / 1000, JSON.stringify(data));
        return data;
      } else {
        const data = { count: 1, firstAttempt: Date.now() };
        await redis.setex(key, windowMs / 1000, JSON.stringify(data));
        return data;
      }
    } catch (error) {
      logger.error('[Redis] Rate limit increment error', { identifier, error: error.message });
      return null;
    }
  },
};

// Health check
export async function checkRedisHealth() {
  try {
    const pong = await redis.ping();
    const info = await redis.info();
    return {
      status: 'healthy',
      ping: pong,
      connected: true,
      info: {
        redis_version: info.match(/redis_version:(.+)/)?.[1],
        used_memory: info.match(/used_memory:(.+)/)?.[1],
        connected_clients: info.match(/connected_clients:(.+)/)?.[1],
      },
    };
  } catch (error) {
    logger.error('[Redis] Health check failed', { error: error.message });
    return {
      status: 'unhealthy',
      connected: false,
      error: error.message,
    };
  }
}

// Graceful shutdown
export async function closeRedis() {
  logger.info('[Redis] Closing Redis connection...');
  await redis.quit();
  logger.info('[Redis] Redis connection closed');
}

// Handle process signals
process.on('SIGTERM', closeRedis);
process.on('SIGINT', closeRedis);
