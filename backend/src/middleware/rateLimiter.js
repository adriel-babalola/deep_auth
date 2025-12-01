import { verifyLimiter, apiLimiter, generalLimiter } from "../config/upstash.js";

// Rate limiter for verification endpoint (strict)
export const verifyRateLimiter = async (req, res, next) => {
    try {
        const { success, remaining, limit, reset } = await verifyLimiter.limit(req.ip);
        res.setHeader('X-RateLimit-Limit', limit);
        res.setHeader('X-RateLimit-Remaining', remaining);
        res.setHeader('X-RateLimit-Reset', reset);
        
        if (!success) {
            return res.status(429).json({
                error: "Too many requests",
                message: "You have exceeded the rate limit. Please try again after " + new Date(reset).toLocaleTimeString(),
                retryAfter: Math.ceil((reset - Date.now()) / 1000)
            });
        }
        next();
    } catch (error) {
        console.error(`Verify Rate Limit Error: ${error}`);
        next(); // Allow request to proceed if rate limiter fails
    }
};

// Rate limiter for general API endpoints (moderate)
export const apiRateLimiter = async (req, res, next) => {
    try {
        const { success, remaining, limit, reset } = await apiLimiter.limit(req.ip);
        res.setHeader('X-RateLimit-Limit', limit);
        res.setHeader('X-RateLimit-Remaining', remaining);
        res.setHeader('X-RateLimit-Reset', reset);
        
        if (!success) {
            return res.status(429).json({
                error: "Too many requests",
                message: "You have exceeded the rate limit. Please try again later.",
                retryAfter: Math.ceil((reset - Date.now()) / 1000)
            });
        }
        next();
    } catch (error) {
        console.error(`API Rate Limit Error: ${error}`);
        next();
    }
};

// Rate limiter for public endpoints (permissive)
export const generalRateLimiter = async (req, res, next) => {
    try {
        const { success } = await generalLimiter.limit(req.ip);
        if (!success) {
            return res.status(429).json({
                error: "Too many requests",
                message: "Please slow down your requests."
            });
        }
        next();
    } catch (error) {
        console.error(`General Rate Limit Error: ${error}`);
        next();
    }
};

export default verifyRateLimiter;