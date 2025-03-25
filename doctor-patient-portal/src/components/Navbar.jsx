import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-primary">
      <div className="container">
        <Link className="navbar-brand text-white" to="/">Doctor Patient Portal</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link className="nav-link text-white" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link text-white" to="/doctors">Doctors</Link></li>
            <li className="nav-item"><Link className="nav-link text-white" to="/appointment">Appointment</Link></li>
            <li className="nav-item"><Link className="nav-link text-white" to="/login">Login</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
