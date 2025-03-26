import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css"; // Importing CSS for dashboard
import AdminNavbar from "../components/AdminNavbar.jsx";
import Footer from "../components/Footer.jsx";

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard">
      <AdminNavbar /> {/* Adding the secondary navbar here */}

      {/* Content Section */}
      {/* <div className="admin-content">
        <h2>Welcome, Admin</h2>
        <p>Select an option from the navbar to manage data.</p>
      </div> */}

      <div className="home-container">
        <div className="text-container">
          <h1>Welcome, Admin</h1>
          <span>You can now manage users, doctors, <br></br>specialists and appointments</span>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AdminDashboard;
