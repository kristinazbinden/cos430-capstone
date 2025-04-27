import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from 'bcryptjs';
import mysql from "mysql2/promise"; // Use promise-based MySQL library
import { createUser, createDoctor, createPatient, getPatientList } from "./database.js"; // Note the .js extension
import pool from "./database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001
import { testDatabaseConnection } from './database.js';

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

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

// Get patients by doctor ID
app.get('/api/patients', async (req, res) => {
  try {
    const doctor_id = req.query.doctor_id || 6; // Use query param or default to 6
    const result = await getPatientList(doctor_id);
    res.status(200).json(result); // Return the array directly, not wrapped in {result: ...}
  } catch (error) {
    console.error('Error finding patients:', error);
    res.status(500).json({
      message: 'Server error', 
      error: error.message
    });
  }
});

// Login Endpoint
// Update login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Doctor login
    const [doctorRows] = await pool.query('SELECT * FROM doctors WHERE email = ?', [email]);
    if (doctorRows.length > 0) {
      const doctor = doctorRows[0];
      const passwordMatch = await bcrypt.compare(password, doctor.password);
      if (passwordMatch) {
        const token = jwt.sign(
          { id: doctor.doctor_id, role: 'doctor' },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );
        return res.cookie('jwt', token, { httpOnly: true, secure: true })
                  .json({ success: true, role: 'doctor' });
      }
    }

    // Patient login
    const [patientRows] = await pool.query('SELECT * FROM patients WHERE email = ?', [email]);
    if (patientRows.length > 0) {
      const patient = patientRows[0];
      const passwordMatch = await bcrypt.compare(password, patient.password);
      if (passwordMatch) {
        const token = jwt.sign(
          { id: patient.patient_id, role: 'patient' },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );
        return res.cookie('jwt', token, { httpOnly: true, secure: true })
                  .json({ success: true, role: 'patient' });
      }
    }

    res.status(401).json({ success: false, message: 'Invalid credentials' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
app.post('/api/medications', async (req, res) => {
  const {
    patient_id,
    medication_name,
    dosage,
    frequency,
    start_date,
    end_date
  } = req.body;

  if (!patient_id || !medication_name || !dosage || !frequency || !start_date || !end_date) {
    return res.status(400).json({ message: 'Missing required medication fields.' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO medications 
       (patient_id, medication_name, dosage, frequency, start_date, end_date) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [patient_id, medication_name, dosage, frequency, start_date, end_date]
    );

    console.log("Inserted medication:", result);
    res.status(201).json({ message: 'Medication prescribed successfully!', result });
  } catch (error) {
    console.error('Error inserting medication:', error);
    res.status(500).json({ message: 'Failed to prescribe medication', error: error.message });
  }
});

// Get a patient by email
app.get('/api/patientByEmail', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'Email query parameter is required.' });
  }

  try {
    const [rows] = await pool.query(`
      SELECT * 
      FROM patients
      WHERE email = ?
    `, [email]);

    if (rows.length > 0) {
      res.status(200).json(rows[0]); // Return the first matching patient
    } else {
      res.status(404).json({ message: 'No patient found with that email.' });
    }
  } catch (error) {
    console.error('Error fetching patient by email:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a doctor by email
app.get('/api/doctorByEmail', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'Email query parameter is required.' });
  }

  try {
    const [rows] = await pool.query(`
      SELECT * 
      FROM doctors
      WHERE email = ?
    `, [email]);

    if (rows.length > 0) {
      res.status(200).json(rows[0]); // Return the first matching doctor
    } else {
      res.status(404).json({ message: 'No doctor found with that email.' });
    }
  } catch (error) {
    console.error('Error fetching doctor by email:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Assign a patient to a doctor
app.put('/api/assignPatient', async (req, res) => {
  const { patient_id, doctor_id } = req.body;

  if (!patient_id || !doctor_id) {
    return res.status(400).json({ message: 'Patient ID and Doctor ID are required.' });
  }

  try {
    const [result] = await pool.query(`
      UPDATE patients
      SET primary_doctor_id = ?
      WHERE patient_id = ?
    `, [doctor_id, patient_id]); // Use primary_doctor_id instead of doctor_id

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Patient assigned to doctor successfully.' });
    } else {
      res.status(404).json({ message: 'Patient not found.' });
    }
  } catch (error) {
    console.error('Error assigning patient to doctor:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/medicationsByPatientId', async (req, res) => {
  const { patientId } = req.query;

  if (!patientId) {
    return res.status(400).json({ message: 'Patient ID is required.' });
  }

  try {
    const [rows] = await pool.query(`
      SELECT * 
      FROM medications
      WHERE patient_id = ?
    `, [patientId]);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching medications by patient ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify user exists in database
    const table = decoded.role === 'doctor' ? 'doctors' : 'patients';
    const [user] = await pool.query(`SELECT * FROM ${table} WHERE ${table}_id = ?`, [decoded.id]);
    
    if (!user) return res.status(401).json({ message: 'Invalid user' });
    
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});