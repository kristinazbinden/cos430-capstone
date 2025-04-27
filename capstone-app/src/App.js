import React, { useState } from "react";
import "./App.css";
import WelcomeScreen from './components/WelcomeScreen.js';
import LoginScreen from './components/LoginScreen.js';
import SignupScreen from './components/SignupScreen.js';
import RoleSelectionScreen from './components/RoleSelectionScreen.js';
import DoctorView from './components/DoctorView.js';
import MedicationSearchScreen from './components/MedicationSearchScreen.js';
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
    if (role === "doctor") {
      setScreen("doctor");
    } else if (role === "patient") {
      setScreen("patient");
    }
  };

  const handleLoginSuccess = (role, userData) => {
    setUserRole(role); // Store the user's role
    setUserData(userData); // Store the user's data (e.g., email, name, etc.)
    if (role === "doctor") {
      setScreen("doctor");
    } else if (role === "patient") {
      setScreen("patient");
    }
  };

  const renderScreen = () => {
    switch (screen) {
      case "welcome":
        return <WelcomeScreen onLogin={() => handleScreenChange("login")} onSignup={() => handleScreenChange("signup")} />;
      case "login":
        return <LoginScreen onBack={() => handleScreenChange("welcome")} onLoginSuccess={handleLoginSuccess} />;
      case "signup":
        return <SignupScreen onSignup={handleSignup} onBack={() => handleScreenChange("welcome")} />;
      case "roleSelection":
        return <RoleSelectionScreen onRoleSelect={handleRoleSelect} userData={userData} />;
      case "patient":
        return <PatientView userData={userData} onSignOut={() => setScreen("welcome")} />;
      case "doctor":
        return <DoctorView userData={userData} onSignOut={() => setScreen("welcome")} />;
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