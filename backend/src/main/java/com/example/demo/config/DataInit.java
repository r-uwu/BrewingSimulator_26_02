package com.example.demo.config;

import com.example.demo.domain.Grain;
import com.example.demo.domain.Hop;
import com.example.demo.domain.Yeast;
import com.example.demo.domain.Yeast.YeastForm;
import com.example.demo.domain.Yeast.YeastType;
import com.example.demo.repository.GrainRepository;
import com.example.demo.repository.HopRepository;
import com.example.demo.repository.YeastRepository;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInit implements CommandLineRunner {

    private final GrainRepository grainRepository;
    private final HopRepository hopRepository;
    private final YeastRepository yeastRepository;

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
        
        
        if (hopRepository.count() == 0) {
            System.out.println("DB에 홉 데이터가 없습니다. 홉 데이터를 주입합니다...");

    	    // 노블 홉
            hopRepository.save(new Hop("Saaz", 3.5, List.of("Spicy", "Herbal", "Earthy", "Noble")));
            hopRepository.save(new Hop("Hallertau Mittelfruh", 4.0, List.of("Floral", "Mild Spice", "Sweet", "Noble")));
            hopRepository.save(new Hop("Tettnanger", 4.5, List.of("Herbal", "Spicy", "Tea-like", "Noble")));
            hopRepository.save(new Hop("Magnum", 14.0, List.of("Clean Bitterness", "Neutral", "Base Bitterness")));
            hopRepository.save(new Hop("Perle", 8.0, List.of("Floral", "Spicy", "Minty", "Green Pepper")));
            hopRepository.save(new Hop("Northern Brewer", 9.0, List.of("Woody", "Pine", "Minty", "Rustic")));
            hopRepository.save(new Hop("Tradition", 6.0, List.of("Floral", "Herbal", "Grassy")));

            // 미국 클래식
            hopRepository.save(new Hop("Cascade", 7.0, List.of("Grapefruit", "Floral", "Citrus", "Classic")));
            hopRepository.save(new Hop("Centennial", 10.0, List.of("Lemon", "Floral", "Clean Citrus", "Super Cascade")));
            hopRepository.save(new Hop("Chinook", 13.0, List.of("Pine", "Grapefruit", "Resinous", "Spicy")));
            hopRepository.save(new Hop("Columbus", 15.0, List.of("Dank", "Pungent", "Black Pepper", "Earthy")));
            hopRepository.save(new Hop("Willamette", 5.0, List.of("Herbal", "Floral", "Earthy", "Fruity")));
            hopRepository.save(new Hop("Amarillo", 9.5, List.of("Orange", "Citrus", "Apricot", "Floral")));
            hopRepository.save(new Hop("Simcoe", 13.0, List.of("Passionfruit", "Pine", "Berry", "Dank")));

            // 미국 신품종
            hopRepository.save(new Hop("Citra", 12.0, List.of("Citrus", "Mango", "Tropical", "Lime")));
            hopRepository.save(new Hop("Mosaic", 12.5, List.of("Blueberry", "Tropical", "Pine", "Complex")));
            hopRepository.save(new Hop("Sabro", 13.5, List.of("Coconut", "Tropical", "Creamy", "Cedar")));
            hopRepository.save(new Hop("Ekuanot", 14.5, List.of("Melon", "Berry", "Lime", "Papaya")));
            hopRepository.save(new Hop("El Dorado", 15.0, List.of("Candy", "Pear", "Watermelon", "Stone Fruit")));
            hopRepository.save(new Hop("Idaho 7", 13.0, List.of("Apricot", "Orange", "Red Fruit", "Black Tea")));
            hopRepository.save(new Hop("Azacca", 14.0, List.of("Mango", "Papaya", "Orange", "Spicy")));
            hopRepository.save(new Hop("Cashmere", 8.5, List.of("Melon", "Lemon", "Lime", "Smooth")));
            hopRepository.save(new Hop("Strata", 14.0, List.of("Passionfruit", "Strawberry", "Dank", "Grapefruit")));
            hopRepository.save(new Hop("Talus", 8.0, List.of("Pink Grapefruit", "Dried Roses", "Pine Resin", "Sage")));

            // 남반구 홉
            hopRepository.save(new Hop("Nelson Sauvin", 12.5, List.of("White Wine", "Gooseberry", "Grape", "Crushed Gooseberry")));
            hopRepository.save(new Hop("Motueka", 7.0, List.of("Lime", "Lemon", "Tropical", "Zesty")));
            hopRepository.save(new Hop("Rakau", 11.0, List.of("Apricot", "Plum", "Stone Fruit", "Resinous")));
            hopRepository.save(new Hop("Galaxy", 14.5, List.of("Passionfruit", "Peach", "Citrus", "Intense")));
            hopRepository.save(new Hop("Vic Secret", 15.5, List.of("Pineapple", "Pine", "Passionfruit", "Clean")));
            hopRepository.save(new Hop("Wai-iti", 3.0, List.of("Stone Fruit", "Peach", "Apricot", "Low Alpha")));

            // 기타
            hopRepository.save(new Hop("East Kent Golding", 5.0, List.of("Honey", "Floral", "Earthy", "Traditional")));
            hopRepository.save(new Hop("Fuggle", 4.5, List.of("Earthy", "Grassy", "Woody", "Mild")));
            hopRepository.save(new Hop("Sorachi Ace", 13.0, List.of("Lemon", "Dill", "Coriander", "Coconut")));

            
            System.out.println("홉 데이터 주입 완료!");
        }
        
        if (yeastRepository.count() == 0) {
            System.out.println("🧪 DB에 효모 데이터가 없습니다. 12가지 카테고리, 전문 효모 22종을 주입합니다...");

            // --- American & Clean ---
            saveYeast("SafAle US-05", 0.81, YeastType.AMERICAN_ALE, YeastForm.DRY, 18, 28, 0.5);
            saveYeast("Lallemand Nottingham", 0.77, YeastType.AMERICAN_ALE, YeastForm.DRY, 10, 22, 0.7);
            saveYeast("WLP001 California Ale", 0.76, YeastType.AMERICAN_ALE, YeastForm.LIQUID, 20, 23, 0.6);

            // --- British ---
            saveYeast("SafAle S-04", 0.75, YeastType.BRITISH_ALE, YeastForm.DRY, 15, 20, 0.8);
            saveYeast("Lallemand Windsor", 0.70, YeastType.BRITISH_ALE, YeastForm.DRY, 15, 22, 0.9);

            // --- German Lager ---
            saveYeast("SafLager W-34/70", 0.83, YeastType.GERMAN_LAGER, YeastForm.DRY, 9, 15, 1.2);
            saveYeast("SafLager S-189", 0.84, YeastType.GERMAN_LAGER, YeastForm.DRY, 9, 15, 1.0);

            // --- Belgian & Saison ---
            saveYeast("SafBrew BE-256", 0.82, YeastType.BELGIAN_ALE, YeastForm.DRY, 15, 25, 0.8);
            saveYeast("SafBrew BE-134", 0.90, YeastType.SAISON, YeastForm.DRY, 18, 28, 0.4);
            saveYeast("Lallemand Belle Saison", 0.90, YeastType.SAISON, YeastForm.DRY, 15, 35, 0.3);

            // --- Wheat ---
            saveYeast("SafBrew WB-06", 0.86, YeastType.GERMAN_WHEAT, YeastForm.DRY, 18, 24, 0.6);
            saveYeast("Lallemand Munich Classic", 0.84, YeastType.GERMAN_WHEAT, YeastForm.DRY, 17, 22, 0.7);

            // --- Kveik & Others ---
            saveYeast("Lallemand Voss Kveik", 0.80, YeastType.KVEIK, YeastForm.DRY, 25, 40, 0.2);
            saveYeast("WLP644 Brett. Brux", 0.85, YeastType.WILD_BRETT, YeastForm.LIQUID, 21, 29, 0.5);

            System.out.println("✅ 효모 22종 주입 완료!");
        }
    }
    
    private void saveYeast(String name, double atten, YeastType type, YeastForm form, double min, double max, double sens) {
        yeastRepository.save(new Yeast(name, atten, type, form, min, max, sens));
    }
}