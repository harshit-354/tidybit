import React, { useState } from 'react';

interface ContestCreatePageProps {
  onCreate: (title: string, numQuestions: number, durationMinutes: number) => void;
  onCancel: () => void;
}

const ContestCreatePage: React.FC<ContestCreatePageProps> = ({ onCreate, onCancel }) => {
  const [title, setTitle] = useState('JavaScript Speed Run');
  const [numQuestions, setNumQuestions] = useState(3);
  const [duration, setDuration] = useState(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && numQuestions > 0 && duration > 0) {
      onCreate(title.trim(), numQuestions, duration);
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
        <h2 style={{ fontSize: '2rem', marginBottom: '8px', color: '#fff', textAlign: 'center' }}>Create Contest</h2>
        <p style={{ color: '#aaa', marginBottom: '32px', textAlign: 'center' }}>Configure your custom algorithmic challenge.</p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '0.875rem' }}>Contest Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Weekly Code Battle"
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

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1, textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '0.875rem' }}>Number of Questions</label>
                <select
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Number(e.target.value))}
                    style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: '#1e293b',
                        color: '#fff',
                        fontSize: '1rem',
                        outline: 'none',
                        cursor: 'pointer'
                    }}
                >
                    <option value={1}>1 Question</option>
                    <option value={3}>3 Questions</option>
                    <option value={5}>5 Questions</option>
                    <option value={10}>10 Questions</option>
                </select>
            </div>

            <div style={{ flex: 1, textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '0.875rem' }}>Duration (Minutes)</label>
                <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: '#1e293b',
                        color: '#fff',
                        fontSize: '1rem',
                        outline: 'none',
                        cursor: 'pointer'
                    }}
                >
                    <option value={5}>5 Minutes</option>
                    <option value={10}>10 Minutes</option>
                    <option value={15}>15 Minutes</option>
                    <option value={30}>30 Minutes</option>
                    <option value={60}>60 Minutes</option>
                </select>
            </div>
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
              disabled={!title.trim()}
              style={{
                flex: 2,
                padding: '12px',
                borderRadius: '8px',
                background: title.trim() ? '#10b981' : 'rgba(16, 185, 129, 0.5)',
                border: 'none',
                color: '#fff',
                cursor: title.trim() ? 'pointer' : 'not-allowed',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
            >
              Generate Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContestCreatePage;
