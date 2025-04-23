import React, { useState } from 'react';
import axios from 'axios';

// Dummy components for demo
// const ViewPatients = () => <div><h3>Patient List</h3></div>;
const MessageDoctor = () => <div><h3>Message Doctor</h3></div>;
const ViewMedications = () => <div><h3>Message Doctor</h3></div>;
const ViewDoctorInfo = () => <div><h3>Message Doctor</h3></div>;

const PatientView = ({ onSignOut }) => {
  const [activeView, setActiveView] = useState('medication');

  const renderContent = () => {
    switch (activeView) {
      case 'medication':
        return <ViewMedications />;
      case 'doctor':
        return <ViewDoctorInfo />;
      case 'messages':
        return <MessageDoctor />;
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
        <button className="option-button" onClick={() => setActiveView('patients')} style={{ margin: '0.5rem 1rem' }}>
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
