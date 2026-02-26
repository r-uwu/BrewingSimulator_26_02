package com.example.demo.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Yeast {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;

    private double attenuation;
    private double minTemp;
    private double maxTemp;
    private double sensitivityFactor;
    
//    @Enumerated(EnumType.STRING)
//    private YeastType type;
//
//    public enum YeastType {
//        ALE, LAGER, WHEAT, BELGIAN, SAISON
//    }

    @Enumerated(EnumType.STRING)
    private YeastType type;

    @Enumerated(EnumType.STRING)
    private YeastForm form;
    
    public enum YeastType {
        //에일 계열
        AMERICAN_ALE,   // 깔끔한 발효 (US-05 등)
        BRITISH_ALE,    // 에스테르가 강조되는 영국 스타일 (S-04 등)
        BELGIAN_ALE,    // 복합적인 풍미의 벨기에 수도원 스타일 (BE-256 등)
        SAISON,         // 매우 높은 감쇄율과 스파이시함 (BE-134 등)
        KVEIK,          // 초고온 발효 가능 (Voss 등)
        
        //라거 계열
        GERMAN_LAGER,   // 깨끗하고 드라이한 독일 라거 (W-34/70 등)
        CZECH_LAGER,    // 약간의 잔당감이 있는 체코 라거 (S-23 등)
        
        //밀맥주 계열
        GERMAN_WHEAT,   // 바나나/클로브 향이 핵심인 헤페바이젠 (WB-06 등)
        BELGIAN_WIT,    // 산뜻하고 가벼운 벨기에 밀맥주
        
        // 기타
        WILD_BRETT,     // 브렛(Brettanomyces) 등 야생 효모
        SOUR_BACTERIA,  // 유산균(Lacto/Pedio) 등 산미 생성용
        WINE_CHAMPAGNE  // 고도수 맥주나 바를리 와인용
    }
    
    public enum YeastForm {
    DRY, LIQUID
    }
    

    public Yeast(String name, double attenuation, YeastType type, YeastForm form, 
                 double minTemp, double maxTemp, double sensitivityFactor) {
        this.name = name;
        this.attenuation = attenuation;
        this.type = type;
        this.form = form;
        this.minTemp = minTemp;
        this.maxTemp = maxTemp;
        this.sensitivityFactor = sensitivityFactor;
    }
}


//public record Yeast(String name, double attenuation, YeastType type, YeastForm form, double minTemp, double maxTemp, double sensitivityFactor) {
//}
//
