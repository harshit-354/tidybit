import { Participant, RankedParticipant } from '../types/contest';

/**
 * Calculates the leaderboard ranking for a given list of participants.
 * Participants are sorted primarily by score (descending),
 * and secondarily by total time taken (ascending).
 * @param participants Array of Participant objects
 * @returns Array of RankedParticipant objects
 */
export function calculateLeaderboard(participants: Participant[]): RankedParticipant[] {
  const ranked = [...participants].sort((a, b) => {
    // 1. Sort by score (descending)
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    // 2. Sort by time taken (ascending) if scores are tied
    return a.totalTimeTakenMs - b.totalTimeTakenMs;
  });

  return ranked.map((participant, index) => ({
    ...participant,
    rank: index + 1,
  }));
}

export interface WinnersCircle {
  winner: RankedParticipant | null;
  runnersUp: RankedParticipant[];
}

/**
 * Extracts the winner and runners-up (top 3) from a calculated leaderboard.
 * @param leaderboard Array of RankedParticipant objects (already sorted)
 * @returns WinnersCircle object
 */
export function getWinnersCircle(leaderboard: RankedParticipant[]): WinnersCircle {
  if (!leaderboard || leaderboard.length === 0) {
    return { winner: null, runnersUp: [] };
  }

  const winner = leaderboard[0];
  const runnersUp = leaderboard.slice(1, 3); // Gets rank 2 and 3 if they exist

  return { winner, runnersUp };
}
