import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './dashboard.css';

const REPORT_COLORS = ['#7C3AED', '#10b981', '#f59e0b', '#f43f5e', '#0ea5e9', '#d946ef', '#8b5cf6', '#14b8a6', '#f97316', '#64748b'];

const FinancialReport = () => {

    const navigate = useNavigate();

    const [transactions, setTransactions] = useState([]);
    const [splits, setSplits] = useState([]);
    const [loading, setLoading] = useState(true);

    const [timePeriod, setTimePeriod] = useState('Last 30 Days');
    const [reportType, setReportType] = useState('Expense Report');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const [txRes, spRes] = await Promise.all([
                    fetch('http://localhost:5000/api/transactions', { headers: { 'x-auth-token': token } }),
                    fetch('http://localhost:5000/api/splits', { headers: { 'x-auth-token': token } })
                ]);

                if (txRes.ok && spRes.ok) {
                    setTransactions(await txRes.json());
                    setSplits(await spRes.json());
                }
            } catch (err) {
                console.error("Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    // Apply Time Filtering Math specifically
    const getFilteredTransactions = () => {
        const now = new Date();
        let cutoffDate = new Date();

        if (timePeriod === 'Last 30 Days') {
            cutoffDate.setDate(now.getDate() - 30);
        } else if (timePeriod === 'Last 3 Months') {
            cutoffDate.setMonth(now.getMonth() - 3);
        } else if (timePeriod === 'Last Year') {
            cutoffDate.setFullYear(now.getFullYear() - 1);
        }

        return transactions.filter(t => new Date(t.date) >= cutoffDate);
    };

    const filteredTx = getFilteredTransactions();

    // Core Mathematical Formulas aggregating data types strictly based on filtered bounds
    const totalExpenses = filteredTx.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const totalIncomes = filteredTx.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const netIncome = totalIncomes - totalExpenses;

    // Balance Sheet native calculations (All-time tracking for true Assets vs Liabilities)
    const allTimeAssets = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) - transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const activeLiabilities = splits.filter(s => s.status === 'pending').reduce((sum, s) => sum + s.pendingAmount, 0);
    const totalEquity = allTimeAssets - activeLiabilities;

    // Render logic for Expense Pie Chart dynamic distributions
    const getExpenseDistribution = () => {
        const cats = {};
        filteredTx.filter(t => t.type === 'expense').forEach(t => {
            cats[t.category] = (cats[t.category] || 0) + t.amount;
        });
        const categories = Object.keys(cats);
        // Fallback default if completely empty
        if (categories.length === 0) return { breakdown: [], total: 0 };
        return { breakdown: categories.map(c => ({ name: c, amount: cats[c] })), total: totalExpenses };
    };

    const expenseStats = getExpenseDistribution();

    // The PDF Print CSS Engine preventing sidebars from exporting!
    const printCSS = `
        @media print {
            .sidebar, .nav-menu, .top-bar-buttons, .report-controls { 
                display: none !important; 
            }
            .main-content {
                margin: 0 !important;
                width: 100% !important;
            }
            body {
                background: #000 !important;
                color: #fff !important;
            }
            .glass-card-sleek {
                border: 1px solid #333 !important;
                break-inside: avoid;
            }
        }
    `;

    // Dynamic Render Function based closely on user Dropdown rules
    const renderReportContent = () => {
        if (loading) return <div style={{ color: '#9CA3AF', padding: '50px', textAlign: 'center' }}>Aggregating Ledger Statements from Database...</div>;

        switch (reportType) {
            case 'Expense Report':
                // Assign colors and calculate gradient
                const breakdownWithColors = expenseStats.breakdown.map((item, idx) => ({
                    ...item,
                    color: REPORT_COLORS[idx % REPORT_COLORS.length]
                }));

                let cumulativePercent = 0;
                const gradientSteps = breakdownWithColors.map(item => {
                    const percent = totalExpenses > 0 ? (item.amount / totalExpenses) * 100 : 0;
                    const start = cumulativePercent;
                    cumulativePercent += percent;
                    return `${item.color} ${start}% ${cumulativePercent}%`;
                }).join(', ');

                const donutGradient = totalExpenses > 0
                    ? `conic-gradient(${gradientSteps})`
                    : '#E9E5F5';

                return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.5fr', gap: '20px', flex: 1 }}>
                        <div className="glass-card-sleek" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                            <h3 className="card-title" style={{ marginBottom: '20px' }}>Spending by Category</h3>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                                {/* Dynamic Donut Ring using Conic Gradient */}
                                <div style={{
                                    width: '180px',
                                    height: '180px',
                                    borderRadius: '50%',
                                    background: donutGradient,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative'
                                }}>
                                    {/* The Inner Hole */}
                                    <div style={{
                                        width: '140px',
                                        height: '140px',
                                        borderRadius: '50%',
                                        background: '#FFFFFF',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)'
                                    }}>
                                        <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 'normal' }}>Total Spent</span>
                                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1E1B4B' }}>
                                            ${totalExpenses.toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                {/* Legend Section */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', width: '100%', marginTop: '10px' }}>
                                    {breakdownWithColors.length > 0 ? breakdownWithColors.map((item, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#6B7280', borderBottom: '1px solid #E9E5F5', paddingBottom: '5px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }}></div>
                                                <span>{item.name}</span>
                                            </div>
                                            <span style={{ fontWeight: '600', color: '#1E1B4B' }}>${item.amount.toLocaleString()}</span>
                                        </div>
                                    )) : (
                                        <span style={{ fontSize: '12px', color: '#9CA3AF', textAlign: 'center' }}>No expenses found in this period.</span>
                                    )}
                                </div>
                            </div>
                        </div>


                        <div className="glass-card-sleek" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div className="card-header" style={{ marginBottom: '10px' }}>
                                <h3 className="card-title">Expenses</h3>
                                <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{timePeriod}</span>
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '300px' }}>
                                {filteredTx.filter(t => t.type === 'expense').length > 0 ? filteredTx.filter(t => t.type === 'expense').map((t, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: '600', fontSize: '14px' }}>{t.merchant || t.description || 'General Expense'}</span>
                                            <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{t.date.split('T')[0]} • {t.category}</span>
                                        </div>
                                        <div style={{ fontWeight: 'bold', color: '#ef4444' }}>-${t.amount.toLocaleString()}</div>
                                    </div>
                                )) : (
                                    <div style={{ textAlign: 'center', color: '#9CA3AF', marginTop: '40px' }}>No ledger data available.</div>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 'Income Statement':
                return (
                    <div className="glass-card-sleek" style={{ padding: '30px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <h3 className="card-title" style={{ textAlign: 'center', fontSize: '24px', marginBottom: '5px' }}>Income Statement (P&L)</h3>
                        <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '13px', marginBottom: '30px' }}>For the period of: {timePeriod}</p>

                        {/* Revenue Block */}
                        <div style={{ marginBottom: '20px' }}>
                            <h4 style={{ color: '#10b981', borderBottom: '1px solid rgba(16,185,129,0.3)', paddingBottom: '10px', marginBottom: '15px' }}>Revenues</h4>
                            {filteredTx.filter(t => t.type === 'income').map((t, i) => (
                                <div key={'inc' + i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '14px', color: '#6B7280' }}>
                                    <span>{t.category || t.description || 'Income Stream'}</span>
                                    <span>${t.amount.toLocaleString()}</span>
                                </div>
                            ))}
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: '15px', fontWeight: 'bold', color: '#1E1B4B', marginTop: '10px', borderTop: '1px dashed #333' }}>
                                <span>Total Gross Revenue</span>
                                <span>${totalIncomes.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Expense Block */}
                        <div style={{ marginBottom: '30px' }}>
                            <h4 style={{ color: '#ef4444', borderBottom: '1px solid rgba(239,68,68,0.3)', paddingBottom: '10px', marginBottom: '15px' }}>Expenses</h4>
                            {expenseStats.breakdown.map((item, i) => (
                                <div key={'exp' + i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '14px', color: '#6B7280' }}>
                                    <span>{item.name}</span>
                                    <span>${item.amount.toLocaleString()}</span>
                                </div>
                            ))}
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: '15px', fontWeight: 'bold', color: '#1E1B4B', marginTop: '10px', borderTop: '1px dashed #333' }}>
                                <span>Total Operating Expenses</span>
                                <span>${totalExpenses.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Summary Block */}
                        <div style={{ padding: '20px', background: netIncome >= 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', borderRadius: '12px', border: `1px solid ${netIncome >= 0 ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Net Income</span>
                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: netIncome >= 0 ? '#10b981' : '#ef4444' }}>
                                ${netIncome.toLocaleString()}
                            </span>
                        </div>
                    </div>
                );

            case 'Balance Sheet':
                return (
                    <div className="glass-card-sleek" style={{ padding: '30px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <h3 className="card-title" style={{ textAlign: 'center', fontSize: '24px', marginBottom: '5px' }}>Balance Sheet</h3>
                        <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '13px', marginBottom: '30px' }}>As of {new Date().toLocaleDateString()} (All-Time Snapshot)</p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', flex: 1 }}>
                            {/* Assets Column */}
                            <div>
                                <h4 style={{ color: '#A78BFA', borderBottom: '1px solid rgba(59,130,246,0.3)', paddingBottom: '10px', marginBottom: '15px' }}>Assets</h4>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '14px', color: '#6B7280' }}>
                                    <span>Cash Equivalents (Savings)</span>
                                    <span>${allTimeAssets.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: '16px', fontWeight: 'bold', color: '#1E1B4B', marginTop: '20px', borderTop: '1px solid #444' }}>
                                    <span>Total Assets</span>
                                    <span>${allTimeAssets.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Liabilities Column linking strictly to pending SplitBills Db! */}
                            <div>
                                <h4 style={{ color: '#ef4444', borderBottom: '1px solid rgba(239,68,68,0.3)', paddingBottom: '10px', marginBottom: '15px' }}>Liabilities</h4>
                                {splits.filter(s => s.status === 'pending').map((s, i) => (
                                    <div key={'liab' + i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '14px', color: '#6B7280' }}>
                                        <span>Debt: {s.description}</span>
                                        <span>${parseFloat(s.pendingAmount).toFixed(2)}</span>
                                    </div>
                                ))}
                                {splits.filter(s => s.status === 'pending').length === 0 && (
                                    <div style={{ padding: '8px 0', fontSize: '13px', color: '#9CA3AF' }}>No active liabilities / debts found.</div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: '16px', fontWeight: 'bold', color: '#1E1B4B', marginTop: '20px', borderTop: '1px solid #444' }}>
                                    <span>Total Liabilities</span>
                                    <span>${parseFloat(activeLiabilities).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Equity Footer strictly proving Asset - Liabilities = Net Worth */}
                        <div style={{ marginTop: 'auto', paddingTop: '30px' }}>
                            <div style={{ padding: '20px', background: 'rgba(168,85,247,0.1)', borderRadius: '12px', border: '1px solid rgba(168,85,247,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#d8b4fe' }}>Total Equity (Net Worth)</span>
                                <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1E1B4B' }}>
                                    ${parseFloat(totalEquity).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <motion.div
            className="dashboard-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ padding: '20px', height: '100vh', overflow: 'hidden' }}
        >
            <style>{printCSS}</style>

            <div className="main-content" style={{ marginLeft: 0, width: '100%', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>

                {/* Header Section */}
                <div className="glass-card-sleek top-bar-buttons" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => navigate('/dashboard')}
                        className="primary-btn"
                        style={{ padding: '8px 16px', fontSize: '14px' }}
                    >
                        ← Back to Dashboard
                    </motion.button>
                    <h2 style={{ margin: 0, color: '#1E1B4B', fontSize: '24px' }}>Financial Statements</h2>
                    <div style={{ width: '80px' }}></div>
                </div>

                {/* Control Filters Section */}
                <div className="glass-card-sleek report-controls" style={{ padding: '20px', display: 'flex', gap: '20px', alignItems: 'flex-end', flexShrink: 0 }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', color: '#6B7280', marginBottom: '8px', fontSize: '14px' }}>Reporting Period</label>
                        <select
                            value={timePeriod}
                            onChange={(e) => setTimePeriod(e.target.value)}
                            style={{ width: '100%', padding: '10px', background: '#FFFFFF', border: '1px solid #E9E5F5', color: '#1E1B4B', borderRadius: '8px', outline: 'none', cursor: 'pointer' }}
                        >
                            <option>Last 30 Days</option>
                            <option>Last 3 Months</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', color: '#6B7280', marginBottom: '8px', fontSize: '14px' }}>Statement Type</label>
                        <select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            style={{ width: '100%', padding: '10px', background: '#FFFFFF', border: '1px solid #E9E5F5', color: '#1E1B4B', borderRadius: '8px', outline: 'none', cursor: 'pointer' }}
                        >
                            <option>Expense Report</option>
                            <option>Income Statement</option>
                            <option>Balance Sheet</option>
                        </select>
                    </div>
                    <div>
                        {/* Download Report utilizing Native Browser PDF Printing via Window object! */}
                        <button
                            onClick={() => window.print()}
                            className="primary-btn"
                            style={{ padding: '10px 20px', background: '#10b981', border: 'none', borderRadius: '8px', color: '#1E1B4B', cursor: 'pointer', display: 'flex', gap: '8px' }}
                        >
                            📄 Print PDF
                        </button>
                    </div>
                </div>

                {/* Highly Dynamic Multi-state Component Container */}
                <div style={{ display: 'flex', flex: 1, overflow: 'hidden', paddingBottom: '20px' }}>
                    {renderReportContent()}
                </div>

            </div>
        </motion.div>
    );
};

export default FinancialReport;
