import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserNavbar from "../components/UserNavbar";
import "../styles/pages.css";
import { bookAppointment } from "../services/AppointmentService";
import Modal from "react-modal";

function UserDashboard() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // Store error messages
  const [successMessage, setSuccessMessage] = useState(""); // Store success messages
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
    
  const [formData, setFormData] = useState({
    userId: "",
    doctorId: "",
    appointmentDate: "",
    email: "",
    phone: "",
    diseases: "",
    address: "",
  });

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
  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fetch userId & doctors
  useEffect(() => {
    const loggedInUserId = localStorage.getItem("loggedUserId");
    console.log(loggedInUserId)
    if (loggedInUserId) {
      setFormData((prev) => ({ ...prev, userId: loggedInUserId }));
    }

    axios
      .get("http://localhost:8888/api/doctors")
      .then((response) => setDoctors(response.data))
      .catch((error) => console.error("Error fetching doctors:", error));
  }, []);

  const getMinDateTime = () => {
    const now = new Date();
    now.setSeconds(0, 0); // Remove seconds and milliseconds
    return now.toISOString().slice(0, 16); // Format as "YYYY-MM-DDTHH:mm"
  };

  const getMaxDateTime = () => {
    const threeMonthsAhead = new Date();
    threeMonthsAhead.setMonth(threeMonthsAhead.getMonth() + 3);
    threeMonthsAhead.setHours(22, 0, 0, 0); // Set to 10:00 PM
    return threeMonthsAhead.toISOString().slice(0, 16); // Format as "YYYY-MM-DDTHH:mm"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate phone number
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert("Phone number must be a valid 10-digit number.");
      return;
    }

    // Validate appointment date and time
    const appointmentDate = new Date(formData.appointmentDate);
    const now = new Date();
    const threeMonthsAhead = new Date();
    threeMonthsAhead.setMonth(now.getMonth() + 3);

    if (appointmentDate < now) {
      alert("Appointment date cannot be in the past.");
      return;
    }
    if (appointmentDate > threeMonthsAhead) {
      alert("Appointment date cannot be more than 3 months ahead.");
      return;
    }

    // Validate appointment time (7:00 AM to 10:00 PM)
    const appointmentHours = appointmentDate.getHours();
    if (appointmentHours < 7 || appointmentHours >= 22) {
      alert("Appointment time must be between 7:00 AM and 10:00 PM.");
      return;
    }

    try {
      await bookAppointment(formData);
      alert("Appointment booked successfully!");
      setShowModal(false); // Close modal on success
    } catch (error) {
      alert("Error booking appointment!");
    }
  };

  return (
    <div className="admin-dashboard">
      <UserNavbar setShowPasswordModal={setShowPasswordModal} handleLogout={handleLogout}/>
      <div className="container">
        <div className="card">
          <h2 className="page-title">Welcome, Patient</h2>
          <p>Manage your appointments with ease. Book a new appointment or view your scheduled ones.</p>
          <div className="button-container">
              <button onClick={() => setShowModal(true)}>Book Appointment</button>
              <button onClick={() => navigate("/appointments")}>View Appointments</button>
          </div>
        </div>
        {/*<Button variant="danger" onClick={handleLogout}>Logout</Button>
        <Button variant="primary" onClick={() => setShowModal(true)}>Change Password</Button> */}

        
        {/* Book Appointment Modal */}
        <Modal
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          ariaHideApp={false}
          contentLabel="Book Appointment"
          className="modal-content"
          overlayClassName="modal-overlay"
        >
            <button className="modal-close-button" onClick={() => setShowModal(false)}>&times;</button>
            <h2>Book an Appointment</h2>
            <form onSubmit={handleSubmit}>
              <input type="hidden" name="userId" value={formData.userId} />
              <div className="mb-3">
                <select className="form-control" name="doctorId" onChange={handleChange} required>
                  <option value="">Select a Doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.fullName} ({doctor.specialism})
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="datetime-local"
                name="appointmentDate"
                placeholder="Choose Appointment Date"
                onChange={handleChange}
                required
                min={getMinDateTime()} // Restrict to current date and time or later
                max={getMaxDateTime()} // Restrict to 3 months ahead
              />
              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Enter Phone Number"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="diseases"
                placeholder="Describe Symptoms"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Enter Address"
                onChange={handleChange}
                required
              />
              <button type="submit" className="submit-button">Book Appointment</button>
            </form>
        </Modal>  
        

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
    </div>
  );
}

export default UserDashboard;
