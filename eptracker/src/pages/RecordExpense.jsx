import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TransactionContext } from '../context/TransactionContext';
import './dashboard.css';

const RecordExpense = () => {
    const navigate = useNavigate();
    const { addTransaction, transactions } = useContext(TransactionContext);

    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Food');
    const [merchant, setMerchant] = useState('');
    const [date, setDate] = useState('');

    const handleSubmit = () => {
        if (!amount || !merchant || !date) return;

        addTransaction({
            amount: parseFloat(amount),
            category,
            merchant,
            date,
            type: 'expense'
        });

        // Reset form or navigate back
        setAmount('');
        setMerchant('');
        setDate('');

        // Optional: Show success feedback or navigate
        // navigate('/dashboard'); 
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

    // Calculate daily limit usage for demo purposes
    const totalToday = transactions
        .filter(t => t.date === new Date().toISOString().split('T')[0])
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
                        ← Back
                    </motion.button>
                    <h2 className="gradient-text">Record Expense</h2>
                </header>

                <div className="full-page-layout">
                    {/* Main Form Section */}
                    <div className="full-page-main">
                        <div>
                            <h3 className="fp-section-title">New Transaction</h3>
                            <form className="auth-form" style={{ gap: '0', padding: '0' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '25px' }}>
                                    <div className="form-group">
                                        <label>Amount ($)</label>
                                        <motion.input
                                            variants={inputVariants}
                                            whileFocus="focus"
                                            type="number"
                                            placeholder="0.00"
                                            className="search-bar"
                                            style={{ width: '100%', color: 'white' }}
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Category</label>
                                        <motion.select
                                            variants={inputVariants}
                                            whileFocus="focus"
                                            className="search-bar"
                                            style={{ width: '100%', color: 'white' }}
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                        >
                                            <option>Food</option>
                                            <option>Transport</option>
                                            <option>Shopping</option>
                                            <option>Bills</option>
                                            <option>Entertainment</option>
                                        </motion.select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Merchant</label>
                                    <motion.input
                                        variants={inputVariants}
                                        whileFocus="focus"
                                        type="text"
                                        placeholder="Where did you spend?"
                                        className="search-bar"
                                        style={{ width: '100%', color: 'white' }}
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
                                        style={{ width: '100%', color: 'white' }}
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
                                    style={{ marginTop: '30px', width: '200px', padding: '16px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold' }}
                                >
                                    Save Expense
                                </motion.button>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar Stats Section */}
                    <div className="full-page-sidebar">
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#fff' }}>Quick Stats</h3>

                            <div className="fp-stat-item">
                                <div className="fp-stat-label">Daily Usage</div>
                                <div className="fp-stat-value" style={{ color: '#3b82f6' }}>${totalToday.toFixed(2)}</div>
                                <div style={{ height: '6px', background: '#222', borderRadius: '3px', overflow: 'hidden', marginTop: '10px' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${usagePercent}%` }}
                                        transition={{ duration: 1 }}
                                        style={{ height: '100%', background: '#a855f7' }}
                                    />
                                </div>
                                <p style={{ fontSize: '12px', color: '#555', marginTop: '8px' }}>{usagePercent.toFixed(0)}% of daily limit ($50)</p>
                            </div>
                        </div>

                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#fff' }}>Recent</h3>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {transactions.slice(0, 3).map((item, i) => (
                                    <div key={i} className="fp-recent-item">
                                        <div>
                                            <div style={{ fontSize: '15px', fontWeight: '500' }}>{item.merchant}</div>
                                            <div style={{ fontSize: '12px', color: '#555' }}>{item.category}</div>
                                        </div>
                                        <div style={{ color: '#ef4444', fontWeight: 'bold' }}>-${item.amount.toFixed(2)}</div>
                                    </div>
                                ))}
                                {transactions.length === 0 && (
                                    <p style={{ color: '#555', fontSize: '13px' }}>No transactions yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default RecordExpense;
