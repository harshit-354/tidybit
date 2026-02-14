import React from 'react';
import { ChevronRight, Code, Brain, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import './LandingPage.css';

interface LandingPageProps {
    onStartSolving: () => void;
    onExploreQuestions: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartSolving, onExploreQuestions }) => {
    return (
        <div className="landing-page">
            <section className="hero-section">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hero-content"
                >
                    <div className="badge">New: Interview Prep 2026</div>
                    <h1 className="hero-title">
                        Master the Art of <br />
                        <span className="gradient-text">Efficient Coding</span>
                    </h1>
                    <p className="hero-subtitle">
                        TidyBit is the ultimate platform for sharpening your DSA skills.
                        Solve, learn, and grow with a premium coding experience.
                    </p>
                    <div className="hero-cta">
                        <button className="cta-primary" onClick={onStartSolving}>
                            Get Started <ChevronRight size={18} />
                        </button>
                        <button className="cta-secondary" onClick={onExploreQuestions}>Explore Questions</button>
                    </div>
                </motion.div>

                <div className="hero-background">
                    <div className="blob blob-1"></div>
                    <div className="blob blob-2"></div>
                </div>
            </section>

            <section className="features-grid">
                <div className="feature-card">
                    <div className="feature-icon"><Code /></div>
                    <h3>Advanced Editor</h3>
                    <p>Full-featured Monaco editor with multi-language support and autocomplete.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon"><Brain /></div>
                    <h3>Curated DSA</h3>
                    <p>Carefully selected questions ranging from basic to advanced competitive levels.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon"><Trophy /></div>
                    <h3>Skill Tracking</h3>
                    <p>Monitor your progress and visualize your growth across different topics.</p>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
