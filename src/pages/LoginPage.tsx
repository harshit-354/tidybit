import React, { useState } from 'react';
import type { User } from '../data/types';
import './LoginPage.css';

interface LoginPageProps {
    onLoginSuccess: (user: User) => void;
    onNavigateBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigateBack }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
            setError('Please fill in all fields');
            return;
        }

        const storedUsers = JSON.parse(localStorage.getItem('tidybit_users') || '[]');

        if (isLogin) {
            const user = storedUsers.find((u: User) => u.email === formData.email && u.password === formData.password);
            if (user) {
                localStorage.setItem('tidybit_current_user', JSON.stringify(user));
                onLoginSuccess(user);
            } else {
                setError('Invalid email or password');
            }
        } else {
            if (storedUsers.some((u: User) => u.email === formData.email)) {
                setError('Email already exists');
                return;
            }

            const newUser: User = { ...formData };
            const updatedUsers = [...storedUsers, newUser];
            localStorage.setItem('tidybit_users', JSON.stringify(updatedUsers));
            localStorage.setItem('tidybit_current_user', JSON.stringify(newUser));
            onLoginSuccess(newUser);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <div className="logo-icon-large">T</div>
                    <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                    <p>{isLogin ? 'Enter your details to access your account' : 'Join TidyBit to start your coding journey'}</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {!isLogin && (
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="submit-btn-full">
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            className="toggle-btn"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                                setFormData({ name: '', email: '', password: '' });
                            }}
                        >
                            {isLogin ? 'Sign Up' : 'Log In'}
                        </button>
                    </p>
                    <button className="back-link" onClick={onNavigateBack}>
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
