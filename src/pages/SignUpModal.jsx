import React, { useState } from "react";
import.meta.env.VITE_ELASTIC_IP 
import "./LoginModal.css";

const SignUpModal = ({ isOpen, onClose, onSwitchToLogin, onSignUpSuccess }) => {
  const [formData, setFormData] = useState({
    UserID: "",
    Password: "",
    Email: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_ELASTIC_IP}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 201) {
        alert("Account created successfully!");
        onClose();
        if (onSignUpSuccess) {
          onSignUpSuccess();
        }
      }
    } catch (error) {
      alert("Signup failed: " + (error.response?.data?.message || error.message));
    }
  };

  const handleClose = (e) => {
    // Only close if clicking the overlay, not the modal content
    if (e.target === e.currentTarget) {
      setFormData({ UserID: "", Password: "", Email: "" });
      onClose();
    }
  };

  const handleSwitchToLogin = () => {
    setFormData({ UserID: "", Password: "", Email: "" });
    onSwitchToLogin();
  };

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay" onClick={handleClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <form className="signup-form" onSubmit={handleSubmit}>
          <h2>Create Account</h2>

          <input
            type="text"
            name="UserID"
            placeholder="User Name"
            value={formData.UserID}
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
          <input
            type="email"
            name="Email"
            placeholder="Email Address"
            value={formData.Email}
            onChange={handleChange}
            required
          />

          <button type="submit">Sign Up</button>
          
          <p className="login-message">
            Already have an account?{" "}
            <button
              type="button"
              className="login-link"
              onClick={handleSwitchToLogin}
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpModal;