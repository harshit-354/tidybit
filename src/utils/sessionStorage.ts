import type { TestSession } from '../types/contest';
import { javascriptQuestions } from '../data/javascriptQuestions';

const API_BASE = '/api/sessions';

export async function saveSession(session: TestSession): Promise<void> {
  const existing = await getSession(session.id);
  if (existing) {
    await fetch(`${API_BASE}/${session.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session),
    });
  } else {
    await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session),
    });
  }
}

export async function getSession(id: string): Promise<TestSession | null> {
  try {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) {
      console.error(`Session fetch failed: ${res.status} ${res.statusText}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error('Session storage connection error:', err);
    return null;
  }
}

export async function createSession(
  creatorId: string,
  title: string,
  numQuestions: number,
  durationMinutes: number
): Promise<TestSession> {
  const id = Math.random().toString(36).substring(2, 9);

  const shuffled = [...javascriptQuestions].sort(() => 0.5 - Math.random());
  const selectedQuestions = shuffled.slice(0, Math.min(numQuestions, javascriptQuestions.length));

  const session: TestSession = {
    id,
    inviteCode: id,
    creatorId,
    title,
    description: `A quick ${durationMinutes}-minute challenge with ${selectedQuestions.length} questions!`,
    questions: selectedQuestions,
    participants: {},
    status: 'Not Started',
    createdAt: Date.now(),
    durationMinutes,
  };

  await saveSession(session);
  return session;
}
