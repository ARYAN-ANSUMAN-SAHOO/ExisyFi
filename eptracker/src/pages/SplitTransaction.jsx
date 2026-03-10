import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './dashboard.css';

const SplitTransaction = () => {
    const navigate = useNavigate();

    return (
        <motion.div
            className="dashboard-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
                    <h2 className="gradient-text">Split Bills</h2>
                </header>

                <div className="full-page-layout">
                    {/* Main Splitter Section */}
                    <div className="full-page-main">
                        <div>
                            <h3 className="fp-section-title">Split Bill</h3>
                            <form className="auth-form" style={{ gap: '0', padding: '0' }}>
                                <div className="form-group">
                                    <label>Total Bill Amount ($)</label>
                                    <input type="number" placeholder="Enter total bill" className="search-bar" style={{ width: '100%', color: 'white' }} />
                                </div>
                                <div className="form-group">
                                    <label>Participants (Emails)</label>
                                    <textarea placeholder="friend1@example.com, friend2@example.com" className="search-bar" style={{ width: '100%', height: '100px', color: 'white', resize: 'none' }} />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
                                    <input type="checkbox" id="user-share" style={{ width: '18px', height: '18px', accentColor: '#a855f7' }} />
                                    <label htmlFor="user-share" style={{ fontSize: '15px', color: '#ccc', margin: 0, cursor: 'pointer' }}>Include my share</label>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    className="primary-btn"
                                    style={{ width: '200px', padding: '16px', borderRadius: '50px' }}
                                >
                                    Generate Split
                                </motion.button>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar Summary Section */}
                    <div className="full-page-sidebar">
                        {/* Summary */}
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#fff' }}>Summary</h3>
                            <div className="fp-stat-item">
                                <div className="fp-stat-label">Individual Share</div>
                                <div className="fp-stat-value" style={{ color: '#3b82f6' }}>$0.00</div>
                                <p style={{ fontSize: '12px', color: '#555', marginTop: '5px' }}>Updates automatically</p>
                            </div>
                        </div>

                        {/* Status Tracker */}
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#fff' }}>Pending</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
                                    <span style={{ color: '#ccc' }}>Dinner at Joey's</span>
                                    <span style={{ color: '#a855f7', fontWeight: 'bold' }}>$45 pending</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
                                    <span style={{ color: '#ccc' }}>Taxi fare</span>
                                    <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>Settled</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default SplitTransaction;
