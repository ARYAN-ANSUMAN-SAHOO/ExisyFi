import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './dashboard.css';

const FinancialReport = () => {
    const navigate = useNavigate();

    return (
        <motion.div
            className="dashboard-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ padding: '20px', height: '100vh', overflow: 'hidden' }}
        >
            <div className="main-content" style={{ marginLeft: 0, width: '100%', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Header Section */}
                <div className="glass-card-sleek" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => navigate('/dashboard')}
                        className="primary-btn"
                        style={{ padding: '8px 16px', fontSize: '14px' }}
                    >
                        ← Back
                    </motion.button>
                    <h2 style={{ margin: 0, color: 'white', fontSize: '24px' }}>Generate Financial Report</h2>
                    <div style={{ width: '80px' }}></div> {/* Spacer for centering */}
                </div>

                {/* Filters Section */}
                <div className="glass-card-sleek" style={{ padding: '20px', display: 'flex', gap: '20px', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', color: '#ccc', marginBottom: '8px', fontSize: '14px' }}>Time Period</label>
                        <select style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px', outline: 'none' }}>
                            <option>Last 30 Days</option>
                            <option>Last 3 Months</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', color: '#ccc', marginBottom: '8px', fontSize: '14px' }}>Report Type</label>
                        <select style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px', outline: 'none' }}>
                            <option>Expense Report</option>
                            <option>Income Statement</option>
                            <option>Balance Sheet</option>
                        </select>
                    </div>
                    <div>
                        <button className="primary-btn" style={{ padding: '10px 20px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>
                            Generate Report
                        </button>
                    </div>
                </div>

                {/* Charts Section */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.5fr', gap: '20px', flex: 1 }}>

                    {/* Pie Chart Card */}
                    <div className="glass-card-sleek" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                        <h3 className="card-title" style={{ marginBottom: '20px' }}>Spending by Category</h3>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                            <div className="pie-chart" style={{ width: '180px', height: '180px', background: 'conic-gradient(#a855f7 0% 35%, #3b82f6 35% 60%, #10b981 60% 80%, #f59e0b 80% 100%)' }}>
                                <div className="pie-hole" style={{ width: '100px', height: '100px', background: 'rgba(0,0,0,0.8)' }}></div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#ccc' }}>
                                    <span style={{ width: '10px', height: '10px', background: '#a855f7', borderRadius: '2px' }}></span> Housing
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#ccc' }}>
                                    <span style={{ width: '10px', height: '10px', background: '#3b82f6', borderRadius: '2px' }}></span> Food
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#ccc' }}>
                                    <span style={{ width: '10px', height: '10px', background: '#10b981', borderRadius: '2px' }}></span> Transport
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#ccc' }}>
                                    <span style={{ width: '10px', height: '10px', background: '#f59e0b', borderRadius: '2px' }}></span> Others
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bar Chart Card */}
                    <div className="glass-card-sleek" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                        <div className="card-header" style={{ marginBottom: '10px' }}>
                            <h3 className="card-title">Monthly Trends</h3>
                        </div>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '15px', paddingBottom: '10px', borderLeft: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingLeft: '10px' }}>
                            {/* Y-Axis Labels (Simple) */}
                            <div style={{ position: 'absolute', left: '40px', bottom: '80px', display: 'flex', flexDirection: 'column', gap: '30px', fontSize: '10px', color: '#666', pointerEvents: 'none' }}>
                                {/* Placeholder for axis labels if needed, or keeping it clean */}
                            </div>

                            {[20, 35, 45, 60, 65, 75, 60, 50].map((h, i) => (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                        style={{ width: '100%', maxWidth: '30px', background: i % 2 === 0 ? '#aaa' : '#888', borderRadius: '4px 4px 0 0', opacity: 0.8 }}
                                    />
                                    <span style={{ fontSize: '10px', color: '#888' }}>{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'][i]}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="glass-card-sleek" style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
                    <button className="primary-btn" style={{ padding: '12px 40px', background: '#ddd', color: 'black', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        Download Report
                    </button>
                </div>

            </div>
        </motion.div>
    );
};

export default FinancialReport;
