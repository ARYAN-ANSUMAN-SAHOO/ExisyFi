import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

function AboutUs() {
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
                    <a onClick={() => navigate("/features")} style={{ cursor: "pointer" }}>Features</a>
                    <a onClick={() => navigate("/contact-us")} style={{ cursor: "pointer" }}>Contact Us</a>
                    <a onClick={() => navigate("/about-us")} style={{ color: "white", cursor: "pointer" }}>About Us</a>
                </div>

                <button className="login-btn" onClick={() => navigate("/login")}>Log In →</button>
            </nav>

            <main className="hero" style={{ display: "block", marginTop: "40px" }}>
                <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>About <span className="gradient-text">ExisyFi</span></h1>
                <p className="muted" style={{ fontSize: "18px", maxWidth: "800px" }}>
                    Empowering individuals to take control of their financial future.
                </p>

                <section style={{ marginTop: "40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
                    <div className="glass-card">
                        <h3>Our Mission</h3>
                        <p className="muted" style={{ marginTop: "10px" }}>
                            To provide simple, powerful, and accessible financial tools that help people understand their spending habits and save for what matters most.
                        </p>
                    </div>

                    <div className="glass-card">
                        <h3>Our Vision</h3>
                        <p className="muted" style={{ marginTop: "10px" }}>
                            A world where financial stress is a thing of the past, and everyone has the confidence to manage their money effectively.
                        </p>
                    </div>
                </section>

                <section style={{ marginTop: "40px" }}>
                    <h2 style={{ marginBottom: "20px" }}>Meet the Team</h2>
                    <div className="hero-cards">
                        <div className="glass-card" style={{ textAlign: "center" }}>
                            <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "#444", margin: "0 auto 15px" }}></div>
                            <h4>Aryan Ansuman Sahoo</h4>
                            <p className="muted">CEO & Founder</p>
                        </div>
                        <div className="glass-card" style={{ textAlign: "center" }}>
                            <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "#444", margin: "0 auto 15px" }}></div>
                            <h4>Saswat Sumanjeet</h4>
                            <p className="muted">CTO</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default AboutUs;
