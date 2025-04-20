import React from 'react';
const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
const response = await axios.post(`${backendURL}/api/patients`, {
  first_name: userData.first_name,
  last_name: userData.last_name,
  id: userData.id
});
const PatientView = () => (
  <div>
    <h2>Patient Dashboard</h2>
    <div style={{ padding: '2rem' }}>
      <h2>Patient Dashboard</h2>
      <div style={{
        border: '5px solid #ccc',
        padding: '1rem',
        borderRadius: '8px',
        backgroundColor: '#f0f8ff',
        marginTop: '1rem',
        maxWidth: '400px'
      }}>
        
      </div>
    </div>
    {/* Patient-specific content here */}
  </div>
);

export default PatientView;