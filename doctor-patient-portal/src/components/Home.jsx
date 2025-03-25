import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Welcome to Our Healthcare System</h1>
      <div className="options">
        <button className="role-button" onClick={() => navigate("/admin-login")}>
          Admin
        </button>
        <button className="role-button" onClick={() => navigate("/doctor-login")}>
          Doctor
        </button>
        <button className="role-button" onClick={() => navigate("/user-login")}>
          Patient
        </button>
      </div>
    </div>
  );
}

export default Home;
