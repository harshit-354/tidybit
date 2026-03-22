import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Send, Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import type { TestSession, Participant } from '../types/contest';
import { runCode, type RunResult } from '../utils/codeRunner';
import '../components/ProblemInterface.css';

interface ContestActivePageProps {
  session: TestSession;
  participantId: string;
  onFinish: (participantId: string) => void;
  onSaveProgress: (participant: Participant) => void;
}

const ContestActivePage: React.FC<ContestActivePageProps> = ({ 
  session, 
  participantId, 
  onFinish,
  onSaveProgress
}) => {
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [code, setCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [activeResultTab, setActiveResultTab] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(session.durationMinutes * 60);

  useEffect(() => {
    const p = session.participants[participantId];
    if (p) {
      setParticipant(p);
      // Load existing code if they jump back to question
      const existingAnswer = p.answers[session.questions[currentQuestionIdx].id];
      if (existingAnswer) {
        setCode(existingAnswer.code);
      } else {
        setCode(`// Write your JavaScript solution here\nfunction ${session.questions[currentQuestionIdx].solutionFunctionName}() {\n  \n}`);
      }
    }
  }, [session, participantId, currentQuestionIdx]);

  useEffect(() => {
    // If there's no startedAt, something went wrong, but fallback to Date.now()
    const startTime = session.startedAt || Date.now();
    const endTime = startTime + (session.durationMinutes * 60 * 1000);

    const timer = setInterval(() => {
      const now = Date.now();
      const remainingMs = Math.max(0, endTime - now);
      const remainingSecs = Math.floor(remainingMs / 1000);
      
      setTimeLeft(remainingSecs);

      if (remainingSecs <= 0) {
        clearInterval(timer);
        handleTimeUp();
      }
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const handleTimeUp = () => {
    if (participant) {
      const updated = {
        ...participant,
        isFinished: true,
        completedAt: Date.now(),
        totalTimeTakenMs: session.durationMinutes * 60 * 1000
      };
      onSaveProgress(updated);
      onFinish(participantId);
    }
  };

  const handleManualFinish = () => {
    if (participant) {
      const timeTakenMs = (session.durationMinutes * 60 - timeLeft) * 1000;
      const updated = {
        ...participant,
        isFinished: true,
        completedAt: Date.now(),
        totalTimeTakenMs: timeTakenMs
      };
      onSaveProgress(updated);
      onFinish(participantId);
    }
  };

  const currentQuestion = session.questions[currentQuestionIdx];

  const handleRun = async () => {
    setIsRunning(true);
    setRunResult(null);

    try {
      const result = await runCode(code, currentQuestion.solutionFunctionName, currentQuestion.testCases, 'javascript');
      setRunResult(result);
      setActiveResultTab(0);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsRunning(true);
    setRunResult(null);

    try {
      const result = await runCode(code, currentQuestion.solutionFunctionName, currentQuestion.testCases, 'javascript');
      setRunResult(result);
      setActiveResultTab(0);
      
      if (participant && result) {
        // Record the answer
        const updatedAnswers = { ...participant.answers };
        const timeAtSubmission = (session.durationMinutes * 60 - timeLeft) * 1000;
        
        let newScore = participant.score;

        // If it's a first-time pass, award points
        if (result.allPassed && !updatedAnswers[currentQuestion.id]?.passedAllTests) {
           newScore += currentQuestion.scoreValue;
        }

        updatedAnswers[currentQuestion.id] = {
          questionId: currentQuestion.id,
          code,
          passedAllTests: result.allPassed,
          timeTakenMs: timeAtSubmission
        };

        const updatedParticipant = {
          ...participant,
          answers: updatedAnswers,
          score: newScore
        };

        setParticipant(updatedParticipant);
        onSaveProgress(updatedParticipant);

        // Auto advance if passed
        if (result.allPassed) {
          setTimeout(() => {
            if (currentQuestionIdx < session.questions.length - 1) {
              setCurrentQuestionIdx(currentQuestionIdx + 1);
              setRunResult(null);
            }
          }, 1500);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  if (!participant || !currentQuestion) return <div>Loading...</div>;

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const isTimeLow = timeLeft < 60; // less than 1 min warning

  const passedCount = runResult?.testCaseResults.filter((r) => r.passed).length ?? 0;
  const totalCount = runResult?.testCaseResults.length ?? 0;

  return (
    <div className="problem-interface" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Contest header overlay */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#1e293b', 
        padding: '12px 24px', 
        borderBottom: '1px solid #334155',
        color: 'white'
      }}>
        <div style={{ fontWeight: 'bold' }}>{session.title} - <span style={{color: '#94a3b8', fontWeight: 'normal'}}>Solving as {participant.alias}</span></div>
        
        {/* Navigation Dots */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {session.questions.map((q, idx) => {
             const ans = participant.answers[q.id];
             let color = '#334155'; // default
             if (idx === currentQuestionIdx) color = '#3b82f6'; // active
             else if (ans?.passedAllTests) color = '#10b981'; // passed
             else if (ans) color = '#ef4444'; // attempted but failed

             return (
               <button 
                 key={q.id}
                 onClick={() => { setCurrentQuestionIdx(idx); setRunResult(null); }}
                 style={{
                   width: '32px', height: '32px', borderRadius: '50%',
                   background: color, border: 'none', color: 'white',
                   cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                   fontSize: '12px', fontWeight: 'bold'
                 }}
               >
                 {idx + 1}
               </button>
             )
          })}
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: '6px', 
            color: isTimeLow ? '#ef4444' : '#10b981',
            fontWeight: 'bold', fontSize: '1.2rem',
            animation: isTimeLow ? 'pulse 1s infinite' : 'none'
          }}>
            <Clock size={18} />
            {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
          </div>
          <button 
            onClick={handleManualFinish}
            style={{
              background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px',
              padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer'
            }}
          >
            Finish Test Early
          </button>
        </div>
      </div>

      <div className="problem-content-split" style={{ flex: 1 }}>
        <div className="left-panel-flex">
          <div className="panel-body">
            <div className="description-view">
              <h2>{currentQuestion.title}</h2>
              <div className="difficulty-badge-container">
                  <span className={`difficulty-badge ${currentQuestion.difficulty.toLowerCase()}`}>
                      {currentQuestion.difficulty}
                  </span>
                  <span style={{ marginLeft: '12px', fontSize: '0.9rem', color: '#888' }}>
                      Points: {currentQuestion.scoreValue}
                  </span>
              </div>
              <p className="description-text">{currentQuestion.description}</p>

              {currentQuestion.examples.map((example, idx) => (
                  <div key={idx} className="example-block">
                      <h4>Example {idx + 1}:</h4>
                      <div className="example-content">
                          <p><strong>Input:</strong> {example.input}</p>
                          <p><strong>Output:</strong> {example.output}</p>
                          {example.explanation && <p><strong>Explanation:</strong> {example.explanation}</p>}
                      </div>
                  </div>
              ))}

              <div className="constraints-block">
                  <h4>Constraints:</h4>
                  <ul>
                      {currentQuestion.constraints.map((c, idx) => <li key={idx}>{c}</li>)}
                  </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="divider-line"></div>

        <div className="right-panel-flex">
          <div className="editor-lang-selector" style={{ justifyContent: 'space-between' }}>
            <span className="lang-label">Language: JavaScript (Contest Only)</span>
            <div className="editor-actions">
                <button className="run-btn" onClick={handleRun} disabled={isRunning}>
                    {isRunning ? <Loader2 size={16} className="spin" /> : <Play size={16} />} Run
                </button>
                <button className="submit-btn" onClick={handleSubmit} disabled={isRunning}>
                    {isRunning ? <Loader2 size={16} className="spin" /> : <Send size={16} />} Submit
                </button>
            </div>
          </div>
          <div className="monaco-wrapper">
              <Editor
                  height="100%"
                  language="javascript"
                  theme="vs-dark"
                  value={code}
                  onChange={(val) => setCode(val || '')}
                  options={{ fontSize: 14, minimap: { enabled: false } }}
              />
          </div>

          {/* Results Panel */}
          <div className={`results-panel ${runResult ? 'visible' : ''}`} style={{ maxHeight: '30%', overflowY: 'auto' }}>
              {isRunning && (
                  <div className="results-loading">
                      <Loader2 size={20} className="spin" />
                      <span>Running test cases...</span>
                  </div>
              )}

              {runResult && !isRunning && (
                  <>
                      <div className="results-header">
                          <div className={`results-status ${runResult.allPassed ? 'passed' : 'failed'}`}>
                              {runResult.allPassed ? (
                                  <><CheckCircle size={18} /> Accepted!</>
                              ) : (
                                  <><XCircle size={18} /> {runResult.error ? 'Error' : 'Wrong Answer'}</>
                              )}
                          </div>
                          <div className="results-meta">
                              <span className="results-count">{passedCount}/{totalCount} passed</span>
                              <span className="results-time">
                                  <Clock size={14} /> {runResult.totalTime}ms
                              </span>
                          </div>
                      </div>

                      {/* Test case tabs */}
                      <div className="testcase-tabs">
                          {runResult.testCaseResults.map((tc, idx) => (
                              <button
                                  key={idx}
                                  className={`testcase-tab ${activeResultTab === idx ? 'active' : ''} ${tc.passed ? 'pass' : 'fail'}`}
                                  onClick={() => setActiveResultTab(idx)}
                              >
                                  {tc.passed ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                  Case {idx + 1}
                              </button>
                          ))}
                      </div>

                      {/* Active test case detail */}
                      {runResult.testCaseResults[activeResultTab] && (
                          <div className="testcase-detail">
                              {runResult.testCaseResults[activeResultTab].error ? (
                                  <div className="testcase-error">
                                      <strong>Runtime Error:</strong>
                                      <pre>{runResult.testCaseResults[activeResultTab].error}</pre>
                                  </div>
                              ) : (
                                  <>
                                      <div className="testcase-row">
                                          <span className="testcase-label">Input:</span>
                                          <code className="testcase-value">{runResult.testCaseResults[activeResultTab].input}</code>
                                      </div>
                                      <div className="testcase-row">
                                          <span className="testcase-label">Expected:</span>
                                          <code className="testcase-value">{runResult.testCaseResults[activeResultTab].expectedOutput}</code>
                                      </div>
                                      <div className="testcase-row">
                                          <span className="testcase-label">Output:</span>
                                          <code className={`testcase-value ${runResult.testCaseResults[activeResultTab].passed ? 'correct' : 'wrong'}`}>
                                              {runResult.testCaseResults[activeResultTab].actualOutput || '(empty)'}
                                          </code>
                                      </div>
                                  </>
                              )}
                          </div>
                      )}
                  </>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestActivePage;
