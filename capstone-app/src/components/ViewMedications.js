import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewMedications = ({ userData }) => {
  const [medications, setMedications] = useState([]);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMedications = async () => {
      if (!userData?.email) {
        console.error("User email is not available.");
        setError("User email is not available.");
        return;
      }

      try {
        const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

        // Step 1: Fetch the patient ID using their email
        const patientResponse = await axios.get(`${backendURL}/api/patientByEmail?email=${userData.email}`);
        const patientId = patientResponse.data?.patient_id;

        if (!patientId) {
          console.error("Patient ID not found.");
          setError("Patient ID not found.");
          return;
        }

        // Step 2: Fetch the medications using the patient ID
        const medicationsResponse = await axios.get(`${backendURL}/api/medicationsByPatientId?patientId=${patientId}`);
        setMedications(medicationsResponse.data);
      } catch (error) {
        console.error("Error fetching medications:", error);
        setError("Failed to fetch medications.");
      }
    };

    fetchMedications();
  }, [userData]);

  const handleSelectMedication = (medication) => {
    setSelectedMedication(medication); // Update the selected medication
  };

  return (
    <div style={{ display: 'flex', gap: '2rem' }}>
      {/* Medication List */}
      <div style={{ flex: 1 }}>
        <h3>My Medications</h3>
        {error && <p className="error-message">{error}</p>}
        {medications.length > 0 ? (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {medications.map((medication) => (
              <li
                key={medication.medication_id}
                onClick={() => handleSelectMedication(medication)}
                style={{
                  cursor: 'pointer',
                  padding: '12px',
                  marginBottom: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: selectedMedication?.medication_id === medication.medication_id ? '#e0e0e0' : '#f9f9f9',
                  transition: 'background-color 0.2s, transform 0.1s',
                  fontSize: '1rem',
                  textAlign: 'center',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
                onMouseEnter={(e) => {
                  if (selectedMedication?.medication_id !== medication.medication_id) {
                    e.target.style.backgroundColor = '#f0f0f0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedMedication?.medication_id !== medication.medication_id) {
                    e.target.style.backgroundColor = '#f9f9f9';
                  }
                }}
              >
                {medication.medication_name}
              </li>
            ))}
          </ul>
        ) : (
          <p>No medications found.</p>
        )}
      </div>

      {/* Medication Details Panel */}
      {selectedMedication && (
        <div
          style={{
            flex: 1,
            padding: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#f9f9f9',
          }}
        >
          <h3>Medication Details</h3>
          <p><strong>Name:</strong> {selectedMedication.medication_name}</p>
          <p><strong>Dosage:</strong> {selectedMedication.dosage}</p>
          <p><strong>Frequency:</strong> {selectedMedication.frequency}</p>
          <p><strong>Start Date:</strong> {new Date(selectedMedication.start_date).toLocaleDateString()}</p>
          <p><strong>End Date:</strong> {new Date(selectedMedication.end_date).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
};

export default ViewMedications;