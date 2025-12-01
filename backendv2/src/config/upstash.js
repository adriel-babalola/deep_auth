import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import dotenv from 'dotenv';

dotenv.config();

// Check if Upstash credentials exist
const hasUpstashConfig = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

let redis;
let verifyLimiter;
let apiLimiter;
let generalLimiter;

if (hasUpstashConfig) {
  // Initialize Redis client
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  // Strict rate limiter for verification endpoint
  // 5 requests per 60 seconds per IP
  verifyLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "60 s"),
    analytics: true,
    prefix: "ratelimit:verify",
  });

  // Moderate rate limiter for general API endpoints
  // 20 requests per 60 seconds per IP
  apiLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "60 s"),
    analytics: true,
    prefix: "ratelimit:api",
  });

  // Permissive rate limiter for public endpoints
  // 100 requests per 60 seconds per IP
  generalLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "60 s"),
    analytics: true,
    prefix: "ratelimit:general",
  });

  console.log('✅ Upstash rate limiting enabled');
} else {
  console.warn('⚠️  Upstash not configured - rate limiting disabled');
  
  // Mock rate limiters that always succeed
  const mockLimiter = {
    limit: async () => ({
      success: true,
      remaining: 999,
      limit: 999,
      reset: Date.now() + 60000
    })
  };

  verifyLimiter = mockLimiter;
  apiLimiter = mockLimiter;
  generalLimiter = mockLimiter;
}

export { verifyLimiter, apiLimiter, generalLimiter };