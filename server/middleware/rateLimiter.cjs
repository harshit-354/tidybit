/**
 * Rate Limiter Middleware
 * 
 * Uses a sliding window algorithm to limit requests per IP address.
 * This is an in-memory implementation — suitable for single-server deployments.
 * For production scale, swap with Redis-based rate limiting.
 * 
 * Why sliding window over fixed window?
 * Fixed window can allow burst traffic at window boundaries (e.g., 5 requests at 0:59 
 * and 5 more at 1:01 = 10 in 2 seconds). Sliding window prevents this by tracking 
 * individual request timestamps.
 */

const DEFAULT_WINDOW_MS = 60 * 1000; // 1 minute
const DEFAULT_MAX_REQUESTS = 5;

// Store: IP -> array of request timestamps
const requestLog = new Map();

/**
 * Clean up expired entries to prevent memory leaks.
 * Runs every 60 seconds automatically.
 */
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of requestLog.entries()) {
    const valid = timestamps.filter((t) => now - t < DEFAULT_WINDOW_MS);
    if (valid.length === 0) {
      requestLog.delete(ip);
    } else {
      requestLog.set(ip, valid);
    }
  }
}, DEFAULT_WINDOW_MS);

// Don't let the cleanup timer prevent Node.js from exiting
if (cleanupInterval.unref) {
  cleanupInterval.unref();
}

/**
 * Creates a rate limiter middleware.
 * 
 * @param {object} options
 * @param {number} options.windowMs - Time window in milliseconds (default: 60000)
 * @param {number} options.maxRequests - Max requests per window (default: 5)
 * @returns {Function} Express middleware
 */
function createRateLimiter(options = {}) {
  const windowMs = options.windowMs || DEFAULT_WINDOW_MS;
  const maxRequests = options.maxRequests || DEFAULT_MAX_REQUESTS;

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();

    // Get existing timestamps for this IP, filter to current window
    const timestamps = (requestLog.get(ip) || []).filter(
      (t) => now - t < windowMs
    );

    if (timestamps.length >= maxRequests) {
      const oldestInWindow = timestamps[0];
      const retryAfterMs = windowMs - (now - oldestInWindow);
      const retryAfterSec = Math.ceil(retryAfterMs / 1000);

      console.warn(`🚫 Rate limit exceeded for ${ip} (${timestamps.length}/${maxRequests} in window)`);

      return res.status(429).json({
        error: 'Too many requests. Please wait before asking another question.',
        retryAfterSeconds: retryAfterSec,
      });
    }

    // Record this request
    timestamps.push(now);
    requestLog.set(ip, timestamps);

    // Attach rate limit info to response headers (useful for frontend)
    res.set('X-RateLimit-Limit', String(maxRequests));
    res.set('X-RateLimit-Remaining', String(maxRequests - timestamps.length));

    next();
  };
}

module.exports = { createRateLimiter };
