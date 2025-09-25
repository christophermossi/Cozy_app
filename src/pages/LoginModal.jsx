import React, { useState } from "react";
import { useIp } from "../context/IpContext"; // Import IpContext
import "./LoginModal.css";

const LoginModal = ({ isOpen, onClose, onSwitchToSignUp, onLoginSuccess }) => {
  const { callBackend } = useIp(); // Use IpContext for backend calls
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await callBackend("/login", {
        method: "POST",
        body: formData,
      });

      if (!data) {
        throw new Error("Login failed");
      }

      alert("Login successful!");
      
      localStorage.setItem("authenticated", "true");
      
      const userData = {
        email: formData.Email,
        name: data.UserID || formData.Email.split('@')[0] || 'User'
      };
      
      localStorage.setItem("user", JSON.stringify(userData));
      
      onClose();
      if (onLoginSuccess) {
        onLoginSuccess(userData);
      } else {
        window.location.reload();
      }
    } catch (error) {
      if (error.message.includes("401")) {
        alert("Login failed: Invalid email or password");
      } else {
        alert("Login failed: " + (error.message || "Unknown error"));
      }
    }
  };

  const handleClose = (e) => {
    // Only close if clicking the overlay, not the modal content
    if (e.target === e.currentTarget) {
      setFormData({ Email: "", Password: "" });
      onClose();
    }
  };

  const handleSwitchToSignUp = () => {
    setFormData({ Email: "", Password: "" });
    onSwitchToSignUp();
  };

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay" onClick={handleClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <form className="signup-form" onSubmit={handleSubmit}>
          <h2>Login to Account</h2>

          <input
            type="email"
            name="Email"
            placeholder="Email Address"
            value={formData.Email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="Password"
            placeholder="Password"
            value={formData.Password}
            onChange={handleChange}
            required
          />

          <button type="submit">Sign In</button>

          <p className="login-message">
            Don't have an account?{" "}
            <button
              type="button"
              className="login-link"
              onClick={handleSwitchToSignUp}
            >
              Sign Up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;