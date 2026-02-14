import React, { useState } from 'react';
import { mockQuestions } from '../data/questions';
import { CheckCircle, Circle, Search, Filter } from 'lucide-react';
import './QuestionList.css';

interface QuestionListProps {
    onSelectQuestion: (id: string) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({ onSelectQuestion }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredQuestions = mockQuestions.filter(q =>
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleFilterClick = () => {
        alert('Filtering options (Difficulty, Category, Status) will be available in the next update!');
    };

    return (
        <div className="question-list-container">
            <div className="list-header">
                <h2>Problem Set</h2>
                <div className="filters">
                    <div className="search-bar">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search questions or categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="filter-btn" onClick={handleFilterClick}>
                        <Filter size={18} /> Filter
                    </button>
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
                        {filteredQuestions.length > 0 ? (
                            filteredQuestions.map((q) => (
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
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="no-results">No questions found matching "{searchTerm}"</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default QuestionList;
