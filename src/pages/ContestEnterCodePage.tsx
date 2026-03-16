import React, { useState } from 'react';
import { getSession } from '../utils/sessionStorage';

interface ContestEnterCodePageProps {
  onSessionFound: (session: any) => void;
  onCancel: () => void;
}

const ContestEnterCodePage: React.FC<ContestEnterCodePageProps> = ({ onSessionFound, onCancel }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const trimmedCode = code.trim();
    if (!trimmedCode) return;

    setIsLoading(true);
    try {
      const session = await getSession(trimmedCode);
      if (session) {
        if (session.status === 'In Progress' || session.status === 'Completed') {
          setError('This contest has already started or ended.');
        } else {
          onSessionFound(session);
        }
      } else {
        setError('Contest not found. Please check the code and try again.');
      }
    } catch (err) {
      setError('An error occurred while looking up the contest.');
    } finally {
      setIsLoading(false);
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
      }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '8px', color: '#fff', textAlign: 'center' }}>Join Contest</h2>
        <p style={{ color: '#aaa', marginBottom: '32px', textAlign: 'center' }}>Enter the contest invite code to join the lobby.</p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '0.875rem' }}>Invite Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. 8xjs9a"
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
              required
            />
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: '0.875rem', margin: '0' }}>{error}</p>}

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
              disabled={!code.trim() || isLoading}
              style={{
                flex: 2,
                padding: '12px',
                borderRadius: '8px',
                background: code.trim() && !isLoading ? '#3b82f6' : 'rgba(59, 130, 246, 0.5)',
                border: 'none',
                color: '#fff',
                cursor: code.trim() && !isLoading ? 'pointer' : 'not-allowed',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
            >
              {isLoading ? 'Joining...' : 'Join Contest'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContestEnterCodePage;
