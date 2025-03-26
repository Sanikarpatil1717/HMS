import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";
import "../styles/pages.css";
 
const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [addDoctorModal, setAddDoctorModal] = useState(false);
  const [filterType, setFilterType] = useState("all"); // Default filter to "All"
  const [filterValue, setFilterValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [specialists, setSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [isError, setIsError] = useState(false);
 
  const [newDoctor, setNewDoctor] = useState({
    fullName: "",
    dateOfBirth: "",
    qualification: "",
    specialism: "",
    email: "",
    phone: "",
    password: "",
  });
 
useEffect(() => {
  axios.get("http://localhost:8888/admin/specialists")
    .then(response => setSpecialists(response.data))
    .catch(error => console.error("Error fetching specialists:", error));
}, []);
 
  console.log(specialists)
  useEffect(() => {
    fetchDoctors();
  }, []);
 
  const fetchDoctors = () => {
    setLoading(true);
    axios
      .get("http://localhost:8888/admin/doctors")
      .then((response) => {
        setDoctors(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Error fetching doctors:");
        setLoading(false);
      });
  };
 
 
  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
  };
 
  const handleFilterTypeChange = (e) => {
    const selectedFilter = e.target.value;
    setFilterType(selectedFilter);
    setFilterValue(""); // Reset filter input when switching type
 
    if (selectedFilter === "all") {
      fetchDoctors(); // Fetch all doctors immediately
    }
  };
 
  const applyFilter = () => {
    if (filterType === "all" || !filterValue) {
      fetchDoctors();
      return;
    }
 
    const endpoint =
      filterType === "name"
        ? `http://localhost:8888/admin/doctors/name/${filterValue}`
        : `http://localhost:8888/admin/doctors/specialist/${filterValue}`;
 
    axios
      .get(endpoint)
      .then((response) => setDoctors(response.data))
      .catch((error) => console.error("Error filtering doctors:", error));
  };
 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
  const handleSave = () => {
    axios
      .put(`http://localhost:8888/admin/doctors/${selectedDoctor.id}`, formData)
      .then((response) => {
        setDoctors(doctors.map((doc) => (doc.id === selectedDoctor.id ? response.data : doc)));
        console.log(response);
        alert("Doctor updated successfully");
        closeModal();
      })
      .catch((error) => console.error("Error updating doctor:", error));
  };
 
  const openModal = (doctor) => {
    setSelectedDoctor(doctor);
    setModalIsOpen(true);
    setFormData({
      fullName: doctor.fullName,
      dateOfBirth: doctor.dateOfBirth,
      qualification: doctor.qualification,
      specialism: doctor.specialism.specialistName,
      email: doctor.email,
      phone: doctor.phone,
    });
    setIsEditing(false);
  };
 
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedDoctor(null);
  };
 
  const openAddDoctorModal = () => {
    setAddDoctorModal(true);
  };
 
  const closeAddDoctorModal = () => {
    setAddDoctorModal(false);
    setNewDoctor({
      fullName: "",
      dateOfBirth: "",
      qualification: "",
      specialism: "",
      email: "",
      phone: "",
      password: "",
    });
  };
 
  const handleDelete = (doctorId) => {
    if (!doctorId) return;
  
    axios
      .delete(`http://localhost:8888/admin/doctors/${doctorId}`)
      .then((response) => {
        setDeleteMessage(response.data || "Doctor deleted successfully.");
        setIsError(false);
        fetchDoctors(); // Refresh the list after deletion
        closeModal(); // Close the modal after successful deletion
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setDeleteMessage(error.response.data || "Failed to delete doctor.");
        } else {
          setDeleteMessage("An unexpected error occurred.");
        }
        setIsError(true); // Set red color for error message
      });
  };  
 
  const handleAddDoctor = (e) => {
    e.preventDefault();
 
    const doctorWithPassword = {
      ...newDoctor,
      password: newDoctor.fullName,
      specialism: { id: newDoctor.specialismId } // Send only the ID
    };
 
    console.log(doctorWithPassword)
 
    axios
      .post("http://localhost:8888/admin/doctors", doctorWithPassword)
      .then((response) => {
        setDoctors([...doctors, response.data]);
        closeAddDoctorModal();
      })
      .catch((error) => console.error("Error adding doctor:", error));
 
    alert("Doctor has been added. Please login with your full name as the password.");
  };
 
  return (
    <div className="admin-dashboard">
      <AdminNavbar />
      <div className="container">
        <h1 className="page-title">Doctors List</h1>
 
        {/* Filters */}
        <div className="filter-container">
          <select
            value={filterType}
            onChange={handleFilterTypeChange}
            className="filter-select"
          >
            <option value="all">All</option>
            <option value="name">By Name</option>
            <option value="specialist">By Specialist</option>
          </select>
 
          {filterType !== "all" && (
            <>
            <input
              type="text"
              placeholder={`Search by ${filterType === "name" ? "Name" : "Specialist"}`}
              value={filterValue}
              onChange={handleFilterChange}
              className="filter-input"
            />
 
            <button
              onClick={applyFilter}
              className="search-button"
            >
              Apply Filter
            </button>
            </>
          )}
 
          <button
            onClick={openAddDoctorModal}
            className="search-button"
          >
            Add Doctor
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
                <th>Full Name</th>
                <th>Specialism</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {doctors
                .sort((a, b) => a.id - b.id) // Sort doctors by ID
                .map((doctor, index) => ( // Use index for sequential numbering
                  <tr key={doctor.id} onClick={() => openModal(doctor)}>
                    <td>{index + 1}</td> {/* Display sequential number */}
                    <td>{doctor.fullName}</td>
                    <td>{doctor.specialism ? doctor.specialism.specialistName : "N/A"}</td>
                    <td>{doctor.email}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
     
        {/* Add Doctor Modal */}
        <Modal
          isOpen={addDoctorModal}
          onRequestClose={closeAddDoctorModal}
          ariaHideApp={false}
          contentLabel="Add Doctor"
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          <button className="modal-close-button" onClick={closeAddDoctorModal}>
            &times;
          </button>
          <h2>Add Doctor</h2>
          <form onSubmit={handleAddDoctor} >
            <input type="text" placeholder="Full Name" required
              value={newDoctor.fullName} onChange={(e) => setNewDoctor({ ...newDoctor, fullName: e.target.value })} />
            <input type="date" placeholder="Date of Birth" required
              value={newDoctor.dateOfBirth} onChange={(e) => setNewDoctor({ ...newDoctor, dateOfBirth: e.target.value })} />
            <input type="text" placeholder="Qualification" required
              value={newDoctor.qualification} onChange={(e) => setNewDoctor({ ...newDoctor, qualification: e.target.value })} />
            <select
              className="filter-input"
              required
              value={newDoctor.specialismId || ""}
              onChange={(e) => setNewDoctor({ ...newDoctor, specialismId: e.target.value })}
            >
              <option value="">Select Specialism</option>
              {specialists.map((specialist) => (
                <option key={specialist.id} value={specialist.id}>
                  {specialist.specialistName}
                </option>
              ))}
            </select>
            <input type="email" placeholder="Email" required
              value={newDoctor.email} onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })} />
            <input type="text" placeholder="Phone" required
              value={newDoctor.phone} onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })} />
            <button type="submit" className="submit-button">Add Doctor</button>
          </form>
        </Modal>
 
        {/* Doctor Details Modal */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          ariaHideApp={false}
          contentLabel="Doctor Details"
          className="modal-content doctor-modal"
          overlayClassName="modal-overlay"
        >
 
          <button className="modal-close-button" onClick={closeModal}>
            &times;
          </button>
          <h2 className="modal-title">{isEditing ? "Edit Doctor" : "Doctor Details"}</h2>
 
          <div className="modal-body">
            {isEditing ? (
              <>
                <input  
                  type="text"
                  name="fullName"
                  placeholder="Enter name change"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="date"
                  name="dateOfBirth"
                  placeholder="Enter dob change"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="qualification"
                  placeholder="Enter qualification change"
                  value={formData.qualification}
                  onChange={handleChange}
                  required
                />
                <select
                  name="specialism"
                  value={formData.specialism}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Specialism</option>
                  {specialists.map((specialist) => (
                    <option key={specialist.id} value={specialist.specialistName}>
                      {specialist.specialistName}
                    </option>
                  ))}
                </select>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email change"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter phone number change"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </>
            ) : (
              <>
                <p><strong>Name:</strong> {selectedDoctor?.fullName}</p>
                <p><strong>Specialist:</strong> {selectedDoctor?.specialism.specialistName}</p>
                <p><strong>Email:</strong> {selectedDoctor?.email}</p>
                <p><strong>Phone:</strong> {selectedDoctor?.phone}</p>
              </>
            )}
          </div>
 
          <div className="doctor-modal-buttons">
            {isEditing ? (
              <button onClick={handleSave} className="search-button">Save</button>
            ) : (
              <button onClick={() => setIsEditing(true)} className="search-button">Edit</button>
            )}
            <button onClick={() => handleDelete(selectedDoctor.id)} className="search-button">Delete</button>
            <button onClick={closeModal} className="search-button">Close</button>
          </div>
          <br></br>
          {deleteMessage && <p className={isError ? "error-delete" : "success-delete"}>{deleteMessage}</p>}
        </Modal>
      </div>
    </div>
  );
};
 
export default Doctors;