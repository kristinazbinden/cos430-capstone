import React, { useState } from 'react';
import ClinicalTablesAPI from '../Api.js';

const MedicationSearchScreen = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setResults([]);
    setLoading(true);
    setSelectedMedication(null);

    try {
      const meds = await ClinicalTablesAPI.searchmedications(query);

      if (!meds || meds.length === 0) {
        setError("No medications found.");
      } else {
        setResults(meds);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMedication = (medication) => {
    setSelectedMedication(medication);
  };

  return (
    <div className="contained-screen">
      <h2 className="form-title">Search Medication</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSearch}>
        <div className="form-group">
          <label htmlFor="medication">Medication Name</label>
          <input
            type="text"
            id="medication"
            placeholder="Enter medication name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {results.length > 0 && (
        <div className="form-group">
          <label htmlFor="results">Search Results</label>
          <div
            id="results"
            style={{
              maxHeight: "300px",
              overflowY: "scroll",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "0.5rem",
              marginTop: "0.5rem"
            }}
          >
            <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
              {results.map((med, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectMedication(med)}
                  style={{
                    cursor: 'pointer',
                    padding: '4px 0',
                    borderBottom: '1px solid #eee'
                  }}
                >
                  {med.medicationName} - {med.dose}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {selectedMedication && (
        <div className="form-group">
          <h3>Selected Medication</h3>
          <p>Name: {selectedMedication.medicationName}</p>
          <p>Dose: {selectedMedication.dose}</p>
        </div>
      )}
    </div>
  );
};

export default MedicationSearchScreen;
