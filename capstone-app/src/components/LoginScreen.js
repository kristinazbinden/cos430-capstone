import React, { useState } from 'react';
import axios from 'axios';

const LoginScreen = ({ onBack, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
      const response = await axios.post(`${backendURL}/api/login`, { email, password });

      if (response.data.success) {
        // Pass role and user data (e.g., email) to the parent
        onLoginSuccess(response.data.role, { email: email });
      } else {
        setError(response.data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Failed to log in. Please try again.");
    }
  };

  return (
    <div className="form-screen">
      <h2 className="form-title">Log In</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="submit-button">
          Log In
        </button>
        <button className="back-button" onClick={onBack}>
          Go Back
        </button>
      </form>
    </div>
  );
};

export default LoginScreen;