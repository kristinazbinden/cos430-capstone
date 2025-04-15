import React, { useState } from 'react';
import axios from 'axios';

const RoleSelectionScreen = ({ onRoleSelect }) => {
  const [userRole, setUserRole] = useState("");

  const handleRoleSubmit = async () => {
    if (!userRole) {
      alert("Please select your role!");
      return;
    }

    const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

    try {
      if (userRole === "doctor") {
        const response = await axios.post(`${backendURL}/api/doctors`, {}); // You might send more doctor-specific data here
        console.log("Doctor role submitted:", response.data);
        alert(response.data.message);
        onRoleSelect(userRole);
        // Navigate to doctor-specific area
      } else if (userRole === "patient") {
        const response = await axios.post(`${backendURL}/api/patients`, {}); // You might send more patient-specific data here
        console.log("Patient role submitted:", response.data);
        alert(response.data.message);
        onRoleSelect(userRole);
        // Navigate to patient-specific area
      }
    } catch (error) {
      console.error(`Error submitting ${userRole} role:`, error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Failed to submit role: ${error.response.data.message}`);
      } else {
        alert("Failed to submit role. Please try again.");
      }
    }
  };

  return (
    <div className="role-selection-screen">
      <h2>Are you a Doctor or a Patient?</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label>
            <input
              type="radio"
              name="role"
              value="doctor"
              checked={userRole === "doctor"}
              onChange={(e) => setUserRole(e.target.value)}
            />
            Doctor
          </label>
        </div>
        <div className="form-group">
          <label>
            <input
              type="radio"
              name="role"
              value="patient"
              checked={userRole === "patient"}
              onChange={(e) => setUserRole(e.target.value)}
            />
            Patient
          </label>
        </div>
        <button type="button" className="submit-button" onClick={handleRoleSubmit}>
          Submit Role
        </button>
      </form>
    </div>
  );
};

export default RoleSelectionScreen;