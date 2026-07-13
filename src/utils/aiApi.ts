/**
 * AI API Utility
 * 
 * Handles communication with the backend AI hint endpoint.
 * This is the only file in the frontend that knows the API URL structure.
 * 
 * Why a separate file instead of fetching directly in the component?
 * - Single source of truth for the API contract
 * - Easy to mock in tests
 * - Centralizes error handling and response parsing
 */

export interface AiHintRequest {
  userMessage: string;
  problemTitle: string;
  problemDescription: string;
  constraints: string[];
  examples: { input: string; output: string; explanation?: string }[];
  userCode: string;
  language: string;
  difficulty: string;
  category: string;
  conversationHistory: { role: 'user' | 'assistant'; content: string }[];
}

export interface AiHintResponse {
  message: string;
  role: 'assistant';
}

export interface AiErrorResponse {
  error: string;
  retryAfterSeconds?: number;
}

/**
 * Sends a hint request to the backend AI endpoint.
 * 
 * The Vite proxy forwards /api/* to the Express server,
 * so we don't need to specify the full backend URL.
 * 
 * @throws Error with user-friendly message on failure
 */
export async function fetchAiHint(request: AiHintRequest): Promise<AiHintResponse> {
  const response = await fetch('/api/ai/hint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorData = data as AiErrorResponse;
    
    // Throw with the server's error message (already sanitized by controller)
    const error = new Error(errorData.error || 'Failed to get AI hint');
    
    // Attach retry info for rate limit errors
    if (response.status === 429 && errorData.retryAfterSeconds) {
      (error as Error & { retryAfterSeconds?: number }).retryAfterSeconds = errorData.retryAfterSeconds;
    }

    throw error;
  }

  return data as AiHintResponse;
}
