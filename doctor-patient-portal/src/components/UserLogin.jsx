import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

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
      <p>New user? <button onClick={handleRegister}>Register</button></p>
    </div>
  );
}

export default UserLogin;
