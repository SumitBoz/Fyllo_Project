// src/components/ToastProvider.jsx
import React from "react";
import { Toaster } from "react-hot-toast";

const ToastProvider = () => (
  <Toaster
    position="down-right"
    toastOptions={{
      duration: 2000, // disappears after 2 seconds
      style: {
        fontWeight: "bold",
        borderRadius: "0.5rem",
        padding: "12px 16px",
      },
      success: {
        style: { background: "#16a34a", color: "#fff" },
      },
      error: {
        style: { background: "#dc2626", color: "#fff" },
      },
    }}
  />
);

export default ToastProvider;
