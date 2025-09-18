import React from "react";
import "./ProtectedRoute/ProtectedRoute.css";


const ProtectedPage = () => {
  return (
    <div className="protected-container">
      <div className="protected-card">
        <h1>Welcome Back!</h1>
        <p>You have successfully accessed a protected</p>
      </div>
    </div>
  );
};

export default ProtectedPage