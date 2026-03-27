import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

// SVG Icons
const Icons = {
    Dashboard: () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
    Wallet: () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path><path d="M4 6v12a2 2 0 0 0 2 2h14v-4"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z"></path></svg>,
    Chart: () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>,
    User: () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
    Settings: () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
    Search: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
    Target: () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>,
    Share: () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>,
    Bell: () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
    Plus: () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    LogOut: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
    // #1 Default Profile Picture SVG
    ProfilePic: () => <svg viewBox="0 0 24 24" width="28" height="28" fill="#9CA3AF"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
};

// Navigation pages for the search index
const NAV_PAGES = [
    { label: 'Record Expense', path: '/record-expense' },
    { label: 'Set Budget Goal', path: '/set-budget' },
    { label: 'Split Transaction', path: '/split-transaction' },
    { label: 'Financial Report', path: '/financial-report' },
    { label: 'Notifications', path: '/notifications' },
    { label: 'Categorize Income', path: '/categorize-income' },
    { label: 'Contact Us', path: '/contact-us' },
];

const DashboardPage = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [user, setUser] = useState(null);

    // #2 Savings Modal State
    const [showSavingsModal, setShowSavingsModal] = useState(false);
    // #6 Search Bar State
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);
    const searchRef = useRef(null);
    // #7 Settings Modal State
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'USD');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const userRes = await fetch('http://localhost:5000/api/auth/me', {
                    headers: { 'x-auth-token': token }
                });
                if (userRes.ok) {
                    setUser(await userRes.json());
                } else {
                    navigate('/login');
                }

                const txRes = await fetch('http://localhost:5000/api/transactions', {
                    headers: { 'x-auth-token': token }
                });
                if (txRes.ok) {
                    setTransactions(await txRes.json());
                }
            } catch (err) {
                console.error("Dashboard fetch error:", err);
            }
        };

        fetchData();
    }, [navigate]);

    // Close search when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSearchResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Core financial calculations
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalSavings = totalIncome - totalExpense;

    // #4 Percentage formulas (Income = 100% baseline)
    const expensePercent = totalIncome > 0 ? ((totalExpense / totalIncome) * 100).toFixed(1) : '0.0';
    const savingsPercent = totalIncome > 0 ? ((totalSavings / totalIncome) * 100).toFixed(1) : '0.0';

    // Aggregate category data for charts
    const categoryTotals = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    const topExpenses = Object.entries(categoryTotals)
        .map(([label, val]) => ({ label, val }))
        .sort((a, b) => b.val - a.val)
        .slice(0, 10);

    const maxVal = Math.max(...topExpenses.map(e => e.val), 1);

    // #3 Dynamic Pie Chart conic-gradient calculation
    const pieTotal = totalIncome + totalExpense + Math.abs(totalSavings);
    const incomeSlice = pieTotal > 0 ? (totalIncome / pieTotal) * 100 : 33;
    const expenseSlice = pieTotal > 0 ? (totalExpense / pieTotal) * 100 : 33;

    // #3 Dynamic Line Chart — group expenses by month
    const monthlyExpenses = Array(12).fill(0);
    transactions.filter(t => t.type === 'expense').forEach(t => {
        const month = new Date(t.date).getMonth();
        monthlyExpenses[month] += t.amount;
    });
    const maxMonthly = Math.max(...monthlyExpenses, 1);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const linePoints = monthlyExpenses.map((val, i) => {
        const x = (i / 11) * 480 + 10;
        const y = 130 - (val / maxMonthly) * 120;
        return x + ',' + y;
    }).join(' ');

    // #2 Savings breakdown data for the modal
    const savingsBreakdown = Object.entries(categoryTotals)
        .map(([cat, spent]) => ({ category: cat, spent, saved: totalIncome > 0 ? totalIncome - spent : 0 }))
        .sort((a, b) => b.spent - a.spent);

    // #6 Search results filtering
    const getSearchResults = () => {
        if (!searchQuery.trim()) return [];
        const q = searchQuery.toLowerCase();
        const pageResults = NAV_PAGES.filter(p => p.label.toLowerCase().includes(q)).map(p => ({ type: 'page', ...p }));
        const txResults = transactions.filter(t =>
            (t.category && t.category.toLowerCase().includes(q)) ||
            (t.merchant && t.merchant.toLowerCase().includes(q)) ||
            (t.description && t.description.toLowerCase().includes(q))
        ).slice(0, 5).map(t => ({ type: 'transaction', label: t.merchant || t.category || t.description, amount: t.amount, txType: t.type }));
        return [...pageResults, ...txResults];
    };

    const searchResults = getSearchResults();

    // Currency symbol helper
    const currSymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '₹';

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <div className="logo-icon">E</div>
                    <span>ExisyFi</span>
                </div>

                <nav className="nav-menu">
                    <a onClick={() => navigate('/dashboard')} className="nav-item active">
                        <Icons.Dashboard /> Dashboard
                    </a>
                    <a onClick={() => navigate('/record-expense')} className="nav-item">
                        <Icons.Plus /> Record Expense
                    </a>
                    <a onClick={() => navigate('/set-budget')} className="nav-item">
                        <Icons.Target /> Set Budget Goal
                    </a>
                    <a onClick={() => navigate('/split-transaction')} className="nav-item">
                        <Icons.Share /> Split Transaction
                    </a>
                    <a onClick={() => navigate('/financial-report')} className="nav-item">
                        <Icons.Chart /> Financial Report
                    </a>
                    <a onClick={() => navigate('/notifications')} className="nav-item">
                        <Icons.Bell /> Notifications
                        <span className="badge">5</span>
                    </a>
                    <a onClick={() => navigate('/categorize-income')} className="nav-item">
                        <Icons.Wallet /> Categorize Income
                    </a>
                </nav>

                <div className="nav-menu" style={{ flex: '0', marginTop: 'auto' }}>
                    {/* #7 Settings opens modal */}
                    <a onClick={() => setShowSettingsModal(true)} className="nav-item" style={{ cursor: 'pointer' }}>
                        <Icons.Settings /> Settings
                    </a>
                    {/* #5 Help redirects to Contact Us */}
                    <a onClick={() => navigate('/contact-us')} className="nav-item" style={{ cursor: 'pointer' }}>
                        <Icons.User /> Help
                    </a>
                </div>

                {/* #1 Profile with default SVG avatar */}
                <div className="user-profile">
                    <div className="avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F3FF', border: '2px solid #7C3AED' }}>
                        <Icons.ProfilePic />
                    </div>
                    <div className="user-info">
                        <span className="name">{user ? user.firstName + ' ' + user.lastName : 'Loading...'}</span>
                        <span className="email">{user ? user.email : '...'}</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="top-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* #6 Live Search Bar */}
                    <div ref={searchRef} style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                        <div className="search-bar" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Icons.Search />
                            <input
                                type="text"
                                placeholder="Search pages or transactions..."
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setShowSearchResults(true); }}
                                onFocus={() => setShowSearchResults(true)}
                                style={{ background: 'transparent', border: 'none', outline: 'none', color: '#1E1B4B', width: '100%', fontSize: '14px' }}
                            />
                        </div>
                        {showSearchResults && searchResults.length > 0 && (
                            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px', background: '#FFFFFF', border: '1px solid #E9E5F5', borderRadius: '12px', overflow: 'hidden', zIndex: 100, maxHeight: '300px', overflowY: 'auto', boxShadow: '0 8px 30px rgba(124,58,237,0.1)' }}>
                                {searchResults.map((r, i) => (
                                    <div
                                        key={i}
                                        onClick={() => {
                                            if (r.type === 'page') navigate(r.path);
                                            setShowSearchResults(false);
                                            setSearchQuery('');
                                        }}
                                        style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #E9E5F5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background 0.2s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#F5F3FF'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <div>
                                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1E1B4B' }}>{r.label}</div>
                                            <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{r.type === 'page' ? 'Navigate' : r.txType}</div>
                                        </div>
                                        {r.type === 'transaction' && (
                                            <span style={{ color: r.txType === 'income' ? '#22c55e' : '#ef4444', fontWeight: 'bold', fontSize: '13px' }}>
                                                {r.txType === 'income' ? '+' : '-'}{currSymbol}{r.amount}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={handleLogout} className="primary-btn" style={{ padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', background: '#ef4444' }}>
                        <Icons.LogOut /> Logout
                    </button>
                </header>

                {/* Stats Row — #4 Percentage Indicators */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-header">
                            <div className="icon-box">{currSymbol}</div>
                            <span className="menu-dots">...</span>
                        </div>
                        <div className="stat-label" style={{ color: '#9CA3AF', fontSize: '12px' }}>TOTAL INCOME</div>
                        <div className="stat-value">{currSymbol}{totalIncome.toLocaleString()}</div>
                        <div className="stat-change up">↗ 100% (Baseline)</div>
                    </div>

                    <div className="stat-card accent">
                        <div className="stat-header">
                            <div className="icon-box"><Icons.Wallet /></div>
                            <span className="menu-dots">...</span>
                        </div>
                        <div className="stat-label">TOTAL EXPENSE</div>
                        <div className="stat-value">{currSymbol}{totalExpense.toLocaleString()}</div>
                        <div className="stat-change down">↘ {expensePercent}% of income</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-header">
                            <div className="icon-box"><Icons.Chart /></div>
                            {/* #2 View Details triggers the savings modal */}
                            <button
                                onClick={() => setShowSavingsModal(true)}
                                style={{ background: '#F5F3FF', border: '1px solid #E9E5F5', color: '#7C3AED', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer', fontWeight: '600' }}
                            >
                                View Details
                            </button>
                        </div>
                        <div className="stat-label" style={{ color: '#9CA3AF', fontSize: '12px' }}>TOTAL SAVINGS</div>
                        <div className="stat-value" style={{ color: totalSavings >= 0 ? '#22c55e' : '#ef4444' }}>{currSymbol}{totalSavings.toLocaleString()}</div>
                        <div className="stat-change" style={{ color: totalSavings >= 0 ? '#22c55e' : '#ef4444' }}>{totalSavings >= 0 ? '↗' : '↘'} {savingsPercent}% saved</div>
                    </div>
                </div>

                {/* Chart Section — #3 Dynamic Data */}
                <div className="chart-section" style={{ marginBottom: '30px' }}>
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h3 className="card-title">Top Expense Sources</h3>
                            <span style={{ color: '#9CA3AF' }}>...</span>
                        </div>
                        <div className="bar-chart-container">
                            {topExpenses.length > 0 ? topExpenses.map((item, i) => (
                                <div className="bar-group" key={i}>
                                    <div className="bar highlight" style={{ height: (item.val / maxVal) * 100 + '%', opacity: 1 }}>
                                        <div className="bar-value-pop">{currSymbol}{item.val}</div>
                                    </div>
                                    <span className="bar-label">{item.label}</span>
                                </div>
                            )) : (
                                <div style={{ color: '#9CA3AF', padding: '20px' }}>No expense data recorded.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Row — #3 Dynamic Charts */}
                <div className="bottom-row">
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h3 className="card-title">Report Overview</h3>
                            <span style={{ color: '#9CA3AF' }}>...</span>
                        </div>
                        <div className="pie-chart-wrapper">
                            {/* #3 Dynamic conic-gradient pie */}
                            <div className="pie-chart" style={{ background: 'conic-gradient(#7C3AED 0% ' + incomeSlice + '%, #A78BFA ' + incomeSlice + '% ' + (incomeSlice + expenseSlice) + '%, #E9E5F5 ' + (incomeSlice + expenseSlice) + '% 100%)' }}>
                                <div className="pie-hole"></div>
                            </div>
                            <div className="pie-legend">
                                <div className="legend-item">
                                    <div className="dot" style={{ background: '#7C3AED' }}></div>
                                    <span>Income {currSymbol}{totalIncome.toLocaleString()}</span>
                                </div>
                                <div className="legend-item">
                                    <div className="dot" style={{ background: '#A78BFA' }}></div>
                                    <span>Expense {currSymbol}{totalExpense.toLocaleString()}</span>
                                </div>
                                <div className="legend-item">
                                    <div className="dot" style={{ background: '#E9E5F5', border: '1px solid #DDD6FE' }}></div>
                                    <span>Savings {currSymbol}{totalSavings.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <div className="card-header">
                            <h3 className="card-title">Expense Activity</h3>
                            <div style={{ fontSize: '12px', color: '#7C3AED' }}>— Monthly trend</div>
                        </div>
                        {/* #3 Dynamic SVG Line Chart from monthly expense data */}
                        <div style={{ height: '140px', width: '100%', position: 'relative' }}>
                            <svg viewBox="0 0 500 140" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                                <line x1="0" y1="35" x2="500" y2="35" stroke="#E9E5F5" strokeWidth="1" />
                                <line x1="0" y1="70" x2="500" y2="70" stroke="#E9E5F5" strokeWidth="1" />
                                <line x1="0" y1="105" x2="500" y2="105" stroke="#E9E5F5" strokeWidth="1" />
                                {/* Dynamic polyline from actual monthly data */}
                                <polyline points={linePoints} fill="none" stroke="#7C3AED" strokeWidth="2" />
                                {/* Data point circles */}
                                {monthlyExpenses.map((val, i) => {
                                    const x = (i / 11) * 480 + 10;
                                    const y = 130 - (val / maxMonthly) * 120;
                                    return <circle key={i} cx={x} cy={y} r="3" fill="#7C3AED" />;
                                })}
                            </svg>
                            {/* Month labels */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#9CA3AF', paddingTop: '4px' }}>
                                {monthNames.map(m => <span key={m}>{m}</span>)}
                            </div>
                        </div>
                    </div>
                </div>

            </main>

            {/* #2 Savings Detail Blurred Modal Overlay */}
            {showSavingsModal && (
                <div
                    onClick={() => setShowSavingsModal(false)}
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{ background: '#FFFFFF', border: '1px solid #E9E5F5', borderRadius: '20px', padding: '30px', width: '450px', maxHeight: '500px', overflowY: 'auto', boxShadow: '0 20px 60px rgba(124,58,237,0.15)' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1E1B4B' }}>Savings Breakdown</h3>
                            <button onClick={() => setShowSavingsModal(false)} style={{ background: 'none', border: 'none', color: '#9CA3AF', fontSize: '20px', cursor: 'pointer' }}>✕</button>
                        </div>
                        <div style={{ marginBottom: '15px', padding: '15px', background: totalSavings >= 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', borderRadius: '12px', textAlign: 'center' }}>
                            <span style={{ fontSize: '13px', color: '#6B7280' }}>Net Financial Position</span>
                            <div style={{ fontSize: '28px', fontWeight: 'bold', color: totalSavings >= 0 ? '#22c55e' : '#ef4444', marginTop: '5px' }}>{currSymbol}{totalSavings.toLocaleString()}</div>
                        </div>
                        <h4 style={{ color: '#9CA3AF', fontSize: '12px', marginBottom: '15px', letterSpacing: '1px' }}>MAJOR EXPENSE DRAINS</h4>
                        {savingsBreakdown.length > 0 ? savingsBreakdown.map((item, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #E9E5F5', fontSize: '14px' }}>
                                <span style={{ color: '#1E1B4B' }}>{item.category}</span>
                                <span style={{ color: '#ef4444', fontWeight: 'bold' }}>-{currSymbol}{item.spent.toLocaleString()}</span>
                            </div>
                        )) : (
                            <div style={{ color: '#9CA3AF', textAlign: 'center', padding: '20px' }}>No expense categories found.</div>
                        )}
                    </div>
                </div>
            )}

            {/* #7 Settings Modal Overlay */}
            {showSettingsModal && (
                <div
                    onClick={() => setShowSettingsModal(false)}
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{ background: '#FFFFFF', border: '1px solid #E9E5F5', borderRadius: '20px', padding: '30px', width: '400px', boxShadow: '0 20px 60px rgba(124,58,237,0.15)' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1E1B4B' }}>Settings</h3>
                            <button onClick={() => setShowSettingsModal(false)} style={{ background: 'none', border: 'none', color: '#9CA3AF', fontSize: '20px', cursor: 'pointer' }}>✕</button>
                        </div>

                        {/* Profile Section */}
                        <div style={{ marginBottom: '25px' }}>
                            <h4 style={{ color: '#9CA3AF', fontSize: '12px', marginBottom: '12px', letterSpacing: '1px' }}>PROFILE</h4>
                            <div style={{ padding: '15px', background: '#F5F3FF', borderRadius: '12px', border: '1px solid #E9E5F5' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F5F3FF', border: '2px solid #7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Icons.ProfilePic />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600', color: '#1E1B4B' }}>{user ? user.firstName + ' ' + user.lastName : '...'}</div>
                                        <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{user ? user.email : '...'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Currency Preference */}
                        <div style={{ marginBottom: '25px' }}>
                            <h4 style={{ color: '#9CA3AF', fontSize: '12px', marginBottom: '12px', letterSpacing: '1px' }}>CURRENCY</h4>
                            <select
                                value={currency}
                                onChange={(e) => { setCurrency(e.target.value); localStorage.setItem('currency', e.target.value); }}
                                style={{ width: '100%', padding: '10px', background: '#F5F3FF', border: '1px solid #E9E5F5', color: '#1E1B4B', borderRadius: '8px', outline: 'none', cursor: 'pointer' }}
                            >
                                <option value="USD">$ USD — US Dollar</option>
                                <option value="EUR">€ EUR — Euro</option>
                                <option value="INR">₹ INR — Indian Rupee</option>
                            </select>
                        </div>

                        {/* Theme */}
                        <div>
                            <h4 style={{ color: '#9CA3AF', fontSize: '12px', marginBottom: '12px', letterSpacing: '1px' }}>THEME</h4>
                            <div style={{ padding: '12px 15px', background: '#F5F3FF', borderRadius: '12px', border: '1px solid #E9E5F5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '14px', color: '#6B7280' }}>Light Mode</span>
                                <div style={{ width: '36px', height: '20px', background: '#7C3AED', borderRadius: '10px', position: 'relative', cursor: 'pointer' }}>
                                    <div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', right: '2px' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
