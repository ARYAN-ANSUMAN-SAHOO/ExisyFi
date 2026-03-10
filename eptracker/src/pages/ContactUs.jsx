import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

function ContactUs() {
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
                    <a onClick={() => navigate("/contact-us")} style={{ color: "white", cursor: "pointer" }}>Contact Us</a>
                    <a onClick={() => navigate("/about-us")} style={{ cursor: "pointer" }}>About Us</a>
                </div>

                <button className="login-btn" onClick={() => navigate("/login")}>Log In →</button>
            </nav>

            <main className="hero" style={{ display: "block", marginTop: "40px" }}>
                <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>Get in <span className="gradient-text">Touch</span></h1>
                <p className="muted" style={{ fontSize: "18px", maxWidth: "800px" }}>
                    Have questions or need support? We are here to help you 24/7.
                </p>

                <div style={{ marginTop: "40px", maxWidth: "600px" }}>
                    <div className="glass-card">
                        <h3 style={{ marginBottom: "15px" }}>Send us a message</h3>
                        <form style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            <input type="text" placeholder="Your Name" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid #444", padding: "12px", borderRadius: "8px", color: "white" }} />
                            <input type="email" placeholder="Your Email" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid #444", padding: "12px", borderRadius: "8px", color: "white" }} />
                            <textarea placeholder="Message" rows="4" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid #444", padding: "12px", borderRadius: "8px", color: "white" }}></textarea>
                            <button className="primary-btn" type="button">Send Message</button>
                        </form>
                    </div>

                    <div style={{ marginTop: "20px" }}>
                        <p className="muted">Email: support@exisyfi.com</p>
                        <p className="muted">Phone: +1 (800) 123-4567</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ContactUs;
