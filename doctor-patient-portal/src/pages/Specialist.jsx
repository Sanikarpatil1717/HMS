import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/pages.css";
import AdminNavbar from "../components/AdminNavbar";

const Specialists = () => {
  const [specialists, setSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [specialistName, setSpecialistName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteName, setDeleteName] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetchSpecialists();
  }, []);

  const fetchSpecialists = () => {
    axios
      .get("http://localhost:8888/admin/specialists")
      .then((response) => {
        setSpecialists(response.data);
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
  
  const deleteSpecialist = () => {
    if (!deleteName) return;
  
    axios
      .delete(`http://localhost:8888/admin/specialists/name/${deleteName}`)
      .then((response) => {
        setDeleteMessage(response.data || "Specialization deleted successfully.");
        setDeleteName("");
        setIsError(false); // Error - Set red color
        fetchSpecialists();
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setDeleteMessage(error.response.data || "Failed to delete specialization.");
          setIsError(true); // Error - Set red color
        } else {
          setDeleteMessage("An unexpected error occurred.");
          setIsError(true); // Error - Set red color
        }
      });
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
                <th>Action</th>
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

        <button onClick={() => setModalOpen(true)} className="delete-sp-button">
          Delete Specialization
        </button>
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close-button"
              onClick={() => {
                setModalOpen(false);
                setDeleteMessage("");
              }}
            >
              &times;
            </button>
            <h2>Delete Specialization</h2>
            <input
              type="text"
              value={deleteName}
              onChange={(e) => setDeleteName(e.target.value)}
              placeholder="Enter specialization name"
            />
            <button onClick={deleteSpecialist} className="submit-button">
              Delete
            </button>
            <br></br>
            {deleteMessage && <p className={isError ? "error-delete" : "success-delete"}>{deleteMessage}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Specialists;
