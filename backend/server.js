import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from 'bcryptjs';
import mysql from "mysql2/promise"; // Use promise-based MySQL library
import { createUser, createDoctor, createPatient } from "./database.js"; // Note the .js extension
import pool from "./database.js"; // Import the database pool

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001
import { testDatabaseConnection } from './database.js';

// Middleware
app.use(cors());
app.use(express.json());

// Route
app.get('/', (req, res) => {
  res.send('Backend is running'); // Respond with a simple message
});


// Initial Post Request for Users
app.post('/api/users', async (req, res) => {
  try {
    const userData = req.body; // Extract user data from request body
    const result = await createUser(userData); // Call the createUser function
    res.status(201).json({ message: 'User created successfully!', result });
  } catch (error) {
    console.error('Error in /api/users:', error); // Detailed error logging
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message, 
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  }
});

// Create Doctor
app.post('/api/doctors', async (req, res) => {
  try {
    const doctorData = req.body;
    const result = await createDoctor(doctorData);
    res.status(201).json({ message: 'Doctor created succesfully!', result });
  } catch (error) {
    console.error('Error creating doctor:', error);
    res.status(500).json({
      message: 'Server error', 
      error: error.message, 
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  }
});


// Create Patient
app.post('/api/patients', async (req, res) => {
  try {
    const patientData = req.body;
    const result = await createPatient(patientData);
    res.status(201).json({ message: 'Patient created successfully!', result });
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({
      message: 'Server error', 
      error: error.message, 
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email, password });

  try {
    // Search in doctors table
    const [doctorRows] = await pool.query('SELECT * FROM doctors WHERE email = ?', [email]);
    if (doctorRows.length > 0) {
      const doctor = doctorRows[0];
      const passwordMatch = await bcrypt.compare(password, doctor.password);
      if (passwordMatch) {
        return res.json({ success: true, role: 'doctor' });
      }
    }

    // Search in patients table
    const [patientRows] = await pool.query('SELECT * FROM patients WHERE email = ?', [email]);
    if (patientRows.length > 0) {
      const patient = patientRows[0];
      const passwordMatch = await bcrypt.compare(password, patient.password);
      if (passwordMatch) {
        return res.json({ success: true, role: 'patient' });
      }
    }

    // If no match found in either table
    res.status(401).json({ success: false, message: 'Invalid email or password' });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});