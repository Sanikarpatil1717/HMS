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

  useEffect(() => {
    const loggedInUserId = localStorage.getItem("userId");
    if (loggedInUserId) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        userId: loggedInUserId,
      }));
    }

    // Fetch doctors with specialism name
    axios
      .get("http://localhost:8888/api/doctors")
      .then((response) => setDoctors(response.data))
      .catch((error) => console.error("Error fetching doctors:", error));
  }, []);

  useEffect(() => {
    const loggedInUserId = localStorage.getItem("loggedUserId"); // Retrieve user ID
    if (loggedInUserId) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        userId: loggedInUserId, // Ensure userId is set
      }));
    }
  }, [localStorage.getItem("userId")]); // Trigger when userId in localStorage changes
  
  const handleChange = (e) => {
    const { name, value } = e.target;
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
    try {
      await bookAppointment(formData);
      alert("Appointment booked successfully!");
    } catch (error) {
      alert("Error booking appointment!");
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
                  {doctor.fullName} ({doctor.specialism}) {/* Display doctor with specialism */}
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
            <input type="email" className="form-control" name="email" placeholder="Enter Email" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input type="text" className="form-control" name="phone" placeholder="Enter Phone Number" onChange={handleChange} required />
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
