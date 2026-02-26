package com.example.demo.repository;



import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.domain.Yeast;


@Repository
public interface YeastRepository extends JpaRepository<Yeast, Long> {
    Optional<Yeast> findByName(String name);
}
//        yeastDb.put("US-05", new Yeast("SafAle US-05", 0.81, YeastType.ALE, YeastForm.DRY, 18.0, 28.0, 0.05
//        ));
//        yeastDb.put("S-04", new Yeast("SafAle S-04", 0.75, YeastType.ALE, YeastForm.DRY, 15.0, 20.0, 0.15
//        ));
//        yeastDb.put("W-34/70", new Yeast("Saflager W-34/70", 0.83, YeastType.LAGER, YeastForm.DRY, 9.0, 15.0, 0.3
//        ));
