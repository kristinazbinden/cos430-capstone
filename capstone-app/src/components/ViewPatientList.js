import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewPatientList = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);    
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const primary_doctor_id = 6;

    useEffect(() => {
        const fetchPatients = async () => {
          setLoading(true);
          setError("");
      
          try {
            const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
            const response = await axios.get(`${backendURL}/api/patients?doctor_id=${primary_doctor_id}`);
      
            if (Array.isArray(response.data)) {
              setPatients(response.data);
            } else {
              setError("Invalid patient data received");
            }
          } catch (error) {
            console.error("Error:", error);
            setError("No patients found.");
          } finally {
            setLoading(false);
          }
        };
        fetchPatients();
      }, []);

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
  };

  return (
    <div className="contained-screen">
      <h2 className="form-title">My Patients</h2>
      {error && <p className="error-message">{error}</p>}
      {/* <div className="loading-status">
        {loading && <p>Loading patient list...</p>}
      </div> */}

      {patients.length > 0 && (
        <div className="form-group">
          <label htmlFor="patients">Patient List</label>
          <div
            id="patients"
            style={{
              maxHeight: "300px",
              overflowY: "auto",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "0.5rem",
              marginTop: "0.5rem"
            }}
          >
            <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
              {patients.map((patient, index) => (
                <li
                  key={patient.patient_id}
                  onClick={() => handleSelectPatient(patient)}
                  style={{
                    cursor: 'pointer',
                    padding: '8px 0',
                    borderBottom: '1px solid #eee',
                    transition: 'background-color 0.2s',
                    ':hover': {
                      backgroundColor: '#f5f5f5'
                    }
                  }}
                >
                  {patient.first_name} {patient.last_name}
                  <div style={{ fontSize: '0.9em', color: '#666' }}>
                    DOB: {new Date(patient.date_of_birth).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {selectedPatient && (
        <div className="patient-details" style={{ marginTop: '2rem' }}>
          <h3>Patient Details</h3>
          <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '4px' }}>
            <p><strong>Name:</strong> {selectedPatient.first_name} {selectedPatient.last_name}</p>
            <p><strong>Date of Birth:</strong> {new Date(selectedPatient.date_of_birth).toLocaleDateString()}</p>
            <p><strong>Email:</strong> {selectedPatient.email}</p>
            <p><strong>Phone:</strong> {selectedPatient.phone_number || 'N/A'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewPatientList
