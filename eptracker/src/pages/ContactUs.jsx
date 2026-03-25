import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./home.css";
import "./contact.css";

function ContactUs() {
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (status.message) setStatus({ type: '', message: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email || !formData.message) {
            setStatus({ type: 'error', message: 'All fields are required.' });
            return;
        }

        setStatus({ type: 'info', message: 'Sending message...' });

        try {
            const response = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setStatus({ type: 'success', message: 'Message sent successfully!' });
                setFormData({ name: '', email: '', message: '' });
            } else {
                const data = await response.json();
                setStatus({ type: 'error', message: data.message || 'Failed to send message.' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Server is unreachable. Please try again later.' });
        }
    };

    return (
        <div className="page contact-page">
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
                    <a
                        onClick={() => navigate("/contact-us")}
                        className={location.pathname === "/contact-us" ? "contact-active-link" : ""}
                        style={{ cursor: "pointer" }}
                    >Contact Us</a>
                    <a onClick={() => navigate("/about-us")} style={{ cursor: "pointer" }}>About Us</a>
                </div>

                <button className="login-btn" onClick={() => navigate("/login")}>Log In →</button>
            </nav>

            <main className="contact-content" style={{ marginTop: "60px" }}>
                {/* Header */}
                <div className="contact-header">
                    <h1>Get in <span className="gradient-text">Touch</span></h1>
                    <p>Have questions or need support? We are here tince to help you stay on top of your game.</p>
                </div>

                {/* Form Card */}
                <div className="contact-form-wrapper">
                    <h3>Send us a message</h3>

                    <form onSubmit={handleSubmit}>
                        {status.message && (
                            <div style={{ padding: '10px', marginBottom: '15px', borderRadius: '4px', backgroundColor: status.type === 'error' ? '#fee2e2' : status.type === 'success' ? '#dcfce7' : '#e0f2fe', color: status.type === 'error' ? '#991b1b' : status.type === 'success' ? '#166534' : '#075985' }}>
                                {status.message}
                            </div>
                        )}

                        {/* Name */}
                        <div className="contact-field-row">
                            <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} />
                            <div className="field-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#cu0)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <defs>
                                        <linearGradient id="cu0" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#3b82f6" />
                                            <stop offset="1" stopColor="#a855f7" />
                                        </linearGradient>
                                    </defs>
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="contact-field-row">
                            <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} />
                            <div className="field-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#cu1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <defs>
                                        <linearGradient id="cu1" x1="2" y1="4" x2="22" y2="20" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#3b82f6" />
                                            <stop offset="1" stopColor="#a855f7" />
                                        </linearGradient>
                                    </defs>
                                    <rect x="2" y="4" width="20" height="16" rx="2" />
                                    <path d="M22 7l-10 7L2 7" />
                                </svg>
                            </div>
                        </div>

                        {/* Message */}
                        <div className="contact-field-row" style={{ alignItems: "flex-start" }}>
                            <textarea name="message" placeholder="Message" rows="5" value={formData.message} onChange={handleChange} />
                            <div className="field-icon" style={{ paddingTop: "4px" }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#cu2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <defs>
                                        <linearGradient id="cu2" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#3b82f6" />
                                            <stop offset="1" stopColor="#a855f7" />
                                        </linearGradient>
                                    </defs>
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                    <line x1="9" y1="10" x2="15" y2="10" />
                                    <line x1="9" y1="14" x2="13" y2="14" />
                                </svg>
                            </div>
                        </div>

                        <button className="contact-send-btn" type="submit">Send Message</button>
                    </form>

                    <p className="contact-email-line">Email: support@exisyfi.com</p>
                </div>
            </main>
        </div>
    );
}

export default ContactUs;
