import db from './database.js'

class Patient {
  
  /**
   * Retrieves the first name of the doctor assigned to the given patient.
   * @param {number} patientId - The ID of the patient.
   * @returns {Promise<string>} The first name of the assigned doctor or a message if not found.
   */
  static async getAssignedDoctor(patientId) {
    try {
      const [rows] = await db.query(
        `SELECT doctors.first_name
         FROM doctors
         JOIN patients ON patients.primary_doctor_id = doctors.doctor_id
         WHERE patients.patient_id = ?`,
        [patientId]
      )
      return rows.length > 0 ? rows[0].first_name : 'No assigned doctor found.'
    } catch (error) {
      throw new Error('Error fetching assigned doctor: ' + error.message)
    }
  }

  /**
   * Retrieves all medication names prescribed to the given patient.
   * @param {number} patientId - The ID of the patient.
   * @returns {Promise<string[]>} An array of medication names.
   */
  static async getAllMedications(patientId) {
    try {
      const [rows] = await db.query(
        `SELECT medication_name 
         FROM medications
         WHERE patient_id = ?`,
        [patientId]
      )
      return rows.map(row => row.medication_name)
    } catch (error) {
      throw new Error('Error fetching medications: ' + error.message)
    }
  }

  /**
   * Retrieves a specific medication for a given patient.
   * @param {number} patientId - The ID of the patient.
   * @param {string} medicationName - The name of the medication to search for.
   * @returns {Promise<string>} The medication name if found, otherwise a not found message.
   */
  static async getMedication(patientId, medicationName) {
    try {
      const [rows] = await db.query(
        `SELECT * 
         FROM medications
         WHERE patient_id = ? AND medication_name = ?`,
        [patientId, medicationName]
      )
      return rows.length > 0 ? rows[0].medication_name : 'Medication not found.'
    } catch (error) {
      throw new Error('Error fetching medication: ' + error.message)
    }
  }

  /**
   * Retrieves a patient's ID based on their email address.
   * @param {string} email - The email of the patient.
   * @returns {Promise<number|string>} The patient's ID if found, otherwise a not found message.
   */
  static async getPatientIdByEmail(email) {
    try {
      const [rows] = await db.query(
        `SELECT patient_id 
         FROM patients
         WHERE email = ?`,
        [email]
      )
      return rows.length > 0 ? rows[0].patient_id : 'Patient not found.'
    } catch (error) {
      throw new Error('Error fetching patient ID by email: ' + error.message)
    }
  }
}

// This block of code runs ONLY when the patient.js file is directly executed (not imported).
// It checks if the current module is the main one, using `import.meta.url`.
// This way, testing code won't accidentally run when this file is imported elsewhere.
if (import.meta.url.endsWith('patient.js')) {
  (async () => {
    try {

      const email = 'Patient@gmail.com'; // Example email for testing

      const patientId = await Patient.getPatientIdByEmail(email)
      console.log('Patient ID from Email:', patientId)

      const doctor = await Patient.getAssignedDoctor(patientId)
      console.log('Assigned Doctor:', doctor)

      const meds = await Patient.getAllMedications(patientId)
      console.log('All Medications:', meds.join(', '))

      const specificMed = await Patient.getMedication(patientId, 'Ibuprofen')
      console.log('Specific Medication:', specificMed)

    } catch (error) {
      console.error(error.message)
    } finally {
      await db.end() // Close the database connection after testing
    }
  })()
}
// ✅ Export the class for other files
export default Patient
