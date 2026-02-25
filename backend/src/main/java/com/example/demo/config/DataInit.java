package com.example.demo.config;

import com.example.demo.domain.Grain;
import com.example.demo.repository.GrainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInit implements CommandLineRunner {

    private final GrainRepository grainRepository;

    @Override
    public void run(String... args) throws Exception {
        if (grainRepository.count() == 0) {
            System.out.println("DB가 비어있습니다. 기본 몰트 데이터를 MariaDB에 주입합니다...");

            // --- 베이스 몰트 ---
            grainRepository.save(new Grain("Pilsner", 1.308, 3.0));
            grainRepository.save(new Grain("Pale Ale", 1.310, 5.0));
            grainRepository.save(new Grain("Maris Otter", 1.310, 6.0));
            grainRepository.save(new Grain("Vienna", 1.300, 8.0));
            grainRepository.save(new Grain("Munich", 1.300, 18.0));

            // --- 밀 및 특수 몰트 ---
            grainRepository.save(new Grain("Wheat Malt", 1.310, 4.0));
            grainRepository.save(new Grain("Biscuit", 1.295, 50.0));
            grainRepository.save(new Grain("Flaked Oats", 1.280, 2.0));
            grainRepository.save(new Grain("Wheat", 1.310, 3.0));

            // --- 결정화 & 로스팅 몰트 ---
            grainRepository.save(new Grain("Crystal 40", 1.285, 80.0));
            grainRepository.save(new Grain("Crystal 120", 1.275, 240.0));
            grainRepository.save(new Grain("Chocolate", 1.240, 900.0));
            grainRepository.save(new Grain("Roasted Barley", 1.210, 1100.0));

            System.out.println("기본 몰트 데이터 주입 완료!");
        }
    }
}