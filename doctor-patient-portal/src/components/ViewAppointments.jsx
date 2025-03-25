import React, { useEffect, useState } from "react";
import { getAppointmentsByUser, cancelAppointment } from "../services/AppointmentService";
import UserNavbar from "./UserNavbar";
import "../styles/pages.css";

const ViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const loggedUserId = localStorage.getItem("loggedUserId");

  useEffect(() => {
    if (loggedUserId) {
      fetchAppointments();
    }
  }, [loggedUserId]);

  const fetchAppointments = async () => {
    try {
      const response = await getAppointmentsByUser(loggedUserId);
      setAppointments(response.data);
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

  return (
    <div className="admin-dashboard">
      <UserNavbar />
      <div className="container">
        <h2 className="page-title">Your Appointments</h2>
        {appointments.length === 0 ? (
          <p className="error-text">No appointments found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Doctor ID</th>
                <th>Date</th>
                <th>Diseases</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id} onClick={() => setSelectedAppointment(appointment)}>
                  <td>{appointment.id}</td>
                  <td>{appointment.doctorId}</td>
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
    </div>
  );
};

export default ViewAppointments;
