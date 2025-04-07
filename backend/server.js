import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { createUser } from "./database.js"; // Note the .js extension

dotenv.config();

const app = express();
const PORT = 3001;
import { testDatabaseConnection } from './database.js';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route
app.get('/', (req, res) => {
  res.send('Welcome to the API!'); // Respond with a simple message
});

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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});