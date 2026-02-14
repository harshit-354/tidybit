import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import QuestionList from './components/QuestionList';
import ProblemInterface from './components/ProblemInterface';
import LoginPage from './pages/LoginPage';
import { mockQuestions } from './data/questions';
import type { User } from './data/types';
import './App.css';

type AppState = 'landing' | 'questions' | 'problem' | 'login';

function App() {
  const [view, setView] = useState<AppState>('landing');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('tidybit_current_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
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

  return (
    <div className="app-container">
      {view !== 'problem' && view !== 'login' && (
        <Navbar
          onNavigate={(v) => {
            setView(v);
            if (v === 'landing') setSelectedQuestionId(null);
          }}
          onLogin={handleStart}
          onLogout={handleLogout}
          currentView={view === 'questions' ? 'questions' : 'landing'}
          user={user}
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
      </main>
    </div>
  );
}

export default App;
