import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useIp } from "../context/IpContext"; // Import IpContext
import "../Login/Login.css";

const Login = () => {
  const { callBackend } = useIp(); // Use IpContext for backend calls
  const [formData, setFormData] = useState({ Email: "", Password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await callBackend("/login", { 
        method: "POST", 
        body: formData 
      });

      if (!data) {
        throw new Error("Login failed");
      }

      alert("Login successful!");

      // Store authentication status
      localStorage.setItem("authenticated", "true");

      // Store user data
      const userData = {
        email: formData.Email,
        name: data?.UserID || formData.Email.split("@")[0] || "User",
      };
      localStorage.setItem("user", JSON.stringify(userData));

      navigate("/payment");
    } catch (error) {
      if (error.message.includes("401") || error.message.includes("Invalid")) {
        alert("Login failed: Invalid email or password");
      } else {
        alert("Signin failed: " + (error.message || "Unknown error"));
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