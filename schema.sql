-- Drop the database if it already exists and create a new one
DROP DATABASE IF EXISTS healthcare_db;
CREATE DATABASE healthcare_db;
USE healthcare_db;

-- Create the users table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,   -- Unique User ID
    username VARCHAR(100) UNIQUE NOT NULL,     -- Unique username
    password VARCHAR(255) NOT NULL,            -- User password
    name VARCHAR(255) NOT NULL                 -- User's full name
);

-- Create the doctors table
CREATE TABLE doctors (
    doctor_id INT AUTO_INCREMENT PRIMARY KEY,  
    user_id INT,  -- Foreign Key to users table
    first_name VARCHAR(100) NOT NULL,           
    last_name VARCHAR(100) NOT NULL,            
    email VARCHAR(100) UNIQUE,                 
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create the patients table
CREATE TABLE patients (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,     
    user_id INT,                                  -- Foreign Key to users table
    first_name VARCHAR(100) NOT NULL,               
    last_name VARCHAR(100) NOT NULL,                
    date_of_birth DATE,                             
    email VARCHAR(100) UNIQUE,                      
    primary_doctor_id INT,                           -- Foreign Key to doctors table
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (primary_doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE
);

-- Create the medications table
CREATE TABLE medications (
    medication_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,                                 -- Foreign Key to patients table
    medication_name VARCHAR(100),
    dosage VARCHAR(100),
    frequency VARCHAR(50),
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
);

-- Insert Users (Doctors, Patients, Admins)
INSERT INTO users (username, password, name) VALUES 
('admin1', 'adminpass', 'Admin User One'),
('doctor1', 'doctorpass1', 'Dr. John Doe'),
('doctor2', 'doctorpass2', 'Dr. Jane Smith'),
('doctor3', 'doctorpass3', 'Dr. Emily White'),
('patient1', 'patientpass1', 'Michael Green'),
('patient2', 'patientpass2', 'Sarah Black'),
('patient3', 'patientpass3', 'Chris Blue'),
('patient4', 'patientpass4', 'Olivia Red'),
('patient5', 'patientpass5', 'David Brown'),
('patient6', 'patientpass6', 'Sophia Yellow'),
('patient7', 'patientpass7', 'Lucas Purple');

-- Insert Doctors (linked with users)
INSERT INTO doctors (user_id, first_name, last_name, email) VALUES
(2, 'John', 'Doe', 'john.doe@hospital.com'),
(3, 'Jane', 'Smith', 'jane.smith@clinic.com'),
(4, 'Emily', 'White', 'emily.white@hospital.com');

-- Insert Patients (linked with users and doctors)
INSERT INTO patients (user_id, first_name, last_name, date_of_birth, email, primary_doctor_id) VALUES
(5, 'Michael', 'Green', '1990-05-15', 'michael.green@mail.com', 1),
(6, 'Sarah', 'Black', '1985-07-20', 'sarah.black@mail.com', 2),
(7, 'Chris', 'Blue', '1992-11-02', 'chris.blue@mail.com', 2),
(8, 'Olivia', 'Red', '1998-04-25', 'olivia.red@mail.com', 3),
(9, 'David', 'Brown', '1982-09-10', 'david.brown@mail.com', 3),
(10, 'Sophia', 'Yellow', '2000-01-30', 'sophia.yellow@mail.com', 1),
(11, 'Lucas', 'Purple', '1995-02-28', 'lucas.purple@mail.com', 1);

-- Insert Medications (linked with patients)
INSERT INTO medications (patient_id, medication_name, dosage, frequency, start_date, end_date) VALUES
(1, 'Amoxicillin', '500mg', '3 times a day', '2025-01-01', '2025-01-10'),
(2, 'Paracetamol', '200mg', 'Twice a day', '2025-02-01', '2025-02-10'),
(3, 'Ibuprofen', '400mg', 'Once a day', '2025-03-01', '2025-03-07'),
(4, 'Metformin', '500mg', 'Twice a day', '2025-03-10', '2025-03-20'),
(5, 'Amlodipine', '10mg', 'Once a day', '2025-04-01', '2025-04-30'),
(6, 'Atorvastatin', '20mg', 'Once a day', '2025-05-01', '2025-05-15'),
(7, 'Lisinopril', '5mg', 'Once a day', '2025-06-01', '2025-06-10'),
(2, 'Hydrochlorothiazide', '25mg', 'Once a day', '2025-02-01', '2025-02-28'),
(3, 'Simvastatin', '40mg', 'Once a day', '2025-04-05', '2025-04-25'),
(1, 'Prednisone', '10mg', 'Twice a day', '2025-05-10', '2025-05-20');
