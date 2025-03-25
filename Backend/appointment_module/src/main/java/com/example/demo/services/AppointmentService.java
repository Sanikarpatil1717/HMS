package com.example.demo.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.example.demo.models.Appointment;
import com.example.demo.repositories.AppointmentRepository;

import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

	 

    @Autowired
    private AppointmentRepository appointmentRepository;

    // Book an appointment
    public Appointment bookAppointment(Appointment appointment) {
        appointment.setStatus("Pending");
        return appointmentRepository.save(appointment);
    }
//    public Appointment bookAppointment(Appointment appointment, String email) {
//        // ✅ Fetch `userId` from the database using the logged-in user's email
//        String sql = "SELECT id FROM users WHERE email = ?";
//        Long userId;
//
//        try {
//            userId = jdbcTemplate.queryForObject(sql, Long.class, email);
//        } catch (EmptyResultDataAccessException e) {
//            throw new RuntimeException("User not found for email: " + email);
//        }
//
//        appointment.setUserId(userId); // ✅ Assign `userId`
//        appointment.setStatus("Pending");
//
//        return appointmentRepository.save(appointment);
//    }



    // Get appointments by user
    public List<Appointment> getAppointmentsByUser(Long userId) {
        return appointmentRepository.findByUserId(userId);
    }

    // Get appointments by doctor
    public List<Appointment> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    // Update appointment status
    public Appointment updateAppointmentStatus(Long id, String status) {
        Optional<Appointment> optionalAppointment = appointmentRepository.findById(id);
        if (optionalAppointment.isPresent()) {
            Appointment appointment = optionalAppointment.get();
            appointment.setStatus(status);
            return appointmentRepository.save(appointment);
        }
        return null;
    }
    public boolean updateAppointmentStatus(Long id, Long doctorId, String prescription) {
        Appointment appointment = appointmentRepository.findById(id).orElse(null);

        if (appointment == null) {
            System.out.println("Error: Appointment ID " + id + " not found.");
            return false;
        }

        // ✅ Ensure the doctor is assigned to this appointment
        if (!appointment.getDoctorId().equals(doctorId)) {
            System.out.println("Error: Doctor ID " + doctorId + " does not match appointment's assigned doctor.");
            return false;
        }

        appointment.setStatus(prescription); // 🔥 Store prescription in status
        appointmentRepository.save(appointment);

        System.out.println("Appointment updated successfully: " + appointment);
        return true;
    }


    // Cancel appointment
    public boolean cancelAppointment(Long id) {
        if (appointmentRepository.existsById(id)) {
            appointmentRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
