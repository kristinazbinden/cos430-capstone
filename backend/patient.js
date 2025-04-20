import db from './database.js'

class Patient {
  static async getAssignedDoctor(patientId) {
    try {
      console.log("Print if here")
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
}

// This block of code runs only when the patient.js file is directly executed (not imported).
// It checks if the current file (patient.js) is the one being run using `import.meta.url` and 
// ensures that the test code doesn't run if the file is imported elsewhere in the project.
    (async () => {
      try {
        const patientId = 8; // example id
  
        const doctor = await Patient.getAssignedDoctor(patientId)
        console.log('Assigned Doctor:', doctor)
  
        const meds = await Patient.getAllMedications(patientId)
        console.log('All Medications:', meds.join(', '))
  
        const specificMed = await Patient.getMedication(patientId, 'Ibuprofen')
        console.log('Specific Medication:', specificMed)
  
      } catch (error) {
        console.error(error.message)
      } finally {
        await db.end();
      }
    })()
  }

// ✅ Export the class for other files
export default Patient
