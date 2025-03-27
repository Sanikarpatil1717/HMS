import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";
import "../styles/pages.css";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState("all"); // "userId", "doctorId", or "all"
  const [searchValue, setSearchValue] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = () => {
    setLoading(true);
    axios
      .get("http://localhost:8888/admin/appointments")
      .then((response) => {
        setAppointments(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch appointments.");
        setLoading(false);
      });
  };

  // Fetch doctors and users data
  useEffect(() => {
    axios.get("http://localhost:8888/admin/doctors")
      .then((response) => setDoctors(response.data))
      .catch((error) => console.error("Error fetching doctors:", error));

    axios.get("http://localhost:8888/admin/users")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  // Helper functions to get names by ID
  const getDoctorName = (doctorId) => {
    const doctor = doctors.find((doc) => doc.id === doctorId);
    return doctor ? doctor.fullName : "Unknown Doctor";
  };

  const getUserName = (userId) => {
    const user = users.find((usr) => usr.id === userId);
    return user ? user.fullName : "Unknown User";
  };

  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilterType(selectedFilter);
    setSearchValue("");

    if (selectedFilter === "all") {
      fetchAppointments(); // Reload all appointments when "All Appointments" is selected
    }
  };

  const handleSearch = () => {
    if (!searchValue.trim()) return;

    let url = "";
    if (filterType === "userId") {
      url = `http://localhost:8888/admin/appointments/userId/${searchValue}`;
    } else if (filterType === "doctorId") {
      url = `http://localhost:8888/admin/appointments/doctorId/${searchValue}`;
    }

    setLoading(true);
    axios
      .get(url)
      .then((response) => {
        setAppointments(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("No matching appointments found.");
        setLoading(false);
      });
  };

  return (
    <div className="admin-dashboard">
      <AdminNavbar />
      <div className="container">
        <h2 className="page-title">Appointments</h2>

        {/* Filter Dropdown */}
        <div className="filter-container">
          <select value={filterType} onChange={handleFilterChange} className="filter-select">
            <option value="all">All Appointments</option>
            <option value="userId">Filter by User</option>
            <option value="doctorId">Filter by Doctor</option>
          </select>

          {/* Show Input Field Only for User ID or Doctor ID */}
          {filterType !== "all" && (
            <>
              <input
                type="number"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={`Enter ${filterType}`}
                className="filter-input"
              />
              <button onClick={handleSearch} className="search-button">
                Search
              </button>
            </>
          )}
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
                <th>User</th>
                <th>Doctor</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment,index) => (
                <tr key={appointment.id}>
                  <td>{index+1}</td>
                  <td>{getUserName(appointment.userId)}</td> {/* Display user name */}
                  <td>{getDoctorName(appointment.doctorId)}</td> {/* Display doctor name */}
                  <td>{appointment.appointmentDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Appointments;
