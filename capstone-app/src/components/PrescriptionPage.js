import React, { useState } from 'react';
import ViewPatientList from './ViewPatientList.js';
import MedicationSearchScreen from './MedicationSearchScreen.js';
import axios from 'axios';

const PrescriptionPage = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

  const handlePrescribe = async () => {
    console.log("Prescribe button clicked");
    if (!selectedPatient || !selectedMedication) {
      alert("Please select both a patient and a medication.");
      return;
    }

    const prescriptionData = {
      patient_id: selectedPatient.patient_id,
      medication_name: selectedMedication.medicationName,
      dosage: selectedMedication.dose,
      frequency: "Once daily",
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
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

  console.log("Patient:", selectedPatient);
  console.log("Medication:", selectedMedication);

  return (
    <div style={{ display: 'flex', gap: '2rem', padding: '2rem' }}>
      <div style={{ flex: 1 }}>
        <ViewPatientList onSelectPatient={setSelectedPatient} />
      </div>
      <div style={{ flex: 1 }}>
        <MedicationSearchScreen onSelectMedication={setSelectedMedication} />
      </div>
      <div style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)' }}>
        <button 
          onClick={handlePrescribe} 
          className="submit-button"
          disabled={!selectedPatient || !selectedMedication}
        >
          Prescribe
        </button>
      </div>
    </div>
  );
};

export default PrescriptionPage;
