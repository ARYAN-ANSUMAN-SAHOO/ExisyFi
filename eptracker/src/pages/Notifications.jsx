import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './dashboard.css';

const Notifications = () => {
    const navigate = useNavigate();
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [pushAlerts, setPushAlerts] = useState(false);


    // Initial Multi-Database Fetch on Page Load
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchAllData = async () => {
            try {
                // Execute a robust Promise.all to fetch the entire database architecture securely simultaneously
                const [txRes, goalsRes, splitsRes] = await Promise.all([
                    fetch('http://localhost:5000/api/transactions', { headers: { 'x-auth-token': token } }),
                    fetch('http://localhost:5000/api/goals', { headers: { 'x-auth-token': token } }),
                    fetch('http://localhost:5000/api/splits', { headers: { 'x-auth-token': token } })
                ]);

                if (txRes.ok && goalsRes.ok && splitsRes.ok) {
                    const transactions = await txRes.json();
                    const goals = await goalsRes.json();
                    const splits = await splitsRes.json();

                    aggregateNotifications(transactions, goals, splits);
                } else {
                    console.error('Failed to authenticate fetching channels.');
                }
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();

        // Mark as seen immediately on mount
        localStorage.setItem('lastNotificationSeen', new Date().toISOString());
        // Use a window event to notify other tabs (like DashboardPage) if needed, 
        // though simpler to just re-check localStorage on Dashboard mount.
    }, [navigate]);


    // Algorithmic core logic combining disparate MongoDB schemas natively
    const aggregateNotifications = (transactions, goals, splits) => {
        const rawAlerts = [];

        // 1. Transactions Parsing
        transactions.forEach(t => {
            if (t.type === 'expense') {
                if (t.amount >= 500) {
                    rawAlerts.push({ title: 'High Expense Trigger', msg: `Large transaction recorded: $${t.amount} at ${t.merchant || 'Unknown'}`, time: t.date, type: 'warn' });
                } else {
                    rawAlerts.push({ title: 'Expense Logged', msg: `Transaction: $${t.amount} at ${t.merchant || 'Unknown'}`, time: t.date, type: 'success' });
                }
            } else if (t.type === 'income') {
                rawAlerts.push({ title: 'Income Logged', msg: `Incoming: $${t.amount} recorded.`, time: t.date, type: 'success' });
            }
        });

        // 2. Budget Goals tracking logic checking Target vs Saved Amount percentages
        goals.forEach(g => {
            const percentage = (g.savedAmount / g.targetAmount) * 100;
            if (percentage >= 100) {
                rawAlerts.push({ title: 'Goal Completed! 🎉', msg: `You hit your ${g.category} target of $${g.targetAmount.toLocaleString()}!`, time: g.createdAt, type: 'success' });
            } else if (percentage >= 80) {
                rawAlerts.push({ title: 'Goal Nearing Completion', msg: `Great job! You are ${percentage.toFixed(0)}% towards your ${g.category} target!`, time: g.createdAt, type: 'warn' });
            } else {
                rawAlerts.push({ title: 'Goal Started', msg: `You initiated a ${g.category} target of $${g.targetAmount.toLocaleString()}. Keep pushing!`, time: g.createdAt, type: 'info' });
            }
        });

        // 3. Pending Bills (Splits) mapping uniquely finding unpaid debts!
        splits.forEach(s => {
            if (s.status === 'pending') {
                rawAlerts.push({ title: 'Pending Bill', msg: `Reminder: You owe $${s.pendingAmount.toFixed(2)} for ${s.description}`, time: s.createdAt, type: 'warn' });
            } else if (s.status === 'settled') {
                rawAlerts.push({ title: 'Bill Settled', msg: `You permanently cleared: ${s.description}.`, time: s.createdAt, type: 'success' });
            }
        });

        // Mathematical sorting descending to push newest items to the top!
        rawAlerts.sort((a, b) => new Date(b.time) - new Date(a.time));
        setAlerts(rawAlerts);
    };

    // Logical formatter parsing timestamps intelligently 
    const timeSince = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m ago";
        return "Just now";
    };

    // Sub-component for the interactive toggle
    const ToggleSwitch = ({ isOn, onToggle }) => (
        <div
            onClick={onToggle}
            style={{
                width: '36px',
                height: '18px',
                background: isOn ? '#7C3AED' : '#E9E5F5',
                borderRadius: '10px',
                padding: '2px',
                cursor: 'pointer',
                display: 'flex',
                transition: 'background 0.3s ease'
            }}
        >
            <motion.div
                animate={{ x: isOn ? 18 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{
                    width: '14px',
                    height: '14px',
                    background: '#FFFFFF',
                    borderRadius: '50%',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
            />
        </div>
    );

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
                        ← Back to Dashboard
                    </motion.button>
                    <h2 className="gradient-text">Activity Feed</h2>
                </header>

                <div className="bento-grid">
                    {/* Alerts List fetched dynamically natively utilizing Data from Multi-MongoDB schemas! */}
                    <motion.div
                        className="bento-item glass-card-sleek"
                        style={{ gridColumn: "span 8", gridRow: "span 5" }}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                    >
                        <div className="card-header">
                            <h3 className="card-title">Database Verified Alerts</h3>
                            <span style={{ fontSize: '12px', color: '#7C3AED' }}>Live Sync</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px', maxHeight: '500px', overflowY: 'auto', paddingRight: '10px' }}>
                            {loading ? (
                                <div style={{ color: '#9CA3AF', padding: '20px', textAlign: 'center' }}>Aggregating MongoDB Systems...</div>
                            ) : alerts.length > 0 ? alerts.map((n, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ x: 5, background: 'rgba(255,255,255,0.05)' }}
                                    style={{ padding: '15px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', display: 'flex', gap: '15px', alignItems: 'flex-start' }}
                                >
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: n.type === 'warn' ? '#ef4444' : n.type === 'success' ? '#22c55e' : '#A78BFA', marginTop: '6px' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '600', fontSize: '15px', color: '#1E1B4B' }}>{n.title}</div>
                                        <div style={{ color: '#6B7280', fontSize: '13px', marginTop: '4px' }}>{n.msg}</div>
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#9CA3AF', whiteSpace: 'nowrap' }}>{timeSince(n.time)}</div>
                                </motion.div>
                            )) : (
                                <div style={{ color: '#555', padding: '20px', textAlign: 'center' }}>No active notifications found securely synced from your databases.</div>
                            )}
                        </div>
                    </motion.div>

                    {/* Settings Quick Access */}
                    <motion.div
                        className="bento-item glass-card-sleek"
                        style={{ gridColumn: "span 4", gridRow: "span 2", padding: '20px' }}
                    >
                        <h3 className="card-title" style={{ marginBottom: '15px' }}>Alert Settings</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '14px', color: '#6B7280' }}>Email Summaries</span>
                                <ToggleSwitch isOn={emailAlerts} onToggle={() => setEmailAlerts(!emailAlerts)} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '14px', color: '#6B7280' }}>Push Notifications</span>
                                <ToggleSwitch isOn={pushAlerts} onToggle={() => setPushAlerts(!pushAlerts)} />
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
                        <p style={{ fontSize: '12px', color: '#555', marginTop: '10px' }}>Your Activity Feed automatically aggregates live database splits, expenses, and budgetary goals into a unified engine.</p>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default Notifications;
