import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './dashboard.css';

const CategorizeIncome = () => {
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
                    <h2 className="gradient-text">Income Streams</h2>
                </header>

                <div className="bento-grid">
                    {/* Entry Form */}
                    <motion.div
                        className="bento-item glass-card-sleek"
                        style={{ gridColumn: "span 6", gridRow: "span 4" }}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                    >
                        <div className="card-header">
                            <h3 className="card-title">Add Income</h3>
                        </div>
                        <form className="auth-form" style={{ gap: '20px' }}>
                            <div className="form-group">
                                <label style={{ color: '#888', marginBottom: '8px', display: 'block' }}>Source</label>
                                <input type="text" placeholder="e.g. Monthly Salary" className="search-bar" style={{ width: '100%', color: 'white' }} />
                            </div>
                            <div className="form-group">
                                <label style={{ color: '#888', marginBottom: '8px', display: 'block' }}>Amount ($)</label>
                                <input type="number" placeholder="5000.00" className="search-bar" style={{ width: '100%', color: 'white' }} />
                            </div>
                            <div className="form-group">
                                <label style={{ color: '#888', marginBottom: '8px', display: 'block' }}>Payment Type</label>
                                <select className="search-bar" style={{ width: '100%', color: 'white', background: '#111' }}>
                                    <option>Direct Deposit</option>
                                    <option>Cash</option>
                                    <option>Bank Transfer</option>
                                </select>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                className="primary-btn"
                            >
                                Register Income
                            </motion.button>
                        </form>
                    </motion.div>

                    {/* Breakdown Card */}
                    <motion.div
                        className="bento-item"
                        style={{ gridColumn: "span 6", gridRow: "span 2" }}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                    >
                        <div className="card-header">
                            <h3 className="card-title">Monthly Breakdown</h3>
                        </div>
                        <div style={{ marginTop: '15px' }}>
                            <div style={{ display: 'flex', gap: '5px', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                                <div style={{ flex: 7, background: '#3b82f6' }} />
                                <div style={{ flex: 2, background: '#a855f7' }} />
                                <div style={{ flex: 1, background: '#555' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '15px', marginTop: '15px', fontSize: '11px', color: '#888' }}>
                                <span>● Salary (70%)</span>
                                <span>● Freelance (20%)</span>
                                <span>● Gifts (10%)</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Total Income Display */}
                    <motion.div
                        className="bento-item"
                        style={{ gridColumn: "span 3", gridRow: "span 2", background: 'rgba(59, 130, 246, 0.05)', borderColor: 'rgba(59, 130, 246, 0.2)' }}
                    >
                        <h4 style={{ color: '#888', fontSize: '12px' }}>GROSS INCOME</h4>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#3b82f6', marginTop: '10px' }}>$7,200</div>
                        <p style={{ fontSize: '10px', color: '#555', marginTop: '5px' }}>Updated 2 mins ago</p>
                    </motion.div>

                    <motion.div
                        className="bento-item"
                        style={{ gridColumn: "span 3", gridRow: "span 2" }}
                    >
                        <h4 style={{ color: '#888', fontSize: '12px' }}>NEXT PAYDAY</h4>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '10px' }}>Feb 28</div>
                        <p style={{ fontSize: '10px', color: '#555', marginTop: '5px' }}>25 days remaining</p>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default CategorizeIncome;
