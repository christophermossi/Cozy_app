import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useShop } from "../context/ShopContext"; // import context
import "./SignUp.css";

const SignUp = () => {
  const { backendUrl } = useShop(); // get backend URL from context
  const [formData, setFormData] = useState({
    UserID: "",
    Password: "",
    Email: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!backendUrl) {
      alert("Backend URL not configured. Please try again later.");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 201) {
        alert("Account created successfully!");
        navigate("/login");
      } else {
        alert("Signup failed: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      alert("Signup failed: " + (error.message || "Unknown error"));
    }
  };

  return (
    <div className="signup-container">
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
          Do already have an account?{" "}
          <Link to="/login" className="login-link">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
