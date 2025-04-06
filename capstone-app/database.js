// Import the necessary modules for MySQL connection and environment variable management
import mysql from 'mysql2'
import dotenv from 'dotenv'

// Load environment variables from the .env file
dotenv.config()

// Create a connection pool to MySQL database using values from environment variables
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,           // MySQL host (e.g., localhost)
  user: process.env.MYSQL_USER,           // MySQL user
  password: process.env.MYSQL_PASSWORD,   // MySQL password
  port: process.env.MYSQL_PORT,           // MySQL port (default: 3306)
  database: process.env.MYSQL_DATABASE    // MySQL database name
}).promise()  // Return a promise-based connection pool

// Create user in database
export async function createUser(userData) {
  console.log('Saving data:', userData);
  const [result] = await pool.query(`
    INSERT INTO users
    (firstname, lastname, email, password)
    VALUES (?, ?, ?, ?)
  `, [
    userData.firstname,
    userData.lastname,
    userData.email,
    userData.password
  ]);

  return result;
}

// Fetch and return a list of all patients from the 'patients' table
export async function getPatientList() {
  const [rows] = await pool.query("SELECT * FROM patients")  // Query to get all patients
  return rows  // Return the list of patients
}

// Fetch and return a list of all doctors from the 'doctors' table
export async function getDoctorList() {
  const [rows] = await pool.query("SELECT * FROM doctors")   // Query to get all doctors
  return rows  // Return the list of doctors
}

// Fetch and return a specific patient by their patient ID
export async function getPatient(id) {
  const [rows] = await pool.query(`
    SELECT * 
    FROM patients
    WHERE patient_id = ?  // Use a parameterized query to avoid SQL injection
  `, [id])  // Pass the patient ID as a parameter
  return rows[0]  // Return the patient object (only one result)
}

// Fetch and return a specific doctor by their doctor ID
export async function getDoctor(id) {
  const [rows] = await pool.query(`
    SELECT * 
    FROM doctors
    WHERE doctor_id = ?  // Use a parameterized query to avoid SQL injection
  `, [id])  // Pass the doctor ID as a parameter
  return rows[0]  // Return the doctor object (only one result)
}

// Uncomment these lines for testing purposes
// const patients = await getPatientList()
// console.log(patients)

// const doctors = await getDoctorList()
// console.log(doctors)

// const patient = await getPatient(10)
// console.log(patient)

// const doctor = await getDoctor(5)
// console.log(doctor)



// Export the pool for use in other parts of the application
export default pool
