import React, { useState } from 'react';

const LoginScreen = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement login logic here
    console.log("Login submitted", { email, password });
    alert(`Logging in with email: ${email} and password: ${password}`);
  };

  return (
    <div className="form-screen">
      <h2 className="form-title">Log In</h2>
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