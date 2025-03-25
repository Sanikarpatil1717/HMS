package com.example.demo.models;

import jakarta.persistence.*;

@Entity
@Table(name = "specialists")
public class Specialist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, unique = true)
    private String specialistName;

    // Default Constructor
    public Specialist() {}

    // Parameterized Constructor
    public Specialist(String specialistName) {
        this.specialistName = specialistName;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getSpecialistName() {
        return specialistName;
    }

    public void setSpecialistName(String specialistName) {
        this.specialistName = specialistName;
    }

    // toString() Method
    @Override
    public String toString() {
        return "Specialist{" +
                "id=" + id +
                ", specialistName='" + specialistName + '\'' +
                '}';
    }
}
