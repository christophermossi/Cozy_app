import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useIp } from "../context/IpContext"; // Import IpContext
import "./SignUp.css";

const SignUp = () => {
  const { callBackend } = useIp(); // Use IpContext for backend calls
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

    try {
      const data = await callBackend("/signup", {
        method: "POST",
        body: formData
      });

      if (!data) {
        throw new Error("Signup failed");
      }

      alert("Account created successfully!");
      navigate("/login");
    } catch (error) {
      if (error.message.includes("400") || error.message.includes("409")) {
        alert("Signup failed: Invalid data or user already exists");
      } else {
        alert("Signup failed: " + (error.message || "Unknown error"));
      }
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