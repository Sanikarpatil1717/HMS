import React from "react";
import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Home from "./components/Home";
import AdminDashboard from "./dashboards/AdminDashboard";
import DoctorDashboard from "./dashboards/DoctorDashboard";
import UserDashboard from "./dashboards/UserDashboard";
import BookAppointment from "./components/BookAppointment";
import ViewAppointments from "./components/ViewAppointments";
import AdminLogin from "./components/AdminLogin";
import DoctorLogin from "./components/DoctorLogin";
import UserLogin from "./components/UserLogin";
import Register from "./components/Register";
import Specialists from "./pages/Specialist";
import Users from "./pages/Users";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointment";

function App() {
  return (
    <>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/doctor-login" element={<DoctorLogin />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />

        <Route path="/book" element={<BookAppointment />} />
        <Route path="/appointments" element={<ViewAppointments />} />


        <Route path="/admin/appointments" element={<Appointments />} />
        <Route path="/admin/specialists" element={<Specialists />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="admin/doctors" element={<Doctors />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
