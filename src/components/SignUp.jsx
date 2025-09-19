import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import "./SignUp.css";


const SignUp = () => {
  const [formData, setFormData] = useState({
    UserID: "",
    Password: "",
    Email: ""
  });

  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("${import.meta.env.VITE_ELASTIC_IP}/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 201) {
        alert("Account created successfully!");
        navigate("/login");
        
      }
    } catch (error) {
      alert("Signup failed: " + (error.response?.data?.message || error.message));
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
