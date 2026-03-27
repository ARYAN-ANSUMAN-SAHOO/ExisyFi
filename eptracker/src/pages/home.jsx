import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import { motion } from "framer-motion";


function Home() {
  const navigate = useNavigate();
  return (
    <div className="page">

      <nav className="navbar">
        <div className="logo">
          <div className="logo-ring">
            <div className="logo-dot"></div>
          </div>
          <span>ExisyFi</span>
        </div>

        <div className="nav-links">
          <a onClick={() => navigate("/services")} style={{ cursor: "pointer" }}>Services</a>
          <a onClick={() => navigate("/features")} style={{ cursor: "pointer" }}>Features</a>
          <a onClick={() => navigate("/contact-us")} style={{ cursor: "pointer" }}>Contact Us</a>
          <a onClick={() => navigate("/about-us")} style={{ cursor: "pointer" }}>About Us</a>
        </div>

        <button className="login-btn" onClick={() => { navigate("/login") }}>Log In →</button>
      </nav>

      <main className="hero">
        <section className="hero-text">
          <h1>
            Manage Your <br />
            Expenses Easily With <br />
            <span className="gradient-text">ExisyFi</span>
          </h1>

          <p>
            We are providing easiest way to manage expenses. Get a full view so you know where to save.
            Track spending, detect fraud, and keep tabs on rising subscription costs.
          </p>

          <button className="primary-btn" onClick={() => navigate("/register")}>Get Started</button>
        </section>

        <section className="hero-cards">

          <div className="card circle-card">
            <div className="circle-feature">
              <RotatingText />
              {/* <div className="circle-dot"></div>  */}
            </div>
          </div>

          <section className="dashboard-grid">
            {/* Donut Chart Card */}
            <div className="glass-card donut-section">
              <div className="card-header">Monthly Distribution</div>
              <div className="donut-container">
                <div className="donut-ring">
                  <div className="donut-center">
                    <span className="amount">$7,200</span>
                    <span className="label">Total Spent</span>
                  </div>
                </div>
                <ul className="donut-legend">
                  <li><span className="dot rent"></span> Rent & Bills</li>
                  <li><span className="dot groceries"></span> Groceries</li>
                  <li><span className="dot savings"></span> Savings</li>
                </ul>
              </div>
            </div>

            {/* Spending Trends Card */}
            <div className="glass-card trends-section">
              <div className="card-header">Monthly Spending Trends</div>
              <div className="bar-chart">
                <div className="bar" style={{ height: "35%" }}><span>35%</span></div>
                <div className="bar" style={{ height: "52%" }}><span>52%</span></div>
                <div className="bar active" style={{ height: "88%" }}><span>88%</span></div>
                <div className="bar" style={{ height: "70%" }}><span>70%</span></div>
                <div className="bar" style={{ height: "63%" }}><span>63%</span></div>
              </div>
            </div>
          </section>






          <div className="card wide-card">
            <div className="graph-line">
              <PulsingGraph />
            </div>
          </div>

        </section>


      </main>



      {/* footer */}
      <footer className="footer">
        <div className="footer-content">

          {/* Left section */}
          <div className="footer-left">
            <h4 style={{ color: '#aaa', fontSize: '14px', marginBottom: '20px', fontWeight: '400' }}>Trusted by</h4>
            <div className="trusted-brands">
              <span className="brand-text">citibank</span>
              <span className="brand-text">DBS</span>
              <span className="brand-text">Bank of America</span>
              <span className="brand-text">HSBC</span>
              <span className="brand-text">Axion</span>
              <span className="brand-text">CHASE</span>
            </div>
          </div>



        </div>


        <div className="footer-bottom">
          © 2026 ExisyFi. All rights reserved.
        </div>
      </footer>



    </div>
  );
}

// pulsating graph


const PulsingGraph = () => (
  <svg
    viewBox="0 0 400 160"
    width="100%"
    height="100%"
    preserveAspectRatio="none"
    style={{ display: 'block' }}
  >
    <defs>
      <linearGradient id="graphGradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="rgba(127, 255, 212, 0.2)" />
        <stop offset="100%" stopColor="rgba(255, 122, 162, 0.2)" />
      </linearGradient>
    </defs>

    <motion.path
      d="M 0 140 Q 50 120 100 130 T 200 80 T 300 60 T 400 20"
      fill="transparent"
      stroke="url(#graphGradient)"
      strokeWidth="3"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 2.5, ease: "easeInOut" }}
    />

    <motion.circle
      cx="400"
      cy="20"
      r="4"
      fill="#ff7aa2"
      initial={{ scale: 0 }}
      animate={{ scale: [1, 1.8, 1], opacity: [1, 0.4, 1] }}
      transition={{ delay: 2.5, duration: 2, repeat: Infinity }}
    />
  </svg>
);

const RotatingText = () => (
  <div className="rotating-container">
    <svg viewBox="0 0 200 200" className="rotating-text">
      <path
        id="circlePath"
        d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
        fill="transparent"
      />
      <text fill="#6D28D9" fontSize="18" fontWeight="200">
        <textPath xlinkHref="#circlePath">
          Budget Planner • Spend Smart • Save More • Better Future •
          Budget Planner • Spend Smart • Save More
        </textPath>
      </text>
    </svg>
    <div className="star-icon">✦</div>
  </div>
);

export default Home;