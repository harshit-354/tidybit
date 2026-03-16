import type { TestSession } from '../types/contest';
import { javascriptQuestions } from '../data/javascriptQuestions';

const SESSIONS_KEY = 'tidybit_test_sessions';

export function getSessions(): Record<string, TestSession> {
  const data = localStorage.getItem(SESSIONS_KEY);
  return data ? JSON.parse(data) : {};
}

export function saveSession(session: TestSession) {
  const sessions = getSessions();
  sessions[session.id] = session;
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function getSession(id: string): TestSession | null {
  const sessions = getSessions();
  return sessions[id] || null;
}

// Helper to generate a random mock session for testing
export function createSession(creatorId: string, title: string, numQuestions: number, durationMinutes: number): TestSession {
  const id = Math.random().toString(36).substring(2, 9);
  
  // Pick random questions for the test
  const shuffled = [...javascriptQuestions].sort(() => 0.5 - Math.random());
  const selectedQuestions = shuffled.slice(0, Math.min(numQuestions, javascriptQuestions.length));
  
  const session: TestSession = {
    id,
    inviteCode: id, // Keep it simple for now
    creatorId,
    title,
    description: `A quick ${durationMinutes}-minute challenge with ${selectedQuestions.length} questions!`,
    questions: selectedQuestions,
    participants: {},
    status: 'Not Started',
    createdAt: Date.now(),
    durationMinutes,
  };
  
  saveSession(session);
  return session;
}
