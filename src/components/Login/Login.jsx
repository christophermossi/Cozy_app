import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Login/Login.css";


const Login = () => {
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("VITE_ELASTIC_IP:", import.meta.env.VITE_ELASTIC_IP);
      const response = await axios.post(`${import.meta.env.VITE_ELASTIC_IP}/login`, formData);
      
      alert("Login successful!");
      
      // Store authentication status
      localStorage.setItem("authenticated", "true");
      
      // Store user data - assuming the response contains user info
      // If your backend doesn't return user data, we'll extract from email or use a default
      const userData = {
        email: formData.Email,
        // If your backend returns user data, use: name: response.data.UserID || response.data.name
        // For now, we'll extract from email or use email as name
        name: response.data?.UserID || formData.Email.split('@')[0] || 'User'
      };
      
      localStorage.setItem("user", JSON.stringify(userData));
      
      navigate("/");

    } catch (error) {
      if (error.response && error.response.status === 401) {
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