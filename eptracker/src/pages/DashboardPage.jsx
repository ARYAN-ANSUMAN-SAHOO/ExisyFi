import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransactionContext } from '../context/TransactionContext';
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
    Plus: () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
};

const DashboardPage = () => {
    const navigate = useNavigate();
    const { transactions } = useContext(TransactionContext);

    // Calculate totals
    const totalExpense = transactions.reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = 45000; // Hardcoded for demo
    const totalSavings = totalIncome - totalExpense;

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
                    <a href="#settings" className="nav-item"><Icons.Settings /> Settings</a>
                    <a href="#help" className="nav-item"><Icons.User /> Help</a>
                </div>

                <div className="user-profile">
                    <div className="avatar"></div>
                    <div className="user-info">
                        <span className="name">Chris Flores</span>
                        <span className="email">felicia.reid@exple.com</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="top-bar">
                    <div className="search-bar">
                        <Icons.Search />
                        <span>Search for...</span>
                    </div>
                </header>

                {/* Stats Row */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-header">
                            <div className="icon-box">
                                $
                            </div>
                            <span className="menu-dots">...</span>
                        </div>
                        <div className="stat-label" style={{ color: '#888', fontSize: '12px' }}>TOTAL INCOME</div>
                        <div className="stat-value">${totalIncome.toLocaleString()}</div>
                        <div className="stat-change up">↗ 6% vs last 30 days</div>
                    </div>

                    <div className="stat-card accent">
                        <div className="stat-header">
                            <div className="icon-box">
                                <Icons.Wallet />
                            </div>
                            <span className="menu-dots">...</span>
                        </div>
                        <div className="stat-label">TOTAL EXPENSE</div>
                        <div className="stat-value">${totalExpense.toLocaleString()}</div>
                        <div className="stat-change">↘ 2% vs last 30 days</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-header">
                            <div className="icon-box">
                                <Icons.Chart />
                            </div>
                            <button style={{ background: '#1a1a1a', border: 'none', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '10px' }}>View Details</button>
                        </div>
                        <div className="stat-label" style={{ color: '#888', fontSize: '12px' }}>TOTAL SAVINGS</div>
                        <div className="stat-value">${totalSavings.toLocaleString()}</div>
                        <div className="stat-change down">↘ 1% vs last 30 days</div>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="chart-section" style={{ marginBottom: '30px' }}>
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h3 className="card-title">Top 5 Expense Source</h3>
                            <span style={{ color: '#666' }}>...</span>
                        </div>
                        <div className="bar-chart-container">
                            {[
                                { label: 'Repairs', h: '40%' },
                                { label: 'House Rent', h: '85%', active: true, val: '$3519' },
                                { label: 'Licenses', h: '55%' },
                                { label: 'Transport', h: '25%' },
                                { label: 'Laptop', h: '60%' },
                                { label: 'Net Bill', h: '45%' },
                                { label: 'AC', h: '20%' },
                                { label: 'Dish Bill', h: '50%' },
                                { label: 'School', h: '30%' },
                                { label: 'Plants', h: '20%' },
                            ].map((item, i) => (
                                <div className="bar-group" key={i}>
                                    <div className={`bar ${item.active ? 'highlight' : ''}`} style={{ height: item.h, opacity: item.active ? 1 : 0.6 }}>
                                        {item.active && <div className="bar-value-pop">{item.val}</div>}
                                    </div>
                                    <span className="bar-label">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="bottom-row">
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h3 className="card-title">Report Overview</h3>
                            <span style={{ color: '#666' }}>...</span>
                        </div>
                        <div className="pie-chart-wrapper">
                            <div className="pie-chart">
                                <div className="pie-hole"></div>
                            </div>
                            <div className="pie-legend">
                                <div className="legend-item">
                                    <div className="dot" style={{ background: '#a855f7' }}></div>
                                    <span>Income ${totalIncome.toLocaleString()}</span>
                                </div>
                                <div className="legend-item">
                                    <div className="dot" style={{ background: '#3b82f6' }}></div>
                                    <span>Expense ${totalExpense.toLocaleString()}</span>
                                </div>
                                <div className="legend-item">
                                    <div className="dot" style={{ background: '#1a1a1a', border: '1px solid #333' }}></div>
                                    <span>Savings ${totalSavings.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <div className="card-header">
                            <h3 className="card-title">Expense Activity</h3>
                            <div style={{ fontSize: '12px', color: '#3b82f6' }}>- Actual exp</div>
                        </div>
                        {/* SVG Line Chart */}
                        <div style={{ height: '140px', width: '100%', position: 'relative' }}>
                            <svg viewBox="0 0 500 140" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                                {/* Grid lines */}
                                <line x1="0" y1="35" x2="500" y2="35" stroke="#222" strokeWidth="1" />
                                <line x1="0" y1="70" x2="500" y2="70" stroke="#222" strokeWidth="1" />
                                <line x1="0" y1="105" x2="500" y2="105" stroke="#222" strokeWidth="1" />

                                {/* Path */}
                                <polyline
                                    points="0,110 50,100 100,90 150,95 200,80 250,90 300,70 350,75 400,110 450,100"
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="2"
                                />
                                {/* Dots */}
                                {[
                                    [50, 100], [100, 90], [150, 95], [200, 80], [250, 90], [300, 70], [350, 75], [400, 110], [450, 100]
                                ].map((p, i) => (
                                    <circle cx={p[0]} cy={p[1]} r="3" fill="#000" stroke="#3b82f6" strokeWidth="2" key={i} />
                                ))}
                            </svg>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', fontSize: '10px', marginTop: '5px' }}>
                                <span>Jan 1</span><span>Jan 2</span><span>Jan 3</span><span>Jan 4</span><span>Jan 5</span><span>Jan 6</span><span>Jan 7</span>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default DashboardPage;
