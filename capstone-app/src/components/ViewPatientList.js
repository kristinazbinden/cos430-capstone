import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewPatientList = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);    
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState(""); // State for email input
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

    const handleSearchByEmail = async () => {
        if (!email) {
            alert("Please enter an email address.");
            return;
        }

        try {
            const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
            console.log(`${backendURL}/api/patientByEmail?email=${email}`);
            const response = await axios.get(`${backendURL}/api/patientByEmail?email=${email}`);

            console.log("Raw Response:", response); // Debugging: Log the raw response

            if (response.data) {
                console.log("Patient Info from Database:", response.data); // Log the result to the console
                setSelectedPatient(response.data); // Update the selectedPatient state with the search result
            } else {
                alert("No patient found with that email.");
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                alert("No patient found with that email.");
            } else {
                console.error("Error searching for patient by email:", error);
                alert("Failed to search for patient.");
            }
        }
    };

    return (
        <div className="contained-screen">
            <h2 className="form-title">My Patients</h2>
            {error && <p className="error-message">{error}</p>}

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

            {/* New field for searching by email */}
            <div style={{ marginTop: '1rem' }}>
                <label htmlFor="search-patient-email" style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Search Patient by Email:
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                        type="email"
                        id="search-patient-email"
                        placeholder="Enter patient email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                            flex: 1,
                            padding: '0.5rem',
                            fontSize: '0.9rem',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                    />
                    <button
                        onClick={handleSearchByEmail}
                        style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.9rem',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Search Patient
                    </button>
                </div>
            </div>

            {selectedPatient && (
                <div className="patient-details" style={{ marginTop: '2rem' }}>
                    <h3>Patient Details</h3>
                    <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '4px' }}>
                        <p><strong>Name:</strong> {selectedPatient.first_name} {selectedPatient.last_name}</p>
                        <p><strong>Date of Birth:</strong> {new Date(selectedPatient.date_of_birth).toLocaleDateString()}</p>
                        <p><strong>Email:</strong> {selectedPatient.email}</p>
                        <p><strong>Phone:</strong> {selectedPatient.phone_number || 'N/A'}</p>
                    </div>

                    {/* Check if the selected patient is in the current patient list */}
                    {!patients.some(patient => patient.patient_id === selectedPatient.patient_id) && (
                        <button
                            onClick={async () => {
                                try {
                                    const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
                                    const response = await axios.put(`${backendURL}/api/assignPatient`, {
                                        patient_id: selectedPatient.patient_id,
                                        doctor_id: primary_doctor_id
                                    });

                                    if (response.status === 200) {
                                        alert('Patient successfully assigned to the doctor.');
                                        // Optionally, refresh the patient list
                                        setPatients([...patients, selectedPatient]);
                                    }
                                } catch (error) {
                                    console.error('Error assigning patient to doctor:', error);
                                    alert('Failed to assign patient to the doctor.');
                                }
                            }}
                            style={{
                                marginTop: '1rem',
                                padding: '0.5rem 1rem',
                                fontSize: '0.9rem',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Add Patient
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ViewPatientList;
