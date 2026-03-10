import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

function Features() {
    const navigate = useNavigate();

    return (
        <div className="page">
            <nav className="navbar">
                <div className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                    <div className="logo-ring">
                        <div className="logo-dot"></div>
                    </div>
                    <span>ExisyFi</span>
                </div>

                <div className="nav-links">
                    <a onClick={() => navigate("/services")} style={{ cursor: "pointer" }}>Services</a>
                    <a onClick={() => navigate("/features")} style={{ color: "white", cursor: "pointer" }}>Features</a>
                    <a onClick={() => navigate("/contact-us")} style={{ cursor: "pointer" }}>Contact Us</a>
                    <a onClick={() => navigate("/about-us")} style={{ cursor: "pointer" }}>About Us</a>
                </div>

                <button className="login-btn" onClick={() => navigate("/login")}>Log In →</button>
            </nav>

            <main className="hero" style={{ display: "block", marginTop: "40px" }}>
                <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>Premium <span className="gradient-text">Features</span></h1>
                <p className="muted" style={{ fontSize: "18px", maxWidth: "800px" }}>
                    Discover the tools that make ExisyFi the best choice for your financial health.
                </p>

                <section className="dashboard-grid" style={{ marginTop: "40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    <div className="glass-card">
                        <h2>Real-time Analytics</h2>
                        <p className="muted">Watch your data update in real-time as transactions happen.</p>
                    </div>

                    <div className="glass-card">
                        <h2>Multi-Currency Support</h2>
                        <p className="muted">Travel the world and track expenses in any currency.</p>
                    </div>

                    <div className="glass-card">
                        <h2>Secure & Private</h2>
                        <p className="muted">Your data is encrypted with bank-grade security protocols.</p>
                    </div>

                    <div className="glass-card">
                        <h2>Export Reports</h2>
                        <p className="muted">Generate PDF and Excel reports for tax season or personal review.</p>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Features;
