import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { ChevronLeft, Play, Send, Lightbulb, FileText, CheckCircle, Loader2, XCircle, Clock } from 'lucide-react';
import type { Question } from '../data/types';
import { runCode, type RunResult } from '../utils/codeRunner';
import './ProblemInterface.css';

interface ProblemInterfaceProps {
    question: Question;
    onBack: () => void;
}

const STARTER_CODE: Record<string, (fnName: string) => string> = {
    typescript: (fnName) => `// Write your TypeScript solution here\nfunction ${fnName}() {\n  \n}`,
    javascript: (fnName) => `// Write your JavaScript solution here\nfunction ${fnName}() {\n  \n}`,
    python: (fnName) => `# Write your Python solution here\ndef ${fnName}():\n    pass`,
    cpp: (fnName) => `// Write your C++ solution here\n#include <iostream>\n\nvoid ${fnName}() {\n    \n}`,
    java: (fnName) => `// Write your Java solution here\nclass Solution {\n    public void ${fnName}() {\n        \n    }\n}`,
};

const ProblemInterface: React.FC<ProblemInterfaceProps> = ({ question, onBack }) => {
    const [activeTab, setActiveTab] = useState<'description' | 'hints' | 'solutions'>('description');
    const [language, setLanguage] = useState<'typescript' | 'javascript' | 'python' | 'cpp' | 'java'>('typescript');
    const [code, setCode] = useState(
        question.solutions[0]?.code || STARTER_CODE.typescript(question.solutionFunctionName)
    );
    const [isRunning, setIsRunning] = useState(false);
    const [runResult, setRunResult] = useState<RunResult | null>(null);
    const [activeResultTab, setActiveResultTab] = useState<number>(0);
    const [submitted, setSubmitted] = useState(false);

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLang = e.target.value as keyof typeof STARTER_CODE;
        setLanguage(newLang as typeof language);
        setCode(STARTER_CODE[newLang](question.solutionFunctionName));
        setRunResult(null);
        setSubmitted(false);
    };

    const handleRun = () => {
        setIsRunning(true);
        setRunResult(null);
        setSubmitted(false);

        // Small delay to show the loading state
        setTimeout(() => {
            const result = runCode(code, question.solutionFunctionName, question.testCases, language);
            setRunResult(result);
            setIsRunning(false);
            setActiveResultTab(0);
        }, 400);
    };

    const handleSubmit = () => {
        setIsRunning(true);
        setRunResult(null);
        setSubmitted(false);

        setTimeout(() => {
            const result = runCode(code, question.solutionFunctionName, question.testCases, language);
            setRunResult(result);
            setIsRunning(false);
            setSubmitted(true);
            setActiveResultTab(0);
        }, 600);
    };

    const passedCount = runResult?.testCaseResults.filter((r) => r.passed).length ?? 0;
    const totalCount = runResult?.testCaseResults.length ?? 0;

    return (
        <div className="problem-interface">
            <div className="problem-header">
                <button className="back-btn" onClick={onBack}>
                    <ChevronLeft size={18} /> Back to Questions
                </button>
                <div className="problem-title-small">
                    {question.id}. {question.title}
                </div>
                <div className="editor-actions">
                    <button className="run-btn" onClick={handleRun} disabled={isRunning}>
                        {isRunning ? <Loader2 size={16} className="spin" /> : <Play size={16} />}
                        Run
                    </button>
                    <button className="submit-btn" onClick={handleSubmit} disabled={isRunning}>
                        {isRunning ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
                        Submit
                    </button>
                </div>
            </div>

            <div className="problem-content-split">
                <div className="left-panel-flex">
                    <div className="panel-tabs">
                        <button
                            className={`tab ${activeTab === 'description' ? 'active' : ''}`}
                            onClick={() => setActiveTab('description')}
                        >
                            <FileText size={16} /> Description
                        </button>
                        <button
                            className={`tab ${activeTab === 'hints' ? 'active' : ''}`}
                            onClick={() => setActiveTab('hints')}
                        >
                            <Lightbulb size={16} /> Hints
                        </button>
                        <button
                            className={`tab ${activeTab === 'solutions' ? 'active' : ''}`}
                            onClick={() => setActiveTab('solutions')}
                        >
                            <CheckCircle size={16} /> Solutions
                        </button>
                    </div>

                    <div className="panel-body">
                        {activeTab === 'description' && (
                            <div className="description-view">
                                <h2>{question.title}</h2>
                                <div className="difficulty-badge-container">
                                    <span className={`difficulty-badge ${question.difficulty.toLowerCase()}`}>
                                        {question.difficulty}
                                    </span>
                                </div>
                                <p className="description-text">{question.description}</p>

                                {question.examples.map((example, idx) => (
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
                                        {question.constraints.map((c, idx) => <li key={idx}>{c}</li>)}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {activeTab === 'hints' && (
                            <div className="hints-view">
                                <h3>Hints</h3>
                                {question.hints.map((hint, idx) => (
                                    <div key={hint.id} className="hint-item">
                                        <span className="hint-number">Hint {idx + 1}</span>
                                        <p>{hint.content}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'solutions' && (
                            <div className="solutions-view">
                                <h3>Solutions</h3>
                                {question.solutions.length > 0 ? (
                                    question.solutions.map((sol, idx) => (
                                        <div key={idx} className="solution-item">
                                            <h4>{sol.language.toUpperCase()} Approach</h4>
                                            <p>{sol.explanation}</p>
                                            <pre><code>{sol.code}</code></pre>
                                        </div>
                                    ))
                                ) : (
                                    <p>No solutions available yet for this problem.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="divider-line"></div>

                <div className="right-panel-flex">
                    <div className="editor-lang-selector">
                        <span className="lang-label">Language:</span>
                        <select
                            value={language}
                            onChange={handleLanguageChange}
                            className="lang-select"
                        >
                            <option value="typescript">TypeScript</option>
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="cpp">C++</option>
                            <option value="java">Java</option>
                        </select>
                    </div>
                    <div className="monaco-wrapper">
                        <Editor
                            height="100%"
                            language={language === 'cpp' ? 'cpp' : language}
                            theme="vs-dark"
                            value={code}
                            onChange={(val) => setCode(val || '')}
                            options={{
                                fontSize: 14,
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                padding: { top: 16 }
                            }}
                        />
                    </div>

                    {/* Results Panel */}
                    <div className={`results-panel ${runResult ? 'visible' : ''}`}>
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
                                            <>
                                                <CheckCircle size={18} />
                                                {submitted ? 'Accepted' : 'All Tests Passed'}
                                            </>
                                        ) : (
                                            <>
                                                <XCircle size={18} />
                                                {runResult.error ? 'Error' : 'Wrong Answer'}
                                            </>
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

export default ProblemInterface;
