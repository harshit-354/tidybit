import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import QuestionList from './components/QuestionList';
import ProblemInterface from './components/ProblemInterface';
import LoginPage from './pages/LoginPage';
import { mockQuestions } from './data/questions';
import type { User } from './data/types';
import ContestJoinPage from './pages/ContestJoinPage';
import ContestActivePage from './pages/ContestActivePage';
import ContestLeaderboardPage from './pages/ContestLeaderboardPage';
import ContestCreatePage from './pages/ContestCreatePage';
import ContestLobbyPage from './pages/ContestLobbyPage';
import ContestEnterCodePage from './pages/ContestEnterCodePage';
import { getSession, saveSession, createSession, checkServerHealth, STORAGE_VERSION } from './utils/sessionStorage';
import type { TestSession, Participant } from './types/contest';
import './App.css';

type AppState = 'landing' | 'questions' | 'problem' | 'login' | 'contest_create' | 'contest_enter_code' | 'contest_join' | 'contest_lobby' | 'contest_active' | 'contest_leaderboard';

function App() {
  const [view, setView] = useState<AppState>('landing');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [activeSession, setActiveSession] = useState<TestSession | null>(null);
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [isServerDown, setIsServerDown] = useState(false);

  // Connection check
  const verifyConnection = async () => {
    const isHealthy = await checkServerHealth();
    setIsServerDown(!isHealthy);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('tidybit_current_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    verifyConnection();
    const healthInterval = setInterval(verifyConnection, 5000);

    // Check for invite link
    const params = new URLSearchParams(window.location.search);
    const inviteCode = params.get('contest_invite');
    if (inviteCode) {
      getSession(inviteCode).then((session) => {
        if (session) {
          setActiveSession(session);
          if (session.status === 'In Progress' || session.status === 'Completed') {
            alert('This contest has already started or ended.');
            window.history.pushState({}, '', window.location.pathname);
          } else {
            setView('contest_join');
          }
        } else {
          alert('Invalid or expired contest link.');
          window.history.pushState({}, '', window.location.pathname);
        }
      }).catch((err) => {
        console.error('Failed to join via link:', err);
        alert('Could not connect to the contest server. Please ensure the backend is running.');
      });
    }

    return () => clearInterval(healthInterval);
  }, []);

  const handleStart = () => {
    if (user) {
      setView('questions');
    } else {
      setView('login');
    }
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setView('questions');
  };

  const handleLogout = () => {
    localStorage.removeItem('tidybit_current_user');
    setUser(null);
    setView('landing');
  };

  const handleSelectQuestion = (id: string) => {
    setSelectedQuestionId(id);
    setView('problem');
  };

  const handleBackToQuestions = () => {
    setView('questions');
    setSelectedQuestionId(null);
  };

  const selectedQuestion = mockQuestions.find(q => q.id === selectedQuestionId);

  // --- Contest Handlers ---
  const handleInitiateCreateContest = () => {
    if (!user) {
      setView('login');
      return;
    }
    setView('contest_create');
  };

  const handleInitiateJoinContest = () => {
    setView('contest_enter_code');
  };

  const handleSessionFoundFromCode = (session: TestSession) => {
    setActiveSession(session);
    setView('contest_join');
    window.history.pushState({}, '', `?contest_invite=${session.id}`);
  };

  const handleGenerateContest = async (title: string, numQuestions: number, durationMinutes: number) => {
    try {
      const session = await createSession(user?.email || 'guest', title, numQuestions, durationMinutes);
      setActiveSession(session);
      setView('contest_join');
      window.history.pushState({}, '', `?contest_invite=${session.id}`);
    } catch (err) {
      alert('Failed to create contest. Is the backend server running?');
    }
  };

  const handleJoinContest = async (alias: string) => {
    if (!activeSession) return;
    const pId = Math.random().toString(36).substring(2, 9);
    const newParticipant = {
      id: pId, alias, joinedAt: Date.now(), score: 0, totalTimeTakenMs: 0, answers: {}, isFinished: false
    };
    const updatedSession = { ...activeSession, participants: { ...activeSession.participants, [pId]: newParticipant } };
    
    try {
      await saveSession(updatedSession);
      setActiveSession(updatedSession);
      setParticipantId(pId);
      setView('contest_lobby');
    } catch (err) {
      alert('Failed to join contest. Connection error.');
    }
  };

  const handleStartContest = async (sessionToStart: TestSession) => {
    const updatedSession = { 
      ...sessionToStart, 
      status: 'In Progress' as const, 
      startedAt: sessionToStart.startedAt || Date.now() 
    };
    await saveSession(updatedSession);
    setActiveSession(updatedSession);
    setView('contest_active');
  };

  const handleContestProgress = async (participant: Participant) => {
    if (!activeSession) return;
    const updatedSession = { ...activeSession, participants: { ...activeSession.participants, [participant.id]: participant } };
    await saveSession(updatedSession);
    setActiveSession(updatedSession);
  };

  const handleContestFinish = () => {
    setView('contest_leaderboard');
  };

  const handleExitContest = () => {
    setActiveSession(null);
    setParticipantId(null);
    window.history.pushState({}, '', window.location.pathname);
    setView('landing');
  };

  return (
    <div className="app-container">
      {isServerDown && (
        <div style={{
          background: '#ef4444',
          color: '#fff',
          padding: '8px 16px',
          textAlign: 'center',
          fontSize: '0.875rem',
          fontWeight: 'bold',
          zIndex: 9999
        }}>
          ⚠️ Backend Offline (v{STORAGE_VERSION}). Run "npm run dev".
        </div>
      )}
      {!isServerDown && (
        <div style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          fontSize: '10px',
          color: 'rgba(255,255,255,0.2)',
          zIndex: 9999
        }}>
          TidyBit Contest v{STORAGE_VERSION}
        </div>
      )}
      {view !== 'problem' && view !== 'login' && !view.startsWith('contest_') && (
        <Navbar
          onNavigate={(v) => {
            setView(v);
            if (v === 'landing') setSelectedQuestionId(null);
          }}
          onLogin={handleStart}
          onLogout={handleLogout}
          currentView={view === 'questions' ? 'questions' : 'landing'}
          user={user}
          onCreateContest={handleInitiateCreateContest}
          onJoinContest={handleInitiateJoinContest}
        />
      )}

      <main className="main-content">
        {view === 'landing' && (
          <div className="landing-wrapper">
            <LandingPage
              onStartSolving={handleStart}
              onExploreQuestions={handleStart}
            />
            <div className="landing-start-cta">
              <button className="cta-primary big" onClick={handleStart}>
                {user ? 'Continue Solving' : 'Start Solving Now'}
              </button>
            </div>
          </div>
        )}

        {view === 'login' && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onNavigateBack={() => setView('landing')}
          />
        )}

        {view === 'questions' && (
          <div className="page-container">
            <QuestionList onSelectQuestion={handleSelectQuestion} />
          </div>
        )}

        {view === 'problem' && selectedQuestion && (
          <ProblemInterface
            question={selectedQuestion}
            onBack={handleBackToQuestions}
          />
        )}

        {view === 'contest_create' && (
          <ContestCreatePage
            onCreate={handleGenerateContest}
            onCancel={handleExitContest}
          />
        )}

        {view === 'contest_enter_code' && (
          <ContestEnterCodePage
            onSessionFound={handleSessionFoundFromCode}
            onCancel={handleExitContest}
          />
        )}

        {view === 'contest_join' && activeSession && (
          <ContestJoinPage 
            session={activeSession} 
            onJoin={handleJoinContest} 
            onCancel={handleExitContest} 
          />
        )}

        {view === 'contest_lobby' && activeSession && participantId && (
          <ContestLobbyPage
            initialSession={activeSession}
            currentUserId={user?.email || 'guest'}
            onStartContest={handleStartContest}
            onCancel={handleExitContest}
          />
        )}

        {view === 'contest_active' && activeSession && participantId && (
          <ContestActivePage
            session={activeSession}
            participantId={participantId}
            onFinish={handleContestFinish}
            onSaveProgress={handleContestProgress}
          />
        )}

        {view === 'contest_leaderboard' && activeSession && (
          <ContestLeaderboardPage
            session={activeSession}
            onExit={handleExitContest}
          />
        )}
      </main>
    </div>
  );
}

export default App;
