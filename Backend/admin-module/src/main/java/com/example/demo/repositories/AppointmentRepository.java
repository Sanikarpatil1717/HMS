package com.example.demo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.models.Appointment;

import jakarta.transaction.Transactional;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
	List<Appointment> findByUserId(int userId);
    List<Appointment> findByDoctorId(int doctorId);
    
    // Fetch all pending appointments of a specific doctor
    List<Appointment> findByDoctorIdAndStatus(int doctorId, String status);

    // Delete all appointments of a specific doctor
    @Transactional
    void deleteByDoctorId(int doctorId);
}
