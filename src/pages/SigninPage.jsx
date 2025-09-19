
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignUp.css";

const SigninPage = () => {
  const [formData, setFormData] = useState({
    
    Email: "",
    Password: "",
  });

  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${VITE_ELASTIC_IP}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 201) {
        alert("Account found successfully!");
        navigate("/protectedroute");
      }
    } catch (error) {
      alert("Signin failed: " + (error.response?.data?.message || error.message));
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
       
      </form>
    </div>
  );
};

export default SigninPage;
