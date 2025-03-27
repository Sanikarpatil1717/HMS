package com.example.demo.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.ChangePasswordRequest;
import com.example.demo.dto.LoginRequest;
import com.example.demo.models.Doctor;
import com.example.demo.models.User;
import com.example.demo.repositories.DoctorRepository;
import com.example.demo.services.DoctorService;

import jakarta.servlet.http.HttpSession;

@RestController
//@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    
    @Autowired
    private DoctorRepository doctorRepository;
//    @GetMapping
//    public List<Doctor> getAvailableDoctors() {
//        return doctorRepository.findAll();
//    }
    
    @GetMapping
    public List<Map<String, Object>> getAllDoctors() {
        List<Doctor> doctors = doctorService.getAllDoctors();
        System.out.println(doctors);
        List<Map<String, Object>> doctorList = new ArrayList<>();
        
        for (Doctor doctor : doctors) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", doctor.getId());
            map.put("fullName", doctor.getFullName());
            String specialistName = (doctor.getSpecialist() != null) ? doctor.getSpecialist().getSpecialistName() : "Not Specified";

            map.put("specialism", specialistName); // Fetch specialism name
            doctorList.add(map);
        }
        return doctorList;
    }
    @PostMapping("/register")
    public ResponseEntity<String> registerDoctor(@RequestBody Doctor doctor, HttpSession session) {
        String response = doctorService.registerDoctor(doctor);

        if (response.equals("Doctor registered successfully!")) {
            session.setAttribute("successMsg", response);
            return ResponseEntity.ok(response);
        } else {
            session.setAttribute("errorMsg", response);
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginDoctor(@RequestBody LoginRequest loginRequest) {
        String response = doctorService.loginDoctor(loginRequest);

        if (response.equals("Login successful!")) {
            Doctor doctor = doctorService.getDoctorByEmail(loginRequest.getEmail());
            return ResponseEntity.ok(Map.of("success", true, "doctorId", doctor.getId(), "message", response));
        } else {
            return ResponseEntity.status(401).body(Map.of("success", false, "message", response));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("Doctor Logged Out Successfully");
    }

    @PostMapping("/changePassword")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordRequest request) {
        boolean isChanged = doctorService.changePassword(request.getUserId(), request.getOldPassword(), request.getNewPassword());
        if (isChanged) {
            return ResponseEntity.ok("Password Changed Successfully");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Incorrect Old Password");
    }
    
    @GetMapping("/{docId}")
    public ResponseEntity<Doctor> getUserById(@PathVariable("docId") Long docId) {
        Doctor doctor = doctorService.getDoctorById(docId);
        if (doctor != null) {
            return ResponseEntity.ok(doctor);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

}
