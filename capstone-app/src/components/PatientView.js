import React, { useState, useEffect } from 'react';
import ViewMedications from './ViewMedications.js';
import ViewDoctorInfo from './ViewDoctorInfo.js'; // Import the new component
import axios from 'axios';

// Dummy components for demo
const MessageDoctor = ({ userData }) => (
  <div>
    <h3>Message Doctor</h3>
    <p>Logged in as: {userData?.email}</p>
  </div>
);

const PatientView = ({ userData, onSignOut }) => {
  const [activeView, setActiveView] = useState('medication');

  useEffect(() => {
    console.log("User Data in PatientView:", userData);
  }, [userData]);

  const renderContent = () => {
    switch (activeView) {
      case 'medication':
        return <ViewMedications userData={userData} />;
      case 'doctor':
        return <ViewDoctorInfo userData={userData} />;
      case 'messages':
        return <MessageDoctor userData={userData} />;
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
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Patient Dashboard</h2>
        <button className="option-button" onClick={() => setActiveView('medication')} style={{ margin: '0.5rem 1rem' }}>
          My Medications
        </button>
        <button className="option-button" onClick={() => setActiveView('doctor')} style={{ margin: '0.5rem 1rem' }}>
          Doctor Info
        </button>
        <button className="option-button" onClick={() => setActiveView('messages')} style={{ margin: '0.5rem 1rem' }}>
          Message Doctor
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

export default PatientView;
