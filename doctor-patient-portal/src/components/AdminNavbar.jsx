import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css"; // External CSS file
import logo from "../assets/medilogo.png";

function AdminNavbar() {
  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={logo} alt="MediPlus Logo" className="logo-img" />
        <span className="logo-text">MediPlus</span>
      </div>      
      <div className="nav-links">
        <Link to="/ " className="nav-item">Home</Link>
        <Link to="/admin/users" className="nav-item">Users</Link>
        <Link to="/admin/doctors" className="nav-item">Doctors</Link>
        <Link to="/admin/specialists" className="nav-item">Specialists</Link>
        <Link to="/admin/appointments" className="nav-item">Appointments</Link>
      </div>
    </nav>
  );
}

export default AdminNavbar;
