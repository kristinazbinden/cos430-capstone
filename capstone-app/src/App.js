import React, { useState } from "react";
import { createUser } from "../database.js";
import "./App.css";

function App() {
  const [screen, setScreen] = useState("welcome"); // Tracks which screen to display

  const [userData, setUserData] = userData({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });

  const handleScreenChange = (newScreen) => {
    setScreen(newScreen);
  };

  // handle input
  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send data to database.js
      await createUser(userData);
      alert('Your profile has been created!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Something went wrong! Please try again.');
    }
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
          <h2 className="form-title"> Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="firstname">First Name</label>
              <input 
                type="text" 
                id="firstname" 
                name="firstname"
                placeholder="Enter your first name" 
                value={userData.firstname}
                />
            </div>
            <div className="form-group">
              <label htmlFor="lastname">Last Name</label>
              <input 
                type="text" 
                id="lastname" 
                name="lastname"
                placeholder="Enter your last name" 
                value={userData.lastname}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input 
                type="text" 
                id="email" 
                name="email"
                placeholder="Enter your email. This will be your username to login." 
                value={userData.email}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="text" 
                id="password" 
                name="password"
                placeholder="Enter your password. Make it unique!" 
                value={userData.password}
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
