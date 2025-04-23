import React, { useState } from 'react';
import ViewPatientList from './ViewPatientList.js';
import MedicationSearchScreen from './MedicationSearchScreen.js';
import axios from 'axios';

const PrescriptionPage = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [frequency, setFrequency] = useState("Once daily");
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

  const handlePrescribe = async () => {
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
          <ViewPatientList onSelectPatient={setSelectedPatient} />
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
              disabled={!selectedPatient || !selectedMedication}
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
