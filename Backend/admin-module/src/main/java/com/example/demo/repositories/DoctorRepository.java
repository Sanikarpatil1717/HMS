package com.example.demo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.models.Doctor;

public interface DoctorRepository extends JpaRepository<Doctor, Integer> {
	@Query("SELECT d FROM Doctor d WHERE LOWER(d.fullName) LIKE LOWER(CONCAT('%', :fullName, '%'))")
	List<Doctor> findByFullNameContainingIgnoreCase(@Param("fullName") String fullName);
    
   // List<Doctor> findBySpecialistContainingIgnoreCase(String specialist);
	
	@Query("SELECT d FROM Doctor d WHERE LOWER(d.specialism.specialistName) LIKE LOWER(CONCAT('%', :specialismName, '%'))")
	List<Doctor> findBySpecialismNameContainingIgnoreCase(@Param("specialismName") String specialismName);
}