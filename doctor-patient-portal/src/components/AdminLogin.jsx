import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import HomeNavbar from "./HomeNavbar";

function AdminLogin() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  const handleLogin = () => {
    if (credentials.username === "admin" && credentials.password === "admin123") {
      navigate("/admin-dashboard");
    } else {
      alert("Invalid admin credentials");
    }
  };

  return (
    <div className="admin-dashboard">
      <HomeNavbar />
      <div className="bg-container">
        <div className="login-container">
          <h2>Admin Login</h2>
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
