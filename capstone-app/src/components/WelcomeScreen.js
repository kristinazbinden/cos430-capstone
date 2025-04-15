import React from 'react';

const WelcomeScreen = ({ onLogin, onSignup }) => (
  <div className="welcome-screen">
    <h1 className="welcome-title">Welcome To My Med App!</h1>
    <p className="welcome-subtitle">Choose an option below:</p>
    <div className="button-group">
      <button className="option-button" onClick={onLogin}>
        Log In
      </button>
      <button className="option-button" onClick={onSignup}>
        Sign Up
      </button>
    </div>
  </div>
);

export default WelcomeScreen;