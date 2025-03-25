package com.example.demo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.models.Appointment;
import com.example.demo.models.User;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
	List<Appointment> findByUserId(int userId);
    List<Appointment> findByDoctorId(int doctorId);
}
