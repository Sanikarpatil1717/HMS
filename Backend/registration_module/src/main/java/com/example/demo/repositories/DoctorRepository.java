package com.example.demo.repositories;


import com.example.demo.models.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
	 Optional<Doctor> findByEmail(String email);
	 
	 @Query("SELECT d FROM Doctor d JOIN FETCH d.specialism")
	    List<Doctor> findAllDoctorsWithSpecialism();
}
