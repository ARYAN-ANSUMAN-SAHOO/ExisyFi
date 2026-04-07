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
    const [editModalData, setEditModalData] = useState(null);
    const [editStatus, setEditStatus] = useState(null);

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

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this split bill?")) return;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:5000/api/splits/${id}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                setSplits(splits.filter(s => s._id !== id));
            } else {
                setStatus({ type: 'error', text: 'Failed to delete split.' });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdate = async () => {
        const token = localStorage.getItem('token');
        setEditStatus('Updating...');
        try {
            const res = await fetch(`http://localhost:5000/api/splits/${editModalData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    description: editModalData.description,
                    totalAmount: parseFloat(editModalData.totalAmount),
                    participants: parseInt(editModalData.participants) || 1,
                    includeMyself: false // Force exact divider count
                })
            });
            if (res.ok) {
                const updated = await res.json();
                setSplits(splits.map(s => s._id === updated._id ? updated : s));
                setEditModalData(null);
                setEditStatus(null);
            } else {
                setEditStatus('Failed to update split.');
            }
        } catch (err) {
            console.error(err);
            setEditStatus('Server error.');
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
        } catch (error) {
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
        } catch (error) {
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
                            <h3 className="fp-section-title">Record Split</h3>
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
                                        style={{ width: '100%', color: '#1E1B4B' }}
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
                                        style={{ width: '100%', color: '#1E1B4B' }}
                                        value={totalAmount}
                                        onChange={(e) => setTotalAmount(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Participants (Emails - Comma Separated)</label>
                                    <textarea
                                        placeholder="friend1@example.com, friend2@example.com"
                                        className="search-bar"
                                        style={{ width: '100%', height: '100px', color: '#1E1B4B', resize: 'none' }}
                                        value={participantsStr}
                                        onChange={(e) => setParticipantsStr(e.target.value)}
                                    />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
                                    <input
                                        type="checkbox"
                                        id="user-share"
                                        style={{ width: '18px', height: '18px', accentColor: '#7C3AED', cursor: 'pointer' }}
                                        checked={includeMyself}
                                        onChange={(e) => setIncludeMyself(e.target.checked)}
                                    />
                                    <label htmlFor="user-share" style={{ fontSize: '15px', color: '#6B7280', margin: 0, cursor: 'pointer' }}>Include my share</label>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    onClick={handleGenerateSplit}
                                    className="primary-btn"
                                    style={{ width: '100%', padding: '16px', borderRadius: '50px' }}
                                >
                                    Split Transaction
                                </motion.button>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar Summary Section */}
                    <div className="full-page-sidebar">
                        {/* Summary */}
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#1E1B4B' }}>Pending Share</h3>
                            <div className="fp-stat-item">
                                <div className="fp-stat-label">Individual Mathematical Share</div>
                                <div className="fp-stat-value" style={{ color: '#A78BFA' }}>${activeIndividualShare}</div>
                                <p style={{ fontSize: '12px', color: '#555', marginTop: '5px' }}>Updates natively while verifying inputs</p>
                            </div>
                        </div>

                        {/* Status Tracker */}
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#1E1B4B' }}>Active Pending Bills</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {/* User explicitly asked "no need to show settled bills". Safe UI .filter covers exactly this! */}
                                {splits.filter(b => b.status === 'pending').length > 0 ? splits.filter(b => b.status === 'pending').map((bill, index) => (
                                    <div key={index} style={{ display: 'flex', flexDirection: 'column', fontSize: '14px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ color: '#6B7280', fontWeight: '600' }}>{bill.description}</span>
                                            <span style={{ color: '#7C3AED', fontWeight: 'bold' }}>${parseFloat(bill.pendingAmount).toFixed(2)} pending</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', alignItems: 'center' }}>
                                            <span style={{ color: '#9CA3AF', fontSize: '12px' }}>Total: ${bill.totalAmount} ({bill.participants} ways)</span>
                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                <button onClick={() => setEditModalData({ ...bill })} style={{ padding: '4px 8px', background: '#eab308', color: '#1E1B4B', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>Edit</button>
                                                <button onClick={() => handleDelete(bill._id)} style={{ padding: '4px 8px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>Delete</button>
                                                <button
                                                    onClick={() => handleMarkAsPaid(bill._id)}
                                                    style={{ padding: '4px 8px', background: '#22c55e', color: '#1E1B4B', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                                                >
                                                    Mark as Paid ✓
                                                </button>
                                            </div>
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

            {/* Edit Modal */}
            {editModalData && (
                <div onClick={() => setEditModalData(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div onClick={(e) => e.stopPropagation()} style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '400px', maxWidth: '90%' }}>
                        <h3 style={{ marginBottom: '20px', color: '#1E1B4B' }}>Edit Split Bill</h3>
                        {editStatus && <div style={{ color: 'red', marginBottom: '10px' }}>{editStatus}</div>}
                        <input type="text" value={editModalData.description} onChange={(e) => setEditModalData({ ...editModalData, description: e.target.value })} placeholder="Description" className="search-bar" style={{ width: '100%', marginBottom: '15px', color: '#000' }} />
                        <input type="number" value={editModalData.totalAmount} onChange={(e) => setEditModalData({ ...editModalData, totalAmount: e.target.value })} placeholder="Total Amount" className="search-bar" style={{ width: '100%', marginBottom: '15px', color: '#000' }} />
                        <input type="number" value={editModalData.participants} onChange={(e) => setEditModalData({ ...editModalData, participants: e.target.value })} placeholder="Total Participants / Ways" className="search-bar" style={{ width: '100%', marginBottom: '20px', color: '#000' }} />

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

export default SplitTransaction;
