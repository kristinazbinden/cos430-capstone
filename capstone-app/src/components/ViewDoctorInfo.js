import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewDoctorInfo = ({ userData }) => {
  const [doctor, setDoctor] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      if (!userData?.email) {
        console.error("User email is not available.");
        setError("User email is not available.");
        return;
      }

      try {
        const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

        // Step 1: Fetch the patient info to get the primary doctor ID
        const patientResponse = await axios.get(`${backendURL}/api/patientByEmail?email=${userData.email}`);
        const primaryDoctorId = patientResponse.data?.primary_doctor_id;

        if (!primaryDoctorId) {
          console.error("Primary doctor ID not found.");
          setError("No primary doctor assigned.");
          return;
        }

        // Step 2: Fetch the doctor info using the primary doctor ID
        const doctorResponse = await axios.get(`${backendURL}/api/doctorById?doctorId=${primaryDoctorId}`);
        setDoctor(doctorResponse.data);
      } catch (error) {
        console.error("Error fetching doctor info:", error);
        setError("Failed to fetch doctor information.");
      }
    };

    fetchDoctorInfo();
  }, [userData]);

  return (
    <div>
      <h3>Doctor Information</h3>
      {error && <p className="error-message">{error}</p>}
      {doctor ? (
        <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
          <p><strong>Name:</strong> {doctor.first_name} {doctor.last_name}</p>
          <p><strong>Email:</strong> {doctor.email}</p>
          <p><strong>Phone:</strong> {doctor.phone_number || 'N/A'}</p>
          <p><strong>Specialization:</strong> {doctor.specialization || 'N/A'}</p>
        </div>
      ) : (
        !error && <p>Loading doctor information...</p>
      )}
    </div>
  );
};

export default ViewDoctorInfo;