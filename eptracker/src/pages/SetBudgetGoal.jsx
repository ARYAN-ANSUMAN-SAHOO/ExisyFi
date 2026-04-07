import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './dashboard.css';

const SetBudgetGoal = () => {
    const navigate = useNavigate();

    const [amount, setAmount] = useState('');
    const [duration, setDuration] = useState('Monthly');
    const [category, setCategory] = useState('Vacation');

    const [goals, setGoals] = useState([]);
    const [status, setStatus] = useState(null);
    const [editModalData, setEditModalData] = useState(null);
    const [editStatus, setEditStatus] = useState(null);
    const [contributeModalData, setContributeModalData] = useState(null);

    const fetchGoals = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5000/api/goals', {
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                setGoals(await res.json());
            } else {
                setStatus({ type: 'error', text: 'Authentication failed. Please Login.' });
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setStatus({ type: 'error', text: 'Database unreachable.' });
        }
    };

    // Initial Database Fetch on Page Load
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        fetchGoals();
    }, [navigate]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this goal?")) return;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:5000/api/goals/${id}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                setGoals(goals.filter(g => g._id !== id));
            } else {
                setStatus({ type: 'error', text: 'Failed to delete goal.' });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdate = async () => {
        const token = localStorage.getItem('token');
        setEditStatus('Updating...');
        try {
            const res = await fetch(`http://localhost:5000/api/goals/${editModalData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    targetAmount: parseFloat(editModalData.targetAmount),
                    category: editModalData.category,
                    duration: editModalData.duration
                })
            });
            if (res.ok) {
                const updated = await res.json();
                setGoals(goals.map(g => g._id === updated._id ? updated : g));
                setEditModalData(null);
                setEditStatus(null);
            } else {
                setEditStatus('Failed to update goal.');
            }
        } catch (err) {
            console.error(err);
            setEditStatus('Server error.');
        }
    };

    const handleContribute = async () => {
        if (!contributeModalData.amount || contributeModalData.amount <= 0) {
            setEditStatus('Please enter a valid amount.');
            return;
        }

        const token = localStorage.getItem('token');
        setEditStatus('Contributing...');
        try {
            const res = await fetch(`http://localhost:5000/api/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    amount: parseFloat(contributeModalData.amount),
                    category: `Savings - ${contributeModalData.goal.category}`,
                    merchant: 'Goal Contribution',
                    date: contributeModalData.date || new Date().toISOString().split('T')[0],
                    type: 'expense',
                    goalId: contributeModalData.goal._id
                })
            });
            if (res.ok) {
                await fetchGoals();
                setContributeModalData(null);
                setEditStatus(null);
            } else {
                setEditStatus('Failed to add contribution.');
            }
        } catch (err) {
            console.error(err);
            setEditStatus('Server error.');
        }
    };

    const handleSubmit = async () => {
        if (!amount || amount <= 0) {
            setStatus({ type: 'error', text: 'Please enter a valid target amount.' });
            return;
        }

        const token = localStorage.getItem('token');
        setStatus({ type: 'info', text: 'Saving budget goal to database...' });

        try {
            const payload = {
                targetAmount: parseFloat(amount),
                category,
                duration
            };

            const response = await fetch('http://localhost:5000/api/goals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const newGoal = await response.json();

                // Clear form
                setAmount('');
                setStatus({ type: 'success', text: 'Goal successfully mapped to your Profile!' });

                // Update local specific view instantly
                setGoals([newGoal, ...goals]);

                // Remove success notification after 3 seconds
                setTimeout(() => setStatus(null), 3000);
            } else {
                setStatus({ type: 'error', text: 'Failed to record goal. Check database connection.' });
            }
        } catch (error) {
            console.error(error);
            setStatus({ type: 'error', text: 'Database unreachable.' });
        }
    };

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
                        ← Back to Dashboard
                    </motion.button>
                    <h2 className="gradient-text">Budget Planner</h2>
                </header>

                <div className="full-page-layout">
                    {/* Main Goal Setting Section */}
                    <div className="full-page-main">
                        <div>
                            <h3 className="fp-section-title">Set Target</h3>
                            <form className="auth-form" style={{ gap: '0', padding: '0' }}>
                                {status && (
                                    <div style={{ padding: '10px', marginBottom: '15px', borderRadius: '4px', textAlign: 'center', backgroundColor: status.type === 'error' ? '#fee2e2' : status.type === 'success' ? '#dcfce7' : '#e0f2fe', color: status.type === 'error' ? '#991b1b' : status.type === 'success' ? '#166534' : '#075985' }}>
                                        {status.text}
                                    </div>
                                )}
                                <div className="form-group">
                                    <label>Goal Amount ($)</label>
                                    <input
                                        type="number"
                                        placeholder="Enter target savings"
                                        className="search-bar"
                                        style={{ width: '100%', color: '#1E1B4B' }}
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Duration</label>
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        {['Monthly', 'Quarterly', 'Yearly'].map(d => (
                                            <button
                                                key={d}
                                                type="button"
                                                onClick={() => setDuration(d)}
                                                className="nav-item"
                                                style={{ flex: 1, textAlign: 'center', fontSize: '14px', background: duration === d ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255,255,255,0.05)', border: duration === d ? '1px solid #7C3AED' : '1px solid rgba(255,255,255,0.1)', justifyContent: 'center' }}
                                            >
                                                {d}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Goal Category</label>
                                    <select
                                        className="search-bar"
                                        style={{ width: '100%', color: '#1E1B4B' }}
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option>Vacation</option>
                                        <option>New Car</option>
                                        <option>Emergency Fund</option>
                                        <option>House Downpayment</option>
                                        <option>Education</option>
                                    </select>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    onClick={handleSubmit}
                                    className="primary-btn"
                                    style={{ marginTop: '20px', width: '200px', padding: '16px', borderRadius: '50px' }}
                                >
                                    Add Budget Goal
                                </motion.button>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar Info Section mapped uniquely dynamically from MongoDB */}
                    <div className="full-page-sidebar">
                        {/* Dynamic DB Active Goals */}
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#1E1B4B' }}>Active Goals</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {goals.length > 0 ? goals.map((goal, index) => {
                                    // Math logic for the blue/purple fill bar UI Feature requested
                                    const fillPercentage = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);

                                    return (
                                        <div key={index} style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                                <span style={{ fontWeight: '600' }}>{goal.category}</span>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
                                                        ${goal.savedAmount ? goal.savedAmount.toLocaleString() : '0'} / ${goal.targetAmount.toLocaleString()}
                                                    </span>
                                                    <button onClick={() => setContributeModalData({ goal, amount: '', date: '' })} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }} title="Contribute Funds">💰</button>
                                                    <button onClick={() => setEditModalData(goal)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>✏️</button>
                                                    <button onClick={() => handleDelete(goal._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>🗑️</button>
                                                </div>
                                            </div>
                                            <div style={{ height: '12px', background: '#222', borderRadius: '6px', overflow: 'hidden' }}>
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${fillPercentage}%` }}
                                                    transition={{ duration: 1.5 }}
                                                    style={{ height: '100%', background: 'linear-gradient(90deg, #A78BFA, #60a5fa)' }}
                                                />
                                            </div>
                                            <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '8px', textAlign: 'right' }}>
                                                {goal.duration}
                                            </div>
                                        </div>
                                    );
                                }) : (
                                    <div style={{ color: '#555', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
                                        No active budget goals mapped to your profile yet.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tips */}
                        <div style={{ marginTop: '30px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#1E1B4B' }}>Insight</h3>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ fontSize: '24px', color: '#7C3AED' }}>💡</div>
                                <div>
                                    <h4 style={{ marginBottom: '5px', fontSize: '15px' }}>Save Smarter</h4>
                                    <p style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: '1.5' }}>
                                        Users who set monthly DB goals save 24% more on average. Start small!
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {editModalData && (
                <div onClick={() => setEditModalData(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div onClick={(e) => e.stopPropagation()} style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '400px', maxWidth: '90%' }}>
                        <h3 style={{ marginBottom: '20px', color: '#1E1B4B' }}>Edit Goal</h3>
                        {editStatus && <div style={{ color: 'red', marginBottom: '10px' }}>{editStatus}</div>}
                        <input type="number" value={editModalData.targetAmount} onChange={(e) => setEditModalData({ ...editModalData, targetAmount: e.target.value })} placeholder="Amount" className="search-bar" style={{ width: '100%', marginBottom: '15px', color: '#000' }} />
                        <select value={editModalData.duration} onChange={(e) => setEditModalData({ ...editModalData, duration: e.target.value })} className="search-bar" style={{ width: '100%', marginBottom: '15px', color: '#000' }}>
                            <option value="Monthly">Monthly</option>
                            <option value="Quarterly">Quarterly</option>
                            <option value="Yearly">Yearly</option>
                        </select>
                        <select value={editModalData.category} onChange={(e) => setEditModalData({ ...editModalData, category: e.target.value })} className="search-bar" style={{ width: '100%', marginBottom: '20px', color: '#000' }}>
                            <option>Vacation</option>
                            <option>New Car</option>
                            <option>Emergency Fund</option>
                            <option>House Downpayment</option>
                            <option>Education</option>
                        </select>

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button onClick={() => setEditModalData(null)} style={{ padding: '10px', background: '#ccc', borderRadius: '5px', cursor: 'pointer', border: 'none' }}>Cancel</button>
                            <button onClick={handleUpdate} className="primary-btn" style={{ padding: '10px 20px', borderRadius: '5px' }}>Update</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Contribute Modal */}
            {contributeModalData && (
                <div onClick={() => setContributeModalData(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div onClick={(e) => e.stopPropagation()} style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '400px', maxWidth: '90%' }}>
                        <h3 style={{ marginBottom: '20px', color: '#1E1B4B' }}>Contribute to {contributeModalData.goal.category}</h3>
                        {editStatus && <div style={{ color: 'red', marginBottom: '10px' }}>{editStatus}</div>}
                        <input type="number" value={contributeModalData.amount} onChange={(e) => setContributeModalData({ ...contributeModalData, amount: e.target.value })} placeholder="Amount to add" className="search-bar" style={{ width: '100%', marginBottom: '15px', color: '#000' }} />
                        <input type="date" value={contributeModalData.date} onChange={(e) => setContributeModalData({ ...contributeModalData, date: e.target.value })} className="search-bar" style={{ width: '100%', marginBottom: '20px', color: '#000' }} />

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button onClick={() => setContributeModalData(null)} style={{ padding: '10px', background: '#ccc', borderRadius: '5px', cursor: 'pointer', border: 'none' }}>Cancel</button>
                            <button onClick={handleContribute} className="primary-btn" style={{ padding: '10px 20px', borderRadius: '5px', background: '#22c55e', color: 'white', border: 'none' }}>Confirm Contribution</button>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default SetBudgetGoal;
