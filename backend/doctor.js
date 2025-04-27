import db from './database.js'

class Doctor {
  /**
   * Retrieves a doctor's ID based on their email address.
   * @param {string} email - The email of the doctor.
   * @returns {Promise<number|string>} The doctor's ID if found, otherwise a not found message.
   */
  static async getDoctorIdByEmail(email) {
    try {
      const [rows] = await db.query(
        `SELECT doctor_id
         FROM doctors
         WHERE email = ?`,
        [email]
      );
      return rows.length > 0 ? rows[0].doctor_id : 'Doctor not found.';
    } catch (error) {
      throw new Error('Error fetching doctor ID by email: ' + error.message);
    }
  }

  /**
   * Retrieves all patients assigned to a specific doctor.
   * @param {number} doctorId - The ID of the doctor.
   * @returns {Promise<Object[]>} An array of patient objects.
   */
  static async getPatientsByDoctorId(doctorId) {
    try {
      const [rows] = await db.query(
        `SELECT patient_id, first_name, last_name, date_of_birth, email
         FROM patients
         WHERE primary_doctor_id = ?`,
        [doctorId]
      );
      return rows;
    } catch (error) {
      throw new Error('Error fetching patients for doctor: ' + error.message);
    }
  }

  /**
   * Assigns a medication to a specific patient.
   * @param {number} patientId - The ID of the patient.
   * @param {Object} medicationData - The medication details.
   * @param {string} medicationData.medicationName - The name of the medication.
   * @param {string} medicationData.frequency - How often the medication should be taken.
   * @param {string} medicationData.startDate - When the medication starts.
   * @param {string} medicationData.endDate - When the medication ends.
   * @returns {Promise<Object>} The result of the insertion.
   */
  static async prescribeMedication(patientId, medicationData) {
    try {
      const [result] = await db.query(
        `INSERT INTO medications
         (patient_id, medication_name, frequency, start_date, end_date)
         VALUES (?, ?, ?, ?, ?)`,
        [
          patientId,
          medicationData.medicationName,
          medicationData.frequency,
          medicationData.startDate,
          medicationData.endDate
        ]
      );
      return result;
    } catch (error) {
      throw new Error('Error prescribing medication: ' + error.message);
    }
  }

  /**
   * Retrieves a specific patient by their first and last name.
   * @param {string} firstName - The patient's first name.
   * @param {string} lastName - The patient's last name.
   * @returns {Promise<Object|string>} The patient object if found, otherwise a not found message.
   */
  static async getPatientByName(firstName, lastName) {
    try {
      const [rows] = await db.query(
        `SELECT patient_id, first_name, last_name, date_of_birth, email
         FROM patients
         WHERE first_name = ? AND last_name = ?`,
        [firstName, lastName]
      );
      return rows.length > 0 ? rows[0] : 'Patient not found.';
    } catch (error) {
      throw new Error('Error fetching patient by name: ' + error.message);
    }
  }
}

// This block runs ONLY when doctor.js is executed directly
if (import.meta.url.endsWith('doctor.js')) {
  (async () => {
    try {
      const email = 'doc@gmail.com'; // Example email for testing

      const doctorId = await Doctor.getDoctorIdByEmail(email);
      console.log('Doctor ID from Email:', doctorId);

      const patients = await Doctor.getPatientsByDoctorId(doctorId);
      console.log('Patients Assigned to Doctor:', patients);

      const patient = await Doctor.getPatientByName('dom', 'manc');
      console.log('Found Patient:', patient);

      const medicationResult = await Doctor.prescribeMedication(patient.patient_id, {
        medicationName: 'Amoxicillin',
        frequency: 'Twice a day',
        startDate: '2025-04-20',
        endDate: '2025-04-30'
      });
      console.log('Medication Prescribed Successfully! Inserted ID:', medicationResult.insertId);

    } catch (error) {
      console.error(error.message);
    } finally {
      await db.end(); // Close database connection
    }
  })();
}

// ✅ Export the class
export default Doctor;
