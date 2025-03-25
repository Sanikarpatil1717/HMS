import React from "react";
import { Link } from "react-router-dom";
import "../styles/DoctorNavbar.css"; // External CSS file
import logo from "../assets/medilogo.png";

function DoctorNavbar({ setShowModal, handleLogout }) {
  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={logo} alt="MediPlus Logo" className="logo-img" />
        <span className="logo-text">MediPlus</span>
      </div>      <div className="nav-links">
        <Link to="/" className="nav-item">Home</Link>
        <button onClick={setShowModal}>Change Password</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default DoctorNavbar;
