import React, { useState } from 'react';
import axios from 'axios';

const RoleSelectionScreen = ({ onRoleSelect, userData }) => { // Receive userData
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRoleSubmit = async () => {
    if (!userRole) {
      alert("Please select your role!");
      return;
    }

    const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
    setLoading(true);

    try {
      if (userRole === "doctor") {
        if (!userData?.first_name || !userData?.last_name || !userData?.email || !userData?.password) {
          alert("Missing user information. Please go back and complete signup.");
          setLoading(false);
          return;
        }
        const response = await axios.post(`${backendURL}/api/doctors`, {
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          password: userData.password,
        });
        console.log("Doctor created:", response.data);
        alert(response.data.message);
        onRoleSelect(userRole);
        // Navigate to doctor-specific area
      } else if (userRole === "patient") {
        if (!userData?.first_name || !userData?.last_name || !userData?.email || !userData?.password) {
          alert("Missing user information. Please go back and complete signup.");
          setLoading(false);
          return;
        }
        const response = await axios.post(`${backendURL}/api/patients`, {
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          password: userData.password,
        });
        console.log("Patient created:", response.data);
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
    } finally {
      setLoading(false);
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
        <button type="button" className="submit-button" onClick={handleRoleSubmit} disabled={loading}>
          {loading ? "Submit Role" : "Awaiting selection..."}
        </button>
      </form>
    </div>
  );
};

export default RoleSelectionScreen;