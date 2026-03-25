import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./home.css";
import "./about.css";

function AboutUs() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="page about-page">
            <nav className="navbar">
                <div className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                    <div className="logo-ring">
                        <div className="logo-dot"></div>
                    </div>
                    <span>ExisyFi</span>
                </div>

                <div className="nav-links">
                    <a onClick={() => navigate("/services")} style={{ cursor: "pointer" }}>Services</a>
                    <a onClick={() => navigate("/features")} style={{ cursor: "pointer" }}>Features</a>
                    <a onClick={() => navigate("/contact-us")} style={{ cursor: "pointer" }}>Contact Us</a>
                    <a
                        onClick={() => navigate("/about-us")}
                        className={location.pathname === "/about-us" ? "about-active-link" : ""}
                        style={{ cursor: "pointer" }}
                    >About Us</a>
                </div>

                <button className="login-btn" onClick={() => navigate("/login")}>Log In →</button>
            </nav>

            <main className="about-content" style={{ marginTop: "60px" }}>

                {/* Header */}
                <div className="about-header">
                    <h1>About <span className="gradient-text">ExisyFi</span></h1>
                    <p>Empowering individuals to take control of their financial future.</p>
                </div>

                {/* Mission & Vision */}
                <div className="about-cards-row">
                    {/* Our Mission */}
                    <div className="about-info-card">
                        <div className="about-info-text">
                            <h3>Our Mission</h3>
                            <p>To provide simple, powerful, and accessible financial tools that help people understand their spending habits and save for what matters most.</p>
                        </div>
                        <div className="about-info-icon">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <defs>
                                    <linearGradient id="ab0" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#a855f7" />
                                        <stop offset="1" stopColor="#3b82f6" />
                                    </linearGradient>
                                </defs>
                                {/* Rocket */}
                                <path d="M12 2C12 2 7 6 7 12l5 2 5-2c0-6-5-10-5-10z" stroke="url(#ab0)" fill="rgba(168,85,247,0.1)" />
                                <path d="M7 12l-2 4 3-1M17 12l2 4-3-1" stroke="url(#ab0)" />
                                <circle cx="12" cy="12" r="2" stroke="#a855f7" fill="rgba(168,85,247,0.2)" />
                                <path d="M10 20c0 1 1 2 2 2s2-1 2-2v-2h-4v2z" stroke="url(#ab0)" fill="rgba(59,130,246,0.1)" />
                            </svg>
                        </div>
                    </div>

                    {/* Our Vision */}
                    <div className="about-info-card">
                        <div className="about-info-text">
                            <h3>Our Vision</h3>
                            <p>A world where financial stress is a thing of the past, and everyone has the confidence to manage their effectively.</p>
                        </div>
                        <div className="about-info-icon">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <defs>
                                    <linearGradient id="ab1" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#3b82f6" />
                                        <stop offset="1" stopColor="#a855f7" />
                                    </linearGradient>
                                </defs>
                                {/* Eye */}
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="url(#ab1)" fill="rgba(59,130,246,0.07)" />
                                <circle cx="12" cy="12" r="3" stroke="#a855f7" fill="rgba(168,85,247,0.15)" />
                                {/* Chart upward arrow */}
                                <polyline points="4 18 8 14 12 16 18 10" stroke="url(#ab1)" />
                                <polyline points="15 10 18 10 18 13" stroke="url(#ab1)" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Meet the Team */}
                <h2 className="about-team-title">Meet the Team</h2>

                <div className="about-team-row">
                    {/* Aryan */}
                    <div className="team-card">
                        {/* Circuit decoration */}
                        <svg className="team-card-circuit" viewBox="0 0 120 100" fill="none" preserveAspectRatio="none">
                            <line x1="10" y1="20" x2="80" y2="20" stroke="#a855f7" strokeWidth="0.8"/>
                            <line x1="80" y1="20" x2="80" y2="50" stroke="#a855f7" strokeWidth="0.8"/>
                            <circle cx="80" cy="50" r="3" fill="#a855f7"/>
                            <line x1="80" y1="50" x2="110" y2="50" stroke="#3b82f6" strokeWidth="0.8"/>
                            <line x1="30" y1="70" x2="100" y2="70" stroke="#3b82f6" strokeWidth="0.8"/>
                            <circle cx="30" cy="70" r="2.5" fill="#3b82f6"/>
                            <line x1="50" y1="85" x2="110" y2="85" stroke="#a855f7" strokeWidth="0.8"/>
                        </svg>

                        <div className="team-photo-wrapper">
                            <div className="team-photo-ring">
                                <img src="/aryan.png" alt="Aryan Ansuman Sahoo" onError={(e) => { e.target.style.display='none'; e.target.parentNode.style.background='linear-gradient(135deg,#3b82f6,#a855f7)'; }} />
                            </div>
                        </div>
                        <div className="team-info">
                            <h4>Aryan Ansuman Sahoo</h4>
                            <p>CEO &amp; Founder</p>
                        </div>
                    </div>

                    {/* Saswat */}
                    <div className="team-card">
                        <svg className="team-card-circuit" viewBox="0 0 120 100" fill="none" preserveAspectRatio="none">
                            <line x1="10" y1="30" x2="70" y2="30" stroke="#3b82f6" strokeWidth="0.8"/>
                            <line x1="70" y1="30" x2="70" y2="60" stroke="#3b82f6" strokeWidth="0.8"/>
                            <circle cx="70" cy="60" r="3" fill="#3b82f6"/>
                            <line x1="70" y1="60" x2="110" y2="60" stroke="#a855f7" strokeWidth="0.8"/>
                            <line x1="20" y1="75" x2="90" y2="75" stroke="#a855f7" strokeWidth="0.8"/>
                            <circle cx="90" cy="75" r="2.5" fill="#a855f7"/>
                            <line x1="40" y1="88" x2="110" y2="88" stroke="#3b82f6" strokeWidth="0.8"/>
                        </svg>

                        <div className="team-photo-wrapper">
                            <div className="team-photo-ring">
                                <img src="/saswat.png" alt="Saswat Sumanjeet" onError={(e) => { e.target.style.display='none'; e.target.parentNode.style.background='linear-gradient(135deg,#a855f7,#3b82f6)'; }} />
                            </div>
                        </div>
                        <div className="team-info">
                            <h4>Saswat Sumanjeet</h4>
                            <p>CTO</p>
                        </div>
                    </div>
                </div>

                <p className="about-email-line">Email: support@exisyfi.com</p>
            </main>
        </div>
    );
}

export default AboutUs;

