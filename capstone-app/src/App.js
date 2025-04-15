import React, { useState } from "react";
import "./App.css";
import WelcomeScreen from './components/WelcomeScreen.js';
import LoginScreen from './components/LoginScreen.js';
import SignupScreen from './components/SignupScreen.js';
import RoleSelectionScreen from './components/RoleSelectionScreen.js';
import DoctorView from './components/DoctorView.js';
import PatientView from './components/PatientView.js';

const App = () => {
  const [screen, setScreen] = useState("welcome");
  const [userRole, setUserRole] = useState("");
  const [userData, setUserData] = useState(null);

  const handleScreenChange = (newScreen) => {
    setScreen(newScreen);
  };

  const handleSignup = (data) => {
    setUserData(data);
    setScreen("roleSelection");
  };

  const handleRoleSelect = (role) => {
    setUserRole(role);
    // Here, you'd typically route to different parts of your application
    // based on the user's role.  For this example, we'll just
    // render placeholder components.
    if (role === "doctor") {
      setScreen("doctor");
    } else {
      setScreen("patient");
    }
  };

  const renderScreen = () => {
    switch (screen) {
      case "welcome":
        return <WelcomeScreen onLogin={() => handleScreenChange("login")} onSignup={() => handleScreenChange("signup")} />;
      case "login":
        return <LoginScreen onBack={() => handleScreenChange("welcome")} />;
      case "signup":
        return <SignupScreen onSignup={handleSignup} onBack={() => handleScreenChange("welcome")} />;
      case "roleSelection":
        return <RoleSelectionScreen onRoleSelect={handleRoleSelect} />;
      case "doctor":
        return <DoctorView />;
      case "patient":
        return <PatientView />;
      default:
        return <WelcomeScreen onLogin={() => handleScreenChange("login")} onSignup={() => handleScreenChange("signup")} />;
    }
  };

  return (
    <div className="app-container">
      {renderScreen()}
    </div>
  );
};

export default App;