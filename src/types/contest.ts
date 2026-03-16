import type { TestCase } from '../data/types';

export type ContestStatus = 'Not Started' | 'In Progress' | 'Completed';

export interface ContestQuestion {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  constraints: string[];
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  testCases: TestCase[];
  solutionFunctionName: string;
  scoreValue: number; // e.g., Easy 10, Medium 20, Hard 30
}

export interface ParticipantAnswer {
  questionId: string;
  code: string;
  passedAllTests: boolean;
  timeTakenMs: number;
}

export interface Participant {
  id: string;
  alias: string;
  joinedAt: number; // timestamp
  startedAt?: number; // timestamp
  completedAt?: number; // timestamp
  score: number;
  totalTimeTakenMs: number;
  answers: Record<string, ParticipantAnswer>;
  isFinished: boolean;
}

export interface TestSession {
  id: string;
  inviteCode: string;
  creatorId: string;
  title: string;
  description: string;
  questions: ContestQuestion[];
  participants: Record<string, Participant>;
  status: ContestStatus;
  createdAt: number; // timestamp
  scheduledStartTime?: number; // timestamp
  endTime?: number; // timestamp
  durationMinutes: number;
}

export interface RankedParticipant extends Participant {
  rank: number;
}
