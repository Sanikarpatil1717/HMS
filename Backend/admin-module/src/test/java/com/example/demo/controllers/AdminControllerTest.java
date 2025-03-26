package com.example.demo.controllers;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Arrays;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.example.demo.models.Doctor;
import com.example.demo.models.Specialist;
import com.example.demo.models.User;
import com.example.demo.repositories.AppointmentRepository;
import com.example.demo.repositories.DoctorRepository;
import com.example.demo.repositories.SpecialistRepository;
import com.example.demo.repositories.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(AdminController.class)
public class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DoctorRepository doctorRepository;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private SpecialistRepository specialistRepository;

    @MockBean
    private AppointmentRepository appointmentRepository;

    @InjectMocks
    private AdminController adminController;

    private ObjectMapper objectMapper = new ObjectMapper();
    
    private Doctor doctor;
    private User user;
    private Specialist specialist;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        specialist = new Specialist(1, "Cardiologist");
        doctor = new Doctor(1, "Dr. John Doe", "1980-05-15", "MBBS", "john.doe@example.com", "9876543210", specialist);
        user = new User(1L, "Jane Doe", "jane.doe@example.com", "password123");
    }

    // ✅ Test GET all doctors
    @Test
    void testGetAllDoctors() throws Exception {
        when(doctorRepository.findAll()).thenReturn(Arrays.asList(doctor));

        mockMvc.perform(get("/admin/doctors"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].fullName").value("Dr. John Doe"));
    }

    // ✅ Test GET doctors by name
    @Test
    void testGetDoctorsByName() throws Exception {
        when(doctorRepository.findByFullNameContainingIgnoreCase("John")).thenReturn(Arrays.asList(doctor));

        mockMvc.perform(get("/admin/doctors/name/John"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].fullName").value("Dr. John Doe"));
    }

    // ✅ Test GET all users
    @Test
    void testGetAllUsers() throws Exception {
        when(userRepository.findAll()).thenReturn(Arrays.asList(user));

        mockMvc.perform(get("/admin/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].fullName").value("Jane Doe"));
    }

    // ✅ Test ADD new doctor
    @Test
    void testAddDoctor() throws Exception {
        when(doctorRepository.save(any(Doctor.class))).thenReturn(doctor);

        mockMvc.perform(post("/admin/doctors")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(doctor)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("Dr. John Doe"));
    }

    // ✅ Test UPDATE doctor
    @Test
    void testUpdateDoctor() throws Exception {
        when(doctorRepository.findById(1)).thenReturn(Optional.of(doctor));
        when(doctorRepository.save(any(Doctor.class))).thenReturn(doctor);

        mockMvc.perform(put("/admin/doctors/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(doctor)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("Dr. John Doe"));
    }

    // ✅ Test DELETE doctor
    @Test
    void testDeleteDoctor() throws Exception {
        when(doctorRepository.findById(1)).thenReturn(Optional.of(doctor));

        mockMvc.perform(delete("/admin/doctors/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Doctor deleted successfully."));
    }

    // ✅ Test DELETE doctor (Not Found)
    @Test
    void testDeleteDoctor_NotFound() throws Exception {
        when(doctorRepository.findById(1)).thenReturn(Optional.empty());

        mockMvc.perform(delete("/admin/doctors/1"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Doctor not found."));
    }
}
