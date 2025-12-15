// client-react/src/Toast.jsx
import React from "react";
import "./style.css";

export default function Toast({ message }) {
  return (
    <div className="toast-container">
      <div className="toast">{message}</div>
    </div>
  );
}
