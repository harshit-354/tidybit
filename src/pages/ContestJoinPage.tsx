import React, { useState } from 'react';
import type { TestSession } from '../types/contest';

interface ContestJoinPageProps {
  session: TestSession;
  onJoin: (alias: string) => void;
  onCancel: () => void;
}

const ContestJoinPage: React.FC<ContestJoinPageProps> = ({ session, onJoin, onCancel }) => {
  const [alias, setAlias] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (alias.trim().length >= 3) {
      onJoin(alias.trim());
    }
  };

  return (
    <div className="landing-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '40px',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '8px', color: '#fff' }}>{session.title}</h2>
        <p style={{ color: '#aaa', marginBottom: '32px' }}>{session.description}</p>
        
        <div style={{ 
          background: 'rgba(59, 130, 246, 0.1)', 
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '8px', 
          padding: '16px', 
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-around'
        }}>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#888' }}>Questions</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3b82f6' }}>{session.questions.length}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#888' }}>Duration</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3b82f6' }}>{session.durationMinutes} mins</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '0.875rem' }}>Your Alias (Name)</label>
            <input
              type="text"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="e.g. CodeNinja"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(0, 0, 0, 0.2)',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              autoFocus
            />
            {alias.length > 0 && alias.length < 3 && (
              <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>Alias must be at least 3 characters.</p>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button 
              type="button" 
              onClick={onCancel}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={alias.trim().length < 3}
              style={{
                flex: 2,
                padding: '12px',
                borderRadius: '8px',
                background: alias.trim().length >= 3 ? '#3b82f6' : 'rgba(59, 130, 246, 0.5)',
                border: 'none',
                color: '#fff',
                cursor: alias.trim().length >= 3 ? 'pointer' : 'not-allowed',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
            >
              Join Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContestJoinPage;
