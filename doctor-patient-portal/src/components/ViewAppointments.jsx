import React, { useEffect, useState } from "react";
import { getAppointmentsByUser, cancelAppointment } from "../services/AppointmentService";
import UserNavbar from "./UserNavbar";
import "../styles/pages.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const loggedUserId = localStorage.getItem("loggedUserId");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Store error messages
  const [successMessage, setSuccessMessage] = useState(""); // Store success messages

  useEffect(() => {
    if (loggedUserId) {
      fetchAppointments();
    }
  }, [loggedUserId]);

  const getDoctorName = async (doctorId) => {
    try {
      const response = await axios.get(`http://localhost:8888/api/doctors/${doctorId}`);
      return response.data.fullName; // Assuming fullName exists in response
    } catch (error) {
      console.error(`Error fetching doctor details for doctorId: ${doctorId}`, error);
      return "Unknown";
    }
  };
  const fetchAppointments = async () => {
    try {
      const response = await getAppointmentsByUser(loggedUserId);
      const appointmentsData = response.data;

      // Fetch doctor names for each appointment
      const updatedAppointments = await Promise.all(
        appointmentsData.map(async (appointment) => {
          const docName = await getDoctorName(appointment.doctorId);
          return { ...appointment, doctorName: docName };
        })
      );

      setAppointments(updatedAppointments);
    } catch (error) {
      console.error("Error fetching appointments", error);
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelAppointment(id);
      fetchAppointments();
      setSelectedAppointment(null);
    } catch (error) {
      console.error("Error canceling appointment", error);
    }
  };

  const handleClose = () => {
    setSelectedAppointment(null); // Hide the modal
  };

  const handleChangePassword = async () => {
    try {
      const userId = localStorage.getItem("loggedUserId"); // Retrieve user ID from storage
      const response = await axios.post("http://localhost:8888/api/users/changePassword", {
        userId,
        oldPassword,
        newPassword,
      });

      alert(response.data);
      setShowPasswordModal(false);
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      alert(error.response?.data || "Password change failed");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8888/api/users/logout", {}, { withCredentials: true });
      alert("Logged out successfully!");
      localStorage.removeItem("userToken"); // Clear stored authentication token
      navigate("/user-login"); // Redirect to login page
    } catch (error) {
      alert(error.response?.data || "Logout failed");
    }
  };

  return (
    <div className="admin-dashboard">
      <UserNavbar setShowModal={setShowPasswordModal} handleLogout={handleLogout} />
      <div className="container">
        <h2 className="page-title">Your Appointments</h2>
        {appointments.length === 0 ? (
          <p className="error-text">No appointments found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Doctor Name</th>
                <th>Date</th>
                <th>Diseases</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment,index) => (
                <tr key={appointment.id} onClick={() => setSelectedAppointment(appointment)}>
                  <td>{index+1}</td>
                  <td>{appointment.doctorName || "Unknown"}</td>
                  <td>{appointment.appointmentDate}</td>
                  <td>{appointment.diseases}</td>
                  <td>{appointment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedAppointment && (
        <div className="modal-overlay">
          <div className="doctor-modal">
            <h3 className="modal-title">Appointment Details</h3>
            <p><strong>ID:</strong> {selectedAppointment.id}</p>
            <p><strong>Doctor ID:</strong> {selectedAppointment.doctorId}</p>
            <p><strong>Date:</strong> {selectedAppointment.appointmentDate}</p>
            <p><strong>Diseases:</strong> {selectedAppointment.diseases}</p>
            <p><strong>Status:</strong> {selectedAppointment.status}</p>
            <div className={`doctor-modal-buttons ${selectedAppointment.status === "Pending" ? "space-between" : "center"}`}>
              {selectedAppointment.status === "Pending" && (
                <button className="delete-button" onClick={() => handleCancel(selectedAppointment.id)}>Cancel</button>
              )}
              <button className="close-button" onClick={handleClose}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Change password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-button" onClick={() => setShowPasswordModal(false)}>×</button>
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
    </div>
  );
};

export default ViewAppointments;
