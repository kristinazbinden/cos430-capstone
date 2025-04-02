import React, { useState } from "react";
import "./App.css";

function App() {
  const [screen, setScreen] = useState("welcome"); // Tracks which screen to display

  const handleScreenChange = (newScreen) => {
    setScreen(newScreen);
  };

  return (
    <div className="app-container">
      {screen === "welcome" && (
        <div className="welcome-screen">
          <h1 className="welcome-title">Welcome To My Med App!</h1>
          <p className="welcome-subtitle">Choose an option below:</p>
          <div className="button-group">
            <button
              className="option-button"
              onClick={() => handleScreenChange("login")}
            >
              Log In
            </button>
            <button
              className="option-button"
              onClick={() => handleScreenChange("signup")}
            >
              Sign Up
            </button>
          </div>
        </div>
      )}

      {screen === "login" && (
        <div className="form-screen">
          <h2 className="form-title">Log In</h2>
          <form>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" placeholder="Enter your email" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
              />
            </div>
            <button type="submit" className="submit-button">
              Log In
            </button>
            <button
              className="back-button"
              onClick={() => handleScreenChange("welcome")}
            >
              Go Back
            </button>
          </form>
        </div>
      )}

      {screen === "signup" && (
        <div className="form-screen">
          <h2 className="form-title">Sign Up</h2>
          <form>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" placeholder="Enter your full name" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" placeholder="Enter your email" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Create a password"
              />
            </div>
            <button type="submit" className="submit-button">
              Sign Up
            </button>
            <button
              className="back-button"
              onClick={() => handleScreenChange("welcome")}
            >
              Go Back
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
