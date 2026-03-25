import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './dashboard.css';

const CategorizeIncome = () => {
    const navigate = useNavigate();

    const [source, setSource] = useState('');
    const [amount, setAmount] = useState('');
    const [paymentType, setPaymentType] = useState('Direct Deposit');
    const [incomes, setIncomes] = useState([]);
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initial database fetch extracting ONLY incomes
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchIncomes(token);
    }, [navigate]);

    const fetchIncomes = async (token) => {
        try {
            const res = await fetch('http://localhost:5000/api/transactions', {
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                const data = await res.json();
                // Strictly tracking Income inputs mapped to the global User Auth Table
                setIncomes(data.filter(t => t.type === 'income'));
            } else {
                setStatus({ type: 'error', text: 'Authentication failed. Please Login.' });
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setStatus({ type: 'error', text: 'Database unreachable.' });
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterIncome = async () => {
        if (!source || !amount || amount <= 0) {
            setStatus({ type: 'error', text: 'Please provide a valid Source and Amount.' });
            return;
        }

        const token = localStorage.getItem('token');
        setStatus({ type: 'info', text: 'Tracking Income directly to MongoDB Unified Ledger...' });

        try {
            const payload = {
                amount: parseFloat(amount),
                category: source, // 'Source' dynamically becomes the strict 'category' identifier
                type: 'income',
                description: paymentType // Repurposing description field to track 'Direct Deposit' etc
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
                const newIncome = await response.json();
                
                // Clear active states safely
                setSource('');
                setAmount('');
                setStatus({ type: 'success', text: 'Income successfully mapped across Global ecosystem!' });
                
                // Natively repopulate the local view without an expensive API refetch
                setIncomes([newIncome, ...incomes]);
                
                setTimeout(() => setStatus(null), 3000);
            } else {
                setStatus({ type: 'error', text: 'Failed to record Income. Check database connection.' });
            }
        } catch(error) {
            console.error(error);
            setStatus({ type: 'error', text: 'Database unreachable.' });
        }
    };

    // Advanced Algorithmic Calculations for Bar Visualizations
    const calculateGrossIncome = () => incomes.reduce((sum, item) => sum + item.amount, 0);
    const grossIncome = calculateGrossIncome();

    const getIncomeDistributions = () => {
        const distributions = {};
        incomes.forEach(i => {
            distributions[i.category] = (distributions[i.category] || 0) + i.amount;
        });

        const colors = ['#3b82f6', '#a855f7', '#10b981', '#f59e0b', '#ec4899', '#6366f1', '#eab308', '#14b8a6'];
        let colorIdx = 0;

        return Object.keys(distributions).map(cat => {
            const sum = distributions[cat];
            const percentage = grossIncome > 0 ? (sum / grossIncome) * 100 : 0;
            const item = {
                source: cat,
                amount: sum,
                percentage: percentage.toFixed(1),
                color: colors[colorIdx % colors.length]
            };
            colorIdx++;
            return item;
        }).sort((a, b) => b.amount - a.amount); // Sort descending size naturally
    };

    const incomeBars = getIncomeDistributions();

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
                        ← Back to HUB
                    </motion.button>
                    <h2 className="gradient-text">Income Streams</h2>
                </header>

                <div className="bento-grid">
                    {/* Unified Database Entry Form */}
                    <motion.div
                        className="bento-item glass-card-sleek"
                        style={{ gridColumn: "span 6", gridRow: "span 4" }}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                    >
                        <div className="card-header">
                            <h3 className="card-title">Add Database Income</h3>
                            <span style={{ fontSize: '11px', color: '#a855f7' }}>Global Ecosystem Sync Active</span>
                        </div>
                        <form className="auth-form" style={{ gap: '20px', padding: '0px' }}>
                            {status && (
                                <div style={{ padding: '10px', borderRadius: '4px', textAlign: 'center', backgroundColor: status.type === 'error' ? '#fee2e2' : status.type === 'success' ? '#dcfce7' : '#e0f2fe', color: status.type === 'error' ? '#991b1b' : status.type === 'success' ? '#166534' : '#075985' }}>
                                    {status.text}
                                </div>
                            )}
                            <div className="form-group">
                                <label style={{ color: '#888', marginBottom: '8px', display: 'block' }}>Source Identifier</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Monthly Salary, Freelance Fiverr" 
                                    className="search-bar" 
                                    style={{ width: '100%', color: 'white' }} 
                                    value={source}
                                    onChange={(e) => setSource(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ color: '#888', marginBottom: '8px', display: 'block' }}>Deposit Amount ($)</label>
                                <input 
                                    type="number" 
                                    placeholder="5000.00" 
                                    className="search-bar" 
                                    style={{ width: '100%', color: 'white' }} 
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ color: '#888', marginBottom: '8px', display: 'block' }}>Payment Channel</label>
                                <select 
                                    className="search-bar" 
                                    style={{ width: '100%', color: 'white', background: '#111' }}
                                    value={paymentType}
                                    onChange={(e) => setPaymentType(e.target.value)}
                                >
                                    <option>Direct Deposit</option>
                                    <option>Cash</option>
                                    <option>Bank Transfer</option>
                                    <option>Crypto Wallet</option>
                                </select>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={handleRegisterIncome}
                                className="primary-btn"
                                style={{ width: '100%', padding: '16px', borderRadius: '50px', marginTop: '10px' }}
                            >
                                Register Global Income
                            </motion.button>
                        </form>
                    </motion.div>

                    {/* Highly Dynamic Visual Breakdown Card Mapping MongoDB! */}
                    <motion.div
                        className="bento-item"
                        style={{ gridColumn: "span 6", gridRow: "span 2" }}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                    >
                        <div className="card-header">
                            <h3 className="card-title">Dynamic Mathematical Breakdown</h3>
                        </div>
                        <div style={{ marginTop: '15px' }}>
                            {/* Rendering the dynamic horizontal distribution block natively combining CSS explicit percents! */}
                            {loading ? (
                                <div style={{ fontSize: '13px', color: '#666' }}>Aligning with Ledger Database...</div>
                            ) : grossIncome > 0 ? (
                                <>
                                    <div style={{ display: 'flex', width: '100%', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                                        {incomeBars.map((bar, i) => (
                                            <div 
                                                key={'vis'+i} 
                                                style={{ width: bar.percentage + '%', background: bar.color }} 
                                                title={bar.source + ': $' + bar.amount} 
                                            />
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '15px', fontSize: '11px', color: '#888' }}>
                                        {incomeBars.map((bar, i) => (
                                            <span key={'leg'+i}>
                                                <span style={{ color: bar.color, marginRight: '4px' }}>●</span> 
                                                {bar.source} ({bar.percentage}%)
                                            </span>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div style={{ fontSize: '13px', color: '#666' }}>No active incomes registered securely onto your account yet.</div>
                            )}
                        </div>
                    </motion.div>

                    {/* Total Income Display mapping directly historically! */}
                    <motion.div
                        className="bento-item"
                        style={{ gridColumn: "span 3", gridRow: "span 2", background: 'rgba(59, 130, 246, 0.05)', borderColor: 'rgba(59, 130, 246, 0.2)' }}
                    >
                        <h4 style={{ color: '#888', fontSize: '12px', letterSpacing: '1px' }}>LIFETIME GROSS INCOME</h4>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#3b82f6', marginTop: '10px' }}>
                            ${loading ? '...' : grossIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <p style={{ fontSize: '10px', color: '#555', marginTop: '5px' }}>Historically verified over MongoDB.</p>
                    </motion.div>

                    <motion.div
                        className="bento-item"
                        style={{ gridColumn: "span 3", gridRow: "span 2" }}
                    >
                        <h4 style={{ color: '#888', fontSize: '12px', letterSpacing: '1px' }}>RECENT INJECTIONS</h4>
                        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {loading ? (
                                <span style={{ fontSize: '12px', color: '#555' }}>Syncing ledgers...</span>
                            ) : incomes.length > 0 ? incomes.slice(0, 3).map((inc, i) => (
                                <div key={'hist'+i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                    <span style={{ color: '#ccc' }}>{inc.category}</span>
                                    <span style={{ color: '#10b981', fontWeight: 'bold' }}>+${inc.amount}</span>
                                </div>
                            )) : (
                                <span style={{ fontSize: '12px', color: '#555' }}>No recent incomes found.</span>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default CategorizeIncome;
