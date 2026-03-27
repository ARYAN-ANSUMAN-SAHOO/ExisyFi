import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./home.css";
import "./services.css";
// If you successfully installed lucide-react you can use these,
// otherwise I am providing custom SVG representations similar to the image.

function Services() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="page services-page">
            <nav className="navbar">
                <div className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                    <div className="logo-ring">
                        <div className="logo-dot"></div>
                    </div>
                    <span>ExisyFi</span>
                </div>

                <div className="nav-links">
                    <a 
                        onClick={() => navigate("/services")} 
                        className={location.pathname === "/services" ? "active-link" : ""}
                        style={{ cursor: "pointer" }}
                    >Services</a>
                    <a onClick={() => navigate("/features")} style={{ cursor: "pointer" }}>Features</a>
                    <a onClick={() => navigate("/contact-us")} style={{ cursor: "pointer" }}>Contact Us</a>
                    <a onClick={() => navigate("/about-us")} style={{ cursor: "pointer" }}>About Us</a>
                </div>

                <button className="login-btn" onClick={() => navigate("/login")}>Log In →</button>
            </nav>

            <main className="services-content" style={{ display: "block", marginTop: "60px" }}>
                <div className="services-header">
                    <h1>Our <span className="gradient-text">Services</span></h1>
                    <p>
                        We offer a wide range of financial tracking services to help you stay on top of your game.
                    </p>
                </div>

                <div className="services-grid" style={{ marginTop: "50px" }}>
                    {/* Expense Tracking */}
                    <div className="service-card-wrapper">
                        <div className="service-card">
                            <div className="service-info">
                                <h3>Expense Tracking</h3>
                                <p>Monitor every penny you spend with our intuitive dashboard.</p>
                            </div>
                            <div className="service-icon">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="url(#paint0_linear)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <defs>
                                        <linearGradient id="paint0_linear" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#7C3AED" />
                                            <stop offset="1" stopColor="#A78BFA" />
                                        </linearGradient>
                                    </defs>
                                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                                    <circle cx="16" cy="16" r="6" stroke="url(#paint0_linear)" strokeWidth="1.5"/>
                                    <path d="M20 20l2 2" stroke="#7C3AED"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Budget Planning */}
                    <div className="service-card-wrapper">
                        <div className="service-card">
                            <div className="service-info">
                                <h3>Budget Planning</h3>
                                <p>Set smart budgets and get alerted when you're close to the limit.</p>
                            </div>
                            <div className="service-icon">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="url(#paint1_linear)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <defs>
                                        <linearGradient id="paint1_linear" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#0ea5e9" />
                                            <stop offset="1" stopColor="#7C3AED" />
                                        </linearGradient>
                                    </defs>
                                    <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
                                    <rect x="9" y="9" width="6" height="8" />
                                    <line x1="9" y1="17" x2="15" y2="17" />
                                    <line x1="14" y1="11" x2="14" y2="11.01" />
                                    <line x1="10" y1="11" x2="10" y2="11.01" />
                                    <line x1="14" y1="14" x2="14" y2="14.01" />
                                    <line x1="10" y1="14" x2="10" y2="14.01" />
                                    <path d="M22 10v10" />
                                    <path d="M20 14h4" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Investment Insights */}
                    <div className="service-card-wrapper">
                        <div className="service-card">
                            <div className="service-info">
                                <h3>Investment Insights</h3>
                                <p>Get AI-driven insights on where to invest your savings.</p>
                            </div>
                            <div className="service-icon">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="url(#paint2_linear)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <defs>
                                        <linearGradient id="paint2_linear" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#A78BFA" />
                                            <stop offset="1" stopColor="#7C3AED" />
                                        </linearGradient>
                                    </defs>
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                    <circle cx="12" cy="18" r="3" stroke="#7C3AED" />
                                    <path d="M12 15v1M12 21v1M10 18H9M15 18h-1" stroke="#7C3AED"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Bill Management */}
                    <div className="service-card-wrapper">
                        <div className="service-card">
                            <div className="service-info">
                                <h3>Bill Management</h3>
                                <p>Never miss a payment with automated reminders and tracking.</p>
                            </div>
                            <div className="service-icon">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="url(#paint3_linear)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <defs>
                                        <linearGradient id="paint3_linear" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#7C3AED" />
                                            <stop offset="1" stopColor="#f43f5e" />
                                        </linearGradient>
                                    </defs>
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                    <path d="M8 14l2 2 4-4" />
                                    <path d="M18 18h.01" />
                                    <path d="M14 18h.01" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Services;
