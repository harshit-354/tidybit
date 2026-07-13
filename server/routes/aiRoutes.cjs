/**
 * AI Routes
 * 
 * Defines the API endpoint for AI-powered hints.
 * Routes are thin — they only wire up middleware and controllers.
 * 
 * Endpoint: POST /api/ai/hint
 * Middleware chain: rateLimiter → controller
 */

const express = require('express');
const router = express.Router();
const { createRateLimiter } = require('../middleware/rateLimiter.cjs');
const { handleHintRequest } = require('../controllers/aiController.cjs');

// Apply rate limiting: 5 requests per minute per IP
const aiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 5,
});

// POST /api/ai/hint — Get an AI-powered hint for a DSA problem
router.post('/ai/hint', aiRateLimiter, handleHintRequest);

module.exports = router;
