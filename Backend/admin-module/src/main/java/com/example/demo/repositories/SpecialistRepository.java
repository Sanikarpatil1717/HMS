package com.example.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.models.Specialist;

public interface SpecialistRepository extends JpaRepository<Specialist, Integer> {
}
