/**
 * AI Controller
 * 
 * Handles request validation and orchestrates the AI hint flow.
 * Controllers are the "traffic cops" — they validate input, call services,
 * and format the response. They contain no business logic themselves.
 * 
 * Validation rules:
 * - userMessage: required, max 2000 chars (prevents prompt injection via huge inputs)
 * - problemTitle: required (we need to know which problem the student is on)
 * - userCode: optional but capped at 10000 chars (prevents abuse)
 * - conversationHistory: optional, max 20 messages (prevents unbounded context)
 */

const { getAiHint } = require('../services/aiService.cjs');

// Validation constants
const MAX_MESSAGE_LENGTH = 2000;
const MAX_CODE_LENGTH = 10000;
const MAX_HISTORY_LENGTH = 20;

/**
 * POST /api/ai/hint
 * 
 * Expected body:
 * {
 *   userMessage: string,          // The student's question
 *   problemTitle: string,         // Problem name (e.g., "Two Sum")
 *   problemDescription: string,   // Full problem description
 *   constraints: string[],        // Problem constraints
 *   examples: object[],           // Example test cases
 *   userCode: string,             // Student's current code
 *   language: string,             // Selected programming language
 *   difficulty: string,           // Easy, Medium, Hard
 *   category: string,             // Arrays, DP, etc.
 *   conversationHistory: Array    // Previous messages for context
 * }
 */
async function handleHintRequest(req, res) {
  try {
    const {
      userMessage,
      problemTitle,
      problemDescription,
      constraints,
      examples,
      userCode,
      language,
      difficulty,
      category,
      conversationHistory,
    } = req.body;

    // --- Input Validation ---

    if (!userMessage || typeof userMessage !== 'string' || userMessage.trim().length === 0) {
      return res.status(400).json({
        error: 'Please enter a question before sending.',
      });
    }

    if (userMessage.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        error: `Question is too long. Please keep it under ${MAX_MESSAGE_LENGTH} characters.`,
      });
    }

    if (!problemTitle || typeof problemTitle !== 'string') {
      return res.status(400).json({
        error: 'Problem context is missing. Please try refreshing the page.',
      });
    }

    if (userCode && userCode.length > MAX_CODE_LENGTH) {
      return res.status(400).json({
        error: `Code is too long to analyze. Please keep it under ${MAX_CODE_LENGTH} characters.`,
      });
    }

    // Trim conversation history to prevent context window abuse
    const trimmedHistory = Array.isArray(conversationHistory)
      ? conversationHistory.slice(-MAX_HISTORY_LENGTH)
      : [];

    // --- Call AI Service ---

    console.log(`🤖 AI Hint requested for "${problemTitle}" in ${language || 'unknown'}`);

    const result = await getAiHint({
      problemContext: {
        problemTitle,
        problemDescription: problemDescription || '',
        constraints: constraints || [],
        examples: examples || [],
        userCode: userCode || '// No code written yet',
        language: language || 'javascript',
        difficulty: difficulty || 'Unknown',
        category: category || 'Unknown',
      },
      userMessage: userMessage.trim(),
      conversationHistory: trimmedHistory,
    });

    console.log(`✅ AI responded for "${problemTitle}" (${result.message.length} chars)`);

    res.json(result);
  } catch (error) {
    console.error('❌ AI Controller error:', error.message);

    // Send the error message if it's a known/safe error from our service
    // Otherwise, send a generic message to avoid leaking internal details
    const isKnownError = error.message && !error.message.includes('fetch');
    
    res.status(500).json({
      error: isKnownError
        ? error.message
        : 'Something went wrong while getting the AI hint. Please try again.',
    });
  }
}

module.exports = { handleHintRequest };
