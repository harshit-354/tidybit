/**
 * useAiChat — Custom React Hook
 * 
 * Manages the entire AI chat state: messages, loading, errors, and API calls.
 * 
 * Why a custom hook instead of putting this in the component?
 * 1. Separation of concerns: UI rendering vs state/logic
 * 2. Testability: You can test the hook's logic independently
 * 3. Reusability: Could be used in ContestActivePage too if needed
 * 
 * The hook resets conversation history when the problemId changes,
 * ensuring each problem gets a fresh conversation context.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { fetchAiHint } from '../utils/aiApi';
import type { Question } from '../data/types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface UseAiChatOptions {
  question: Question;
  userCode: string;
  language: string;
}

interface UseAiChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (userMessage: string) => Promise<void>;
  clearHistory: () => void;
  retryAfterSeconds: number | null;
}

/**
 * Generates a simple unique ID for messages.
 * Not cryptographically secure — just for React keys.
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function useAiChat({ question, userCode, language }: UseAiChatOptions): UseAiChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryAfterSeconds, setRetryAfterSeconds] = useState<number | null>(null);
  
  // Track the current problem ID to reset history on problem change
  const currentProblemId = useRef(question.id);

  // Reset conversation when problem changes
  useEffect(() => {
    if (currentProblemId.current !== question.id) {
      setMessages([]);
      setError(null);
      setRetryAfterSeconds(null);
      currentProblemId.current = question.id;
    }
  }, [question.id]);

  const sendMessage = useCallback(async (userMessage: string) => {
    const trimmed = userMessage.trim();
    if (!trimmed || isLoading) return;

    // Add user message to the chat immediately (optimistic UI)
    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);
    setRetryAfterSeconds(null);

    try {
      // Build conversation history from existing messages (excluding the one we just added)
      // We use a functional update to get the latest state
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetchAiHint({
        userMessage: trimmed,
        problemTitle: question.title,
        problemDescription: question.description,
        constraints: question.constraints,
        examples: question.examples,
        userCode,
        language,
        difficulty: question.difficulty,
        category: question.category,
        conversationHistory,
      });

      // Add AI response to the chat
      const aiMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: response.message,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      setError(errorMessage);

      // Handle rate limit retry info
      const retrySeconds = (err as Error & { retryAfterSeconds?: number }).retryAfterSeconds;
      if (retrySeconds) {
        setRetryAfterSeconds(retrySeconds);
        // Auto-clear the retry timer
        setTimeout(() => setRetryAfterSeconds(null), retrySeconds * 1000);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages, question, userCode, language]);

  const clearHistory = useCallback(() => {
    setMessages([]);
    setError(null);
    setRetryAfterSeconds(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearHistory,
    retryAfterSeconds,
  };
}
