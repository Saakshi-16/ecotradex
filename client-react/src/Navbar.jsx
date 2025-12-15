// client-react/src/Navbar.jsx
import React from "react";

export default function Navbar({ email, onToggleTheme, theme, onLogout }) {
  return (
    <header className="nav-bar">
      <div className="nav-left">
        <div className="brand">
          <div className="logo-dot" />
          <span className="brand-name">EcoTradeX</span>
        </div>
      </div>

      <div className="nav-right">
        {email && <div className="nav-email">{email}</div>}

        {/* Theme Toggle Button (Sun/Moon icon) */}
        <button
          className="icon-btn"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {theme === "light" ? (
            // moon icon
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                fill="currentColor"
              />
            </svg>
          ) : (
            // sun icon
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M6.76 4.84l-1.8-1.79L3.17 4.84l1.79 1.8 1.8-1.8zM1 13h3v-2H1v2zm10 9h2v-3h-2v3zm7.03-16.19l1.8-1.79-1.79-1.79-1.8 1.8 1.79 1.78zM17.24 19.16l1.79 1.79 1.79-1.79-1.8-1.8-1.78 1.8zM20 11v2h3v-2h-3zM12 4a8 8 0 100 16 8 8 0 000-16z"
                fill="currentColor"
              />
            </svg>
          )}
        </button>

        {email && (
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
