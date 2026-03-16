import React, { useMemo } from 'react';
import { Trophy, Medal, Award, Clock } from 'lucide-react';
import type { TestSession } from '../types/contest';
import { calculateLeaderboard, getWinnersCircle } from '../utils/leaderboardUtils';

interface ContestLeaderboardPageProps {
  session: TestSession;
  onExit: () => void;
}

const ContestLeaderboardPage: React.FC<ContestLeaderboardPageProps> = ({ session, onExit }) => {
  const rankedParticipants = useMemo(() => {
    return calculateLeaderboard(Object.values(session.participants));
  }, [session.participants]);

  const { winner, runnersUp } = useMemo(() => {
    return getWinnersCircle(rankedParticipants);
  }, [rankedParticipants]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="landing-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '3rem', margin: '0 0 8px 0', background: 'linear-gradient(to right, #fbbf24, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Test Over!
      </h1>
      <p style={{ color: '#aaa', fontSize: '1.2rem', marginBottom: '40px' }}>{session.title} Leaderboard</p>

      {/* Winner's Circle */}
      {winner && (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', marginBottom: '60px', height: '250px' }}>
          {/* Rank 2 (Silver) */}
          {runnersUp[0] && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'slideUp 0.8s ease-out 0.2s both' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#e2e8f0', marginBottom: '8px' }}>{runnersUp[0].alias}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#cbd5e1', marginBottom: '16px' }}>{runnersUp[0].score} pts</div>
              <div style={{ width: '120px', height: '140px', background: 'linear-gradient(to top, #64748b, #cbd5e1)', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'center', paddingTop: '16px', boxShadow: '0 0 20px rgba(203, 213, 225, 0.2)' }}>
                <Medal size={48} color="#f8fafc" />
              </div>
            </div>
          )}

          {/* Rank 1 (Gold) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'slideUp 0.8s ease-out both' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fef08a', marginBottom: '8px' }}>{winner.alias}</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fbbf24', marginBottom: '16px' }}>{winner.score} pts</div>
            <div style={{ width: '140px', height: '180px', background: 'linear-gradient(to top, #ca8a04, #fbbf24)', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'center', paddingTop: '16px', boxShadow: '0 0 30px rgba(251, 191, 36, 0.4)' }}>
              <Trophy size={64} color="#fef08a" />
            </div>
          </div>

          {/* Rank 3 (Bronze) */}
          {runnersUp[1] && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'slideUp 0.8s ease-out 0.4s both' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fed7aa', marginBottom: '8px' }}>{runnersUp[1].alias}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fdba74', marginBottom: '16px' }}>{runnersUp[1].score} pts</div>
              <div style={{ width: '120px', height: '120px', background: 'linear-gradient(to top, #9a3412, #fdba74)', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'center', paddingTop: '16px', boxShadow: '0 0 20px rgba(253, 186, 116, 0.2)' }}>
                <Award size={48} color="#fffedd" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div style={{ width: '100%', maxWidth: '800px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
          <thead>
            <tr style={{ background: 'rgba(0, 0, 0, 0.3)', textAlign: 'left' }}>
              <th style={{ padding: '16px 24px', width: '80px' }}>Rank</th>
              <th style={{ padding: '16px 24px' }}>Participant</th>
              <th style={{ padding: '16px 24px', textAlign: 'right' }}>Score</th>
              <th style={{ padding: '16px 24px', textAlign: 'right' }}>Time Taken</th>
            </tr>
          </thead>
          <tbody>
            {rankedParticipants.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '16px 24px', fontWeight: 'bold', color: p.rank <= 3 ? '#fbbf24' : '#94a3b8' }}>#{p.rank}</td>
                <td style={{ padding: '16px 24px', fontSize: '1.1rem' }}>{p.alias}</td>
                <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 'bold', fontSize: '1.1rem', color: '#3b82f6' }}>{p.score}</td>
                <td style={{ padding: '16px 24px', textAlign: 'right', color: '#94a3b8' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                    <Clock size={14} /> {formatTime(p.totalTimeTakenMs)}
                  </div>
                </td>
              </tr>
            ))}
            {rankedParticipants.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: '#888' }}>No participants recorded.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button 
        onClick={onExit}
        style={{
          marginTop: '40px',
          padding: '16px 32px',
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'white',
          borderRadius: '8px',
          fontSize: '1.1rem',
          cursor: 'pointer',
          transition: 'all 0.2s',
          fontWeight: 'bold'
        }}
        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        onMouseOut={e => e.currentTarget.style.background = 'transparent'}
      >
        Exit Session
      </button>
    </div>
  );
};

export default ContestLeaderboardPage;
