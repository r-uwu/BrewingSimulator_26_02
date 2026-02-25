package com.example.demo.domain;

import jakarta.persistence.*;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Grain{
	
	@Id // PK
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AUTO_INCREMENT
    private Long id;

    @Column(unique = true)
    private String name;
	
    private double potential; // 잠재 비중
    private double lovibond;  // SRM 수치
    
    public Grain(String name, double potential, double lovibond) {
        this.name = name;
        this.potential = potential;
        this.lovibond = lovibond;
    }
	
}




//(String name, double potential, double lovibond)


