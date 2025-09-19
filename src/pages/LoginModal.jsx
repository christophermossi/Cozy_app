import React, { useState } from "react";
import axios from "axios";
import.meta.env.VITE_ELASTIC_IP 
import "./LoginModal.css";

const LoginModal = ({ isOpen, onClose, onSwitchToSignUp, onLoginSuccess }) => {
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
      const response = await axios.post(`${VITE_ELASTIC_IP}/login`, formData);

      alert("Login successful!");
      
      localStorage.setItem("authenticated", "true");
      
      const userData = {
        email: formData.Email,
        name: response.data?.UserID || formData.Email.split('@')[0] || 'User'
      };
      
      localStorage.setItem("user", JSON.stringify(userData));
      
      onClose();
      if (onLoginSuccess) {
        onLoginSuccess(userData);
      } else {
        window.location.reload();
      }

    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Login failed: Invalid email or password");
      } else {
        alert("Login failed: " + (error.response?.data?.message || error.message));
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