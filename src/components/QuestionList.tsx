import React from 'react';
import { mockQuestions } from '../data/questions';
import { CheckCircle, Circle, Search, Filter } from 'lucide-react';
import './QuestionList.css';

interface QuestionListProps {
    onSelectQuestion: (id: string) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({ onSelectQuestion }) => {
    return (
        <div className="question-list-container">
            <div className="list-header">
                <h2>Problem Set</h2>
                <div className="filters">
                    <div className="search-bar">
                        <Search size={18} />
                        <input type="text" placeholder="Search questions..." />
                    </div>
                    <button className="filter-btn"><Filter size={18} /> Filter</button>
                </div>
            </div>

            <div className="table-container">
                <table className="question-table">
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Difficulty</th>
                            <th>Acceptance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockQuestions.map((q) => (
                            <tr key={q.id} onClick={() => onSelectQuestion(q.id)} className="question-row">
                                <td className="status-cell">
                                    {q.id === '1' ? <CheckCircle className="solved" size={18} /> : <Circle className="unsolved" size={18} />}
                                </td>
                                <td className="title-cell">{q.title}</td>
                                <td className="category-cell">{q.category}</td>
                                <td className={`difficulty-cell ${q.difficulty.toLowerCase()}`}>
                                    {q.difficulty}
                                </td>
                                <td className="acceptance-cell">{q.acceptanceRate}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default QuestionList;
