import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./home.css";
import "./features.css";

function Features() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="page features-page">
            <nav className="navbar">
                <div className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                    <div className="logo-ring">
                        <div className="logo-dot"></div>
                    </div>
                    <span>ExisyFi</span>
                </div>

                <div className="nav-links">
                    <a onClick={() => navigate("/services")} style={{ cursor: "pointer" }}>Services</a>
                    <a
                        onClick={() => navigate("/features")}
                        className={location.pathname === "/features" ? "features-active-link" : ""}
                        style={{ cursor: "pointer" }}
                    >Features</a>
                    <a onClick={() => navigate("/contact-us")} style={{ cursor: "pointer" }}>Contact Us</a>
                    <a onClick={() => navigate("/about-us")} style={{ cursor: "pointer" }}>About Us</a>
                </div>

                <button className="login-btn" onClick={() => navigate("/login")}>Log In →</button>
            </nav>

            <main className="features-content" style={{ display: "block", marginTop: "60px" }}>
                <div className="features-header">
                    <h1>Premium <span className="gradient-text">Features</span></h1>
                    <p>
                        We offer a wide range of financial tracking services to help you stay on top of your game.
                    </p>
                </div>

                <div className="features-grid" style={{ marginTop: "50px" }}>

                    {/* Real-time Analytics */}
                    <div className="feature-card-wrapper">
                        <div className="feature-card">
                            <div className="feature-info">
                                <h3>Real-time Analytics</h3>
                                <p>Watch your data update in real-time our intuitive dashboard.</p>
                            </div>
                            <div className="feature-icon">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <defs>
                                        <linearGradient id="fg0" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#a855f7" />
                                            <stop offset="1" stopColor="#3b82f6" />
                                        </linearGradient>
                                    </defs>
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="url(#fg0)" />
                                    <circle cx="17" cy="6" r="3" stroke="#a855f7" />
                                    <path d="M17 3v1M17 9v1M14 6h1M20 6h1" stroke="#a855f7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Multi-Currency Support */}
                    <div className="feature-card-wrapper">
                        <div className="feature-card">
                            <div className="feature-info">
                                <h3>Multi-Currency Support</h3>
                                <p>Travel the world and track alerted when you're close to the limit.</p>
                            </div>
                            <div className="feature-icon">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <defs>
                                        <linearGradient id="fg1" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#0ea5e9" />
                                            <stop offset="1" stopColor="#a855f7" />
                                        </linearGradient>
                                    </defs>
                                    <circle cx="12" cy="12" r="10" stroke="url(#fg1)" />
                                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="url(#fg1)" />
                                    <path d="M8 8h2M14 8h2M8 16h2M14 16h2" stroke="#0ea5e9" />
                                    <text x="10" y="13.5" fontSize="5" fill="#a855f7" fontWeight="bold">$</text>
                                    <text x="15" y="10" fontSize="4" fill="#0ea5e9" fontWeight="bold">€</text>
                                    <text x="5" y="16" fontSize="4" fill="#a855f7" fontWeight="bold">£</text>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Secure & Private */}
                    <div className="feature-card-wrapper">
                        <div className="feature-card">
                            <div className="feature-info">
                                <h3>Secure &amp; Private</h3>
                                <p>Your data is encrypted with bank-grade security protocols.</p>
                            </div>
                            <div className="feature-icon">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <defs>
                                        <linearGradient id="fg2" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#a855f7" />
                                            <stop offset="1" stopColor="#3b82f6" />
                                        </linearGradient>
                                    </defs>
                                    <rect x="5" y="11" width="14" height="10" rx="2" ry="2" stroke="url(#fg2)" />
                                    <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="url(#fg2)" />
                                    <circle cx="12" cy="16" r="1" fill="#a855f7" />
                                    <text x="9" y="17.5" fontSize="4" fill="#3b82f6" fontWeight="bold">AI</text>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Export Reports */}
                    <div className="feature-card-wrapper">
                        <div className="feature-card">
                            <div className="feature-info">
                                <h3>Export Reports</h3>
                                <p>Generate PDF and Excel reports for tax season or personal review.</p>
                            </div>
                            <div className="feature-icon">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <defs>
                                        <linearGradient id="fg3" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#3b82f6" />
                                            <stop offset="1" stopColor="#a855f7" />
                                        </linearGradient>
                                    </defs>
                                    {/* PDF doc */}
                                    <rect x="3" y="3" width="10" height="12" rx="1" stroke="url(#fg3)" />
                                    <text x="4.5" y="11" fontSize="4.5" fill="#3b82f6" fontWeight="bold">PDF</text>
                                    {/* XLS doc behind */}
                                    <rect x="9" y="7" width="10" height="12" rx="1" stroke="url(#fg3)" />
                                    <text x="10.5" y="15" fontSize="4" fill="#a855f7" fontWeight="bold">XLS</text>
                                    {/* Download arrow */}
                                    <circle cx="17" cy="19" r="3" stroke="#a855f7" />
                                    <path d="M17 17v2l1 1" stroke="#a855f7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

export default Features;
