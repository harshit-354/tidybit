import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { ChevronLeft, Play, Send, Lightbulb, FileText, CheckCircle } from 'lucide-react';
import type { Question } from '../data/types';
import './ProblemInterface.css';

interface ProblemInterfaceProps {
    question: Question;
    onBack: () => void;
}

const STARTER_CODE = {
    typescript: '// Write your TypeScript solution here\n',
    python: '# Write your Python solution here\ndef solution():\n    pass',
    cpp: '// Write your C++ solution here\n#include <iostream>\n\nvoid solution() {\n    \n}',
    java: '// Write your Java solution here\nclass Solution {\n    public void solve() {\n        \n    }\n}'
};

const ProblemInterface: React.FC<ProblemInterfaceProps> = ({ question, onBack }) => {
    const [activeTab, setActiveTab] = useState<'description' | 'hints' | 'solutions'>('description');
    const [language, setLanguage] = useState<'typescript' | 'python' | 'cpp' | 'java'>('typescript');
    const [code, setCode] = useState(question.solutions[0]?.code || STARTER_CODE.typescript);

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLang = e.target.value as keyof typeof STARTER_CODE;
        setLanguage(newLang);
        // Ideally we would preserve code for each language, but for now we reset to starter
        // or existing solution if available for that lang (mock data only has TS)
        setCode(STARTER_CODE[newLang]);
    };

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
                    <button className="run-btn"><Play size={16} /> Run</button>
                    <button className="submit-btn"><Send size={16} /> Submit</button>
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
                            <option value="python">Python</option>
                            <option value="cpp">C++</option>
                            <option value="java">Java</option>
                        </select>
                    </div>
                    <div className="monaco-wrapper">
                        <Editor
                            height="100%"
                            language={language}
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
                </div>
            </div>
        </div>
    );
};

export default ProblemInterface;
