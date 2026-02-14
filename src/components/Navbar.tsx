import React from 'react';
import { Bell, LogOut } from 'lucide-react';
import type { User } from '../data/types';
import './Navbar.css';

interface NavbarProps {
    onNavigate: (view: 'questions' | 'landing') => void;
    onLogin: () => void;
    onLogout: () => void;
    currentView?: 'questions' | 'landing' | 'problem';
    user: User | null;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, onLogin, onLogout, currentView, user }) => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo" onClick={() => onNavigate('landing')} style={{ cursor: 'pointer' }}>
                    <div className="logo-icon">T</div>
                    <span className="logo-text">TidyBit</span>
                </div>

                <div className="navbar-links">
                    <button
                        className={`nav-link ${currentView === 'questions' ? 'active' : ''}`}
                        onClick={() => onNavigate('questions')}
                    >
                        Questions
                    </button>
                    <button className="nav-link" onClick={() => alert('Contest module coming soon!')}>Contest</button>
                    <button className="nav-link" onClick={() => alert('Learning paths coming soon!')}>Learn</button>
                    <button className="nav-link" onClick={() => alert('Discussion forum coming soon!')}>Discuss</button>
                </div>

                <div className="navbar-actions">
                    <button className="icon-btn" onClick={() => alert('No new notifications')}><Bell size={20} /></button>
                    {user ? (
                        <>
                            <div className="profile-badge" title={user.name}>
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <button
                                className="icon-btn logout-btn"
                                onClick={onLogout}
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </>
                    ) : (
                        <button className="cta-small" onClick={onLogin}>Login</button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
