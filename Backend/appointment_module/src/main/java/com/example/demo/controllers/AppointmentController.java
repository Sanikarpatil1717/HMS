package com.example.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.models.Appointment;
import com.example.demo.services.AppointmentService;

import java.util.List;
import java.util.Map;

//@CrossOrigin(origins = "http://localhost:3000") // Adjust if deployed

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    
    // Book an appointment
    @PostMapping("/user/book")
    public ResponseEntity<Appointment> bookAppointment(@RequestBody Appointment appointment) {
        return ResponseEntity.ok(appointmentService.bookAppointment(appointment));
    }
   

    // Get appointments for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByUser(userId));
    }

    // Get appointments for a doctor
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByDoctor(doctorId));
    }

    // Update appointment status (Completed, Canceled)
    @PutMapping("/status/{id}")
    public ResponseEntity<Appointment> updateAppointmentStatus(@PathVariable Long id, @RequestParam String status) {
        Appointment updatedAppointment = appointmentService.updateAppointmentStatus(id, status);
        return updatedAppointment != null ? ResponseEntity.ok(updatedAppointment) : ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}/update-status")
    public ResponseEntity<String> updateAppointmentStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Object> requestBody) {

        try {
            Long doctorId = Long.valueOf(requestBody.get("doctorId").toString());
            String prescription = requestBody.get("prescription").toString();

            System.out.println("Received Request - Appointment ID: " + id + ", Doctor ID: " + doctorId + ", Prescription: " + prescription);

            boolean isUpdated = appointmentService.updateAppointmentStatus(id, doctorId, prescription);

            if (isUpdated) {
                return ResponseEntity.ok("Appointment updated successfully with prescription.");
            } else {
                return ResponseEntity.badRequest().body("Failed to update appointment. Check the provided details.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid request: " + e.getMessage());
        }
    }



    // Cancel an appointment
    @DeleteMapping("cancel/{id}")
    public ResponseEntity<String> cancelAppointment(@PathVariable Long id) {
        return appointmentService.cancelAppointment(id)
                ? ResponseEntity.ok("Appointment canceled successfully.")
                : ResponseEntity.notFound().build();
    }
}
