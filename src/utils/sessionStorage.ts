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
export function createMockSession(creatorId: string): TestSession {
  const id = Math.random().toString(36).substring(2, 9);
  
  // Pick 3 random questions for the test
  const shuffled = [...javascriptQuestions].sort(() => 0.5 - Math.random());
  const selectedQuestions = shuffled.slice(0, 3);
  
  const session: TestSession = {
    id,
    inviteCode: id, // Keep it simple for now
    creatorId,
    title: 'JavaScript Speed Run',
    description: 'A quick 10-minute challenge to test your JS skills!',
    questions: selectedQuestions,
    participants: {},
    status: 'Not Started',
    createdAt: Date.now(),
    durationMinutes: 10,
  };
  
  saveSession(session);
  return session;
}
