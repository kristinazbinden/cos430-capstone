import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewPatientList = ({ userData, onSelectPatient }) => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState(""); // State for email input
    const [primaryDoctorId, setPrimaryDoctorId] = useState(null); // Initialize as null

    // Fetch the doctor's ID using the user's email
    useEffect(() => {
        const fetchDoctorId = async () => {
            if (!userData?.email) {
                console.error("User email is not available.");
                return;
            }

            try {
                const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
                const response = await axios.get(`${backendURL}/api/doctorByEmail?email=${userData.email}`);
                if (response.data?.doctor_id) {
                    setPrimaryDoctorId(response.data.doctor_id); // Set the doctor's ID
                } else {
                    console.error("No doctor found with the provided email.");
                }
            } catch (error) {
                console.error("Error fetching doctor ID:", error);
            }
        };

        fetchDoctorId();
    }, [userData]);

    // Fetch patients for the current doctor
    useEffect(() => {
        const fetchPatients = async () => {
            if (!primaryDoctorId) return; // Wait until the doctor ID is fetched

            setLoading(true);
            setError("");

            try {
                const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
                const response = await axios.get(`${backendURL}/api/patients?doctor_id=${primaryDoctorId}`);

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
    }, [primaryDoctorId]);

    const handleSelectPatient = (patient) => {
        setSelectedPatient(patient);
        if (onSelectPatient) {
            onSelectPatient(patient); // Notify the parent component
        }
    };

    const handleSearchByEmail = async () => {
        if (!email) {
            alert("Please enter an email address.");
            return;
        }

        try {
            const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
            const response = await axios.get(`${backendURL}/api/patientByEmail?email=${email}`);

            if (response.data) {
                setSelectedPatient(response.data);
                if (onSelectPatient) {
                    onSelectPatient(response.data); // Notify the parent component
                }
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

    const handleAssignPatient = async () => {
        if (!selectedPatient || !primaryDoctorId) {
            alert("Please select a patient to assign.");
            return;
        }

        try {
            const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
            const response = await axios.put(`${backendURL}/api/assignPatient`, {
                patient_id: selectedPatient.patient_id,
                doctor_id: primaryDoctorId,
            });

            if (response.status === 200) {
                alert("Patient assigned to doctor successfully.");
                setPatients((prevPatients) => [...prevPatients, selectedPatient]); // Add the patient to the list
                setSelectedPatient(null); // Clear the selected patient
            }
        } catch (error) {
            console.error("Error assigning patient:", error);
            alert("Failed to assign patient.");
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
                            {patients.map((patient) => (
                                <li
                                    key={patient.patient_id}
                                    onClick={() => handleSelectPatient(patient)}
                                    style={{
                                        cursor: 'pointer',
                                        padding: '8px 0',
                                        borderBottom: '1px solid #eee',
                                        transition: 'background-color 0.2s',
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
                <div style={{ marginTop: '1rem' }}>
                    <h3>Selected Patient</h3>
                    <p><strong>Name:</strong> {selectedPatient.first_name} {selectedPatient.last_name}</p>
                    <p><strong>Email:</strong> {selectedPatient.email}</p>
                    {!patients.some(patient => patient.patient_id === selectedPatient.patient_id) && (
                        <button
                            onClick={handleAssignPatient}
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
