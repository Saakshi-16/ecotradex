// client-react/src/App.jsx

import { useState } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Navbar from "./Navbar";
import Toast from "./Toast";
import "./style.css";

function App() {
  const [email, setEmail] = useState(null);
  const [theme, setTheme] = useState("light"); // "light" or "dark"
  const [toast, setToast] = useState(""); // toast message

  // Logout handler
  const handleLogout = () => {
    setEmail(null);
    setToast("Logged out successfully");
    setTimeout(() => setToast(""), 2500);
  };

  return (
    <div className={`app-root theme-${theme}`}>
      {/* Navbar */}
      <Navbar
        email={email}
        onToggleTheme={() => setTheme(theme === "light" ? "dark" : "light")}
        theme={theme}
        onLogout={handleLogout}
      />

      {/* Toast Notification */}
      {toast && <Toast message={toast} />}

      {/* Main Content */}
      <main className="page-transition">
        {!email ? (
          <Login
            onLogin={(e) => {
              setEmail(e);

              // Success toast when login happens
              setToast("Login Successful — Welcome to EcoTradeX 🎉");

              // Auto-hide toast after 3 seconds
              setTimeout(() => setToast(""), 3000);
            }}
          />
        ) : (
          <div className="fade-in-dashboard">
            <Dashboard email={email} theme={theme} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
