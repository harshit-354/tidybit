import React, { useEffect, useState } from 'react';
import { Copy, Users, Play, Loader2, Check } from 'lucide-react';
import type { TestSession } from '../types/contest';
import { getSession } from '../utils/sessionStorage';

interface ContestLobbyPageProps {
  initialSession: TestSession;
  currentUserId: string;
  onStartContest: (session: TestSession) => void;
  onCancel: () => void;
}

const ContestLobbyPage: React.FC<ContestLobbyPageProps> = ({ 
  initialSession, 
  currentUserId,
  onStartContest, 
  onCancel 
}) => {
  const [session, setSession] = useState<TestSession>(initialSession);
  const [copied, setCopied] = useState(false);

  // Poll for new participants joining the session
  useEffect(() => {
    let active = true;
    const pollInterval = setInterval(async () => {
      try {
        const freshSession = await getSession(session.id);
        if (freshSession && active) {
          setSession(freshSession);
          
          // If someone else started the contest, we should trigger the start too
          if (freshSession.status === 'In Progress') {
            onStartContest(freshSession);
          }
        }
      } catch (err) {
        console.error('Lobby polling error:', err);
      }
    }, 1000); // Check every second

    return () => {
      active = false;
      clearInterval(pollInterval);
    };
  }, [session.id, onStartContest]);

  const inviteLink = `${window.location.origin}${window.location.pathname}?contest_invite=${session.id}`;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isCreator = session.creatorId === currentUserId;
  const participantList = Object.values(session.participants);

  return (
    <div className="landing-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '40px',
        maxWidth: '600px',
        width: '100%',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
            <Loader2 className="spin" size={28} color="#3b82f6" />
            <h2 style={{ fontSize: '2rem', margin: 0, color: '#fff' }}>Waiting Lobby</h2>
        </div>
        
        <p style={{ color: '#aaa', marginBottom: '32px' }}>{session.title}</p>
        
        {/* Contest Code Section */}
        <div style={{ 
          background: 'rgba(59, 130, 246, 0.2)', 
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '8px', 
          padding: '16px', 
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
            Contest Code
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', letterSpacing: '0.2em', fontFamily: 'monospace' }}>
            {session.id.toUpperCase()}
          </div>
        </div>

        {/* Invite Link Section */}
        <div style={{ 
          background: 'rgba(0, 0, 0, 0.3)', 
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px', 
          padding: '16px', 
          marginBottom: '32px',
          textAlign: 'left'
        }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '0.875rem', fontWeight: 'bold' }}>
            Invite Link
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              readOnly 
              value={inviteLink}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: '#1e293b',
                color: '#94a3b8',
                fontSize: '0.9rem'
              }}
            />
            <button 
              onClick={handleCopy}
              style={{
                padding: '0 16px',
                background: copied ? '#10b981' : '#3b82f6',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 'bold',
                transition: 'background 0.2s'
              }}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '8px' }}>
            Share this link with your friends. They will appear below when they join.
          </p>
        </div>

        {/* Participants section */}
        <div style={{ marginBottom: '32px', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Users size={20} color="#94a3b8" />
                <h3 style={{ margin: 0, color: '#e2e8f0' }}>Participants ({participantList.length})</h3>
            </div>
            
            <div style={{ 
                display: 'flex', flexWrap: 'wrap', gap: '12px', 
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                padding: '16px', borderRadius: '8px',
                minHeight: '80px'
            }}>
                {participantList.length === 0 ? (
                    <div style={{ color: '#64748b', width: '100%', textAlign: 'center', paddingTop: '16px' }}>
                        Waiting for players...
                    </div>
                ) : (
                    participantList.map(p => (
                        <div key={p.id} style={{
                            background: '#334155',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            color: 'white',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            animation: 'fadeIn 0.3s ease-out'
                        }}>
                           <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></div>
                           {p.alias}
                        </div>
                    ))
                )}
            </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={onCancel}
              style={{
                flex: 1, padding: '14px', borderRadius: '8px', background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)', color: '#fff', cursor: 'pointer', fontWeight: 'bold'
              }}
            >
              Leave Lobby
            </button>
            
            {isCreator ? (
                <button 
                onClick={() => onStartContest(session)}
                disabled={participantList.length === 0}
                style={{
                    flex: 2, padding: '14px', borderRadius: '8px',
                    background: participantList.length > 0 ? '#10b981' : 'rgba(16, 185, 129, 0.3)',
                    border: 'none', color: '#fff', cursor: participantList.length > 0 ? 'pointer' : 'not-allowed', 
                    fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
                }}
                >
                <Play size={18} fill="currentColor" />
                Start Contest Now
                </button>
            ) : (
                <div style={{
                    flex: 2, padding: '14px', borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px dashed rgba(255, 255, 255, 0.2)', color: '#94a3b8', 
                    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
                }}>
                    <Loader2 size={18} className="spin" />
                    Waiting for host to start...
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ContestLobbyPage;
