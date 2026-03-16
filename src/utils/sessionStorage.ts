import { createClient } from '@supabase/supabase-js';
import type { TestSession } from '../types/contest';
import { javascriptQuestions } from '../data/javascriptQuestions';

const API_BASE = '/api/sessions';
export const STORAGE_VERSION = '1.0.1';

// Supabase Configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

if (supabase) {
  console.log('☁️ Supabase Cloud Storage enabled');
} else {
  console.log('🏠 Local Express Storage enabled');
}

export async function checkServerHealth(): Promise<boolean> {
  if (supabase) return true; // Cloud is always "up" if we have keys
  try {
    const res = await fetch(`/api/health?t=${Date.now()}`);
    return res.ok;
  } catch (err) {
    console.error('Server health check failed:', err);
    return false;
  }
}

export async function saveSession(session: TestSession): Promise<void> {
  const normalizedId = session.id.toLowerCase();
  
  if (supabase) {
    const { error } = await supabase
      .from('sessions')
      .upsert({ id: normalizedId, data: session });
    if (error) {
      console.error('Supabase Save Error:', error);
      throw error;
    }
    return;
  }

  // Fallback to Express backend if no Supabase
  let res;
  try {
    const checkRes = await fetch(`${API_BASE}/${normalizedId}`);
    if (checkRes.ok) {
      // PUT if exists
      res = await fetch(`${API_BASE}/${normalizedId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session),
      });
    } else {
      // POST if new
      res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session),
      });
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Server returned ${res.status}`);
    }
  } catch (err) {
    console.error('Failed to save session:', err);
    throw err; // Re-throw so UI can handle
  }
}

export async function getSession(id: string): Promise<TestSession | null> {
  const normalizedId = id.toLowerCase();

  if (supabase) {
    const { data, error } = await supabase
      .from('sessions')
      .select('data')
      .eq('id', normalizedId)
      .single();
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      console.error('Supabase Fetch Error:', error);
      throw error;
    }
    return data.data as TestSession;
  }

  try {
    const res = await fetch(`${API_BASE}/${normalizedId}?t=${Date.now()}`);
    if (res.status === 404) return null;
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error('Session storage connection error:', err);
    throw err;
  }
}

export async function createSession(
  creatorId: string,
  title: string,
  numQuestions: number,
  durationMinutes: number
): Promise<TestSession> {
  const id = Math.random().toString(36).substring(2, 9).toLowerCase();

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
