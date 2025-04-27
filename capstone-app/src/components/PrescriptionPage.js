import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MedicationSearchScreen from './MedicationSearchScreen.js';

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
        setSelectedPatient(patient); // Update the selected patient locally
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

    return (
        <div className="contained-screen">
            <h2 className="form-title">My Patients</h2>
            {error && <p className="error-message">{error}</p>}
            {loading && <p>Loading patients...</p>}

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
                <div className="patient-details" style={{ marginTop: '2rem' }}>
                    <h3>Selected Patient Details</h3>
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

const PrescriptionPage = ({ userData }) => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [frequency, setFrequency] = useState("Once daily");
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

  const handlePrescribe = async () => {
    console.log("Submitting prescription...");
    console.log("Selected Patient:", selectedPatient);
    console.log("Selected Medication:", selectedMedication);
    if (!selectedPatient || !selectedMedication) {
      alert("Please select both a patient and a medication.");
      return;
    }

    const prescriptionData = {
      patient_id: selectedPatient.patient_id,
      medication_name: selectedMedication.medicationName,
      dosage: selectedMedication.dose,
      frequency,
      start_date: startDate,
      end_date: endDate
    };

    try {
      const response = await axios.post(`${backendURL}/api/medications`, prescriptionData);
      console.log("Prescription created:", response.data);
      alert("Prescription submitted!");
    } catch (error) {
      console.error("Error prescribing medication:", error);
      alert("Failed to submit prescription.");
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          {/* Pass userData to ViewPatientList */}
          <ViewPatientList userData={userData} onSelectPatient={setSelectedPatient} />
        </div>
        <div style={{ flex: 1 }}>
          <MedicationSearchScreen onSelectMedication={setSelectedMedication} />
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Prescription Info</h3>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'flex-end',
            justifyContent: 'flex-start'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', width: '160px' }}>
            <label htmlFor="frequency">Frequency:</label>
            <input
              type="text"
              id="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              style={{ padding: '0.5rem', fontSize: '0.9rem' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', width: '160px' }}>
            <label htmlFor="start-date">Start Date:</label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ padding: '0.5rem', fontSize: '0.9rem' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', width: '160px' }}>
            <label htmlFor="end-date">End Date:</label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ padding: '0.5rem', fontSize: '0.9rem' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={handlePrescribe}
              className="submit-button"
              //disabled={!selectedPatient || !selectedMedication}
              style={{
                padding: '0.6rem 1rem',
                fontSize: '0.9rem',
                backgroundColor: '#8a2be2',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Prescribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionPage;
