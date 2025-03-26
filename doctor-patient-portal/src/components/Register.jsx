import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import HomeNavbar from "./HomeNavbar";

const Register = () => {
    const [user, setUser] = useState({ fullName: "", email: "", password: "" });
    const [emailError, setEmailError] = useState(""); // State to store email validation error

  const navigate = useNavigate();
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex pattern
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    if (!validateEmail(user.email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailError(""); // Clear error if valid

    try {
      const response = await fetch("http://localhost:8888/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const result = await response.text();
      if (response.ok) {
        alert(result);
        navigate("/user-login"); // Redirect to login page
      } else {
        alert(result);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="admin-dashboard">
      <HomeNavbar />
      <div className="bg-container">
        <div className="login-container">
          <h2>Register</h2>
          <input
            type="text"
            placeholder="Name"
            onChange={(e) => setUser({ ...user, fullName: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) =>  {
              setUser({ ...user, password: e.target.value });
            validateEmail(e.target.value)}}
          />
          {emailError && <p className="error-text">{emailError}</p>} {/* Show error message */}

          <button onClick={handleRegister}>Register</button>
          <div class="new-user-container">
            <span>Already have an account?</span>
            <a href="/user-login" class="register-link">Log In</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
