import React, { useState, useEffect } from 'react';
import MedicationSearchScreen from './MedicationSearchScreen.js';
import ViewPatientList from './ViewPatientList.js'; 
import PrescriptionPage from "./PrescriptionPage.js";

const MessagePatients = ({ userData }) => (
  <div>
    <h3>Message Patients</h3>
    <p>Logged in as: {userData?.email}</p>
  </div>
);

const DoctorView = ({ userData, onSignOut }) => {
  const [activeView, setActiveView] = useState('medication');

  // Log userData when the component loads
  useEffect(() => {
    console.log("User Data:", userData);
  }, [userData]);

  const renderContent = () => {
    switch (activeView) {
      case 'medication':
        return <MedicationSearchScreen userData={userData} />;
      case 'patients':
        return <ViewPatientList userData={userData} />;
      case 'messages':
        return <MessagePatients userData={userData} />;
      case 'prescribe':
        return <PrescriptionPage userData={userData} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: '220px',
        background: '#f8f9fa',
        borderRight: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        padding: '1rem 0'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Doctor Dashboard</h2>
        <button className="option-button" onClick={() => setActiveView('medication')} style={{ margin: '0.5rem 1rem' }}>
          Medication Search
        </button>
        <button className="option-button" onClick={() => setActiveView('patients')} style={{ margin: '0.5rem 1rem' }}>
          View Patients
        </button>
        <button className="option-button" onClick={() => setActiveView('messages')} style={{ margin: '0.5rem 1rem' }}>
          Message Patients
        </button>
        <button className="option-button" onClick={() => setActiveView('prescribe')} style={{ margin: '0.5rem 1rem' }}>
          Manage Prescriptions
        </button>
        <button className="option-button" onClick={onSignOut} style={{ margin: '0.5rem 1rem', marginTop: 'auto' }}>
          Sign Out
        </button>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {renderContent()}
      </main>
    </div>
  );
};

export default DoctorView;
