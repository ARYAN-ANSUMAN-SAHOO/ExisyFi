import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './dashboard.css';

const SetBudgetGoal = () => {
    const navigate = useNavigate();

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
    };

    return (
        <motion.div
            className="dashboard-container"
            initial="hidden"
            animate="visible"
        >
            <div className="main-content" style={{ marginLeft: 0, width: '100%' }}>
                <header className="top-bar">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => navigate('/dashboard')}
                        className="primary-btn"
                        style={{ padding: '8px 16px' }}
                    >
                        ← Back
                    </motion.button>
                    <h2 className="gradient-text">Budget Planner</h2>
                </header>

                <div className="full-page-layout">
                    {/* Main Goal Setting Section */}
                    <div className="full-page-main">
                        <div>
                            <h3 className="fp-section-title">Set Target</h3>
                            <form className="auth-form" style={{ gap: '0', padding: '0' }}>
                                <div className="form-group">
                                    <label>Goal Amount ($)</label>
                                    <input type="number" placeholder="Enter target savings" className="search-bar" style={{ width: '100%', color: 'white' }} />
                                </div>
                                <div className="form-group">
                                    <label>Duration</label>
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        {['Monthly', 'Quarterly', 'Yearly'].map(d => (
                                            <button key={d} type="button" className="nav-item" style={{ flex: 1, textAlign: 'center', fontSize: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', justifyContent: 'center' }}>{d}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Goal Category</label>
                                    <select className="search-bar" style={{ width: '100%', color: 'white' }}>
                                        <option>Vacation</option>
                                        <option>New Car</option>
                                        <option>Emergency Fund</option>
                                    </select>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    className="primary-btn"
                                    style={{ marginTop: '20px', width: '200px', padding: '16px', borderRadius: '50px' }}
                                >
                                    Set Budget Goal
                                </motion.button>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar Info Section */}
                    <div className="full-page-sidebar">
                        {/* Active Goals */}
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#fff' }}>Active Goals</h3>
                            <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <span style={{ fontWeight: '600' }}>Emergency Fund</span>
                                    <span style={{ fontSize: '12px', color: '#888' }}>$4,200 / $5,000</span>
                                </div>
                                <div style={{ height: '12px', background: '#222', borderRadius: '6px', overflow: 'hidden' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '84%' }}
                                        transition={{ duration: 1.5 }}
                                        style={{ height: '100%', background: 'linear-gradient(90deg, #3b82f6, #60a5fa)' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Tips */}
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#fff' }}>Insight</h3>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ fontSize: '24px', color: '#a855f7' }}>💡</div>
                                <div>
                                    <h4 style={{ marginBottom: '5px', fontSize: '15px' }}>Save Smarter</h4>
                                    <p style={{ fontSize: '13px', color: '#888', lineHeight: '1.5' }}>
                                        Users who set monthly goals save 24% more on average. Start small!
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Est Time */}
                        <div className="fp-stat-item">
                            <div className="fp-stat-label">Estimated Time</div>
                            <div className="fp-stat-value">2 Months</div>
                            <p style={{ fontSize: '12px', color: '#555', marginTop: '5px' }}>Based on current rate</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default SetBudgetGoal;
