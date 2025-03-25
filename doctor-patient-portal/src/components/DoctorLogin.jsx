import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function DoctorLogin() {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8888/api/doctors/login",
        doctor,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        localStorage.setItem("doctorToken", response.data.token); // Store token
        localStorage.setItem("doctorId", response.data.doctorId); // Store doctorId
        navigate("/doctor-dashboard");
      } else {
        setError("Invalid doctor credentials");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>Doctor Login</h2>
      {error && <p className="error-message">{error}</p>}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={doctor.email}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={doctor.password}
        onChange={handleChange}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default DoctorLogin;
