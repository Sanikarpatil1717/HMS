package com.example.demo.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.Specialist;

public interface SpecialistRepository extends JpaRepository<Specialist, Integer> {
	// Find a specialization by name (case insensitive)
    Optional<Specialist> findBySpecialistNameIgnoreCase(String specialistName);
}
