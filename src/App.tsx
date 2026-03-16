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
import { getSession, saveSession, createMockSession } from './utils/sessionStorage';
import type { TestSession, Participant } from './types/contest';
import './App.css';

type AppState = 'landing' | 'questions' | 'problem' | 'login' | 'contest_join' | 'contest_active' | 'contest_leaderboard';

function App() {
  const [view, setView] = useState<AppState>('landing');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [activeSession, setActiveSession] = useState<TestSession | null>(null);
  const [participantId, setParticipantId] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('tidybit_current_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Check for invite link
    const params = new URLSearchParams(window.location.search);
    const inviteCode = params.get('contest_invite');
    if (inviteCode) {
      const session = getSession(inviteCode);
      if (session) {
        setActiveSession(session);
        setView('contest_join');
      }
    }
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
  const handleCreateMockContest = () => {
    const session = createMockSession(user?.email || 'guest');
    // For demo purposes, immediately join the one we created
    setActiveSession(session);
    setView('contest_join');
    // Update URL so it can be shared easily
    window.history.pushState({}, '', `?contest_invite=${session.id}`);
  };

  const handleJoinContest = (alias: string) => {
    if (!activeSession) return;
    const pId = Math.random().toString(36).substring(2, 9);
    const newParticipant = {
      id: pId, alias, joinedAt: Date.now(), score: 0, totalTimeTakenMs: 0, answers: {}, isFinished: false
    };
    const updatedSession = { ...activeSession, participants: { ...activeSession.participants, [pId]: newParticipant } };
    
    saveSession(updatedSession);
    setActiveSession(updatedSession);
    setParticipantId(pId);
    setView('contest_active');
  };

  const handleContestProgress = (participant: Participant) => {
    if (!activeSession) return;
    const updatedSession = { ...activeSession, participants: { ...activeSession.participants, [participant.id]: participant } };
    saveSession(updatedSession);
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
          onCreateContest={handleCreateMockContest}
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

        {view === 'contest_join' && activeSession && (
          <ContestJoinPage 
            session={activeSession} 
            onJoin={handleJoinContest} 
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
