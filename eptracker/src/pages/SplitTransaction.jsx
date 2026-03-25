import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './dashboard.css';

const SplitTransaction = () => {
    const navigate = useNavigate();

    const [description, setDescription] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [participantsStr, setParticipantsStr] = useState('');
    const [includeMyself, setIncludeMyself] = useState(true);
    
    const [splits, setSplits] = useState([]);
    const [status, setStatus] = useState(null);

    // Initial Database Fetch on Page Load
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchSplits(token);
    }, [navigate]);

    const fetchSplits = async (token) => {
        try {
            const res = await fetch('http://localhost:5000/api/splits', {
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                setSplits(await res.json());
            } else {
                setStatus({ type: 'error', text: 'Authentication failed. Please Login.' });
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setStatus({ type: 'error', text: 'Database unreachable.' });
        }
    };

    const handleGenerateSplit = async () => {
        if (!description || !totalAmount || !participantsStr) {
            setStatus({ type: 'error', text: 'Description, Total Amount, and Participants are required.' });
            return;
        }

        // Parse emails by comma to get the raw number of external participants
        const participantsCount = participantsStr.split(',').filter(p => p.trim() !== '').length;

        if (participantsCount === 0 && !includeMyself) {
            setStatus({ type: 'error', text: 'You must have at least one participant to split a bill.' });
            return;
        }

        const token = localStorage.getItem('token');
        setStatus({ type: 'info', text: 'Calculating specific math and saving to database...' });

        try {
            const payload = {
                description,
                totalAmount: parseFloat(totalAmount),
                participants: participantsCount,
                includeMyself
            };

            const response = await fetch('http://localhost:5000/api/splits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token 
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const newSplit = await response.json();
                
                // Clear form
                setDescription('');
                setTotalAmount('');
                setParticipantsStr('');
                setIncludeMyself(true);
                setStatus({ type: 'success', text: 'Split Bill successfully calculated and saved!' });
                
                // Instantly update the UI Context array
                setSplits([newSplit, ...splits]);
                
                setTimeout(() => setStatus(null), 3000);
            } else {
                setStatus({ type: 'error', text: 'Failed to record split. Check database connection.' });
            }
        } catch(error) {
            console.error(error);
            setStatus({ type: 'error', text: 'Database unreachable.' });
        }
    };

    const handleMarkAsPaid = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/api/splits/${id}/settle`, {
                method: 'PUT',
                headers: {
                    'x-auth-token': token 
                }
            });

            if (response.ok) {
                const updatedSplit = await response.json();
                // Update specific split in state to 'settled'
                setSplits(splits.map(s => s._id === updatedSplit._id ? updatedSplit : s));
            } else {
                setStatus({ type: 'error', text: 'Failed to mark as paid.' });
                setTimeout(() => setStatus(null), 3000);
            }
        } catch(error) {
            console.error(error);
        }
    }

    // Interactive Math for the UI Summary Sidebar
    const activeIndividualShare = (totalAmount && participantsStr) ? 
        (parseFloat(totalAmount) / (participantsStr.split(',').filter(p => p.trim() !== '').length + (includeMyself ? 1 : 0))).toFixed(2) 
        : '0.00';

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
                    <h2 className="gradient-text">Split Bills</h2>
                </header>

                <div className="full-page-layout">
                    {/* Main Splitter Section */}
                    <div className="full-page-main">
                        <div>
                            <h3 className="fp-section-title">Record Database Split</h3>
                            <form className="auth-form" style={{ gap: '0', padding: '0' }}>
                                {status && (
                                   <div style={{ padding: '10px', marginBottom: '15px', borderRadius: '4px', textAlign: 'center', backgroundColor: status.type === 'error' ? '#fee2e2' : status.type === 'success' ? '#dcfce7' : '#e0f2fe', color: status.type === 'error' ? '#991b1b' : status.type === 'success' ? '#166534' : '#075985' }}>
                                        {status.text}
                                   </div>
                                )}
                                <div className="form-group">
                                    <label>Bill Description</label>
                                    <input 
                                        type="text" 
                                        placeholder="E.g., Dinner at Joey's" 
                                        className="search-bar" 
                                        style={{ width: '100%', color: 'white' }} 
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Total Bill Amount ($)</label>
                                    <input 
                                        type="number" 
                                        placeholder="Enter target total bill" 
                                        className="search-bar" 
                                        style={{ width: '100%', color: 'white' }} 
                                        value={totalAmount}
                                        onChange={(e) => setTotalAmount(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Participants (Emails - Comma Separated)</label>
                                    <textarea 
                                        placeholder="friend1@example.com, friend2@example.com" 
                                        className="search-bar" 
                                        style={{ width: '100%', height: '100px', color: 'white', resize: 'none' }} 
                                        value={participantsStr}
                                        onChange={(e) => setParticipantsStr(e.target.value)}
                                    />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
                                    <input 
                                        type="checkbox" 
                                        id="user-share" 
                                        style={{ width: '18px', height: '18px', accentColor: '#a855f7', cursor: 'pointer' }} 
                                        checked={includeMyself}
                                        onChange={(e) => setIncludeMyself(e.target.checked)}
                                    />
                                    <label htmlFor="user-share" style={{ fontSize: '15px', color: '#ccc', margin: 0, cursor: 'pointer' }}>Include my share</label>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    onClick={handleGenerateSplit}
                                    className="primary-btn"
                                    style={{ width: '100%', padding: '16px', borderRadius: '50px' }}
                                >
                                    Push Split Securely
                                </motion.button>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar Summary Section */}
                    <div className="full-page-sidebar">
                        {/* Summary */}
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#fff' }}>Pending Share</h3>
                            <div className="fp-stat-item">
                                <div className="fp-stat-label">Individual Mathematical Share</div>
                                <div className="fp-stat-value" style={{ color: '#3b82f6' }}>${activeIndividualShare}</div>
                                <p style={{ fontSize: '12px', color: '#555', marginTop: '5px' }}>Updates natively while verifying inputs</p>
                            </div>
                        </div>

                        {/* Status Tracker */}
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#fff' }}>Active Pending Bills</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {/* User explicitly asked "no need to show settled bills". Safe UI .filter covers exactly this! */}
                                {splits.filter(b => b.status === 'pending').length > 0 ? splits.filter(b => b.status === 'pending').map((bill, index) => (
                                    <div key={index} style={{ display: 'flex', flexDirection: 'column', fontSize: '14px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ color: '#ccc', fontWeight: '600' }}>{bill.description}</span>
                                            <span style={{ color: '#a855f7', fontWeight: 'bold' }}>${parseFloat(bill.pendingAmount).toFixed(2)} pending</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', alignItems: 'center' }}>
                                            <span style={{ color: '#666', fontSize: '12px' }}>Total: ${bill.totalAmount} ({bill.participants} ways)</span>
                                            {/* Explored mapping logic: "Mark as Paid" disappears it! */}
                                            <button 
                                                onClick={() => handleMarkAsPaid(bill._id)}
                                                style={{ padding: '4px 8px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                                            >
                                                Mark as Paid ✓
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <div style={{ color: '#555', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
                                        All your bills are entirely settled!
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default SplitTransaction;
