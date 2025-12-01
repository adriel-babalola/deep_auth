import { verifyLimiter, apiLimiter, generalLimiter } from "../config/upstash.js";

// Rate limiter for verification endpoint (strict)
export const verifyRateLimiter = async (req, res, next) => {
    try {
        const identifier = req.ip || req.headers['x-forwarded-for'] || 'unknown';
        const { success, remaining, limit, reset } = await verifyLimiter.limit(identifier);
        
        res.setHeader('X-RateLimit-Limit', limit);
        res.setHeader('X-RateLimit-Remaining', remaining);
        res.setHeader('X-RateLimit-Reset', reset);
        
        if (!success) {
            const retryAfter = Math.ceil((reset - Date.now()) / 1000);
            return res.status(429).json({
                error: "Too many requests",
                message: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
                retryAfter
            });
        }
        next();
    } catch (error) {
        console.error('Verify Rate Limit Error:', error.message);
        next(); // Allow request to proceed if rate limiter fails
    }
};

// Rate limiter for general API endpoints (moderate)
export const apiRateLimiter = async (req, res, next) => {
    try {
        const identifier = req.ip || req.headers['x-forwarded-for'] || 'unknown';
        const { success, remaining, limit, reset } = await apiLimiter.limit(identifier);
        
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
        console.error('API Rate Limit Error:', error.message);
        next();
    }
};

// Rate limiter for public endpoints (permissive)
export const generalRateLimiter = async (req, res, next) => {
    try {
        const identifier = req.ip || req.headers['x-forwarded-for'] || 'unknown';
        const { success } = await generalLimiter.limit(identifier);
        
        if (!success) {
            return res.status(429).json({
                error: "Too many requests",
                message: "Please slow down your requests."
            });
        }
        next();
    } catch (error) {
        console.error('General Rate Limit Error:', error.message);
        next();
    }
};

export default verifyRateLimiter;