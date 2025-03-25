package com.example.demo.services;

import com.example.demo.dto.LoginRequest;
import com.example.demo.models.Doctor;
import com.example.demo.repositories.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;
    
    public List<Doctor> getAllDoctors() {
        List<Doctor> doctors = doctorRepository.findAll();
        System.out.println("Doctors retrieved: " + doctors);
        return doctors;
    }

    public String registerDoctor(Doctor doctor) {
        if (doctorRepository.findByEmail(doctor.getEmail()).isPresent()) {
            return "Email already exists!";
        }
        doctorRepository.save(doctor);
        return "Doctor registered successfully!";
    }

    public String loginDoctor(LoginRequest loginDTO) {
        Optional<Doctor> doctorOptional = doctorRepository.findByEmail(loginDTO.getEmail());

        if (doctorOptional.isPresent()) {
            Doctor doctor = doctorOptional.get();
            if (doctor.getPassword().equals(loginDTO.getPassword())) {
                return "Login successful!";
            } else {
                return "Invalid password!";
            }
        }
        return "Doctor not found!";
    }

    public Doctor getDoctorByEmail(String email) {
        return doctorRepository.findByEmail(email).orElse(null);
    }

    public boolean changePassword(Long userId, String oldPassword, String newPassword) {
        Optional<Doctor> doctorOptional = doctorRepository.findById(userId);
        if (doctorOptional.isPresent()) {
            Doctor doctor = doctorOptional.get();
            if (doctor.getPassword().equals(oldPassword)) {
                doctor.setPassword(newPassword);
                doctorRepository.save(doctor);
                return true;
            }
        }
        return false;
    }
}
