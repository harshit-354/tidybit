/**
 * AI Service
 * 
 * Handles all communication with the Google Gemini API.
 * This is the only file that knows about the AI provider — if you want to swap 
 * to OpenAI or Anthropic, you only change this file.
 * 
 * Design decisions:
 * - Uses native `fetch` instead of the Gemini SDK to avoid adding a dependency.
 * - The system prompt is carefully designed to make the AI act as a tutor, not a solver.
 * - Conversation history is sent with each request for multi-turn context.
 */

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * Builds the system instruction that shapes the AI's persona.
 * 
 * Why is this so detailed?
 * LLMs follow instructions better when they're specific and structured.
 * Vague prompts like "be a tutor" lead to inconsistent behavior.
 * Each numbered rule maps to a specific user requirement.
 */
function buildSystemPrompt(problemContext) {
  return `You are **TidyBit AI** — a patient and encouraging DSA (Data Structures & Algorithms) tutor embedded in a coding practice platform.

## Your Core Rules

1. **NEVER give the complete solution immediately.** This is your most important rule.
2. First, identify what the student is struggling with by analyzing their code and question.
3. Ask a clarifying question if their request is vague (e.g., "What output are you expecting for input X?").
4. Give **conceptual hints** first (e.g., "Think about what data structure gives O(1) lookups").
5. If they're still stuck after a hint, suggest the specific **algorithm or pattern** (e.g., "This is a classic sliding window problem").
6. **Analyze their current code**: point out specific bugs, logical errors, or inefficiencies — but let them fix it.
7. Discuss **time and space complexity** when relevant to help them understand tradeoffs.
8. Only provide complete working code if the student **explicitly asks** for it after receiving hints (e.g., "Can you show me the code?" or "Give me the solution").
9. Use the student's chosen **programming language** (${problemContext.language}) for any code snippets.
10. Format responses with markdown: use \`code\`, **bold**, bullet points, and code blocks for readability.

## Current Problem Context

**Title:** ${problemContext.problemTitle}
**Difficulty:** ${problemContext.difficulty || 'Unknown'}
**Category:** ${problemContext.category || 'Unknown'}

**Description:**
${problemContext.problemDescription}

**Constraints:**
${(problemContext.constraints || []).map(c => `- ${c}`).join('\n')}

**Examples:**
${(problemContext.examples || []).map((ex, i) => 
  `Example ${i + 1}:\n  Input: ${ex.input}\n  Output: ${ex.output}${ex.explanation ? `\n  Explanation: ${ex.explanation}` : ''}`
).join('\n\n')}

**Student's Current Code (${problemContext.language}):**
\`\`\`${problemContext.language}
${problemContext.userCode}
\`\`\`

Remember: You're here to help them **learn**, not just get the answer. Be encouraging but honest about mistakes.`;
}

/**
 * Formats conversation history into the Gemini API's expected format.
 * Gemini uses 'user' and 'model' roles (not 'assistant').
 */
function formatConversationHistory(messages) {
  return messages.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));
}

/**
 * Sends a message to the Gemini API with full conversation context.
 * 
 * @param {object} params
 * @param {object} params.problemContext - Problem details + user code
 * @param {string} params.userMessage - The user's current question
 * @param {Array} params.conversationHistory - Previous messages in this conversation
 * @returns {Promise<{message: string, role: string}>}
 */
async function getAiHint({ problemContext, userMessage, conversationHistory = [] }) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured. Please add it to your .env file.');
  }

  const systemPrompt = buildSystemPrompt(problemContext);

  // Build the messages array: history + new user message
  const allMessages = [
    ...formatConversationHistory(conversationHistory),
    { role: 'user', parts: [{ text: userMessage }] },
  ];

  const requestBody = {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    contents: allMessages,
    generationConfig: {
      temperature: 0.7, // Balanced: creative enough for explanations, focused enough for accuracy
      maxOutputTokens: 1024, // Enough for a detailed hint, not so much it writes essays
      topP: 0.9,
    },
    // Safety settings to ensure educational content
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
    ],
  };

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`❌ Gemini API error (${response.status}):`, errorBody);

    if (response.status === 429) {
      throw new Error('AI service is temporarily busy. Please try again in a few seconds.');
    }
    if (response.status === 401 || response.status === 403) {
      throw new Error('AI service authentication failed. Please check your API key.');
    }

    throw new Error('AI service encountered an error. Please try again.');
  }

  const data = await response.json();

  // Extract the text response from Gemini's response format
  const aiMessage = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!aiMessage) {
    console.error('❌ Unexpected Gemini response structure:', JSON.stringify(data, null, 2));
    throw new Error('Received an empty response from the AI. Please try rephrasing your question.');
  }

  return {
    message: aiMessage,
    role: 'assistant',
  };
}

module.exports = { getAiHint };
