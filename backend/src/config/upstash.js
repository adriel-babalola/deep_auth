import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import dotenv from "dotenv";

dotenv.config();

const redis = Redis.fromEnv();

// Strict limit for verification endpoint (resource-intensive AI API calls)
export const verifyLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "60 s"), // 10 requests per minute
    analytics: true,
    prefix: "verify:ratelimit"
});

// Moderate limit for general API endpoints
export const apiLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "60 s"), // 30 requests per minute
    analytics: true,
    prefix: "api:ratelimit"
});

// Loose limit for health checks and public endpoints
export const generalLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "60 s"), // 100 requests per minute
    analytics: true,
    prefix: "general:ratelimit"
});

export default verifyLimiter;

