package com.example.demo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.models.User;

public interface UserRepository extends JpaRepository<User, Long> {
	@Query("SELECT d FROM User d WHERE LOWER(d.fullName) LIKE LOWER(CONCAT('%', :fullName, '%'))")
	List<User> findByFullNameContainingIgnoreCase(String fullName);
    List<User> findByEmailContainingIgnoreCase(String email);
}
