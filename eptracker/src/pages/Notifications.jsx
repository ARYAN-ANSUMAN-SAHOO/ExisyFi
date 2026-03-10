import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './dashboard.css';

const Notifications = () => {
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
                    <h2 className="gradient-text">Activity Feed</h2>
                </header>

                <div className="bento-grid">
                    {/* Alerts List */}
                    <motion.div
                        className="bento-item glass-card-sleek"
                        style={{ gridColumn: "span 8", gridRow: "span 5" }}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                    >
                        <div className="card-header">
                            <h3 className="card-title">Recent Alerts</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px' }}>
                            {[
                                { title: 'Budget Alert', msg: 'You have spent 80% of your Rent budget.', time: '2h ago', type: 'warn' },
                                { title: 'Subscription', msg: 'Netflix is due tomorrow.', time: '5h ago', type: 'info' },
                                { title: 'New Log', msg: 'Manual expense added: $12.50', time: '1d ago', type: 'success' },
                                { title: 'System', msg: 'Weekly report is now available.', time: '2d ago', type: 'info' }
                            ].map((n, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ x: 5, background: 'rgba(255,255,255,0.05)' }}
                                    style={{ padding: '15px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', display: 'flex', gap: '15px', alignItems: 'center' }}
                                >
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: n.type === 'warn' ? '#a855f7' : n.type === 'success' ? '#3b82f6' : '#555' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '600', fontSize: '15px' }}>{n.title}</div>
                                        <div style={{ color: '#888', fontSize: '13px' }}>{n.msg}</div>
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#444' }}>{n.time}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Settings Quick Access */}
                    <motion.div
                        className="bento-item"
                        style={{ gridColumn: "span 4", gridRow: "span 2" }}
                    >
                        <h3 className="card-title">Alert Settings</h3>
                        <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '13px', color: '#ccc' }}>Email Alerts</span>
                                <div style={{ width: '30px', height: '16px', background: '#3b82f6', borderRadius: '8px' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '13px', color: '#ccc' }}>Push Notifications</span>
                                <div style={{ width: '30px', height: '16px', background: '#333', borderRadius: '8px' }} />
                            </div>
                        </div>
                    </motion.div>

                    {/* Summary Tile */}
                    <motion.div
                        className="bento-item"
                        style={{ gridColumn: "span 4", gridRow: "span 3", justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
                    >
                        <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔔</div>
                        <h3>Stay Notified</h3>
                        <p style={{ fontSize: '12px', color: '#555', marginTop: '10px' }}>Never miss a payment or a budget threshold again.</p>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default Notifications;
