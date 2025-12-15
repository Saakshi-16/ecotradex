// client-react/src/Login.jsx
import React, { useState } from "react";
import "./style.css";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() !== "") {
      setLoading(true);

      setTimeout(() => {
        onLogin(email.trim());
      }, 1000);
    }
  };

  return (
    <div className="login-wrapper">
      {/* Animated Background Waves */}
      <div className="wave"></div>
      <div className="wave wave2"></div>
      <div className="wave wave3"></div>

      <div className="login-card fade-in">
        {/* Branding */}
        <div className="login-logo-container">
          <div className="logo-dot login-logo"></div>
          <h2 className="login-title">EcoTradeX</h2>
        </div>

        {/* Welcome Text */}
        <h3 className="welcome-text">Welcome to EcoTradeX 👋</h3>
        <p className="welcome-subtext">
          Track real-time markets and stay ahead of trends.
        </p>

        {/* Ticker Animation Bar */}
        <div className="ticker-bar">
          <marquee behavior="scroll" direction="left" scrollamount="5">
            TSLA ▲ 1.42%  META ▼ 0.83%  AMZN ▲ 0.54%  GOOG ▲ 2.11%  NVDA ▼ 1.25%
          </marquee>
        </div>

        {/* Login Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-label">Email Address</label>

          <input
            type="email"
            className="login-input"
            placeholder="trader@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            className={`login-btn ${loading ? "loading" : ""}`}
            type="submit"
          >
            {loading ? <div className="loader"></div> : "Continue"}
          </button>
        </form>

        <p className="forgot-link">Forgot email?</p>
      </div>
    </div>
  );
}
