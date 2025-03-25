package com.example.demo.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;

@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String dateOfBirth;

    @Column(nullable = false)
    private String qualification;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})  // Ignore Hibernate proxies
    @ManyToOne(fetch = FetchType.LAZY) // Lazy loading to avoid unnecessary joins
    @JoinColumn(name = "specialism_id", referencedColumnName = "id", nullable = false)
    private Specialist specialism;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String phone;

    @Column(nullable = false)
    private String password;

    public Doctor() {}

    public Doctor(String fullName, String dateOfBirth, String qualification, 
                  Specialist specialism, String email, String phone, String password) {
        this.fullName = fullName;
        this.dateOfBirth = dateOfBirth;
        this.qualification = qualification;
        this.specialism = specialism;
        this.email = email;
        this.phone = phone;
        this.password = password;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public Specialist getSpecialism() {
        return specialism;
    }

    public void setSpecialism(Specialist specialism) {
        this.specialism = specialism;
    }

    public Integer getSpecialismId() {
        return specialism != null ? specialism.getId() : null;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "Doctor{" +
                "id=" + id +
                ", fullName='" + fullName + '\'' +
                ", dateOfBirth='" + dateOfBirth + '\'' +
                ", qualification='" + qualification + '\'' +
                ", specialismId=" + getSpecialismId() + 
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                '}';
    }
}
