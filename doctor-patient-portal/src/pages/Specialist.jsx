import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/pages.css";
import AdminNavbar from "../components/AdminNavbar";

const Specialists = () => {
  const [specialists, setSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [specialistName, setSpecialistName] = useState("");

  useEffect(() => {
    fetchSpecialists();
  }, []);

  const fetchSpecialists = () => {
    axios
      .get("http://localhost:8888/admin/specialists")
      .then((response) => {
        setSpecialists(response.data);
        console.log("hello");
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch specialists.");
        setLoading(false);
      });
  };

  const addSpecialist = () => {
    if (!specialistName) return;
    axios
      .post("http://localhost:8888/admin/specialists", {
        specialistName,
      }, {
        headers: { "Content-Type": "application/json" }
      })
      .then(() => {
        setSpecialistName("");
        fetchSpecialists();
      })
      .catch(() => setError("Failed to add specialist."));
  };

  return (
    <div className="admin-dashboard">
      <AdminNavbar />
      <div className="container">
        <h1 className="page-title">Specialists List</h1>

        <div className="filter-container">
          <input
            type="text"
            value={specialistName}
            onChange={(e) => setSpecialistName(e.target.value)}
            placeholder="Enter specialisation name"
            className="filter-input"
          />
          <button
            onClick={addSpecialist}
            className="search-button"
          >
            Add Specialisation
          </button>
        </div>

        {loading ? (
          <p className="loading-text">Loading...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Specialty</th>
              </tr>
            </thead>
            <tbody>
              {specialists.map((specialist) => (
                <tr key={specialist.id}>
                  <td>{specialist.id}</td>
                  <td>{specialist.specialistName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Specialists;