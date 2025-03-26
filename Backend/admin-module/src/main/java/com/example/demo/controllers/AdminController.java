package com.example.demo.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.models.Appointment;
import com.example.demo.models.Doctor;
import com.example.demo.models.Specialist;
import com.example.demo.models.User;
import com.example.demo.repositories.AppointmentRepository;
import com.example.demo.repositories.DoctorRepository;
import com.example.demo.repositories.SpecialistRepository;
import com.example.demo.repositories.UserRepository;

//@CrossOrigin(origins = "http://localhost:3000") // Adjust if deployed

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SpecialistRepository specialistRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    // GET all doctors
    @GetMapping("/doctors")
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }
    
    // GET doctors filtered by full name
    @GetMapping("/doctors/name/{fullName}")
    public List<Doctor> getDoctorsByName(@PathVariable String fullName) {
        return doctorRepository.findByFullNameContainingIgnoreCase(fullName);
    }

    @GetMapping("/doctors/specialist/{specialism}")
    public List<Doctor> getDoctorsBySpecialist(@PathVariable String specialism) {
        return doctorRepository.findBySpecialismNameContainingIgnoreCase(specialism);
    }


    // GET all users
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    // GET users filtered by full name
    @GetMapping("/users/name/{fullName}")
    public List<User> getUsersByName(@PathVariable String fullName) {
        return userRepository.findByFullNameContainingIgnoreCase(fullName);
    }

    // GET users filtered by email
    @GetMapping("/users/email/{email}")
    public List<User> getUsersByEmail(@PathVariable String email) {
        return userRepository.findByEmailContainingIgnoreCase(email);
    }

    // GET all specialists
    @GetMapping("/specialists")
    public List<Specialist> getAllSpecialists() {
        return specialistRepository.findAll();
    }

    // GET all appointments
    @GetMapping("/appointments")
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }
    
    // GET appointments filtered by userId
    @GetMapping("/appointments/userId/{userId}")
    public List<Appointment> getUsersByUserId(@PathVariable int userId) {
        return appointmentRepository.findByUserId(userId);
    }

    // GET appointments filtered by doctorId
    @GetMapping("/appointments/doctorId/{doctorId}")
    public List<Appointment> getUsersByDoctorId(@PathVariable int doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }
    
    // UPDATE an existing doctor
    @PutMapping("/doctors/{id}")
    public ResponseEntity<?> updateDoctor(@PathVariable int id, @RequestBody Doctor updatedDoctor) {
        Optional<Doctor> existingDoctorOpt = doctorRepository.findById(id);
        
        
 
        if (existingDoctorOpt.isPresent()) {
            Doctor existingDoctor = existingDoctorOpt.get();
            if (updatedDoctor.getSpecialism() != null) {
                // Find specialist by name
                Specialist existingSpecialist = specialistRepository.findBySpecialistNameIgnoreCase(updatedDoctor.getSpecialism().getSpecialistName())
                    .orElseThrow(() -> new RuntimeException("Specialist not found"));
                existingDoctor.setSpecialism(existingSpecialist);
            }
            // Update fields
            existingDoctor.setFullName(updatedDoctor.getFullName());
            existingDoctor.setDateOfBirth(updatedDoctor.getDateOfBirth());
            existingDoctor.setQualification(updatedDoctor.getQualification());
            existingDoctor.setEmail(updatedDoctor.getEmail());
            existingDoctor.setPhone(updatedDoctor.getPhone());
            
            // Save updated doctor
            Doctor savedDoctor = doctorRepository.save(existingDoctor);
            return ResponseEntity.ok(savedDoctor);
        } else {
            return ResponseEntity.status(404).body("Doctor not found.");
        }
    }
 

    // ADD a new doctor
    @PostMapping("/doctors")
    public ResponseEntity<Doctor> addDoctor(@RequestBody Doctor doctor) {
        Doctor savedDoctor = doctorRepository.save(doctor);
        return ResponseEntity.ok(savedDoctor);
    }

    // ADD a new specialist
    @PostMapping("/specialists")
    public ResponseEntity<Specialist> addSpecialist(@RequestBody Specialist specialist) {
        Specialist savedSpecialist = specialistRepository.save(specialist);
        return ResponseEntity.ok(savedSpecialist);
    }
    
    //DELETE a user by ID
    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
        	userRepository.deleteById(id);
            return ResponseEntity.ok("User deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    // DELETE a doctor by ID
    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<String> deleteDoctor(@PathVariable int id) {
        Optional<Doctor> doctor = doctorRepository.findById(id);
        if (doctor.isPresent()) {
            doctorRepository.deleteById(id);
            return ResponseEntity.ok("Doctor deleted successfully.");
        } else {
            return ResponseEntity.status(404).body("Doctor not found.");
        }
    }

    // DELETE a specialist by ID
    @DeleteMapping("/specialists/{id}")
    public ResponseEntity<String> deleteSpecialist(@PathVariable int id) {
        Optional<Specialist> specialist = specialistRepository.findById(id);
        if (specialist.isPresent()) {
            specialistRepository.deleteById(id);
            return ResponseEntity.ok("Specialist deleted successfully.");
        } else {
            return ResponseEntity.status(404).body("Specialist not found.");
        }
    }
    
    // DELETE a specialization by name
    @DeleteMapping("/specialists/name/{name}")
    public ResponseEntity<String> deleteSpecialistByName(@PathVariable String name) {
        // Check if any doctor has this specialization
        List<Doctor> doctorsWithSpecialization = doctorRepository.findBySpecialismNameContainingIgnoreCase(name);
        
        if (!doctorsWithSpecialization.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("A doctor with this specialization exists, hence cannot delete.");
        }
        
        // Find the specialization
        Optional<Specialist> specialistOpt = specialistRepository.findBySpecialistNameIgnoreCase(name);
        
        if (specialistOpt.isPresent()) {
            specialistRepository.delete(specialistOpt.get());
            return ResponseEntity.ok("Specialization deleted successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Specialization not found.");
        }
    }

}
