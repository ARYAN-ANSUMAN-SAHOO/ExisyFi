import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

function Services() {
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
                    <a onClick={() => navigate("/services")} style={{ color: "white", cursor: "pointer" }}>Services</a>
                    <a onClick={() => navigate("/features")} style={{ cursor: "pointer" }}>Features</a>
                    <a onClick={() => navigate("/contact-us")} style={{ cursor: "pointer" }}>Contact Us</a>
                    <a onClick={() => navigate("/about-us")} style={{ cursor: "pointer" }}>About Us</a>
                </div>

                <button className="login-btn" onClick={() => navigate("/login")}>Log In →</button>
            </nav>

            <main className="hero" style={{ display: "block", marginTop: "40px" }}>
                <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>Our <span className="gradient-text">Services</span></h1>
                <p className="muted" style={{ fontSize: "18px", maxWidth: "800px" }}>
                    We offer a wide range of financial tracking services to help you stay on top of your game.
                </p>

                <div className="hero-cards" style={{ marginTop: "40px" }}>
                    <div className="glass-card">
                        <h3>Expense Tracking</h3>
                        <p className="muted">Monitor every penny you spend with our intuitive dashboard.</p>
                    </div>
                    <div className="glass-card">
                        <h3>Budget Planning</h3>
                        <p className="muted">Set smart budgets and get alerted when you're close to the limit.</p>
                    </div>
                    <div className="glass-card">
                        <h3>Investment Insights</h3>
                        <p className="muted">Get AI-driven insights on where to invest your savings.</p>
                    </div>
                    <div className="glass-card">
                        <h3>Bill Management</h3>
                        <p className="muted">Never miss a payment with automated reminders and tracking.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Services;
