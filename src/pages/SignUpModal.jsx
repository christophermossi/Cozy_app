import React, { useState } from "react";
import { useIp } from "../context/IpContext"; // Import IpContext
import "./LoginModal.css";

const SignUpModal = ({ isOpen, onClose, onSwitchToLogin, onSignUpSuccess }) => {
  const { callBackend } = useIp(); // Use IpContext for backend calls
  const [formData, setFormData] = useState({
    UserID: "",
    Password: "",
    Email: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await callBackend("/signup", {
        method: "POST",
        body: formData,
      });

      if (!data) {
        throw new Error("Signup failed");
      }

      alert("Account created successfully!");
      onClose();
      if (onSignUpSuccess) {
        onSignUpSuccess();
      }
    } catch (error) {
      if (error.message.includes("400") || error.message.includes("409")) {
        alert("Signup failed: Invalid data or user already exists");
      } else {
        alert("Signup failed: " + (error.message || "Unknown error"));
      }
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