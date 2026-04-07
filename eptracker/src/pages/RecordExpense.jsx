import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCurrency } from '../context/CurrencyContext';
import './dashboard.css';

const RecordExpense = () => {
    const navigate = useNavigate();

    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Food');
    const [merchant, setMerchant] = useState('');
    const [date, setDate] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [goals, setGoals] = useState([]);
    const [transactionType, setTransactionType] = useState('expense'); // 'expense' or 'savings'
    const [selectedGoalId, setSelectedGoalId] = useState('');
    const [status, setStatus] = useState(null);
    const [editModalData, setEditModalData] = useState(null);
    const [editStatus, setEditStatus] = useState(null);

    const { symbol: currSymbol, formatAmount, convertNumber } = useCurrency();

    // Initial Database Fetch on Page Load
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchHistory = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/transactions', {
                    headers: { 'x-auth-token': token }
                });
                if (res.ok) {
                    setTransactions(await res.json());
                } else {
                    setStatus({ type: 'error', text: 'Authentication failed. Please Login.' });
                }
            } catch (err) {
                console.error('Fetch error:', err);
                setStatus({ type: 'error', text: 'Database unreachable.' });
            }
        };

        const fetchGoals = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/goals', {
                    headers: { 'x-auth-token': token }
                });
                if (res.ok) {
                    const fetchedGoals = await res.json();
                    setGoals(fetchedGoals);
                    if (fetchedGoals.length > 0) {
                        setSelectedGoalId(fetchedGoals[0]._id);
                    }
                }
            } catch (err) {
                console.error('Fetch goals error:', err);
            }
        };

        fetchHistory();
        fetchGoals();
    }, [navigate]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this expense?")) return;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:5000/api/transactions/${id}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                setTransactions(transactions.filter(t => t._id !== id));
            } else {
                setStatus({ type: 'error', text: 'Failed to delete expense.' });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdate = async () => {
        const token = localStorage.getItem('token');
        setEditStatus('Updating...');
        try {
            const res = await fetch(`http://localhost:5000/api/transactions/${editModalData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    amount: parseFloat(editModalData.amount),
                    category: editModalData.category,
                    merchant: editModalData.merchant,
                    date: editModalData.date,
                    type: editModalData.type || 'expense'
                })
            });
            if (res.ok) {
                const updated = await res.json();
                setTransactions(transactions.map(t => t._id === updated._id ? updated : t));
                setEditModalData(null);
                setEditStatus(null);
            } else {
                setEditStatus('Failed to update expense.');
            }
        } catch (err) {
            console.error(err);
            setEditStatus('Server error.');
        }
    };

    const handleSubmit = async () => {
        if (!amount || !merchant || !date) {
            setStatus({ type: 'error', text: 'Amount, Merchant, and Date are required!' });
            return;
        }

        if (transactionType === 'savings' && !selectedGoalId) {
            setStatus({ type: 'error', text: 'Please select a savings goal!' });
            return;
        }

        const token = localStorage.getItem('token');
        setStatus({ type: 'info', text: 'Saving to database...' });

        try {
            const selectedGoal = goals.find(g => g._id === selectedGoalId);
            const payload = {
                amount: parseFloat(amount),
                category: transactionType === 'savings' ? `Savings - ${selectedGoal.category}` : category,
                merchant,
                date,
                type: 'expense', // Both are outflows from main balance
                goalId: transactionType === 'savings' ? selectedGoalId : undefined
            };

            const response = await fetch('http://localhost:5000/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const newTransaction = await response.json();

                // Clear form
                setAmount('');
                setMerchant('');
                setDate('');
                setStatus({ type: 'success', text: transactionType === 'savings' ? 'Savings contribution recorded!' : 'Expense permanently saved to database!' });

                // Update specific local view instantly
                setTransactions([newTransaction, ...transactions]);

                // Remove success notification after 3 seconds
                setTimeout(() => setStatus(null), 3000);
            } else {
                setStatus({ type: 'error', text: 'Failed to record transaction. Check your inputs.' });
            }
        } catch (error) {
            console.error(error);
            setStatus({ type: 'error', text: 'Database unreachable.' });
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
        }
    };

    const inputVariants = {
        focus: { scale: 1.02, transition: { duration: 0.2 } }
    };

    // Dynamically calculate from the MongoDB fetched arrays
    const totalToday = transactions
        .filter(t => t.type === 'expense' && t.date && t.date.split('T')[0] === new Date().toISOString().split('T')[0])
        .reduce((sum, t) => sum + t.amount, 0);

    const dailyLimit = 50;
    const usagePercent = Math.min((totalToday / dailyLimit) * 100, 100);

    return (
        <motion.div
            className="dashboard-container"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="main-content" style={{ marginLeft: 0, width: '100%' }}>
                <header className="top-bar">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/dashboard')}
                        className="primary-btn"
                        style={{ padding: '8px 16px' }}
                    >
                        ← Back to Dashboard
                    </motion.button>
                    <h2 className="gradient-text">Record Expense</h2>
                </header>

                <div className="full-page-layout">
                    {/* Main Form Section */}
                    <div className="full-page-main">
                        <div>
                            <h3 className="fp-section-title">New  Transaction</h3>
                            <form className="auth-form" style={{ gap: '0', padding: '0' }}>
                                {status && (
                                    <div style={{ padding: '10px', marginBottom: '15px', borderRadius: '4px', textAlign: 'center', backgroundColor: status.type === 'error' ? '#fee2e2' : status.type === 'success' ? '#dcfce7' : '#e0f2fe', color: status.type === 'error' ? '#991b1b' : status.type === 'success' ? '#166534' : '#075985' }}>
                                        {status.text}
                                    </div>
                                )}
                                <div className="segmented-control" style={{ position: 'relative' }}>
                                    <button
                                        type="button"
                                        className={`segmented-btn ${transactionType === 'expense' ? 'active' : ''}`}
                                        onClick={() => setTransactionType('expense')}
                                        style={{ position: 'relative', zIndex: 1 }}
                                    >
                                        Expense
                                        {transactionType === 'expense' && (
                                            <motion.div
                                                layoutId="segmented-pill"
                                                className="segmented-pill"
                                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        className={`segmented-btn ${transactionType === 'savings' ? 'active' : ''}`}
                                        onClick={() => setTransactionType('savings')}
                                        style={{ position: 'relative', zIndex: 1 }}
                                    >
                                        Savings Contribution
                                        {transactionType === 'savings' && (
                                            <motion.div
                                                layoutId="segmented-pill"
                                                className="segmented-pill"
                                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                    </button>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '25px' }}>
                                    <div className="form-group">
                                        <label>Amount ({currSymbol})</label>
                                        <motion.input
                                            variants={inputVariants}
                                            whileFocus="focus"
                                            type="number"
                                            placeholder="0.00"
                                            className="search-bar"
                                            style={{ width: '100%', color: '#1E1B4B' }}
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{transactionType === 'savings' ? 'Select Goal' : 'Category'}</label>
                                        {transactionType === 'savings' ? (
                                            <motion.select
                                                variants={inputVariants}
                                                whileFocus="focus"
                                                className="search-bar"
                                                style={{ width: '100%', color: '#1E1B4B' }}
                                                value={selectedGoalId}
                                                onChange={(e) => setSelectedGoalId(e.target.value)}
                                            >
                                                {goals.length > 0 ? goals.map(g => (
                                                    <option key={g._id} value={g._id}>{g.category} (Target: {currSymbol}{formatAmount(g.targetAmount)})</option>
                                                )) : (
                                                    <option value="">No goals found</option>
                                                )}
                                            </motion.select>
                                        ) : (
                                            <motion.select
                                                variants={inputVariants}
                                                whileFocus="focus"
                                                className="search-bar"
                                                style={{ width: '100%', color: '#1E1B4B' }}
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                            >
                                                <option>Food</option>
                                                <option>Transport</option>
                                                <option>Shopping</option>
                                                <option>Bills</option>
                                                <option>Entertainment</option>
                                            </motion.select>
                                        )}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Merchant (Description)</label>
                                    <motion.input
                                        variants={inputVariants}
                                        whileFocus="focus"
                                        type="text"
                                        placeholder="Where did you spend?"
                                        className="search-bar"
                                        style={{ width: '100%', color: '#1E1B4B' }}
                                        value={merchant}
                                        onChange={(e) => setMerchant(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Date</label>
                                    <motion.input
                                        variants={inputVariants}
                                        whileFocus="focus"
                                        type="date"
                                        className="search-bar"
                                        style={{ width: '100%', color: '#1E1B4B' }}
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                    />
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(168, 85, 247, 0.5)" }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    onClick={handleSubmit}
                                    className="primary-btn"
                                    style={{ marginTop: '30px', width: '100%', padding: '16px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold' }}
                                >
                                    {transactionType === 'savings' ? 'Record Contribution' : 'Add Expense'}
                                </motion.button>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar Stats Section completely verified via DB fetches */}
                    <div className="full-page-sidebar">
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#1E1B4B' }}>Profile Active Limits</h3>

                            <div className="fp-stat-item">
                                <div className="fp-stat-label">Verified Daily Usage</div>
                                <div className="fp-stat-value" style={{ color: '#A78BFA' }}>{currSymbol}{formatAmount(totalToday)}</div>
                                <div style={{ height: '6px', background: '#222', borderRadius: '3px', overflow: 'hidden', marginTop: '10px' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${usagePercent}%` }}
                                        transition={{ duration: 1 }}
                                        style={{ height: '100%', background: '#7C3AED' }}
                                    />
                                </div>
                                <p style={{ fontSize: '12px', color: '#555', marginTop: '8px' }}>{usagePercent.toFixed(0)}% of daily limit ({currSymbol}{formatAmount(50)})</p>
                            </div>
                        </div>

                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#1E1B4B' }}>Recent Expenses</h3>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {transactions.filter(t => t.type === 'expense').slice(0, 3).map((item, i) => (
                                    <div key={i} className="fp-recent-item" style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #E9E5F5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontSize: '15px', fontWeight: '500', color: '#1E1B4B' }}>{item.merchant || item.description || 'Unknown'}</div>
                                            <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{item.category} • {item.date && item.date.split('T')[0]}</div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '16px' }}>-{currSymbol}{formatAmount(item.amount)}</div>
                                            <button onClick={() => setEditModalData({ ...item, date: item.date ? item.date.split('T')[0] : '' })} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>✏️</button>
                                            <button onClick={() => handleDelete(item._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>🗑️</button>
                                        </div>
                                    </div>
                                ))}
                                {transactions.filter(t => t.type === 'expense').length === 0 && (
                                    <p style={{ color: '#555', fontSize: '13px' }}>Your database has no expenses yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {editModalData && (
                <div onClick={() => setEditModalData(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div onClick={(e) => e.stopPropagation()} style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '400px', maxWidth: '90%' }}>
                        <h3 style={{ marginBottom: '20px', color: '#1E1B4B' }}>Edit Expense</h3>
                        {editStatus && <div style={{ color: 'red', marginBottom: '10px' }}>{editStatus}</div>}
                        <input type="number" value={editModalData.amount} onChange={(e) => setEditModalData({ ...editModalData, amount: e.target.value })} placeholder="Amount" className="search-bar" style={{ width: '100%', marginBottom: '15px', color: '#000' }} />
                        <input type="text" value={editModalData.merchant} onChange={(e) => setEditModalData({ ...editModalData, merchant: e.target.value })} placeholder="Merchant" className="search-bar" style={{ width: '100%', marginBottom: '15px', color: '#000' }} />
                        <select value={editModalData.category} onChange={(e) => setEditModalData({ ...editModalData, category: e.target.value })} className="search-bar" style={{ width: '100%', marginBottom: '15px', color: '#000' }}>
                            <option>Food</option>
                            <option>Transport</option>
                            <option>Shopping</option>
                            <option>Bills</option>
                            <option>Entertainment</option>
                        </select>
                        <input type="date" value={editModalData.date} onChange={(e) => setEditModalData({ ...editModalData, date: e.target.value })} className="search-bar" style={{ width: '100%', marginBottom: '20px', color: '#000' }} />

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button onClick={() => setEditModalData(null)} style={{ padding: '10px', background: '#ccc', borderRadius: '5px', cursor: 'pointer', border: 'none' }}>Cancel</button>
                            <button onClick={handleUpdate} className="primary-btn" style={{ padding: '10px 20px', borderRadius: '5px' }}>Update</button>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default RecordExpense;
