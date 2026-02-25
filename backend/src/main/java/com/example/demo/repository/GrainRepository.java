package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.domain.Grain;
import java.util.Optional;

@Repository
public interface GrainRepository extends JpaRepository<Grain, Long> {
    
    Optional<Grain> findByName(String name);
    
}