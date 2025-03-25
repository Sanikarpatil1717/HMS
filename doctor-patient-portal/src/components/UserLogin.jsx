import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";
import HomeNavbar from "./HomeNavbar";

function UserLogin() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    console.log("Sending Login Data:", user);
    try {
      const response = await axios.post("http://localhost:8888/api/users/login", user, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
  
      console.log("Login Response:", response.data); // Debugging
      console.log("Extracted UserId:", response.data?.userId); // Check if userId exists
  
      if (response.data.success && response.data.userId) {
        localStorage.setItem("loggedUserId", response.data.userId);
        console.log("Stored UserId in localStorage:", localStorage.getItem("loggedUserId"));
        navigate("/user-dashboard");
      } else {
        alert(response.data.message || "Invalid user credentials");
      }
    } catch (error) {
      console.error("Login Error:", error.response ? error.response.data : error.message);
      alert(error.response?.data?.message || "Login failed. Please try again.");
    }
  };
  
  
  const handleRegister = () => {
    navigate("/register"); // Navigate to registration page
  };
  return (
    <div className="admin-dashboard">
      <HomeNavbar />
      <div className="bg-container">
        <div className="login-container">
          <h2>User Login</h2>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
          <button onClick={handleLogin}>Login</button>
          <div class="new-user-container">
            <span>New user?</span>
            <a href="/register" class="register-link">Register</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
