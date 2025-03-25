import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import HomeNavbar from "./HomeNavbar";

function Home() {
  const navigate = useNavigate();
  
  return (
    <div>
      <HomeNavbar />
      <div className="home-container">
        <div className="text-container">
          <h1>Welcome to Our</h1>
          <h1>Healthcare System</h1>
          <div className="button-group">
            <button className="btn" onClick={()=>navigate("/admin-login")}>Admin</button>
            <button className="btn" onClick={()=>navigate("/doctor-login")}>Doctor</button>
            <button className="btn" onClick={()=>navigate("/user-login")}>Patient</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;