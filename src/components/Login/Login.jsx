import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useShop } from "../context/ShopContext"; // import context
import "../Login/Login.css";

const Login = () => {
  const { backendUrl } = useShop(); // get backend URL from context
  const [formData, setFormData] = useState({ Email: "", Password: "" });
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
      const response = await axios.post(`${backendUrl}/login`, formData);

      alert("Login successful!");

      // Store authentication status
      localStorage.setItem("authenticated", "true");

      // Store user data
      const userData = {
        email: formData.Email,
        name: response.data?.UserID || formData.Email.split("@")[0] || "User",
      };
      localStorage.setItem("user", JSON.stringify(userData));

      navigate("/payment");
    } catch (error) {
      if (error.response?.status === 401) {
        alert("Login failed: Invalid email or password");
      } else {
        alert("Signin failed: " + (error.response?.data?.message || error.message));
      }
    }
  };

  return (
    <div className="signup-container">
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
          Don't have an account already?{" "}
          <Link to="/SignUp" className="login-link">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
