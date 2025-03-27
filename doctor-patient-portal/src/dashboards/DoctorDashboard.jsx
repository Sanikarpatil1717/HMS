import React, { useEffect, useState } from "react";
import { getAppointmentsByDoctor } from "../services/AppointmentService";
import axios from "axios";
import { Container, Table, Button, Badge, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DoctorNavbar from "../components/DoctorNavbar";

const DoctorDashboard = () => {
  const doctorId = localStorage.getItem("doctorId"); // Get stored doctorId
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Store error messages
  const [successMessage, setSuccessMessage] = useState(""); // Store success messages
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [prescription, setPrescription] = useState("");
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  useEffect(() => {
    if (doctorId) {
      fetchAppointments();
    }
  }, [doctorId]);

  const getPatientName = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8888/api/users/${userId}`);
      console.log(response.data.fullName)
      return response.data.fullName; // Assuming fullName exists in response
    } catch (error) {
      console.error(`Error fetching patient details for userId: ${userId}`, error);
      return "Unknown";
    }
  };
  
  const fetchAppointments = async () => {
    try {
      // setLoading(true);
      console.log(`Fetching appointments for doctorId: ${doctorId}`);
      const response = await getAppointmentsByDoctor(doctorId);
      const appointmentsData = response.data;

    // Fetch patient names for each appointment
    const updatedAppointments = await Promise.all(
      appointmentsData.map(async (appointment) => {
        const patientName = await getPatientName(appointment.userId);
        console.log(patientName);
        return { ...appointment, patientName };
      })
    );

    setAppointments(updatedAppointments);
      setLoading(false);
    } catch (error) {
      setError("Error fetching doctor appointments:", error);
      setLoading(false);
    }
  };

  const openPrescriptionModal = (appointmentId) => {
    setSelectedAppointment(appointmentId);
    setShowPrescriptionModal(true);
  };

  const closePrescriptionModal = () => {
    setShowPrescriptionModal(false);
    setPrescription("");
  };


  const handleUpdateStatus = async () => {
    if (!prescription.trim()) {
      alert("Prescription cannot be empty.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8888/appointments/${selectedAppointment}/update-status`,
        { doctorId, prescription },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Updated successfully:", response.data);
      alert("Prescription updated successfully!");
      fetchAppointments(); // Refresh appointments after update
      closePrescriptionModal();
    } catch (error) {
      console.error("Error updating prescription:", error.response?.data || error.message);
      alert("Failed to update prescription. Check console for details.");
    }
  };

  const handleChangePassword = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!oldPassword || !newPassword) {
      setErrorMessage("Both fields are required!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8888/api/doctors/changePassword", {
        userId: doctorId,
        oldPassword,
        newPassword,
      });

      setSuccessMessage(response.data);
      setTimeout(() => setShowModal(false), 2000); // Close modal after success
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      setErrorMessage(error.response?.data || "Password change failed");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8888/api/doctors/logout", {}, { withCredentials: true });
  
      alert("Logged out successfully!");
      localStorage.removeItem("doctorToken"); // Clear stored authentication token if any
      window.location.href = "/doctor-login"; // Redirect to login page
    } catch (error) {
      alert(error.response?.data || "Logout failed");
    }
  };
  
  return (
    <div className="admin-dashboard">
      <DoctorNavbar setShowModal={setShowModal} handleLogout={handleLogout} />
      <div className="container">
      {/* <button className="change-password-button" onClick={() => setShowModal(true)}>Change Password</button>
      <button variant="dang er" onClick={handleLogout}>Logout</button> */}

        
        <h2 className="page-title">Doctor Dashboard</h2>
        {/* <h5 className="text-center text-muted">Doctor ID: {doctorId}</h5> */}
          

        {loading ? (
          <p className="loading-text">Loading...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient Name</th>
                  <th>Diseases</th>
                  <th>Date</th>
                  <th>Status/Prescription</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length > 0 ? (
                  appointments.map((appointment,index) => (
                    <tr key={appointment.id}>
                      <td>{index+1}</td>
                      <td>{appointment.patientName || "Unknown"}</td>
                      <td>{appointment.diseases}</td>
                      <td>{appointment.appointmentDate}</td>
                      <td>{appointment.status || "Pending"}</td>
                      <td>
                        <button
                          className="search-button"
                          onClick={() => openPrescriptionModal(appointment.id)}
                        >
                          Add Prescription
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      No appointments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
        )}

        {/* Change password Modal */}
        {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-button" onClick={() => setShowModal(false)}>×</button>
            <h3>Change Password</h3>

            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

            <input
              type="password"
              placeholder="Enter Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button className="submit-button" onClick={handleChangePassword}>
              Update Password
            </button>
          </div>
        </div>
      )}

      {/* Prescription Modal */}
      {showPrescriptionModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-button" onClick={closePrescriptionModal}>×</button>
            <h3>Enter Prescription</h3>
            <input
              type="text"
              placeholder="Enter prescription"
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
            />
            <button className="submit-button" onClick={handleUpdateStatus}>
              Submit Prescription
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
