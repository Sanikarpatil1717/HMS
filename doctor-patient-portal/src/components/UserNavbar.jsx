import React from "react";
import { Link } from "react-router-dom";
import "../styles/DoctorNavbar.css"; // External CSS file

function UserNavbar({ setShowPasswordModal, handleLogout }) {
  return (
    <nav className="navbar">
      <div className="logo">MediPlus</div>
      <div className="nav-links">
        <Link to="/" className="nav-item">Home</Link>
        <button onClick={setShowPasswordModal}>Change Password</button> {/* Fix */}
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default UserNavbar;
