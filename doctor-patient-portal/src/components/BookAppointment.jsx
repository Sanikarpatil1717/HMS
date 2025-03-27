import React, { useEffect, useState } from "react";
import { bookAppointment } from "../services/AppointmentService";
import axios from "axios";

const BookAppointment = () => {
  const [formData, setFormData] = useState({
    userId: "",
    doctorId: "",
    appointmentDate: "",
    email: "",
    phone: "",
    diseases: "",
    address: "",
  });

  const [doctors, setDoctors] = useState([]);
  const [phoneError, setPhoneError] = useState(""); // State to store phone validation error

  useEffect(() => {
    const loggedInUserId = localStorage.getItem("userId");
    if (loggedInUserId) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        userId: loggedInUserId,
        email: formData.email || "",
      }));
    }

    // Fetch doctors with specialism name
    axios
      .get("http://localhost:8888/api/doctors")
      .then((response) => setDoctors(response.data))
      .catch((error) => console.error("Error fetching doctors:", error));
  }, []); // Run only once on component mount

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate phone number in real-time
    if (name === "phone") {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(value)) {
        setPhoneError("Phone number must be a valid 10-digit number.");
      } else {
        setPhoneError(""); // Clear error if valid
      }
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Final formData before submission:", formData); // Debugging

    if (!formData.userId) {
      alert("User ID not found. Please log in again.");
      return;
    }

    // Validate phone number explicitly
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setPhoneError("Phone number must be a valid 10-digit number.");
      alert("Phone number must be a valid 10-digit number."); // Show alert for invalid phone
      return; // Stop submission
    }
    setPhoneError(""); // Clear error if valid

    try {
      await bookAppointment(formData);
      alert("Appointment booked successfully!");
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert(`Error booking appointment: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow-lg p-4" style={{ maxWidth: "500px", width: "100%" }}>
        <h3 className="text-center mb-4">Book an Appointment</h3>
        <form onSubmit={handleSubmit}>
          {/* User ID (Hidden) */}
          <input type="hidden" name="userId" value={formData.userId} />
          {/* Doctor Dropdown */}
          <div className="mb-3">
            <label className="form-label">Doctor</label>
            <select className="form-control" name="doctorId" onChange={handleChange} required>
              <option value="">Select a Doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.fullName} ({doctor.specialism})
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Appointment Date</label>
            <input type="datetime-local" className="form-control" name="appointmentDate" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              // placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled
              title="This email is linked to your account and cannot be changed."
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input
              type="text"
              className={`form-control ${phoneError ? "is-invalid" : ""}`} // Add invalid class if error exists
              name="phone"
              placeholder="Enter Phone Number"
              onChange={handleChange}
              required
            />
            {phoneError && <div className="invalid-feedback">{phoneError}</div>} {/* Display error message */}
          </div>
          <div className="mb-3">
            <label className="form-label">Diseases</label>
            <input type="text" className="form-control" name="diseases" placeholder="Describe Symptoms" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Address</label>
            <input type="text" className="form-control" name="address" placeholder="Enter Address" onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary w-100">Book Appointment</button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
